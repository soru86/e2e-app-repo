import { useMemo, useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import type { Location, NavigateFunction } from "react-router-dom";
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
} as const;

type AdminAppProps = {
  basePath?: string;
  location?: Location;
  navigate?: NavigateFunction;
};

export default function AdminApp({ basePath = "", location, navigate }: AdminAppProps) {
  const AUTH_STORAGE_KEY = "super-shop-admin-auth";
  const embeddedInShell = Boolean(basePath && location && navigate);

  const [isAuthed, setIsAuthed] = useState<boolean>(() => window.localStorage.getItem(AUTH_STORAGE_KEY) === "true");

  const handleLogin = useCallback(() => {
    setIsAuthed(true);
    window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthed(false);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  if (embeddedInShell) {
    return <AdminShell basePath={basePath} onLogout={() => {}} router={{ location: location!, navigate: navigate! }} />;
  }

  const loginPath = "/login";
  const dashboardPath = "/*";
  const defaultLanding = "/inventory";

  return (
    <Routes>
      <Route
        path={loginPath}
        element={isAuthed ? <Navigate to={defaultLanding} replace /> : <LoginScreen basePath={basePath} onLogin={handleLogin} />}
      />
      <Route
        path={dashboardPath}
        element={
          <ProtectedRoute authed={isAuthed} redirectTo={loginPath}>
            <AdminShell basePath={basePath} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isAuthed ? defaultLanding : loginPath} replace />} />
    </Routes>
  );
}

function ProtectedRoute({ authed, redirectTo, children }: { authed: boolean; redirectTo: string; children: React.ReactNode }) {
  if (!authed) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
}

type AdminShellProps = {
  basePath: string;
  onLogout: () => void;
  router?: {
    location: Location;
    navigate: NavigateFunction;
  };
};

function AdminShell({ basePath, onLogout, router }: AdminShellProps) {
  const { data, loading } = useQuery(ADMIN_DASHBOARD);
  const dashboard = useMemo(() => data?.adminDashboard ?? fallbackDashboard, [data]);

  const sanitizedBase = normalizeBasePath(basePath);
  const buildHref = useCallback((segment: string) => buildPath(segment, sanitizedBase), [sanitizedBase]);
  const buildRoutePath = useCallback(
    (segment: string) => {
      if (embeddedInShell) {
        return buildHref(segment);
      }
      const normalized = normalizeRelativePath(segment);
      return normalized === "/" ? "" : normalized.replace(/^\//, "");
    },
    [embeddedInShell, buildHref],
  );

  const embeddedInShell = Boolean(router);
  const relativePath = embeddedInShell ? getRelativePath(router!.location.pathname, sanitizedBase) : undefined;
  const normalizedRelativePath = embeddedInShell ? normalizeRelativePath(relativePath ?? "/") : undefined;

  useEffect(() => {
    if (!embeddedInShell || !router) return;
    if (!normalizedRelativePath) return;
    if (!NAVIGATION_ITEMS.some((item) => item.relativePath === normalizedRelativePath)) {
      router.navigate(buildHref("/inventory"), { replace: true });
    }
  }, [embeddedInShell, normalizedRelativePath, router, buildHref]);

  const content = (
    <>
      <header className="rounded-2xl bg-white/80 p-6 shadow-lg shadow-slate-200/60 dark:bg-[#111827]/90 dark:shadow-black/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400 dark:text-orange-200/70">Super Shop</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Operations Control Center</h1>
          </div>
          {!embeddedInShell && (
            <button
              onClick={onLogout}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-orange-500/40 dark:text-orange-200 dark:hover:bg-orange-500/10"
            >
              Logout
            </button>
          )}
        </div>
        <NavBar
          embeddedInShell={embeddedInShell}
          activePath={normalizedRelativePath}
          onNavigate={router?.navigate}
          buildHref={buildHref}
        />
      </header>

      {embeddedInShell ? (
        <EmbeddedRoutesView activePath={normalizedRelativePath ?? "/"} dashboard={dashboard} loading={loading} />
      ) : (
        <Routes>
          <Route path={buildRoutePath("/")} element={<Overview dashboard={dashboard} loading={loading} />} />
          <Route path={buildRoutePath("/inventory")} element={<Inventory dashboard={dashboard} loading={loading} />} />
          <Route path={buildRoutePath("/orders")} element={<Orders dashboard={dashboard} />} />
          <Route path={buildRoutePath("/issues")} element={<Issues dashboard={dashboard} />} />
          <Route path={buildRoutePath("/discounts")} element={<Discounts dashboard={dashboard} />} />
          <Route path="*" element={<Navigate to={buildRoutePath("/inventory")} replace />} />
        </Routes>
      )}
    </>
  );

  if (embeddedInShell) {
    return <div className="mt-4 space-y-4">{content}</div>;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200
        dark:from-[#050505] dark:via-[#070707] dark:to-[#111827] text-slate-900 dark:text-slate-100"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:px-8">{content}</div>
    </div>
  );
}

type NavBarProps = {
  embeddedInShell: boolean;
  activePath?: string;
  onNavigate?: NavigateFunction;
  buildHref: (segment: string) => string;
};

function NavBar({ embeddedInShell, activePath, onNavigate, buildHref }: NavBarProps) {
  const links = NAVIGATION_ITEMS.map((item) => ({
    ...item,
    href: buildHref(item.relativePath),
  }));

  if (embeddedInShell) {
    return (
      <nav className="mt-6 flex flex-wrap gap-3">
        {links.map((link) => {
          const isActive = activePath === link.relativePath;
          return (
            <button
              key={link.relativePath}
              type="button"
              onClick={() => onNavigate?.(link.href)}
              className={[
                "rounded-full px-4 py-1.5 text-sm font-semibold transition",
                isActive
                  ? "bg-slate-900 text-white dark:bg-orange-500 dark:text-slate-900"
                  : "text-slate-500 hover:text-slate-900 dark:text-orange-200/70 dark:hover:text-orange-200",
              ].join(" ")}
            >
              {link.label}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="mt-6 flex flex-wrap gap-3">
      {links.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          className={({ isActive }) =>
            [
              "rounded-full px-4 py-1.5 text-sm font-semibold transition",
              isActive
                ? "bg-slate-900 text-white dark:bg-orange-500 dark:text-slate-900"
                : "text-slate-500 hover:text-slate-900 dark:text-orange-200/70 dark:hover:text-orange-200",
            ].join(" ")
          }
          end={link.relativePath === "/"}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

function EmbeddedRoutesView({
  activePath,
  dashboard,
  loading,
}: {
  activePath: string;
  dashboard: typeof fallbackDashboard;
  loading: boolean;
}) {
  switch (activePath) {
    case "/":
      return <Overview dashboard={dashboard} loading={loading} />;
    case "/inventory":
      return <Inventory dashboard={dashboard} loading={loading} />;
    case "/orders":
      return <Orders dashboard={dashboard} />;
    case "/issues":
      return <Issues dashboard={dashboard} />;
    case "/discounts":
      return <Discounts dashboard={dashboard} />;
    default:
      return null;
  }
}

function Overview({ dashboard, loading }: { dashboard: typeof fallbackDashboard; loading: boolean }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total stock" value={`${dashboard.inventory.reduce((sum, item) => sum + item.stock, 0)} units`} trend={8.4} />
        <Stat label="Open issues" value={dashboard.issues.length} trend={-3.1} helpText="vs last week" />
        <Stat label="Active discounts" value={dashboard.discounts.filter((d) => d.active).length} />
        <Stat label="Pending orders" value={dashboard.orders.filter((o) => o.status === "PENDING").length} />
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <Inventory dashboard={dashboard} loading={loading} />
        <Issues dashboard={dashboard} />
      </div>
    </div>
  );
}

function Inventory({ dashboard, loading }: { dashboard: typeof fallbackDashboard; loading: boolean }) {
  if (loading) {
    return <Panel title="Inventory management">Loading inventory…</Panel>;
  }
  const rows: Array<(typeof dashboard.inventory)[number]> = [...dashboard.inventory];
  return (
    <Panel
      title="Inventory management"
      description="Track stock, replenishment windows, and low-supply alerts."
      actions={
        <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:border-slate-400 dark:border-orange-500/30 dark:text-orange-100 dark:hover:border-orange-400/70">
          Export CSV
        </button>
      }
    >
      <DataTable<(typeof dashboard.inventory)[number]>
        columns={[
          { key: "sku", header: "SKU" },
          { key: "name", header: "Item" },
          { key: "stock", header: "Stock" },
          { key: "reorderThreshold", header: "Reorder at" },
        ]}
        rows={rows}
      />
    </Panel>
  );
}

function Orders({ dashboard }: { dashboard: typeof fallbackDashboard }) {
  type OrderStatus = (typeof dashboard.orders)[number]["status"];
  const rows: Array<(typeof dashboard.orders)[number]> = [...dashboard.orders];
  return (
    <Panel title="Order pipeline" description="Monitor every stage of the fulfillment lifecycle.">
      <DataTable<(typeof dashboard.orders)[number]>
        columns={[
          { key: "id", header: "Order #" },
          { key: "createdAt", header: "Date" },
          {
            key: "status",
            header: "Status",
            render: (value) => {
              const status = value as OrderStatus;
              return <StatusBadge label={String(status)} tone={status === "PENDING" ? "warning" : "success"} />;
            },
          },
          {
            key: "total",
            header: "Total",
            render: (value) => `$${value as number}`,
          },
        ]}
        rows={rows}
      />
    </Panel>
  );
}

function Issues({ dashboard }: { dashboard: typeof fallbackDashboard }) {
  type IssueStatus = (typeof dashboard.issues)[number]["status"];
  const rows: Array<(typeof dashboard.issues)[number]> = [...dashboard.issues];
  return (
    <Panel title="Issue tracker" description="Assign owners and update SLAs quickly.">
      <DataTable<(typeof dashboard.issues)[number]>
        columns={[
          { key: "id", header: "Issue #" },
          { key: "customerId", header: "Customer" },
          { key: "category", header: "Category" },
          {
            key: "status",
            header: "Status",
            render: (value) => {
              const status = value as IssueStatus;
              return <StatusBadge label={String(status)} tone={status === "OPEN" ? "danger" : "success"} />;
            },
          },
        ]}
        rows={rows}
      />
    </Panel>
  );
}

function Discounts({ dashboard }: { dashboard: typeof fallbackDashboard }) {
  const [form, setForm] = useState({ label: "", value: 5, active: true });
  const [upsert, { data: mutationData, loading }] = useMutation(UPSERT_DISCOUNT);
  type Discount = (typeof dashboard.discounts)[number];
  const rows: Array<Discount> = [...dashboard.discounts];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Discount rules" description="Live promos applied during checkout.">
        <DataTable<Discount>
          columns={[
            { key: "label", header: "Label" },
            {
              key: "type",
              header: "Type",
              render: (value) => <StatusBadge label={String(value)} tone="info" />,
            },
            {
              key: "value",
              header: "Value",
              render: (value) => {
                const numeric = value as number;
                return `${numeric}${numeric < 1 ? "" : "%"}`;
              },
            },
            {
              key: "active",
              header: "Active",
              render: (value) => {
                const active = Boolean(value);
                return <StatusBadge label={active ? "Active" : "Paused"} tone={active ? "success" : "warning"} />;
              },
            },
          ]}
          rows={rows}
        />
      </Panel>
      <Panel title="Create / update discount" description="Provide quick incentives for at-risk segments.">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            upsert({ variables: { input: { ...form, type: "PERCENTAGE" } } });
          }}
        >
          <label className="block text-sm font-medium text-slate-500 dark:text-orange-100">
            Label
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-slate-400 dark:border-orange-500/40 dark:bg-[#0c0c0c] dark:text-orange-50"
              value={form.label}
              onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
            />
          </label>
          <label className="block text-sm font-medium text-slate-500 dark:text-orange-100">
            Value (%)
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-slate-400 dark:border-orange-500/40 dark:bg-[#0c0c0c] dark:text-orange-50"
              value={form.value}
              onChange={(event) => setForm((prev) => ({ ...prev, value: Number(event.target.value) }))}
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-orange-100">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
            />
            Active
          </label>
          <button
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-orange-500 dark:text-slate-900 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            Save rule
          </button>
          {mutationData && <p className="text-sm text-emerald-600 dark:text-orange-200">Discount saved.</p>}
        </form>
      </Panel>
    </div>
  );
}

function LoginScreen({ basePath, onLogin }: { basePath: string; onLogin: () => void }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const redirectTo = basePath ? `${basePath}/inventory` : "/inventory";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-white dark:from-black dark:via-[#080505] dark:to-[#121212]
      text-slate-900 dark:text-orange-100 flex items-center justify-center px-4"
    >
      <Panel className="w-full max-w-md p-10" title="Super Shop Admin" description="Secure access to analytics & operations">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onLogin();
            navigate(redirectTo, { replace: true });
          }}
        >
          <label className="block text-sm font-semibold text-slate-500 dark:text-orange-100">
            Email
            <input
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-slate-400 dark:border-orange-500/40 dark:bg-[#0c0c0c] dark:text-orange-50"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </label>
          <label className="block text-sm font-semibold text-slate-500 dark:text-orange-100">
            Password
            <input
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-slate-400 dark:border-orange-500/40 dark:bg-[#0c0c0c] dark:text-orange-50"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
          </label>
          <button className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-orange-500 dark:text-slate-900">
            Sign in
          </button>
        </form>
      </Panel>
    </div>
  );
}

const NAVIGATION_ITEMS = [
  { relativePath: "/", label: "Overview" },
  { relativePath: "/inventory", label: "Inventory" },
  { relativePath: "/orders", label: "Orders" },
  { relativePath: "/issues", label: "Issues" },
  { relativePath: "/discounts", label: "Discounts" },
] as const;

function normalizeBasePath(basePath?: string) {
  if (!basePath || basePath === "/") {
    return "";
  }
  return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
}

function normalizeRelativePath(path?: string) {
  if (!path || path === "") {
    return "/";
  }
  let normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

function getRelativePath(fullPath: string, basePath: string) {
  const normalizedFull = normalizeRelativePath(fullPath);
  if (!basePath) {
    return normalizedFull;
  }
  if (normalizedFull === basePath) {
    return "/";
  }
  if (normalizedFull.startsWith(`${basePath}/`)) {
    return normalizedFull.slice(basePath.length);
  }
  return normalizedFull;
}

function buildPath(segment: string, basePath: string) {
  const normalizedSegment = normalizeRelativePath(segment);
  if (!basePath) {
    return normalizedSegment;
  }
  if (normalizedSegment === "/") {
    return basePath || "/";
  }
  return `${basePath}${normalizedSegment}`;
}
