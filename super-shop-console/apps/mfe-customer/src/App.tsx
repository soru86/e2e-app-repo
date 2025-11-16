import { Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import type { Location, NavigateFunction } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { CUSTOMER_DASHBOARD, CREATE_ISSUE } from "./graphql";
import { Panel, DataTable, StatusBadge, Stat } from "@super-shop/ui";
import { useMemo, useState, useCallback, useEffect } from "react";

const fallbackDashboard = {
  totalSavings: 1845,
  totalOrders: 54,
  totalPayments: 32,
  issuesOpen: 1,
  orderHistory: [
    { id: "ORD-101", status: "FULFILLED", total: 182.5, createdAt: "2024-03-01" },
    { id: "ORD-104", status: "PENDING", total: 62.0, createdAt: "2024-03-12" },
  ],
  paymentHistory: [
    { id: "PAY-22", method: "VISA", amount: 120, status: "CAPTURED", processedAt: "2024-03-05" },
    { id: "PAY-23", method: "UPI", amount: 62, status: "FAILED", processedAt: "2024-03-11" },
  ],
  issues: [
    { id: "ISS-1", status: "OPEN", category: "PAYMENT", description: "Payment double charged", createdAt: "2024-03-11" },
  ],
} as const;

const CUSTOMER_AUTH_STORAGE_KEY = "super-shop-customer-auth";

type CustomerAppProps = {
  basePath?: string;
  location?: Location;
  navigate?: NavigateFunction;
};

export default function CustomerApp({ basePath = "", location, navigate }: CustomerAppProps) {
  const embeddedInShell = Boolean(basePath && location && navigate);
  const [isAuthed, setIsAuthed] = useState<boolean>(() => window.localStorage.getItem(CUSTOMER_AUTH_STORAGE_KEY) === "true");

  const handleLogin = useCallback(() => {
    setIsAuthed(true);
    window.localStorage.setItem(CUSTOMER_AUTH_STORAGE_KEY, "true");
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthed(false);
    window.localStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
  }, []);

  if (embeddedInShell) {
    return <CustomerShell basePath={basePath} onLogout={() => { }} router={{ location: location!, navigate: navigate! }} />;
  }

  const loginPath = basePath ? `${basePath}/login` : "/login";
  const dashboardPath = basePath ? `${basePath}/*` : "/*";
  const defaultLanding = basePath ? `${basePath}/orders` : "/orders";

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
            <CustomerShell basePath={basePath} onLogout={handleLogout} />
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

type CustomerShellProps = {
  basePath: string;
  onLogout: () => void;
  router?: {
    location: Location;
    navigate: NavigateFunction;
  };
};

function CustomerShell({ basePath, onLogout, router }: CustomerShellProps) {
  const { data, loading } = useQuery(CUSTOMER_DASHBOARD);
  const dashboard = useMemo(() => data?.customerDashboard ?? fallbackDashboard, [data]);
  const sanitizedBase = normalizeBasePath(basePath);
  const embeddedInShell = Boolean(router);
  const relativePath = embeddedInShell ? getRelativePath(router!.location.pathname, sanitizedBase) : undefined;
  const normalizedRelativePath = embeddedInShell ? normalizeRelativePath(relativePath ?? "/") : undefined;
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

  useEffect(() => {
    if (!embeddedInShell || !router) return;
    if (!normalizedRelativePath) return;
    const isKnown = CUSTOMER_NAV_ITEMS.some((item) => item.relativePath === normalizedRelativePath);
    if (!isKnown) {
      router.navigate(buildHref("/"), { replace: true });
    }
  }, [embeddedInShell, normalizedRelativePath, router, buildHref]);

  const containerClass = [
    "customer-shell",
    embeddedInShell ? "customer-shell--embedded" : "customer-shell--standalone",
  ].join(" ");
  const innerClass = [
    "customer-shell__inner",
    embeddedInShell ? "customer-shell__inner--embedded" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const header = (
    <header className="customer-shell__header panel-surface">
      <div className="customer-shell__hero">
        <div className="customer-shell__hero-text">
          <p className="customer-shell__eyebrow">Super Shop</p>
          <h2>Customer Portal</h2>
          <p>Orders, payments, and support history in one place.</p>
        </div>
        {!embeddedInShell && (
          <button className="customer-shell__logout" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
      <div className="customer-shell__nav-wrapper">
        <NavBar
          embeddedInShell={embeddedInShell}
          activePath={normalizedRelativePath}
          onNavigate={router?.navigate}
          buildHref={buildHref}
        />
      </div>
    </header>
  );

  const mainContent = embeddedInShell ? (
    <EmbeddedRoutesView activePath={normalizedRelativePath ?? "/"} dashboard={dashboard} loading={loading} />
  ) : (
    <Routes>
      <Route path={buildRoutePath("/")} element={<CustomerDashboard dashboard={dashboard} loading={loading} />} />
      <Route path={buildRoutePath("/orders")} element={<Orders data={dashboard.orderHistory} />} />
      <Route path={buildRoutePath("/payments")} element={<Payments data={dashboard.paymentHistory} />} />
      <Route path={buildRoutePath("/issues")} element={<Issues data={dashboard.issues} />} />
      <Route path="*" element={<Navigate to={buildRoutePath("/orders")} replace />} />
    </Routes>
  );

  return (
    <div className={containerClass}>
      <div className={innerClass}>
        {header}
        <div className="customer-shell__body">{mainContent}</div>
      </div>
    </div>
  );
}

type CustomerNavBarProps = {
  embeddedInShell: boolean;
  activePath?: string;
  onNavigate?: NavigateFunction;
  buildHref: (segment: string) => string;
};

function NavBar({ embeddedInShell, activePath, onNavigate, buildHref }: CustomerNavBarProps) {
  const links = CUSTOMER_NAV_ITEMS.map((item) => ({
    ...item,
    href: buildHref(item.relativePath),
  }));

  const navClass = "customer-shell__nav";
  const buttonClasses = (active: boolean) =>
    ["customer-shell__nav-button", active ? "customer-shell__nav-button--active" : ""].filter(Boolean).join(" ");

  if (embeddedInShell) {
    return (
      <nav className={navClass}>
        {links.map((link) => {
          const isActive = activePath === link.relativePath;
          return (
            <button
              key={link.relativePath}
              type="button"
              onClick={() => onNavigate?.(link.href)}
              className={buttonClasses(isActive)}
            >
              {link.label}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className={navClass}>
      {links.map((link) => (
        <NavLink key={link.href} to={link.href} className={({ isActive }) => buttonClasses(isActive)} end={link.relativePath === "/"}>
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
      return <CustomerDashboard dashboard={dashboard} loading={loading} />;
    case "/orders":
      return <Orders data={dashboard.orderHistory} />;
    case "/payments":
      return <Payments data={dashboard.paymentHistory} />;
    case "/issues":
      return <Issues data={dashboard.issues} />;
    default:
      return null;
  }
}

function CustomerDashboard({
  dashboard,
  loading,
}: {
  dashboard: typeof fallbackDashboard;
  loading: boolean;
}) {
  if (loading) return <Panel title="Loading your data">Please wait...</Panel>;

  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Orders placed" value={dashboard.totalOrders} />
        <Stat label="Total savings" value={`$${dashboard.totalSavings}`} />
        <Stat label="Payments made" value={dashboard.totalPayments} />
        <Stat label="Open issues" value={dashboard.issuesOpen} />
      </section>
      <Orders data={dashboard.orderHistory} />
      <Payments data={dashboard.paymentHistory} />
    </div>
  );
}

type OrderRow = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
};

type PaymentRow = {
  id: string;
  method: string;
  amount: number;
  status: string;
  processedAt: string;
};

function Orders({ data }: { data?: OrderRow[] }) {
  const rows =
    data ??
    [
      { id: "ORD-101", status: "FULFILLED", total: 182.5, createdAt: "2024-03-01" },
      { id: "ORD-104", status: "PENDING", total: 62.0, createdAt: "2024-03-12" },
    ];
  const [amount, setAmount] = useState(50);
  const [sku, setSku] = useState("SKU-AC-22");
  return (
    <Panel title="Order history" description="Printable order receipts available">
      <DataTable
        columns={[
          { key: "id", header: "Order #" },
          { key: "createdAt", header: "Date" },
          {
            key: "status",
            header: "Status",
            render: (value) => <StatusBadge label={String(value)} tone={value === "PENDING" ? "warning" : "success"} />,
          },
          {
            key: "total",
            header: "Total",
            render: (value) => `$${value?.toFixed?.(2)}`,
          },
        ]}
        rows={rows}
      />
      <div className="panel-surface mt-6 rounded-3xl border border-slate-200/70 px-5 py-4 text-sm shadow-lg shadow-slate-950/5 dark:border-orange-500/25">
        <h3 className="text-base font-semibold text-slate-900 dark:text-orange-50">Place a new order</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <label className="flex flex-1 min-w-[160px] flex-col gap-1">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-orange-100">
              SKU
            </span>
            <input
              className="rounded-2xl border border-slate-200/70 bg-white/95 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-orange-500/35 dark:bg-slate-900/60 dark:text-orange-50 dark:focus:border-orange-400 dark:focus:ring-orange-400/30"
              value={sku}
              onChange={(event) => setSku(event.target.value)}
            />
          </label>
          <label className="flex flex-1 min-w-[140px] flex-col gap-1">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-orange-100">
              Amount
            </span>
            <input
              type="number"
              className="rounded-2xl border border-slate-200/70 bg-white/95 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-orange-500/35 dark:bg-slate-900/60 dark:text-orange-50 dark:focus:border-orange-400 dark:focus:ring-orange-400/30"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </label>
          <button
            className="self-end rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-orange-500 dark:text-slate-900 dark:hover:bg-orange-400 dark:focus-visible:outline-orange-400"
            onClick={() => alert(`Order placed for ${sku} worth $${amount}`)}
          >
            Place order
          </button>
        </div>
      </div>
    </Panel>
  );
}

function Payments({ data }: { data?: PaymentRow[] }) {
  const rows =
    data ??
    [
      { id: "PAY-22", method: "VISA", amount: 120, status: "CAPTURED", processedAt: "2024-03-05" },
      { id: "PAY-23", method: "UPI", amount: 62, status: "FAILED", processedAt: "2024-03-11" },
    ];
  const [amount, setAmount] = useState(25);
  const [method, setMethod] = useState("CARD");
  return (
    <Panel title="Payment history" description="Secure transactions backed by PCI provider">
      <DataTable
        columns={[
          { key: "id", header: "Payment #" },
          { key: "processedAt", header: "Date" },
          { key: "method", header: "Method" },
          {
            key: "status",
            header: "Status",
            render: (value) => <StatusBadge label={String(value)} tone={value === "FAILED" ? "danger" : "success"} />,
          },
          {
            key: "amount",
            header: "Amount",
            render: (value) => `$${value?.toFixed?.(2)}`,
          },
        ]}
        rows={rows}
      />
      <div className="panel-surface mt-6 rounded-3xl border border-slate-200/70 px-5 py-4 text-sm shadow-lg shadow-slate-950/5 dark:border-orange-500/25">
        <h3 className="text-base font-semibold text-slate-900 dark:text-orange-50">Quick payment</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <label className="flex flex-1 min-w-[140px] flex-col gap-1">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-orange-100">
              Amount
            </span>
            <input
              type="number"
              className="rounded-2xl border border-slate-200/70 bg-white/95 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-orange-500/35 dark:bg-slate-900/60 dark:text-orange-50 dark:focus:border-orange-400 dark:focus:ring-orange-400/30"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </label>
          <label className="flex flex-1 min-w-[160px] flex-col gap-1">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-orange-100">
              Method
            </span>
            <select
              className="rounded-2xl border border-slate-200/70 bg-white/95 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-orange-500/35 dark:bg-slate-900/60 dark:text-orange-50 dark:focus:border-orange-400 dark:focus:ring-orange-400/30"
              value={method}
              onChange={(event) => setMethod(event.target.value)}
            >
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
              <option value="COD">Cash on delivery</option>
            </select>
          </label>
          <button
            className="self-end rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-orange-500 dark:text-slate-900 dark:hover:bg-orange-400 dark:focus-visible:outline-orange-400"
            onClick={() => alert(`Processing ${method} payment of $${amount}`)}
          >
            Pay now
          </button>
        </div>
      </div>
    </Panel>
  );
}

function Issues({ data }: { data: { id: string; status: string; category: string; description: string; createdAt: string }[] }) {
  const [form, setForm] = useState({ category: "PAYMENT", description: "" });
  const [createIssue, { data: mutation, loading }] = useMutation(CREATE_ISSUE);

  return (
    <Panel title="Report an issue" description="Our support team responds within 12 hours">
      <DataTable
        columns={[
          { key: "id", header: "Issue #" },
          { key: "category", header: "Category" },
          { key: "description", header: "Description" },
          {
            key: "status",
            header: "Status",
            render: (value) => <StatusBadge label={String(value)} tone={value === "OPEN" ? "warning" : "success"} />,
          },
        ]}
        rows={data}
      />
      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          createIssue({ variables: { input: { ...form } } });
        }}
      >
        <label className="block text-sm font-medium text-slate-700 dark:text-orange-100">
          Category
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-orange-500/40 dark:bg-[#0c0c0c] dark:text-orange-50"
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          >
            <option value="PAYMENT">Payment</option>
            <option value="ORDER">Order</option>
            <option value="DELIVERY">Delivery</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-orange-100">
          Description
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-orange-500/40 dark:bg-[#0c0c0c] dark:text-orange-50"
            rows={4}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-60 dark:bg-orange-500 dark:text-slate-900"
          disabled={loading}
        >
          Submit
        </button>
        {mutation?.createIssue && (
          <p className="text-sm text-emerald-600 dark:text-orange-200">Issue {mutation.createIssue.id} submitted successfully.</p>
        )}
      </form>
    </Panel>
  );
}

function LoginScreen({ basePath, onLogin }: { basePath: string; onLogin: () => void }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const redirectTo = basePath ? `${basePath}/orders` : "/orders";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-white dark:from-black dark:via-[#080505] dark:to-[#121212]
      text-slate-900 dark:text-orange-100 flex items-center justify-center px-4"
    >
      <Panel className="w-full max-w-md p-10" title="Super Shop Customer" description="Sign in to view your orders & payments">
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

const CUSTOMER_NAV_ITEMS = [
  { relativePath: "/", label: "Dashboard" },
  { relativePath: "/orders", label: "My orders" },
  { relativePath: "/payments", label: "Payments" },
  { relativePath: "/issues", label: "Report issues" },
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

