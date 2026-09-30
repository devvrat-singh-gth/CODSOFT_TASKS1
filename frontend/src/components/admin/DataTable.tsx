export interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

// Generic, reusable table — used for products, orders, users, and reviews in
// the admin section instead of four separate table implementations.
export function DataTable<T extends { _id: string }>({
  columns,
  rows,
  emptyMessage = "Nothing to show yet",
}: {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return <p className="py-10 text-center text-sm text-foreground/50">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted">
          <tr>
            {columns.map((c) => (
              <th key={c.header} className="px-4 py-2.5 font-medium">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id} className="border-t border-border">
              {columns.map((c) => (
                <td key={c.header} className="px-4 py-2.5">
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
