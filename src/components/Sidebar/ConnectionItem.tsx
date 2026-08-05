import { ConnectionItemProps } from "../../type/props";

export const ConnectionItem = (props: ConnectionItemProps) => {
  const { onDblClick, onSelect, className, connection } = props;

  return (
    <div
      className={`connection-item ${className}`.trim()}
      onClick={onSelect}
      onDoubleClick={onDblClick}
    >
      <div className="connection-info">
        <div className="connection-avatar">PG</div>
        <div className="connection-details">
          <div className="connection-name">{connection.name}</div>
          <div className="connection-meta">
            {connection.host}:{connection.port} ·{" "}
            <span className="db-name"> {connection.dbName}</span>
          </div>
        </div>
      </div>
      <div
        className={`status-dot ${connection.isConnected ? "online" : "offline"}`}
      ></div>
    </div>
  );
};
