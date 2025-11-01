import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login } from "../../graphql/gql.apis";
import { userInitialState } from "../initial-states/user-initial-state";

export const loginUser = createAsyncThunk(
  "graphql/users/login",
  async ({ userName, password }) => {
    const response = await login(userName, password);
    return response;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setNetworkStatus } = userSlice.actions;
export default userSlice.reducer;
