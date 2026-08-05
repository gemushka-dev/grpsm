import { Connection } from "./connection.type";

export interface BaseProps {
  className?: string;
  id?: string;
}

export interface ConnectionItemProps extends BaseProps {
  connection: Connection;
  onSelect?: () => void;
  onDblClick?: () => void;
}
