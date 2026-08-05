import { Connection } from "./connection.type";
import {
  ColumnInfo,
  ConstraintInfo,
  IndexInfo,
  ViewColumnInfo,
} from "./database.type";
import { MetadataItem } from "./metadata";

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
