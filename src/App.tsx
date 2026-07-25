import { useState } from "react";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
import { EditorComponent } from "./components/sql-editor";
import { ResultTable } from "./components/result-table";
import "./styles/base.css";
import "./styles/main.css";

export const App = () => {
  const [activeConnection, setActiveConnection] = useState(null);
  return (
    <div className="container">
      <Header></Header>

      <div className="main-part">
        <Sidebar
          pgConnections={[]}
          onNodeSelect={(conn) => setActiveConnection(conn)}
        ></Sidebar>

        <div className="sql-part">
          <EditorComponent></EditorComponent>
          <ResultTable data={[]}></ResultTable>
        </div>
      </div>
    </div>
  );
};
