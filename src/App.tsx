import { useRef, useState } from "react";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
import { EditorComponent } from "./components/sql-editor";
import { ResultTable } from "./components/result-table";
import { type Connection } from "./type/connection.type";
import { ConnectionModel } from "./components/connection";
import { Result } from "./type/result.type";
import Draggable from "react-draggable";
import "./styles/base.css";
import "./styles/main.css";

export const App = () => {
  const [code, setCode] = useState("");

  const [activeConnection, setActiveConnection] = useState(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [result, setResult] = useState<Result | string>("");

  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="container">
      <Header
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        code={code}
        setResult={setResult}
        activeConnection={activeConnection}
      ></Header>
      {isVisible ? (
        <Draggable cancel="" nodeRef={nodeRef}>
          <div ref={nodeRef} className="drag-div" style={{}}>
            <ConnectionModel setConnections={setConnections} />
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
