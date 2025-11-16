import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./assets/styles.css";
import { createApolloClient } from "@super-shop/graphql-client";
import { config } from "@super-shop/config";
const apolloClient = createApolloClient({
    uri: config.graphqlHttp(),
    getAccessToken: () => null,
});
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(ApolloProvider, { client: apolloClient, children: _jsx(BrowserRouter, { future: { v7_startTransition: true, v7_relativeSplatPath: true }, children: _jsx(App, {}) }) }) }));
