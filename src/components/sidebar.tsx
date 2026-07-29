import { useState } from "react";
import { Connection } from "../type/connection.type";
import "../styles/sidebar.css";
import { invoke } from "@tauri-apps/api/core";
import { ColumnInfo, ConstraintInfo } from "../type/database.type";

type SidebarProps = {
  onNodeSelect: (node: any) => void;
  pgConnections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
};

function groupResult<T extends { table_name: string }>(arr: T[]) {
  const r: Record<string, T[]> = {};
  for (const item of arr) {
    (r[item.table_name] ??= []).push(item);
  }
  return r;
}

export const Sidebar = ({
  onNodeSelect,
  pgConnections,
  setConnections,
}: SidebarProps) => {
  const [selectedId, setSelectedId] = useState("");
  const [tablesMap, setTablesMap] = useState<
    Record<string, Record<string, ColumnInfo[]>>
  >({});
  const [constraintMap, setConstraintMap] = useState<
    Record<string, Record<string, ConstraintInfo[]>>
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
    const [result, constraintResult] = await Promise.all([
      invoke<ColumnInfo[]>("get_db_info", { uuid: conn.id }),
      invoke<ConstraintInfo[]>("get_constraints", { uuid: conn.id }),
    ]);
    setTablesMap((prev) => ({ ...prev, [conn.id]: groupResult(result) }));
    setConstraintMap((prev) => ({
      ...prev,
      [conn.id]: groupResult(constraintResult),
    }));
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
          const constraints = constraintMap[conn.id];
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
                    <summary>Schemas</summary>

                    <details>
                      <summary>Tables</summary>

                      {Object.entries(tables).map(([tableName, cols]) => {
                        const tableConstraints = constraints?.[tableName] || [];

                        return (
                          <details key={tableName}>
                            <summary>{tableName}</summary>

                            <details>
                              <summary>Columns</summary>
                              <ul>
                                {cols.map((col) => (
                                  <li key={col.column_name}>
                                    {col.column_name}{" "}
                                    <small>({col.data_type})</small>
                                  </li>
                                ))}
                              </ul>
                            </details>

                            <details>
                              <summary>Constraints</summary>
                              {tableConstraints.length > 0 ? (
                                <ul>
                                  {tableConstraints.map((c, index) => (
                                    <li key={c.constraint_name || index}>
                                      {c.constraint_name}{" "}
                                      <small>({c.constraint_type})</small>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div>No constraints</div>
                              )}
                            </details>
                          </details>
                        );
                      })}
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
