import React from "react";
interface ReusableTableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
}


const ReusableTable = <T,>({ headers, data, renderRow }: ReusableTableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-left text-sm">
        <thead className="bg-gray-100 text-black">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-4 py-2 border">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-black">
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="text-center py-4">
                No data found.
              </td>
            </tr>
          ) : (
            data.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;