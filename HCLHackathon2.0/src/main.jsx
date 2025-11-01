import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store } from "./common/redux/store/store";
import { Provider } from "react-redux";
import { apolloClient } from "./common/graphql/apollo.client";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./hooks/useAuth.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  </StrictMode>
);
