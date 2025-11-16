import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { Panel } from "@super-shop/ui";
import { useDispatch, useSelector } from "react-redux";
import { rootActions, RootState } from "@super-shop/state";
import { useTheme } from "@super-shop/theme";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { DashboardRoute } from "./routes/DashboardRoute";
import { NotificationCenter } from "./components/NotificationCenter";

const CustomerApp = lazy(() => import("mfe_customer/App"));
const AdminApp = lazy(() => import("mfe_admin/App"));

export default function App() {
  const { keycloak, initialized } = useKeycloak();
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications);
  const { theme } = useTheme();

  useEffect(() => {
    if (notifications.length === 0) {
      dispatch(
        rootActions.notifications.push({
          id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
          message: "Welcome to Super Shop Console",
          type: "info",
        }),
      );
    }
  }, [dispatch, notifications.length]);
  const isAdmin = initialized && keycloak?.hasRealmRole?.("ADMIN");
  const isCustomer = initialized && keycloak?.hasRealmRole?.("CUSTOMER");
  const shellThemeClass = theme === "dark" ? "shell-root shell-dark" : "shell-root shell-light";

  return (
    <div className={`${shellThemeClass} min-h-screen`}>
      <div className="flex min-h-screen">
        <Sidebar isAdmin={!!isAdmin} isCustomer={!!isCustomer} />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="shell-content flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10">
              <NotificationCenter />
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute allow={!!keycloak?.authenticated}>
                      <DashboardRoute />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/*"
                  element={
                    <ProtectedRoute allow={!!isCustomer}>
                      <RemoteBoundary>
                        <CustomerRemote />
                      </RemoteBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute allow={!!isAdmin}>
                      <RemoteBoundary>
                        <AdminRemote />
                      </RemoteBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function RemoteBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Panel title="Loading module" description="Fetching remote bundle..." />}>{children}</Suspense>
  );
}

function ProtectedRoute({ allow, children }: { allow: boolean; children: React.ReactNode }) {
  if (!allow) {
    return (
      <Panel title="Insufficient permissions" description="Contact your administrator for access." className="p-8">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This route is restricted based on your Keycloak role assignments.
        </p>
      </Panel>
    );
  }
  return <>{children}</>;
}

function CustomerRemote() {
  const navigate = useNavigate();
  const location = useLocation();
  return <CustomerApp basePath="/customer" location={location} navigate={navigate} />;
}

function AdminRemote() {
  const navigate = useNavigate();
  const location = useLocation();
  return <AdminApp basePath="/admin" location={location} navigate={navigate} />;
}

