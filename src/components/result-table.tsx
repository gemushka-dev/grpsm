import { memo } from "react";
import "../styles/table.css";
import { Result } from "../type/result.type";
type ResultTableProps = {
  data: Result | string;
};

export const ResultTable = memo(({ data }: ResultTableProps) => {
  if (typeof data == "string") {
    return (
      <div className="result-msg">
        <span>{data as string}</span>
      </div>
    );
  }
  if (data.type === "mutation") {
    return (
      <div className="result-msg">
        <span>{data.rows_affected}</span>
      </div>
    );
  }
  return (
    <div className="result-div">
      <table className="result-table">
        <thead className="table-header">
          <tr className="header-tr">
            {data.columns.map((header) => {
              return (
                <th key={header} className="header-th">
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.data.map((row, index) => {
            return (
              <tr key={row.id || index} className="body-tr">
                {data.columns.map((header) => {
                  return (
                    <td key={header} className="body-td">
                      {typeof row[header] == "object"
                        ? JSON.stringify(row[header])
                        : String(row[header])}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
