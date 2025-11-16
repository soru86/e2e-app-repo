import { ApolloClient, HttpLink, InMemoryCache, from, NormalizedCacheObject } from "@apollo/client";
import fetch from "cross-fetch";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

type ClientOptions = {
  getAccessToken: () => Promise<string | null> | string | null;
  uri: string;
};

export function createApolloClient({ getAccessToken, uri }: ClientOptions) {
  const authLink = setContext(async (_, { headers }) => {
    const token = await getAccessToken();
    return {
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((err) => console.error("GraphQL error", err));
    }
    if (networkError) {
      console.error("Network error", networkError);
    }
  });

  const httpLink = new HttpLink({ uri, fetch });

  return new ApolloClient<NormalizedCacheObject>({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });
}


