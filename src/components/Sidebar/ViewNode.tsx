import { ViewNodeProps } from "../../type/props";
import { MetaDataSection } from "./MetaDataSection";

export const ViewNode = (props: ViewNodeProps) => {
  const { viewName, columns } = props;
  const columnItems = columns.map((col, ind) => {
    return {
      id: `view${ind}-${viewName}`,
      label: col.column_name,
      badge: col.data_type,
    };
  });
  return (
    <details key={viewName}>
      <summary>{viewName}</summary>

      <MetaDataSection
        title="Columns"
        items={columnItems}
        emptyText="No Columns"
      ></MetaDataSection>
    </details>
  );
};
