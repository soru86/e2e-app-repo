import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from "clsx";
export function Panel({ title, description, actions, className, children }) {
    return (_jsxs("section", { className: clsx("panel-surface rounded-2xl border border-slate-200/80 dark:border-orange-500/20 p-6 shadow-lg shadow-slate-200/60 dark:shadow-black/40 backdrop-blur-sm transition-all duration-300", "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70 dark:hover:shadow-black/60", className), children: [(title || description || actions) && (_jsxs("header", { className: "mb-5 flex flex-wrap items-start justify-between gap-4", children: [_jsxs("div", { children: [title && _jsx("h2", { className: "text-lg font-semibold text-slate-900 dark:text-slate-100", children: title }), description && _jsx("p", { className: "text-sm text-slate-500 dark:text-orange-200/80", children: description })] }), actions] })), _jsx("div", { children: children })] }));
}
