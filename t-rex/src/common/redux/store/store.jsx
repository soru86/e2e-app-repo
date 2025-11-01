import { thunk } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import userReducers from "../reducers/user-slice";

/**
 * This module configures the root store. The shape of root store will look like:
 *
 * store: {
 *   user: {
 *     status: <string>                   // represents server API call status
 *     error: <string | undefined>        // represents error received in server API call reponse
 *     currentUser: Object                // when user clicks on info icon to see animation metadata, this will be loaded
 *   }
 * }
 *
 */

export const store = configureStore({
  reducer: {
    user: userReducers,
  },
  middleware: () => [thunk],
  devTools: true,
});
