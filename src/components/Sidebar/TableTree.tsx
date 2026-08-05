import { TableTreeProps } from "../../type/props";
import { TableNode } from "./TableNode";

export const TableTree = (props: TableTreeProps) => {
  const { tables, constraints, indexes } = props;

  return (
    <details>
      <summary>Tables</summary>
      {Object.entries(tables).map(([tableName, cols]) => {
        const tableConstraints = constraints?.[tableName] || [];
        const tableIndexes = indexes?.[tableName] || [];
        return (
          <TableNode
            tableName={tableName}
            columns={cols}
            constraints={tableConstraints}
            indexes={tableIndexes}
          ></TableNode>
        );
      })}
    </details>
  );
};
