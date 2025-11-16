import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Stat({ label, value, trend, helpText }) {
    const trendLabel = trend ? `${trend > 0 ? "+" : ""}${trend}% vs prev.` : null;
    return (_jsxs("div", { className: "panel-surface rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm", children: [_jsx("p", { className: "text-sm uppercase tracking-wide text-slate-500", children: label }), _jsx("p", { className: "mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100", children: value }), (trendLabel || helpText) && (_jsxs("p", { className: "mt-2 text-xs text-slate-500 dark:text-slate-400", children: [trendLabel, trendLabel && helpText ? " · " : null, helpText] }))] }));
}
