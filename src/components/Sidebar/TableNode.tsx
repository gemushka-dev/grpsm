import { TableNodeProps } from "../../type/props";
import { MetaDataSection } from "./MetaDataSection";

export const TableNode = (props: TableNodeProps) => {
  const { tableName, columns = [], constraints = [], indexes = [] } = props;
  const columnItems = columns.map((col, ind) => {
    return {
      id: `${ind}-${tableName}`,
      label: col.column_name,
      badge: col.data_type,
    };
  });
  const constraintItems = constraints.map((constr, ind) => {
    return {
      id: `${ind}-${tableName}`,
      label: constr.constraint_name,
      badge: constr.constraint_type,
    };
  });
  const indexeItems = indexes.map((ind, i) => {
    return {
      id: `${i}-${tableName}`,
      label: ind.index_name,
    };
  });
  return (
    <details key={tableName}>
      <summary>{tableName}</summary>

      <MetaDataSection
        title="Columns"
        items={columnItems}
        emptyText="No Columns"
      ></MetaDataSection>
      <MetaDataSection
        title="Constraints"
        items={constraintItems}
        emptyText="No Constraints"
      ></MetaDataSection>
      <MetaDataSection
        title="Indexes"
        items={indexeItems}
        emptyText="No Indexes"
      ></MetaDataSection>
    </details>
  );
};
