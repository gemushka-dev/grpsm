import { Connection } from "./connection.type";
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
