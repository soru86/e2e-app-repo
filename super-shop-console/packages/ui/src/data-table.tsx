import { clsx } from "clsx";
import type { ReactNode } from "react";

type Column<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  emptyState?: string;
};

export function DataTable<T extends Record<string, unknown>>({ columns, rows, emptyState = "No data" }: Props<T>) {
  const hasRows = rows.length > 0;
  return (
    <div className="panel-surface overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={clsx(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500",
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {!hasRows && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-slate-500">
                {emptyState}
              </td>
            </tr>
          )}
          {hasRows &&
            rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80">
                {columns.map((column) => (
                  <td
                    key={`${String(column.key)}-${idx}`}
                    className={clsx("px-4 py-3 text-sm text-slate-700 dark:text-slate-200", column.className)}
                  >
                    {column.render ? column.render(row[column.key], row) : (row[column.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
