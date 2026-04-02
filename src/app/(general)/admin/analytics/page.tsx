export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAnalyticsData } from "@/app/actions/analytics";
import StatCard from "./_components/StatCard";
import BarChartClient from "./_components/BarChartClient";
import AreaChartClient from "./_components/AreaChartClient";
import ScatterChartClient from "./_components/ScatterChartClient";
import ShowsTable from "./_components/ShowsTable";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AnalyticsPage() {
  const { showAnalytics, totalTickets, totalRevenue, totalPerformances } =
    await getAnalyticsData();

  // --- Chart data ---

  // Tickets per show (sorted by opening date, oldest first)
  const ticketsPerShow = [...showAnalytics]
    .sort((a, b) => a.openingDate.localeCompare(b.openingDate))
    .map((s) => ({ label: s.title, value: s.totalTickets }));

  // Revenue per show
  const revenuePerShow = [...showAnalytics]
    .sort((a, b) => a.openingDate.localeCompare(b.openingDate))
    .map((s) => ({ label: s.title, value: Math.round(s.totalRevenue) }));

  // Day of week distribution (aggregate across all shows)
  const dowCounts: number[] = [0, 0, 0, 0, 0, 0, 0];
  for (const show of showAnalytics) {
    for (const perf of show.performances) {
      if (perf.dayOfWeek >= 0) {
        dowCounts[perf.dayOfWeek] += perf.ticketsSold;
      }
    }
  }
  const dowData = DAY_NAMES.map((name, i) => ({ label: name, value: dowCounts[i] }));

  // Monthly trend (all shows combined)
  const monthlyMap: Record<string, number> = {};
  for (const show of showAnalytics) {
    for (const perf of show.performances) {
      if (!perf.date) continue;
      const key = perf.date.substring(0, 7); // "YYYY-MM"
      monthlyMap[key] = (monthlyMap[key] ?? 0) + perf.ticketsSold;
    }
  }
  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => {
      const [year, month] = key.split("-");
      const label = new Date(
        Number(year),
        Number(month) - 1,
        1,
      ).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      return { label, value };
    });

  // Cast size vs. tickets sold (scatter)
  const scatterData = showAnalytics
    .filter((s) => s.castCount > 0 && s.totalTickets > 0)
    .map((s) => ({ x: s.castCount, y: s.totalTickets, name: s.title }));

  return (
    <div className="p-4 md:p-6 xl:p-8">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-sm text-base-content/50 hover:text-base-content transition-colors"
        >
          ← Admin
        </Link>
        <h1 className="mt-2">Show Analytics</h1>
        <p className="mt-1 text-sm text-base-content/60">
          Ticket sales and revenue estimates across all productions.{" "}
          <span className="italic">
            Revenue is estimated (tickets sold × lowest ticket price).
          </span>
        </p>
      </div>

      {/* Stat cards */}
      <div className="stats stats-vertical sm:stats-horizontal shadow bg-base-200 mb-8 w-full">
        <StatCard title="Productions" value={showAnalytics.length} />
        <StatCard
          title="Total Performances"
          value={totalPerformances.toLocaleString()}
        />
        <StatCard
          title="Total Tickets Sold"
          value={totalTickets.toLocaleString()}
        />
        <StatCard
          title="Est. Gross Revenue"
          value={totalRevenue > 0 ? formatCurrency(totalRevenue) : "—"}
          description="Estimated"
        />
      </div>

      {/* Charts grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card bg-base-200">
          <div className="card-body gap-1">
            <h2 className="text-base font-semibold">Tickets Sold per Show</h2>
            <div className="mt-3">
              <BarChartClient
                data={ticketsPerShow}
                valueLabel="Tickets sold"
                horizontal
                height={Math.max(200, ticketsPerShow.length * 36)}
              />
            </div>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body gap-1">
            <h2 className="text-base font-semibold">Est. Revenue per Show</h2>
            <div className="mt-3">
              <BarChartClient
                data={revenuePerShow}
                valueLabel="Est. revenue ($)"
                color="#0891b2"
                horizontal
                height={Math.max(200, revenuePerShow.length * 36)}
              />
            </div>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body gap-1">
            <h2 className="text-base font-semibold">Tickets by Day of Week</h2>
            <p className="text-sm text-base-content/50">
              Total tickets sold per weekday, across all shows
            </p>
            <div className="mt-3">
              <BarChartClient data={dowData} valueLabel="Tickets sold" />
            </div>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body gap-1">
            <h2 className="text-base font-semibold">Monthly Ticket Sales</h2>
            <p className="text-sm text-base-content/50">
              All productions combined
            </p>
            <div className="mt-3">
              <AreaChartClient data={monthlyData} valueLabel="Tickets sold" />
            </div>
          </div>
        </div>

        {scatterData.length > 1 && (
          <div className="card bg-base-200 lg:col-span-2">
            <div className="card-body gap-1">
              <h2 className="text-base font-semibold">
                Cast Size vs. Tickets Sold
              </h2>
              <p className="text-sm text-base-content/50">
                Does a larger cast correlate with higher ticket sales?
              </p>
              <div className="mt-3">
                <ScatterChartClient
                  data={scatterData}
                  xLabel="Cast Size"
                  yLabel="Tickets Sold"
                  height={300}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* All shows table */}
      <div className="card bg-base-200 mt-6">
        <div className="card-body gap-1">
          <h2 className="text-base font-semibold">All Productions</h2>
          <div className="mt-3">
            <ShowsTable shows={showAnalytics} />
          </div>
        </div>
      </div>
    </div>
  );
}
