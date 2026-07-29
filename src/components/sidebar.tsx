import { useState } from "react";
import { Connection } from "../type/connection.type";
import "../styles/sidebar.css";
import { invoke } from "@tauri-apps/api/core";

type SidebarProps = {
  onNodeSelect: (node: any) => void;
  pgConnections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
};

export type ColumnInfo = {
  table_name: string;
  column_name: string;
  data_type: string;
};

export const Sidebar = ({
  onNodeSelect,
  pgConnections,
  setConnections,
}: SidebarProps) => {
  const [selectedId, setSelectedId] = useState("");
  const [tablesMap, setTablesMap] = useState<
    Record<string, Record<string, ColumnInfo[]>>
  >({});
  const handleConnectClick = (conn: Connection) => {
    setSelectedId(conn.id);
    if (onNodeSelect) {
      onNodeSelect(conn);
    }
    setConnections((prevConnections) =>
      prevConnections.map((item) => ({
        ...item,
        isConnected: item.id === conn.id,
      })),
    );
  };

  const handleDoubleClick = async (conn: Connection) => {
    const result = await invoke<ColumnInfo[]>("get_db_info", {
      uuid: conn.id,
    });
    const r: Record<string, ColumnInfo[]> = {};
    for (const item of result) {
      (r[item.table_name] ??= []).push(item);
    }
    setTablesMap((prev) => ({ ...prev, [conn.id]: r }));
    console.log(result);
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">PostgreSQL connections</span>
        <span className="sidebar-count">{pgConnections.length}</span>
      </div>

      <div className="sidebar-list">
        {pgConnections.map((conn) => {
          const isSelected = selectedId === conn.id;
          const tables = tablesMap[conn.id];
          return (
            <div className="connection-wrapper">
              <div
                className={`connection-item ${isSelected ? "selected" : ""}`}
                key={conn.id}
                onClick={() => handleConnectClick(conn)}
                onDoubleClick={() => handleDoubleClick(conn)}
              >
                <div className="connection-info">
                  <div className="connection-avatar">PG</div>
                  <div className="connection-details">
                    <div className="connection-name">{conn.name}</div>
                    <div className="connection-meta">
                      {conn.host}:{conn.port} ·{" "}
                      <span className="db-name"> {conn.dbName}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`status-dot ${conn.isConnected ? "online" : "offline"}`}
                ></div>
              </div>
              {tables && (
                <div className="tables-tree">
                  <details>
                    <summary>{conn.dbName}</summary>

                    <details>
                      <summary>Schemas</summary>

                      <details>
                        <summary>Tables</summary>

                        <details>
                          <summary>Columns</summary>
                          {Object.entries(tables).map(([tableName, cols]) => (
                            <details key={tableName}>
                              <summary>{tableName}</summary>

                              <ul>
                                {cols.map((col) => (
                                  <li key={col.column_name}>
                                    {col.column_name}{" "}
                                    <small>({col.data_type})</small>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          ))}
                        </details>
                      </details>
                    </details>
                  </details>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
