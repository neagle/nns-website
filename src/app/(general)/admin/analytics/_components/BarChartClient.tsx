"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

export interface BarChartDataPoint {
  label: string;
  value: number;
  highlight?: boolean;
}

interface BarChartClientProps {
  data: BarChartDataPoint[];
  valueLabel?: string;
  color?: string;
  highlightColor?: string;
  horizontal?: boolean;
  referenceLine?: number;
  referenceLineLabel?: string;
  height?: number;
}

const TOOLTIP_STYLE = {
  fontSize: 13,
  borderRadius: 6,
  border: "1px solid rgba(0,0,0,0.1)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

export default function BarChartClient({
  data,
  valueLabel = "Value",
  color = "#8b5cf6",
  highlightColor = "#d97706",
  horizontal = false,
  referenceLine,
  referenceLineLabel,
  height = 300,
}: BarChartClientProps) {
  if (horizontal) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 32, left: 4, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="currentColor"
            strokeOpacity={0.08}
          />
          <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            width={175}
            tick={{ fontSize: 12 }}
            tickFormatter={(v: string) =>
              v.length > 28 ? v.slice(0, 27) + "…" : v
            }
            tickLine={false}
          />
          <Tooltip
            formatter={(v) => [v, valueLabel]}
            contentStyle={TOOLTIP_STYLE}
            cursor={{ fill: "currentColor", fillOpacity: 0.04 }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.highlight ? highlightColor : color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 4, bottom: 4 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="currentColor"
          strokeOpacity={0.08}
        />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(v) => [v, valueLabel]}
          contentStyle={TOOLTIP_STYLE}
          cursor={{ fill: "currentColor", fillOpacity: 0.04 }}
        />
        {referenceLine !== undefined && (
          <ReferenceLine
            y={referenceLine}
            stroke="#f97316"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: referenceLineLabel ?? "Avg",
              fill: "#f97316",
              fontSize: 11,
              fontWeight: 500,
            }}
          />
        )}
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.highlight ? highlightColor : color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
