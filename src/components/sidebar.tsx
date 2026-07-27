import { useState } from "react";
import { Connection } from "../type/connection.type";
import "../styles/sidebar.css";

type SidebarProps = {
  onNodeSelect: (node: any) => void;
  pgConnections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
};

export const Sidebar = ({
  onNodeSelect,
  pgConnections,
  setConnections,
}: SidebarProps) => {
  const [selectedId, setSelectedId] = useState("");
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
