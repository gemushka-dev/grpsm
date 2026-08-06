import "../../styles/header.css";
import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect } from "react";
import { AppConfig } from "../../type/config.type";
import { ActionItem } from "../../type/header.action";
import { HeaderAction } from "./HeaderAction";
import { HeaderProps } from "../../type/props";

export const Header = (props: HeaderProps) => {
  const {
    activeConnection,
    isVisible,
    setIsVisible,
    code,
    setResult,
    config,
    setConfig,
  } = props;
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
