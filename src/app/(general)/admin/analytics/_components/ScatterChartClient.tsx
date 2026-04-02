"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

export interface ScatterDataPoint {
  x: number;
  y: number;
  name: string;
}

interface ScatterChartClientProps {
  data: ScatterDataPoint[];
  xLabel?: string;
  yLabel?: string;
  color?: string;
  height?: number;
}

interface TooltipPayload {
  payload?: ScatterDataPoint;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  if (!d) return null;
  return (
    <div
      style={{
        fontSize: 13,
        borderRadius: 6,
        border: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
      className="bg-base-100 p-2.5"
    >
      <p className="font-semibold mb-1">{d.name}</p>
      <p className="text-base-content/70">Cast members: {d.x}</p>
      <p className="text-base-content/70">Tickets sold: {d.y}</p>
    </div>
  );
};

export default function ScatterChartClient({
  data,
  xLabel = "Cast Size",
  yLabel = "Tickets Sold",
  color = "#8b5cf6",
  height = 300,
}: ScatterChartClientProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 8, right: 16, left: 4, bottom: 28 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="currentColor"
          strokeOpacity={0.08}
        />
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        >
          <Label
            value={xLabel}
            position="insideBottom"
            offset={-16}
            fontSize={12}
            fill="currentColor"
            fillOpacity={0.5}
          />
        </XAxis>
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeOpacity: 0.1 }} />
        <Scatter data={data} fill={color} opacity={0.75} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
