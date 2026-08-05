import { useEffect, useRef, useState } from "react";
import { Header } from "./components/header";
import { Sidebar } from "./components/Sidebar/sidebar";
import { EditorComponent } from "./components/sql-editor";
import { ResultTable } from "./components/result-table";
import { type Connection } from "./type/connection.type";
import { ConnectionModel } from "./components/connection";
import { Result } from "./type/result.type";
import Draggable from "react-draggable";
import "remixicon/fonts/remixicon.css";
import "./styles/base.css";
import "./styles/main.css";
import "./styles/color.css";
import { invoke } from "@tauri-apps/api/core";
import { AppConfig } from "./type/config.type";

export const App = () => {
  const [code, setCode] = useState("");

  const [activeConnection, setActiveConnection] = useState(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [result, setResult] = useState<Result | string>("");

  const [config, setConfig] = useState<AppConfig>({
    theme: "light",
  });

  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initConnections = async () => {
      try {
        const saved: Connection[] = await invoke("load_saved_connections");
        setConnections(saved);
      } catch (e) {
        console.error("Error:", e);
      }
    };

    initConnections();
  }, []);

  useEffect(() => {
    async function getConfig() {
      try {
        const savedConfig: AppConfig = await invoke("get_config");
        setConfig(savedConfig);
      } catch (e) {
        console.error(e);
      }
    }
    getConfig();
  }, []);
  useEffect(() => {
    if (config.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [config.theme]);

  return (
    <div className="container">
      <Header
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        code={code}
        setResult={setResult}
        activeConnection={activeConnection}
        config={config}
        setConfig={setConfig}
      ></Header>
      {isVisible ? (
        <Draggable cancel=".move-input, .close, .btn-connect" nodeRef={nodeRef}>
          <div ref={nodeRef} className="drag-div" style={{}}>
            <ConnectionModel
              setConnections={setConnections}
              setIsVisible={setIsVisible}
            />
          </div>
        </Draggable>
      ) : null}

      <div className="main-part">
        <Sidebar
          pgConnections={connections}
          onNodeSelect={(conn) => setActiveConnection(conn)}
          setConnections={setConnections}
        ></Sidebar>

        <div className="sql-part">
          <EditorComponent code={code} setCode={setCode}></EditorComponent>
          <ResultTable data={result}></ResultTable>
        </div>
      </div>
    </div>
  );
};
