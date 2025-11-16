import { useTheme } from "@super-shop/theme";
import { useKeycloak } from "@react-keycloak/web";

export function Header() {
  const { toggleTheme, theme } = useTheme();
  const { keycloak } = useKeycloak();
  const isDark = theme === "dark";
  const eyebrowClass = isDark ? "text-slate-400" : "text-slate-500";
  const headingClass = isDark ? "text-white" : "text-slate-900";
  const subheadingClass = isDark ? "text-slate-300" : "text-slate-500";

  return (
    <header
      className={`border-b ${isDark ? "border-white/10" : "border-slate-200/80 bg-white/70 backdrop-blur-sm text-slate-900"}`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <div>
          <p className={`text-xs uppercase tracking-[0.3em] ${eyebrowClass}`}>Super Shop</p>
          <h1 className={`text-2xl font-semibold tracking-tight ${headingClass}`}>Operations Console</h1>
          <p className={`text-sm ${subheadingClass}`}>Unified portal for operations + customer experience</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            data-variant="icon"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          {keycloak?.authenticated ? (
            <div className={`flex items-center gap-3 text-sm ${isDark ? "text-slate-200" : "text-slate-600"}`}>
              <span className={`truncate max-w-[140px] text-right ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                {keycloak?.tokenParsed?.preferred_username ?? "user"}
              </span>
              <button data-variant="ghost" onClick={() => keycloak?.logout?.()}>
                <span className={isDark ? undefined : "text-slate-600"}>Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button data-variant="ghost" onClick={() => keycloak?.register?.()}>
                <span className={isDark ? undefined : "text-slate-800"}>Register</span>
              </button>
              <button onClick={() => keycloak?.login?.()}>
                <span className={isDark ? undefined : "text-white"}>Sign in</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M6.34 17.66l1.41-1.41M16.24 7.76l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
    </svg>
  );
}

