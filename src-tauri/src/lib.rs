use std::collections::HashMap;
use std::env;
use std::fs::{self, OpenOptions};
use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::{PgPool, Row};
use tokio::sync::RwLock;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PGConnection {
    pub id: String,
    pub name: String,
    pub host: String,
    pub port: i32,
    pub user: String,
    pub password: String,
    #[serde(rename = "dbName")]
    pub db_name: String,
}

pub struct AppState {
    pub connections: RwLock<HashMap<String, PgPool>>,
    pub config_path: PathBuf
}

#[tauri::command]
async fn load_saved_connections(state: tauri::State<'_, AppState>) -> Result<Vec<PGConnection>, String>{
    if !state.config_path.exists(){
        return Ok(vec![]);
    }
    let content = fs::read_to_string(&state.config_path).map_err(|e| e.to_string())?;
    if content.trim().is_empty() {
        return Ok(vec![]);
    }
    let connections: Vec<PGConnection> = serde_json::from_str(&content).map_err(|e| e.to_string())?;

    for conn in &connections{
        let connection_string = format!(
            "postgres://{}:{}@{}:{}/{}",
            conn.user, conn.password, conn.host, conn.port, conn.db_name
        );
        if let Ok(pool) = PgPool::connect(&connection_string).await {
            let mut conn_save = state.connections.write().await;
            conn_save.insert(conn.id.clone(), pool);
        } 
    }

    Ok(connections)
}

#[tauri::command]
async fn connect_to_db(connection_string: String, pg_conn:PGConnection, state: tauri::State<'_, AppState>) -> Result<String, String>{
    let pool = PgPool::connect(&connection_string)
        .await
        .map_err(|e| e.to_string())?;
    let connection_id = Uuid::new_v4().to_string();
    let mut connections = state.connections.write().await;
    connections.insert(connection_id.clone(), pool);

    let content = fs::read_to_string(&state.config_path).map_err(|e| e.to_string())?;
    let mut saved_list: Vec<PGConnection> = if content.trim().is_empty() {
        vec![]
    } else {
        serde_json::from_str(&content).unwrap_or_else(|_| vec![])
    };
    let mut new_conn = pg_conn;
    new_conn.id = connection_id.clone();
    saved_list.push(new_conn);

    let json_data = serde_json::to_string_pretty(&saved_list).map_err(|e| e.to_string())?;
    fs::write(&state.config_path, json_data).map_err(|e| e.to_string())?;

    Ok(connection_id)
}

#[tauri::command]
async fn execute_query(uuid: String, sql:String, state: tauri::State<'_, AppState>) -> Result<Value, String>{
    let read_connections = state.connections.read().await;
    let connection = read_connections.get(&uuid).ok_or_else(|| "No connection".to_string())?;
    let clean_sql = sql.trim().trim_end_matches(';');
    let wrapped_sql = format!(
        "WITH query_result AS ({})
         SELECT 
            coalesce(json_agg(row_to_json(query_result)), '[]'::json) AS data,
            coalesce(
                (
                    SELECT json_agg(keys) 
                    FROM (
                        SELECT json_object_keys(row_to_json(first_row)) AS keys 
                        FROM (SELECT * FROM query_result LIMIT 1) first_row
                    ) k
                ), 
                '[]'::json
            ) AS columns
         FROM query_result",
        clean_sql
    );
   
    match sqlx::query(&wrapped_sql).fetch_one(connection).await {
        Ok(row) => {
            let data: Value = row.try_get("data").unwrap_or(json!([]));
            let columns: Value = row.try_get("columns").unwrap_or(json!([]));

            Ok(json!({
                "type": "select",
                "columns": columns,
                "data": data
            }))
        },
        Err(_) => {
            let execution = sqlx::query(&sql)
                .execute(connection)
                .await
                .map_err(|e| e.to_string())?;

            Ok(json!({
                "type": "mutation",
                "rows_affected": format!("Rows affected {}",execution.rows_affected())
            }))
        }
    }
}

