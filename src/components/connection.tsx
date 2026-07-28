import { useState } from "react";
import { Connection } from "../type/connection.type";
import { invoke } from "@tauri-apps/api/core";
import "../styles/connection.css";

type ConnectionProps = {
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  setIsVisible: (visible: boolean) => void;
};

export const ConnectionModel = ({
  setConnections,
  setIsVisible,
}: ConnectionProps) => {
  const [name, setName] = useState("");
  const [port, setPort] = useState(5432);
  const [host, setHost] = useState("localhost");
  const [user, setUser] = useState("postgres");
  const [database, setDatabase] = useState("postgres");
  const [password, setPassword] = useState("");

  const handleConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    const connectionString = `postgres://${user}:${password}@${host}:${port}/${database}`;
    try {
      const uuid: string = await invoke("connect_to_db", {
        connectionString: connectionString,
      });
      const newConnection: Connection = {
        id: uuid,
        name,
        host,
        port,
        dbName: database,
        isConnected: true,
      };
      setConnections((prev) => [...prev, newConnection]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="move">
      <span className="close" onClick={() => setIsVisible(false)}>
        <i className="ri-close-large-line"></i>
      </span>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          className="move-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="db-conf">
          <label htmlFor="port">Default port</label>
          <input
            type="number"
            id="port"
            className="move-input"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
          />

          <label htmlFor="host">Default host</label>
          <input
            type="text"
            id="host"
            className="move-input"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />

          <label htmlFor="user">Default user</label>
          <input
            type="text"
            id="user"
            className="move-input"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <label htmlFor="database">Default database</label>
          <input
            type="text"
            id="database"
            className="move-input"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="move-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="button" className="btn-connect" onClick={handleConnect}>
          Connect
        </button>
      </form>
    </div>
  );
};
