import "../styles/table.css";
type ResultTableProps = {
  data: Record<string, any>[] | string;
};

export const ResultTable = ({ data }: ResultTableProps) => {
  if (!data || data.length === 0) {
    return (
      <div>
        <span>Waiting for your SQL script</span>
      </div>
    );
  }
  if (typeof data == "string" || !data[0]) {
    return (
      <div>
        <span>Rows affected {data as string}</span>
      </div>
    );
  }
  const headers = Object.keys(data[0]);
  return (
    <div className="result-div">
      <table className="result-table">
        <thead className="table-header">
          <tr className="header-tr">
            {headers.map((header) => {
              return (
                <th key={header} className="header-th">
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.map((row, index) => {
            return (
              <tr key={row.id || index} className="body-tr">
                {headers.map((header) => {
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
};
