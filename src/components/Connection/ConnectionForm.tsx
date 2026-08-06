import { useState } from "react";
import { ConnectionFormProps } from "../../type/props";
import { Connection } from "../../type/connection.type";
import { invoke } from "@tauri-apps/api/core";
import { FormField } from "./FormField";
import { Button } from "../Button/Button";

export const ConnectionForm = (props: ConnectionFormProps) => {
  const { setConnections } = props;
  const [formData, setFormData] = useState({
    name: "",
    port: 5432,
    host: "localhost",
    user: "postgres",
    database: "postgres",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? Number(value) : value,
    }));
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, host, port, user, database, password } = formData;
    const connectionString = `postgres://${user}:${password}@${host}:${port}/${database}`;
    try {
      const uuid: string = await invoke("connect_to_db", {
        connectionString: connectionString,
        pgConn: {
          id: "",
          name,
          host,
          port,
          user,
          password,
          dbName: database,
        },
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
    <form onSubmit={handleConnect}>
      <FormField id="name" value={formData.name} onChange={handleChange}>
        Name
      </FormField>

      <div className="db-conf">
        <FormField
          type="number"
          id="port"
          value={formData.port}
          onChange={handleChange}
        >
          Default port
        </FormField>

        <FormField id="host" value={formData.host} onChange={handleChange}>
          Default host
        </FormField>

        <FormField id="user" value={formData.user} onChange={handleChange}>
          Default user
        </FormField>

        <FormField
          id="database"
          value={formData.database}
          onChange={handleChange}
        >
          Default database
        </FormField>

        <FormField
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
        >
          Password
        </FormField>
      </div>

      <Button type="submit" className="btn-connect">
        Connect
      </Button>
    </form>
  );
};
