import { ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import { Connection } from "./connection.type";
import {
  ColumnInfo,
  ConstraintInfo,
  IndexInfo,
  ViewColumnInfo,
} from "./database.type";
import { MetadataItem } from "./metadata";
import { ActionItem } from "./header.action";
import { AppConfig } from "./config.type";
import { Result } from "./result.type";

export interface BaseProps {
  className?: string;
  id?: string;
}

export interface ConnectionItemProps extends BaseProps {
  connection: Connection;
  onSelect?: () => void;
  onDblClick?: () => void;
}

export interface MetaDataSectionProps {
  title: string;
  items: MetadataItem[];
  emptyText?: string;
}

export interface TableNodeProps {
  tableName: string;
  columns: ColumnInfo[];
  constraints: ConstraintInfo[];
  indexes: IndexInfo[];
}

export interface TableTreeProps {
  tables: Record<string, ColumnInfo[]>;
  constraints: Record<string, ConstraintInfo[]>;
  indexes: Record<string, IndexInfo[]>;
}

export interface ViewNodeProps {
  viewName: string;
  columns: ViewColumnInfo[];
}

export interface ViewTreeProps {
  views: Record<string, ViewColumnInfo[]>;
}

export interface ConnectionGroupProps {
  connection: Connection;
  selectedId: string;
  onSelect?: () => void;
}

export interface SidebarProps {
  onNodeSelect: (node: any) => void;
  pgConnections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export interface HeaderActionProps extends BaseProps {
  items: ActionItem[];
}

export interface HeaderProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  setResult: React.Dispatch<React.SetStateAction<Result | string>>;
  activeConnection: Connection | null;
  code: string;
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {}

export interface ConnectionFormProps {
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
}
