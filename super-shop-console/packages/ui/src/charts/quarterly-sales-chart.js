import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Panel } from "../layout/shell";
export function QuarterlySalesChart({ data }) {
    return (_jsx(Panel, { title: "Total sales per quarter", description: "Live revenue vs targets", children: _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data, margin: { top: 10, right: 20, bottom: 0, left: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "quarter" }), _jsx(YAxis, { tickFormatter: (value) => `$${value / 1000}k` }), _jsx(Tooltip, { formatter: (value) => `$${value.toLocaleString()}` }), _jsx(Bar, { dataKey: "revenue", fill: "#2563eb", radius: [6, 6, 0, 0] }), _jsx(Bar, { dataKey: "target", fill: "#a5b4fc", radius: [6, 6, 0, 0] })] }) }) }) }));
}
