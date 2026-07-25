import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({ data, columns, onRowClick }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-[var(--color-outline-variant)]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[var(--color-surface-admin)] border-b border-[var(--color-outline-variant)] text-[var(--color-outline)] text-sm font-medium">
            {columns.map((col, index) => (
              <th key={index} className="py-4 px-6">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-outline-variant)]">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`hover:bg-blue-50/50 transition-colors group ${onRowClick ? 'cursor-pointer' : ''} border-l-4 border-transparent hover:border-[var(--color-primary)]`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="py-4 px-6 text-sm">
                  {col.cell ? col.cell(row) : (col.accessorKey ? String(row[col.accessorKey]) : null)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
