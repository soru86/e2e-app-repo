import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { Issue, Order } from "@super-shop/shared-types";

type Notification = { id: string; message: string; type: "success" | "error" | "info" };

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [] as Notification[],
  reducers: {
    push(state, action: PayloadAction<Notification>) {
      state.push(action.payload);
    },
    dismiss(state, action: PayloadAction<string>) {
      return state.filter((n) => n.id !== action.payload);
    },
  },
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: [] as Order[],
  reducers: {
    set(_, action: PayloadAction<Order[]>) {
      return action.payload;
    },
  },
});

const issuesSlice = createSlice({
  name: "issues",
  initialState: [] as Issue[],
  reducers: {
    set(_, action: PayloadAction<Issue[]>) {
      return action.payload;
    },
  },
});

export const rootReducers = {
  notifications: notificationsSlice.reducer,
  orders: ordersSlice.reducer,
  issues: issuesSlice.reducer,
};

export const rootActions = {
  notifications: notificationsSlice.actions,
  orders: ordersSlice.actions,
  issues: issuesSlice.actions,
};

export type RootState = {
  notifications: Notification[];
  orders: Order[];
  issues: Issue[];
};

export function createAppStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducers,
    preloadedState: preloadedState as RootState | undefined,
  });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore["dispatch"];

export const createHooks = (store: AppStore) => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  return { useAppDispatch, useAppSelector };
};

