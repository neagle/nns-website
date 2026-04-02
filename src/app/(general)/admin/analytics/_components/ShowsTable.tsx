"use client";

import Link from "next/link";
import { useState } from "react";
import type { ShowAnalytics } from "@/app/actions/analytics";

type SortKey = keyof Pick<
  ShowAnalytics,
  "title" | "openingDate" | "totalTickets" | "totalRevenue" | "castCount"
> | "performances";

interface ShowsTableProps {
  shows: ShowAnalytics[];
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
  });
}

export default function ShowsTable({ shows }: ShowsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("openingDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggle = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...shows].sort((a, b) => {
    let av: string | number;
    let bv: string | number;

    if (sortKey === "performances") {
      av = a.performances.length;
      bv = b.performances.length;
    } else {
      av = a[sortKey] ?? "";
      bv = b[sortKey] ?? "";
    }

    if (typeof av === "string" && typeof bv === "string") {
      return sortDir === "asc"
        ? av.localeCompare(bv)
        : bv.localeCompare(av);
    }
    return sortDir === "asc"
      ? (av as number) - (bv as number)
      : (bv as number) - (av as number);
  });

  const Th = ({
    label,
    col,
    className,
  }: {
    label: string;
    col: SortKey;
    className?: string;
  }) => (
    <th
      className={`cursor-pointer select-none hover:bg-base-300 transition-colors ${className ?? ""}`}
      onClick={() => toggle(col)}
    >
      {label}
      {sortKey === col && (
        <span className="ml-1 text-xs opacity-60">
          {sortDir === "asc" ? "↑" : "↓"}
        </span>
      )}
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="table table-sm w-full">
        <thead>
          <tr>
            <Th label="Show" col="title" className="min-w-36" />
            <Th label="Opened" col="openingDate" />
            <Th label="Perfs" col="performances" />
            <Th label="Tickets Sold" col="totalTickets" />
            <Th label="Est. Revenue" col="totalRevenue" />
            <Th label="Cast" col="castCount" />
            <th />
          </tr>
        </thead>
        <tbody>
          {sorted.map((show) => (
            <tr key={show.showId} className="hover">
              <td className="font-medium">{show.title}</td>
              <td className="text-base-content/70 whitespace-nowrap">
                {formatDate(show.openingDate)}
              </td>
              <td>{show.performances.length}</td>
              <td>{show.totalTickets > 0 ? show.totalTickets.toLocaleString() : "—"}</td>
              <td className="text-base-content/80">
                {formatCurrency(show.totalRevenue)}
              </td>
              <td>{show.castCount > 0 ? show.castCount : "—"}</td>
              <td>
                <Link
                  href={`/admin/analytics/${show.slug}`}
                  className="btn btn-xs btn-ghost"
                >
                  Detail →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
