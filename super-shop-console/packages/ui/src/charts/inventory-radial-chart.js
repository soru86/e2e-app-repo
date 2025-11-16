import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, PolarAngleAxis } from "recharts";
import { Panel } from "../layout/shell";
export const defaultInventoryData = [
    { name: "In Stock", value: 72, fill: "#22c55e" },
    { name: "Reserved", value: 18, fill: "#f59e0b" },
    { name: "Backordered", value: 10, fill: "#ef4444" },
];
export function InventoryRadialChart({ data = defaultInventoryData }) {
    return (_jsx(Panel, { title: "Inventory status", description: "Distribution across lifecycle", children: _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RadialBarChart, { cx: "50%", cy: "50%", innerRadius: "20%", outerRadius: "100%", data: data, barSize: 18, children: [_jsx(PolarAngleAxis, { type: "number", domain: [0, 100], angleAxisId: 0, tick: false }), _jsx(RadialBar, { background: true, dataKey: "value" }), _jsx(Legend, { iconType: "circle" })] }) }) }) }));
}
