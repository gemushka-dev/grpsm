use std::collections::HashMap;
use sqlx::{PgPool, Row, Column};
use uuid::Uuid;
use tokio::sync::RwLock;
use serde_json::{json, Value};

pub struct AppState {
    pub connections: RwLock<HashMap<String, PgPool>>,
}

#[tauri::command]
async fn connect_to_db(connection_string: String, state: tauri::State<'_, AppState>) -> Result<String, String>{
    let pool = PgPool::connect(&connection_string)
        .await
        .map_err(|e| e.to_string())?;
    let connection_id = Uuid::new_v4().to_string();
    let mut connections = state.connections.write().await;
    connections.insert(connection_id.clone(), pool);

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


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState{
            connections: RwLock::new(HashMap::new(),)
        })
        .invoke_handler(tauri::generate_handler![connect_to_db, execute_query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
