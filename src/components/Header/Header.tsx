import "../../styles/header.css";
import { Connection } from "../../type/connection.type";
import { invoke } from "@tauri-apps/api/core";
import { Result } from "../../type/result.type";
import { useCallback, useEffect } from "react";
import { AppConfig } from "../../type/config.type";
import { ActionItem } from "../../type/header.action";
import { HeaderAction } from "./HeaderAction";

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

  const headerActions: ActionItem[] = [
    {
      id: "add",
      iconClass: "ri-add-large-line",
      className: "item-connection",
      onClick: () => setIsVisible(!isVisible),
    },
    {
      id: "execute",
      iconClass: "ri-play-large-line",
      className: "item-start",
      onClick: handleExecute,
    },
    {
      id: "theme",
      iconClass: config.theme === "dark" ? "ri-moon-line" : "ri-sun-line",
      className: "item-theme",
      onClick: handleToggleTheme,
    },
  ];
  return (
    <header className="header">
      <h3 className="header-logo">grpsm</h3>
      <HeaderAction
        items={headerActions}
        className="header-list"
      ></HeaderAction>
    </header>
  );
};
