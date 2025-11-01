import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchOrderList } from "../../graphql/gql.apis";
import { orderInitialState } from "../initial-states/order-initial-state";

export const searchOrders = createAsyncThunk(
  "graphql/orders/search",
  async (searchFilter) => {
    const response = await searchOrderList(searchFilter);
    return response;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: orderInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchOrders.pending, (state) => {
        // state.status = "loading";
      })
      .addCase(searchOrders.fulfilled, (state, action) => {
        //state.status = "succeeded";
        // state.orders.unshift(action.payload);
      })
      .addCase(searchOrders.rejected, (state, action) => {
        //state.status = "failed";
        //state.error = action.error.message;
      });
  },
});

export const { setNetworkStatus } = orderSlice.actions;
export default orderSlice.reducer;
