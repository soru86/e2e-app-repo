import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Panel } from "../layout/shell";

export type QuarterlySalesDatum = { quarter: string; revenue: number; target: number };

type Props = {
  data: QuarterlySalesDatum[];
};

export function QuarterlySalesChart({ data }: Props) {
  return (
    <Panel title="Total sales per quarter" description="Live revenue vs targets">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 24, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="quarter" tick={{ fill: "currentColor" }} />
            <YAxis tickFormatter={(value) => `$${value / 1000}k`} tick={{ fill: "currentColor" }} />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Bar dataKey="revenue" fill="#2563eb" radius={[8, 8, 0, 0]} />
            <Bar dataKey="target" fill="#a5b4fc" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}


