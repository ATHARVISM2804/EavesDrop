// Shared comparison table for /vs/[slug] and /alternatives.
// A boolean renders a check/cross, "partial" a dash, any string renders as text.
export type CompareVal = boolean | "partial" | string;

export type CompareColumn = {
  key: string;
  label: string;
  sublabel?: string;
  featured?: boolean;
};

export type CompareRow = {
  label: string;
  values: Record<string, CompareVal>;
};

function Mark({ value, featured }: { value: CompareVal; featured?: boolean }) {
  if (value === true) {
    return (
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
          featured ? "bg-signal/12" : "bg-success/12"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-label="Yes">
          <path
            d="M13.5 4.5 6.5 11.5 3 8"
            stroke={featured ? "#D97B3F" : "#7A9B76"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-static/10">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-label="No">
          <path d="M4 4l8 8M12 4l-8 8" stroke="#5B6B7A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-static/10">
        <span className="h-0.5 w-2.5 rounded-full bg-static" />
      </span>
    );
  }
  return <span className="text-sm text-static">{value}</span>;
}

export function CompareTable({
  columns,
  rows,
  rowHeader = "Capability",
}: {
  columns: CompareColumn[];
  rows: CompareRow[];
  rowHeader?: string;
}) {
  const minWidth = 320 + columns.length * 160;
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full border-separate border-spacing-0"
        style={{ minWidth: `${minWidth}px` }}
      >
        <thead>
          <tr>
            <th className="px-5 py-4 text-left text-sm font-medium text-static">
              {rowHeader}
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-5 py-4 text-center ${
                  col.featured
                    ? "rounded-t-xl border border-b-0 border-signal/40 bg-signal/[0.06]"
                    : ""
                }`}
              >
                <span
                  className={`block ${
                    col.featured
                      ? "font-serif text-lg font-semibold text-ink"
                      : "text-sm font-medium text-static"
                  }`}
                >
                  {col.label}
                </span>
                {col.sublabel && (
                  <span className="mt-0.5 block text-xs font-normal text-static/70">
                    {col.sublabel}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const last = i === rows.length - 1;
            return (
              <tr key={row.label}>
                <th
                  scope="row"
                  className="border-t border-hairline px-5 py-4 text-left text-sm font-medium text-ink"
                >
                  {row.label}
                </th>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`border-t border-hairline px-5 py-4 text-center ${
                      col.featured
                        ? `border-x border-t-signal/40 bg-signal/[0.06] ${
                            last ? "rounded-b-xl border-b border-b-signal/40" : ""
                          }`
                        : ""
                    }`}
                  >
                    <div className="flex justify-center">
                      <Mark value={row.values[col.key]} featured={col.featured} />
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
