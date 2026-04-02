export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getShowAnalyticsData } from "@/app/actions/analytics";
import StatCard from "../_components/StatCard";
import BarChartClient, { type BarChartDataPoint } from "../_components/BarChartClient";
import PerformanceTable from "../_components/PerformanceTable";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ShowAnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const show = await getShowAnalyticsData(slug);

  if (!show) notFound();

  const avgTickets =
    show.performances.length > 0
      ? Math.round(show.totalTickets / show.performances.length)
      : 0;

  // Tickets per performance date
  const perfData: BarChartDataPoint[] = show.performances.map((p) => {
    const date = p.date
      ? new Date(p.date).toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
        })
      : "?";
    return {
      label: date,
      value: p.ticketsSold,
      highlight: p.status === "UPCOMING",
    };
  });

  // Day of week distribution for this show
  const dowCounts: number[] = [0, 0, 0, 0, 0, 0, 0];
  for (const perf of show.performances) {
    if (perf.dayOfWeek >= 0) {
      dowCounts[perf.dayOfWeek] += perf.ticketsSold;
    }
  }
  const dowData = DAY_NAMES.map((name, i) => ({
    label: name,
    value: dowCounts[i],
  }));

  return (
    <div className="p-4 md:p-6 xl:p-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-base-content/50">
          <Link href="/admin" className="hover:text-base-content transition-colors">
            Admin
          </Link>
          <span>/</span>
          <Link
            href="/admin/analytics"
            className="hover:text-base-content transition-colors"
          >
            Analytics
          </Link>
          <span>/</span>
          <span className="text-base-content">{show.title}</span>
        </div>

        <h1 className="mt-3">{show.title}</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-base-content/50">
          {show.author && <span>Written by {show.author}</span>}
          {show.openingDate && (
            <span>Opened {formatDate(show.openingDate)}</span>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats stats-vertical sm:stats-horizontal shadow bg-base-200 mb-8 w-full">
        <StatCard title="Performances" value={show.performances.length} />
        <StatCard
          title="Tickets Sold"
          value={
            show.totalTickets > 0 ? show.totalTickets.toLocaleString() : "—"
          }
        />
        <StatCard
          title="Est. Revenue"
          value={
            show.totalRevenue > 0 ? formatCurrency(show.totalRevenue) : "—"
          }
          description="Estimated"
        />
        <StatCard
          title="Cast"
          value={show.castCount > 0 ? show.castCount : "—"}
        />
        <StatCard
          title="Crew"
          value={show.crewCount > 0 ? show.crewCount : "—"}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {perfData.length > 0 && (
          <div className="card bg-base-200 lg:col-span-2">
            <div className="card-body gap-1">
              <h2 className="text-base font-semibold">Tickets per Performance</h2>
              <p className="text-sm text-base-content/50">
                Upcoming performances highlighted in amber · dashed line ={" "}
                show average ({avgTickets} tickets)
              </p>
              <div className="mt-3">
                <BarChartClient
                  data={perfData}
                  valueLabel="Tickets sold"
                  referenceLine={avgTickets > 0 ? avgTickets : undefined}
                  referenceLineLabel={`Avg (${avgTickets})`}
                  height={280}
                />
              </div>
            </div>
          </div>
        )}

        <div className="card bg-base-200">
          <div className="card-body gap-1">
            <h2 className="text-base font-semibold">Tickets by Day of Week</h2>
            <p className="text-sm text-base-content/50">
              Total tickets sold per weekday for this production
            </p>
            <div className="mt-3">
              <BarChartClient data={dowData} valueLabel="Tickets sold" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance breakdown table */}
      <div className="card bg-base-200">
        <div className="card-body gap-1">
          <h2 className="text-base font-semibold">All Performances</h2>
          <div className="mt-3">
            <PerformanceTable performances={show.performances} />
          </div>
        </div>
      </div>
    </div>
  );
}
