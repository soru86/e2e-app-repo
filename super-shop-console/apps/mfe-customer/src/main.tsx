import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import Keycloak from "keycloak-js";
import { ThemeProvider } from "@super-shop/theme";
import { createApolloClient } from "@super-shop/graphql-client";
import { config } from "@super-shop/config";
import App from "./App";
import "./assets/styles.css";

const keycloakSettings = config.keycloak();
const keycloak = new Keycloak({
  url: keycloakSettings.url,
  realm: keycloakSettings.realm,
  clientId: keycloakSettings.clientId,
});

keycloak.onTokenExpired = () => {
  keycloak.updateToken(20).catch(() => keycloak.login());
};

const apolloClient = createApolloClient({
  uri: config.graphqlHttp(),
  getAccessToken: async () => keycloak.token ?? null,
});

keycloak
  .init({ onLoad: "check-sso" })
  .then(() => {
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ApolloProvider client={apolloClient}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Failed to initialize Keycloak in mfe-customer", error);
  });



