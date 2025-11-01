import { thunk } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import userReducers from "../reducers/user-slice";
import ordersReducers from "../reducers/order-slice";

export const store = configureStore({
  reducer: {
    user: userReducers,
    orders: ordersReducers,
  },
  middleware: () => [thunk],
  devTools: true,
});
