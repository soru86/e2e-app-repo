type StatProps = {
  label: string;
  value: string | number;
  trend?: number;
  helpText?: string;
};

export function Stat({ label, value, trend, helpText }: StatProps) {
  const trendLabel = trend ? `${trend > 0 ? "+" : ""}${trend}% vs prev.` : null;
  return (
    <div className="panel-surface flex flex-col gap-4 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 px-6 py-6 shadow-lg shadow-slate-200/40 dark:shadow-black/50">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-200/80">{label}</p>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      {(trendLabel || helpText) && (
        <p className="text-xs text-slate-500 dark:text-slate-300">
          {trendLabel}
          {trendLabel && helpText ? " · " : null}
          {helpText}
        </p>
      )}
    </div>
  );
}


