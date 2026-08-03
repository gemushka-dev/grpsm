import "../styles/header.css";
import { Connection } from "../type/connection.type";
import { invoke } from "@tauri-apps/api/core";
import { Result } from "../type/result.type";
import { useCallback, useEffect } from "react";
import { AppConfig } from "../type/config.type";

type HeaderProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  setResult: React.Dispatch<React.SetStateAction<Result | string>>;
  activeConnection: Connection | null;
  code: string;
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
};

export const Header = ({
  isVisible,
  setIsVisible,
  activeConnection,
  code,
  setResult,
  config,
  setConfig,
}: HeaderProps) => {
  const handleToggleTheme = useCallback(async () => {
    try {
      const newConfig = {
        theme: config.theme === "light" ? "dark" : "light",
      };
      await invoke("save_config", {
        config: newConfig,
      });
      setConfig(newConfig as AppConfig);
    } catch (e) {
      console.error(e);
    }
  }, [config, setConfig]);

  const handleExecute = useCallback(async () => {
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
  }, [activeConnection, code, setResult]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F5" || (e.ctrlKey && e.key === "Enter")) {
        e.preventDefault();
        handleExecute();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleExecute]);
  return (
    <header className="header">
      <h3 className="header-logo">grpsm</h3>
      <ul className="header-list">
        <li className="list-item">
          <button
            className="item-connection"
            onClick={() => setIsVisible(!isVisible)}
          >
            <i className="ri-add-large-line"></i>
          </button>
        </li>
        <li className="list-item">
          <button className="item-start" onClick={handleExecute}>
            <i className="ri-play-large-line"></i>
          </button>
        </li>
        <li className="list-item">
          <button className="item-theme" onClick={handleToggleTheme}>
            {config.theme === "dark" ? (
              <i className="ri-moon-line"></i>
            ) : (
              <i className="ri-sun-line"></i>
            )}
          </button>
        </li>
      </ul>
    </header>
  );
};
