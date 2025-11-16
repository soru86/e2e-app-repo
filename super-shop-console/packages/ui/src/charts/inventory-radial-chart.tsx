import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, PolarAngleAxis } from "recharts";
import { Panel } from "../layout/shell";

export const defaultInventoryData = [
  { name: "In Stock", value: 72, fill: "#22c55e" },
  { name: "Reserved", value: 18, fill: "#f59e0b" },
  { name: "Backordered", value: 10, fill: "#ef4444" },
];

type Props = {
  data?: typeof defaultInventoryData;
};

export function InventoryRadialChart({ data = defaultInventoryData }: Props) {
  return (
    <Panel title="Inventory status" description="Distribution across lifecycle">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="48%" cy="48%" innerRadius="20%" outerRadius="90%" data={data} barSize={16}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background dataKey="value" cornerRadius={8} />
            <Legend iconType="circle" align="right" verticalAlign="middle" layout="vertical" />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}


