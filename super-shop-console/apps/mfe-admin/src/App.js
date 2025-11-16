import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Routes, Route, NavLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ADMIN_DASHBOARD, UPSERT_DISCOUNT } from "./graphql";
import { Panel, DataTable, StatusBadge, Stat } from "@super-shop/ui";
const fallbackDashboard = {
    inventory: [
        { id: "INV-1", sku: "SKU-12", name: "LED TV", stock: 24, reorderThreshold: 5 },
        { id: "INV-2", sku: "SKU-62", name: "Wireless buds", stock: 180, reorderThreshold: 40 },
    ],
    orders: [
        { id: "ORD-1", status: "PENDING", total: 200, createdAt: "2024-03-12" },
        { id: "ORD-2", status: "FULFILLED", total: 87, createdAt: "2024-03-10" },
    ],
    issues: [
        { id: "ISS-1", customerId: "CUS-44", status: "OPEN", category: "DELIVERY", createdAt: "2024-03-11" },
    ],
    discounts: [{ id: "DISC-1", label: "Spring 10%", type: "PERCENTAGE", value: 10, active: true }],
};
const AUTH_STORAGE_KEY = "super-shop-admin-auth";
export default function AdminApp() {
    const location = useLocation();
    const basePath = location.pathname.startsWith("/admin") ? "/admin" : "";
    const [isAuthed, setIsAuthed] = useState(() => window.localStorage.getItem(AUTH_STORAGE_KEY) === "true");
    const handleLogin = useCallback(() => {
        setIsAuthed(true);
        window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
    }, []);
    const handleLogout = useCallback(() => {
        setIsAuthed(false);
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }, []);
    const loginPath = basePath ? `${basePath}/login` : "/login";
    const dashboardPath = basePath ? `${basePath}/*` : "/*";
    const defaultLanding = basePath ? `${basePath}/inventory` : "/inventory";
    return (_jsxs(Routes, { children: [_jsx(Route, { path: loginPath, element: isAuthed ? _jsx(Navigate, { to: defaultLanding, replace: true }) : _jsx(LoginScreen, { basePath: basePath, onLogin: handleLogin }) }), _jsx(Route, { path: dashboardPath, element: _jsx(ProtectedRoute, { authed: isAuthed, redirectTo: loginPath, children: _jsx(AdminShell, { basePath: basePath, onLogout: handleLogout }) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: isAuthed ? defaultLanding : loginPath, replace: true }) })] }));
}
function ProtectedRoute({ authed, redirectTo, children }) {
    if (!authed) {
        return _jsx(Navigate, { to: redirectTo, replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
function AdminShell({ basePath, onLogout }) {
    const { data, loading } = useQuery(ADMIN_DASHBOARD);
    const dashboard = useMemo(() => data?.adminDashboard ?? fallbackDashboard, [data]);
    const withBase = (segment) => (basePath ? `${basePath}${segment}` : segment || "/");
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200\n        dark:from-[#050505] dark:via-[#070707] dark:to-[#111827] text-slate-900 dark:text-slate-100", children: _jsxs("div", { className: "mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:px-8", children: [_jsxs("header", { className: "rounded-2xl bg-white/80 p-6 shadow-lg shadow-slate-200/60 dark:bg-[#111827]/90 dark:shadow-black/50", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm uppercase tracking-[0.35em] text-slate-400 dark:text-orange-200/70", children: "Super Shop" }), _jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Operations Control Center" })] }), _jsx("button", { onClick: onLogout, className: "rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-orange-500/40 dark:text-orange-200 dark:hover:bg-orange-500/10", children: "Logout" })] }), _jsx(NavBar, { basePath: basePath })] }), _jsxs(Routes, { children: [_jsx(Route, { path: withBase(""), element: _jsx(Overview, { dashboard: dashboard, loading: loading }) }), _jsx(Route, { path: withBase("/inventory"), element: _jsx(Inventory, { dashboard: dashboard, loading: loading }) }), _jsx(Route, { path: withBase("/orders"), element: _jsx(Orders, { dashboard: dashboard }) }), _jsx(Route, { path: withBase("/issues"), element: _jsx(Issues, { dashboard: dashboard }) }), _jsx(Route, { path: withBase("/discounts"), element: _jsx(Discounts, { dashboard: dashboard }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: withBase("/inventory"), replace: true }) })] })] }) }));
}
function NavBar({ basePath }) {
    const withBase = (segment) => (basePath ? `${basePath}${segment}` : segment || "/");
    const links = [
        { to: withBase(""), label: "Overview" },
        { to: withBase("/inventory"), label: "Inventory" },
        { to: withBase("/orders"), label: "Orders" },
        { to: withBase("/issues"), label: "Issues" },
        { to: withBase("/discounts"), label: "Discounts" },
    ];
    return (_jsx("nav", { className: "mt-6 flex flex-wrap gap-3", children: links.map((link) => (_jsx(NavLink, { to: link.to, className: ({ isActive }) => [
                "rounded-full px-4 py-1.5 text-sm font-semibold transition",
                isActive
                    ? "bg-slate-900 text-white dark:bg-orange-500 dark:text-slate-900"
                    : "text-slate-500 hover:text-slate-900 dark:text-orange-200/70 dark:hover:text-orange-200",
            ].join(" "), end: link.to === withBase(""), children: link.label }, link.to))) }));
}
function Overview({ dashboard, loading }) {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("section", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [_jsx(Stat, { label: "Total stock", value: `${dashboard.inventory.reduce((sum, item) => sum + item.stock, 0)} units`, trend: 8.4 }), _jsx(Stat, { label: "Open issues", value: dashboard.issues.length, trend: -3.1, helpText: "vs last week" }), _jsx(Stat, { label: "Active discounts", value: dashboard.discounts.filter((d) => d.active).length }), _jsx(Stat, { label: "Pending orders", value: dashboard.orders.filter((o) => o.status === "PENDING").length })] }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsx(Inventory, { dashboard: dashboard, loading: loading }), _jsx(Issues, { dashboard: dashboard })] })] }));
}
function Inventory({ dashboard, loading }) {
    if (loading) {
        return _jsx(Panel, { title: "Inventory management", children: "Loading inventory\u2026" });
    }
    const rows = [...dashboard.inventory];
    return (_jsx(Panel, { title: "Inventory management", description: "Track stock, replenishment windows, and low-supply alerts.", actions: _jsx("button", { className: "rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:border-slate-400 dark:border-orange-500/30 dark:text-orange-100 dark:hover:border-orange-400/70", children: "Export CSV" }), children: _jsx(DataTable, { columns: [
                { key: "sku", header: "SKU" },
                { key: "name", header: "Item" },
                { key: "stock", header: "Stock" },
                { key: "reorderThreshold", header: "Reorder at" },
            ], rows: rows }) }));
}
function Orders({ dashboard }) {
    const rows = [...dashboard.orders];
    return (_jsx(Panel, { title: "Order pipeline", description: "Monitor every stage of the fulfillment lifecycle.", children: _jsx(DataTable, { columns: [
                { key: "id", header: "Order #" },
                { key: "createdAt", header: "Date" },
                {
                    key: "status",
                    header: "Status",
                    render: (value) => {
                        const status = value;
                        return _jsx(StatusBadge, { label: String(status), tone: status === "PENDING" ? "warning" : "success" });
                    },
                },
                {
                    key: "total",
                    header: "Total",
                    render: (value) => `$${value}`,
                },
            ], rows: rows }) }));
}
function Issues({ dashboard }) {
    const rows = [...dashboard.issues];
    return (_jsx(Panel, { title: "Issue tracker", description: "Assign owners and update SLAs quickly.", children: _jsx(DataTable, { columns: [
                { key: "id", header: "Issue #" },
                { key: "customerId", header: "Customer" },
                { key: "category", header: "Category" },
                {
                    key: "status",
                    header: "Status",
                    render: (value) => {
                        const status = value;
                        return _jsx(StatusBadge, { label: String(status), tone: status === "OPEN" ? "danger" : "success" });
                    },
                },
            ], rows: rows }) }));
}
function Discounts({ dashboard }) {
    const [form, setForm] = useState({ label: "", value: 5, active: true });
    const [upsert, { data: mutationData, loading }] = useMutation(UPSERT_DISCOUNT);
    const rows = [...dashboard.discounts];
    return (_jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsx(Panel, { title: "Discount rules", description: "Live promos applied during checkout.", children: _jsx(DataTable, { columns: [
                        { key: "label", header: "Label" },
                        {
                            key: "type",
                            header: "Type",
                            render: (value) => _jsx(StatusBadge, { label: String(value), tone: "info" }),
                        },
                        {
                            key: "value",
                            header: "Value",
                            render: (value) => {
                                const numeric = value;
                                return `${numeric}${numeric < 1 ? "" : "%"}`;
                            },
                        },
                        {
                            key: "active",
                            header: "Active",
                            render: (value) => {
                                const active = Boolean(value);
                                return _jsx(StatusBadge, { label: active ? "Active" : "Paused", tone: active ? "success" : "warning" });
                            },
                        },
                    ], rows: rows }) }), _jsx(Panel, { title: "Create / update discount", description: "Provide quick incentives for at-risk segments.", children: _jsxs("form", { className: "space-y-4", onSubmit: (event) => {
                        event.preventDefault();
                        upsert({ variables: { input: { ...form, type: "PERCENTAGE" } } });
                    }, children: [_jsxs("label", { className: "block text-sm font-medium text-slate-500 dark:text-orange-100", children: ["Label", _jsx("input", { className: "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-slate-400 dark:border-orange-500/40 dark:bg-[#0c0c0c] dark:text-orange-50", value: form.label, onChange: (event) => setForm((prev) => ({ ...prev, label: event.target.value })) })] }), _jsxs("label", { className: "block text-sm font-medium text-slate-500 dark:text-orange-100", children: ["Value (%)", _jsx("input", { type: "number", className: "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-slate-400 dark:border-orange-500/40 dark:bg-[#0c0c0c] dark:text-orange-50", value: form.value, onChange: (event) => setForm((prev) => ({ ...prev, value: Number(event.target.value) })) })] }), _jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-600 dark:text-orange-100", children: [_jsx("input", { type: "checkbox", checked: form.active, onChange: (event) => setForm((prev) => ({ ...prev, active: event.target.checked })) }), "Active"] }), _jsx("button", { className: "w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-orange-500 dark:text-slate-900 disabled:opacity-60", type: "submit", disabled: loading, children: "Save rule" }), mutationData && _jsx("p", { className: "text-sm text-emerald-600 dark:text-orange-200", children: "Discount saved." })] }) })] }));
}
function LoginScreen({ basePath, onLogin }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const redirectTo = basePath ? `${basePath}/inventory` : "/inventory";
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-white dark:from-black dark:via-[#080505] dark:to-[#121212]\n      text-slate-900 dark:text-orange-100 flex items-center justify-center px-4", children: _jsx(Panel, { className: "w-full max-w-md p-10", title: "Super Shop Admin", description: "Secure access to analytics & operations", children: _jsxs("form", { className: "space-y-4", onSubmit: (event) => {
                    event.preventDefault();
                    onLogin();
                    navigate(redirectTo, { replace: true });
                }, children: [_jsxs("label", { className: "block text-sm font-semibold text-slate-500 dark:text-orange-100", children: ["Email", _jsx("input", { type: "email", required: true, className: "mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-slate-400 dark:border-orange-500/40 dark:bg-[#0c0c0c] dark:text-orange-50", value: form.email, onChange: (event) => setForm((prev) => ({ ...prev, email: event.target.value })) })] }), _jsxs("label", { className: "block text-sm font-semibold text-slate-500 dark:text-orange-100", children: ["Password", _jsx("input", { type: "password", required: true, className: "mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-slate-400 dark:border-orange-500/40 dark:bg-[#0c0c0c] dark:text-orange-50", value: form.password, onChange: (event) => setForm((prev) => ({ ...prev, password: event.target.value })) })] }), _jsx("button", { className: "w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-orange-500 dark:text-slate-900", children: "Sign in" })] }) }) }));
}
