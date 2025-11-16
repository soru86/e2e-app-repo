import { NavLink } from "react-router-dom";
import { useTheme } from "@super-shop/theme";

type Props = {
  isCustomer: boolean;
  isAdmin: boolean;
};

const navItems = [
  { to: "/", label: "Dashboard", roles: ["CUSTOMER", "ADMIN"] },
  { to: "/customer/orders", label: "My Orders", roles: ["CUSTOMER"] },
  { to: "/customer/payments", label: "Payments", roles: ["CUSTOMER"] },
  { to: "/customer/issues", label: "Report Issue", roles: ["CUSTOMER"] },
  { to: "/admin/inventory", label: "Inventory", roles: ["ADMIN"] },
  { to: "/admin/discounts", label: "Discounts", roles: ["ADMIN"] },
  { to: "/admin/issues", label: "Issue Tracker", roles: ["ADMIN"] },
];

export function Sidebar({ isCustomer, isAdmin }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const roles = new Set([
    ...(isCustomer ? ["CUSTOMER"] : []),
    ...(isAdmin ? ["ADMIN"] : []),
  ]);

  const containerClasses = [
    "hidden border-r md:flex md:w-64 md:flex-col md:justify-between lg:w-72",
    isDark
      ? "border-white/10 bg-black/10 text-slate-100"
      : "border-slate-200 bg-white/90 text-slate-800 shadow-lg shadow-slate-200/60",
  ].join(" ");
  const activeClasses = isDark
    ? "bg-white/15 text-white shadow-lg shadow-orange-500/20"
    : "bg-slate-900/5 text-slate-900 shadow-lg shadow-slate-200/40";
  const inactiveClasses = isDark ? "text-slate-300 hover:bg-white/5" : "text-slate-500 hover:bg-slate-100";

  return (
    <aside className={containerClasses}>
      <div className="flex flex-col gap-10 px-6 py-8">
        <div>
          <p className={`text-[10px] uppercase tracking-[0.4em] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Explore</p>
          <h2 className="mt-2 text-xl font-semibold text-inherit">Your workspace</h2>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          {navItems
            .filter((item) => item.roles.some((role) => roles.has(role)))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => ["rounded-xl px-3 py-2 font-semibold transition", isActive ? activeClasses : inactiveClasses].join(" ")}
              >
                {item.label}
              </NavLink>
            ))}
          {roles.size === 0 && (
            <p className="text-xs text-slate-400">
              No modules available yet. After your Keycloak role is assigned, refresh to access dashboards.
            </p>
          )}
        </nav>
      </div>
    </aside>
  );
}

