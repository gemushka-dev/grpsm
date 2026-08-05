import { memo, useState } from "react";
import { Connection } from "../../type/connection.type";
import { ConnectionGroup } from "./ConnectionGroup";
import "../../styles/sidebar.css";
import { SidebarProps } from "../../type/props";

export const Sidebar = memo((props: SidebarProps) => {
  const { setConnections, onNodeSelect, pgConnections } = props;
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
          return (
            <ConnectionGroup
              key={conn.id}
              connection={conn}
              selectedId={selectedId}
              onSelect={() => handleConnectClick(conn)}
            ></ConnectionGroup>
          );
        })}
      </div>
    </aside>
  );
});
