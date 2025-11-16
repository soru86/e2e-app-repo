import { Panel, QuarterlySalesChart, InventoryRadialChart, Stat } from "@super-shop/ui";

const salesData = [
  { quarter: "Q1", revenue: 120000, target: 100000 },
  { quarter: "Q2", revenue: 132000, target: 110000 },
  { quarter: "Q3", revenue: 101000, target: 120000 },
  { quarter: "Q4", revenue: 178000, target: 150000 },
];

export function DashboardRoute() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total orders served" value="12,842" trend={8.4} />
        <Stat label="Pending orders" value="127" trend={-3.1} />
        <Stat label="Inventory value" value="$482k" trend={5.2} />
        <Stat label="CSAT" value="4.8 / 5" />
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <QuarterlySalesChart data={salesData} />
        <InventoryRadialChart />
        <Panel title="Issues overview" description="Open vs resolved SLA">
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-200">
            <li className="flex items-center justify-between rounded-2xl border border-slate-200/50 px-3 py-2 dark:border-white/5">
              <span className="truncate">Open customer issues</span>
              <span className="font-semibold text-rose-600 dark:text-rose-300">32</span>
            </li>
            <li className="flex items-center justify-between rounded-2xl border border-slate-200/50 px-3 py-2 dark:border-white/5">
              <span>Pending admin review</span>
              <span className="font-semibold text-amber-500 dark:text-amber-300">12</span>
            </li>
            <li className="flex items-center justify-between rounded-2xl border border-slate-200/50 px-3 py-2 dark:border-white/5">
              <span>Resolved last 7 days</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-300">89</span>
            </li>
          </ul>
        </Panel>
      </section>
    </div>
  );
}


