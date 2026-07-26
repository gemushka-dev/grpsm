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

    match sqlx::query(&sql).fetch_all(connection).await{
        Ok(rows) => {
            let res: Vec<Value> = rows.iter().map(|row| {
                let mut map = serde_json::Map::new();
                for col in row.columns(){
                    let val: Option<String> = row.try_get(col.name()).ok();
                    map.insert(col.name().to_string(), json!(val));
                }
                Value::Object(map)
            }).collect();
            Ok(json!({"type":"select", "data":res}))
        },
        Err(_) => {
            let execution = sqlx::query(&sql).execute(connection).await.map_err(|e| e.to_string())?;
            Ok(json!({ "type": "mutation", "rows_affected": execution.rows_affected() }))
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
