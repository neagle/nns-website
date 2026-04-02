"use client";

import { useId } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface AreaChartDataPoint {
  label: string;
  value: number;
}

interface AreaChartClientProps {
  data: AreaChartDataPoint[];
  valueLabel?: string;
  color?: string;
  height?: number;
}

const TOOLTIP_STYLE = {
  fontSize: 13,
  borderRadius: 6,
  border: "1px solid rgba(0,0,0,0.1)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

export default function AreaChartClient({
  data,
  valueLabel = "Value",
  color = "#8b5cf6",
  height = 300,
}: AreaChartClientProps) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: 4, bottom: 4 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="currentColor"
          strokeOpacity={0.08}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(v) => [v, valueLabel]}
          contentStyle={TOOLTIP_STYLE}
          cursor={{ stroke: color, strokeWidth: 1, strokeOpacity: 0.4 }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
