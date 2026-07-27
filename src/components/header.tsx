import "../styles/header.css";
import { Connection } from "../type/connection.type";
import { invoke } from "@tauri-apps/api/core";
import { Result } from "../type/result.type";

type HeaderProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  setResult: React.Dispatch<React.SetStateAction<Result | string>>;
  activeConnection: Connection | null;
  code: string;
};

export const Header = ({
  isVisible,
  setIsVisible,
  activeConnection,
  code,
  setResult,
}: HeaderProps) => {
  const handleExecute = async () => {
    try {
      if (activeConnection) {
        const result: any = await invoke("execute_query", {
          uuid: activeConnection.id,
          sql: code,
        });
        setResult(result);
        console.log(result);
      }
    } catch (e) {
      console.error(e);
      setResult(e as string);
    }
  };
  return (
    <header className="header">
      <h3 className="header-logo">grpsm</h3>
      <ul className="header-list">
        <li className="list-item">
          <button
            className="item-connection"
            onClick={() => setIsVisible(!isVisible)}
          >
            ➕
          </button>
        </li>
        <li className="list-item">
          <button className="item-start" onClick={handleExecute}>
            ⏩
          </button>
        </li>
      </ul>
    </header>
  );
};
