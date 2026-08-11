/**
 * Table — gaya hitam-putih (design system terpadu).
 * Daftar data dengan header uppercase + border hitam, konsisten dengan
 * tabel di seluruh halaman role.
 */
import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Array<Column<T>>;
  data: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

export default function Table<T>({ columns, data, rowKey, emptyMessage = 'Tidak ada data' }: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-md border-2 border-black bg-white">
      <table className="w-full text-left text-xs text-black">
        <thead>
          <tr className="border-b-2 border-black bg-neutral-50 text-[10px] font-bold tracking-wide uppercase">
            {columns.map((col) => (
              <th key={col.key} className={`px-3 py-2.5 ${col.className ?? ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-[11px] text-black/50 italic">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={rowKey(row)} className="transition-colors hover:bg-neutral-50">
                {columns.map((col) => (
                  <td key={col.key} className={`px-3 py-2.5 ${col.className ?? ''}`}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
