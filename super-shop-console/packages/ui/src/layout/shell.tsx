import { ReactNode } from "react";
import { clsx } from "clsx";

type CardProps = {
  title?: string;
  description?: string;
  className?: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export function Panel({ title, description, actions, className, children }: CardProps) {
  return (
    <section
      className={clsx(
        "panel-surface rounded-3xl border border-slate-200/80 dark:border-orange-500/20 px-6 pt-7 pb-8 shadow-lg shadow-slate-200/60 dark:shadow-black/40 backdrop-blur-sm transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70 dark:hover:shadow-black/60",
        className,
      )}
    >
      {(title || description || actions) && (
        <header className="mb-6 flex w-full flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            {title && <h2 className="truncate text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>}
            {description && <p className="text-sm text-slate-500 dark:text-orange-200/80">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}


