interface SkeletonProps {
  className?: string;
  count?: number;
}

export default function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`animate-pulse rounded bg-slate-200 ${className}`} />
      ))}
    </>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {[...Array(cols)].map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-300" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...Array(rows)].map((_, r) => (
              <tr key={r}>
                {[...Array(cols)].map((_, c) => (
                  <td key={c} className="px-4 py-3">
                    <div
                      className="h-4 animate-pulse rounded bg-slate-200"
                      style={{ width: `${50 + Math.random() * 40}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
