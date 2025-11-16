import { useDispatch, useSelector } from "react-redux";
import { RootState, rootActions } from "@super-shop/state";

export function NotificationCenter() {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications);

  if (notifications.length === 0) return null;

  return (
    <div className="mb-4 flex flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="panel-surface flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2 text-sm shadow-sm dark:border-white/10"
        >
          <span className="text-slate-700 dark:text-slate-100">{notification.message}</span>
          <button
            onClick={() => dispatch(rootActions.notifications.dismiss(notification.id))}
            className="text-xs text-slate-500 dark:text-slate-300 hover:underline"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}


