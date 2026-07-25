import { useState } from "react";

type Connection = {
  id: string;
  name: string;
  host: string;
  port: number;
  dbName: string;
  isConnected: boolean;
};
type SidebarProps = {
  onNodeSelect: (node: any) => void;
  pgConnections: Connection[];
};

export const Sidebar = ({ onNodeSelect, pgConnections }: SidebarProps) => {
  const [selectedId, setSelectedId] = useState("");
  const handleConnectClick = (conn: Connection) => {
    setSelectedId(conn.id);
    if (onNodeSelect) {
      onNodeSelect(conn);
    }
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
          return (
            <div
              className={`connection-item ${isSelected ? "selected" : ""}`}
              key={conn.id}
              onClick={() => handleConnectClick(conn)}
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
          );
        })}
      </div>
    </aside>
  );
};
