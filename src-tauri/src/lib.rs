use std::collections::HashMap;
use sqlx::{PgPool};
use uuid::Uuid;
use tokio::sync::RwLock;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState{
            connections: RwLock::new(HashMap::new(),)
        })
        .invoke_handler(tauri::generate_handler![connect_to_db])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
