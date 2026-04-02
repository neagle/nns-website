import type { PerformanceStats } from "@/app/actions/analytics";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface PerformanceTableProps {
  performances: PerformanceStats[];
}

function formatCurrency(value: number) {
  return value === 0
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusBadge(status: string) {
  if (status === "UPCOMING")
    return (
      <span className="badge badge-sm badge-soft badge-info">Upcoming</span>
    );
  if (status === "CANCELED")
    return (
      <span className="badge badge-sm badge-soft badge-error">Canceled</span>
    );
  return (
    <span className="badge badge-sm badge-soft badge-neutral">Past</span>
  );
}

export default function PerformanceTable({ performances }: PerformanceTableProps) {
  if (performances.length === 0) {
    return <p className="text-base-content/50 text-sm">No performances found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-sm w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Day</th>
            <th>Tickets Sold</th>
            <th>Est. Revenue</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {performances.map((perf) => (
            <tr key={perf.eventId} className="hover">
              <td className="whitespace-nowrap">{formatDate(perf.date)}</td>
              <td>{perf.dayOfWeek >= 0 ? DAY_NAMES[perf.dayOfWeek] : "—"}</td>
              <td>{perf.ticketsSold > 0 ? perf.ticketsSold : "—"}</td>
              <td>{formatCurrency(perf.estimatedRevenue)}</td>
              <td>{statusBadge(perf.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
