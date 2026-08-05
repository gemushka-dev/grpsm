import { useState } from "react";
import {
  ColumnInfo,
  ConstraintInfo,
  IndexInfo,
  ViewColumnInfo,
} from "../../type/database.type";
import { ConnectionGroupProps } from "../../type/props";
import { invoke } from "@tauri-apps/api/core";
import { ConnectionItem } from "./ConnectionItem";
import { TableTree } from "./TableTree";
import { ViewTree } from "./ViewTree";

function groupResult<T extends { table_name: string }>(
  arr: T[],
): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  for (const item of arr) {
    (result[item.table_name] ??= []).push(item);
  }
  return result;
}

export const ConnectionGroup = (props: ConnectionGroupProps) => {
  const { connection, selectedId, onSelect } = props;
  const isSelected = selectedId === connection.id;

  const [columnMap, setColumnsMap] = useState<Record<string, ColumnInfo[]>>({});
  const [constraintMap, setConstraintsMap] = useState<
    Record<string, ConstraintInfo[]>
  >({});
  const [indexMap, setIndexesMap] = useState<Record<string, IndexInfo[]>>({});
  const [viewMap, setViewsMap] = useState<Record<string, ViewColumnInfo[]>>({});

  const fetchDatabase = async () => {
    try {
      const [columns, constraints, indexResult, views] = await Promise.all([
        invoke<ColumnInfo[]>("get_db_info", { uuid: connection.id }),
        invoke<ConstraintInfo[]>("get_constraints", { uuid: connection.id }),
        invoke<IndexInfo[]>("get_indexes", { uuid: connection.id }),
        invoke<ViewColumnInfo[]>("get_views", { uuid: connection.id }),
      ]);
      setColumnsMap(groupResult(columns));
      setConstraintsMap(groupResult(constraints));
      setIndexesMap(groupResult(indexResult));
      setViewsMap(groupResult(views));
    } catch (e) {
      console.error(e);
    }
  };

  const onDblClick = async () => {
    fetchDatabase();
  };

  return (
    <div className="connection-wrapper" key={connection.id}>
      <div className="tables-tree">
        <details>
          <summary>
            <ConnectionItem
              className={isSelected ? "selected" : ""}
              connection={connection}
              onSelect={onSelect}
              onDblClick={onDblClick}
            ></ConnectionItem>
          </summary>

          {columnMap && constraintMap && indexMap && viewMap && (
            <details>
              <summary>Schemas</summary>

              <TableTree
                tables={columnMap}
                constraints={constraintMap}
                indexes={indexMap}
              ></TableTree>

              <ViewTree views={viewMap}></ViewTree>
            </details>
          )}
        </details>
      </div>
    </div>
  );
};
