import React from "react";
import ReactDOM from "react-dom/client";
import Keycloak from "keycloak-js";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@super-shop/theme";
import { createApolloClient } from "@super-shop/graphql-client";
import { config } from "@super-shop/config";
import { createAppStore } from "@super-shop/state";
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

const store = createAppStore();

const client = createApolloClient({
  uri: config.graphqlHttp(),
  getAccessToken: async () => keycloak.token ?? null,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ReactKeycloakProvider authClient={keycloak}>
    <ThemeProvider>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <App />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    </ThemeProvider>
  </ReactKeycloakProvider>,
);

