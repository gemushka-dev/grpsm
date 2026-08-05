import { ViewTreeProps } from "../../type/props";
import { ViewNode } from "./ViewNode";

export const ViewTree = (props: ViewTreeProps) => {
  const { views } = props;
  return (
    <details>
      <summary>Views</summary>
      {Object.entries(views).map(([viewName, cols]) => {
        return <ViewNode viewName={viewName} columns={cols}></ViewNode>;
      })}
    </details>
  );
};
