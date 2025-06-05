// components/ReusableTable.tsx

import React from "react";

interface ReusableTableProps<T> {
    headers: string[];
    data: T[];
    renderRow: (item: any, index: number) => React.ReactNode;

}

const ReusableTable = <T,>({ headers, data, renderRow }: ReusableTableProps<T>) => {

return(
    <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="min-w-full border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-100">
                    {headers.map((header) => (
                        <th
                            key={header}
                            className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-600"
                        >
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


)

};

export default ReusableTable;