#[tauri::command]
async fn get_db_info(uuid: String, state: tauri::State<'_, AppState>) -> Result<Value, String> {
    let read_connections = state.connections.read().await;
    let connection = read_connections.get(&uuid).ok_or_else(|| "No connection".to_string())?;
    let sql = "
        SELECT coalesce(json_agg(row_to_json(t)), '[]'::json) AS data
        FROM (
            SELECT 
                table_name AS \"table_name\",
                column_name AS \"column_name\",
                data_type AS \"data_type\"
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            ORDER BY table_name, ordinal_position
        ) t
    ";
    match sqlx::query(&sql).fetch_one(connection).await{
        Ok(row) => {
            let data: Value = row.try_get("data").unwrap_or(json!([]));
            Ok(data)
        }
        Err(e) => Err(e.to_string())
    }
}

#[tauri::command]
async fn get_constraints(uuid: String, state: tauri::State<'_, AppState>) -> Result<Value, String> {
    let read_connections = state.connections.read().await;
    let connection = read_connections.get(&uuid).ok_or_else(|| "No connection".to_string())?;
    let sql = "
        SELECT coalesce(json_agg(row_to_json(t)), '[]'::json) AS data
        FROM (
            SELECT 
                conrelid::regclass::text AS table_name,
                conname AS constraint_name,
                CASE contype
                    WHEN 'p' THEN 'Primary Key'
                    WHEN 'f' THEN 'Foreign Key'
                    WHEN 'u' THEN 'Unique'
                    WHEN 'c' THEN 'Check'
                    WHEN 'n' THEN 'Null'
                    ELSE contype::text
                END AS constraint_type,
                pg_get_constraintdef(oid) AS constraint_definition
            FROM pg_constraint
            WHERE connamespace = 'public'::regnamespace
            ORDER BY conrelid, contype
        ) t
    ";
    match sqlx::query(&sql).fetch_one(connection).await{
        Ok(row) => {
            let data: Value = row.try_get("data").unwrap_or(json!([]));
            Ok(data)
        }
        Err(e) => Err(e.to_string())
    }
}

#[tauri::command]
async fn get_indexes(uuid: String, state: tauri::State<'_, AppState>) -> Result<Value, String> {
    let read_connections = state.connections.read().await;
    let connection = read_connections.get(&uuid).ok_or_else(|| "No connection".to_string())?;
    let sql = "
        SELECT coalesce(json_agg(row_to_json(t)), '[]'::json) AS data
        FROM (
            SELECT 
                tablename AS table_name,
                indexname AS index_name,
                indexdef AS index_def
            FROM pg_indexes
            WHERE schemaname = 'public'
            ORDER BY tablename, indexname
        ) t
    ";
    match sqlx::query(&sql).fetch_one(connection).await{
        Ok(row) => {
            let data: Value = row.try_get("data").unwrap_or(json!([]));
            Ok(data)
        }
        Err(e) => Err(e.to_string())
    }
}

#[tauri::command]
async fn get_views(uuid:String, state:tauri::State<'_, AppState>) -> Result<Value, String>{
    let read_connections = state.connections.read().await;
    let connection = read_connections.get(&uuid).ok_or_else(|| "No connection".to_string())?;
    let sql = "
        WITH query_result AS (
            SELECT 
                table_name,
                column_name,
                data_type,
                ordinal_position
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name IN (SELECT viewname FROM pg_views WHERE schemaname = 'public')
        )
        SELECT coalesce(json_agg(row_to_json(q)), '[]'::json) AS data
        FROM (
            SELECT table_name, column_name, data_type 
            FROM query_result 
            ORDER BY table_name, ordinal_position
        ) q
    ";
    match sqlx::query(&sql).fetch_one(connection).await{
        Ok(row) => {
            let data: Value = row.try_get("data").unwrap_or(json!([]));
            Ok(data)
        }
        Err(e) => Err(e.to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let user_profile = env::var("USERPROFILE").or_else(|_| env::var("HOME")).unwrap_or_else(|_| ".".to_string());
    let config_path = PathBuf::from(user_profile).join("grpsm-connections-conf.json");
    let options = OpenOptions::new().read(true).write(true).create(true).open(&config_path);

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState{
            connections: RwLock::new(HashMap::new(),),
            config_path,
        })
        .invoke_handler(tauri::generate_handler![
            connect_to_db, execute_query,load_saved_connections, get_db_info, get_constraints, get_indexes,get_views
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
