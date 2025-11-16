const PREFIX = "VITE_";
const browserEnv = typeof import.meta !== "undefined"
    ? import.meta.env
    : undefined;
const nodeEnv = typeof process !== "undefined" ? process.env : undefined;
export function getEnv(key, fallback) {
    const envKey = `${PREFIX}${key}`;
    const value = browserEnv?.[envKey] ?? nodeEnv?.[envKey];
    if (!value && !fallback) {
        throw new Error(`Missing environment variable ${envKey}`);
    }
    return value ?? fallback ?? "";
}
export const config = {
    graphqlHttp: () => getEnv("GRAPHQL_HTTP", "http://localhost:4000/graphql"),
    keycloak: () => ({
        url: getEnv("KEYCLOAK_URL", "http://localhost:8080/auth"),
        realm: getEnv("KEYCLOAK_REALM", "super-shop"),
        clientId: getEnv("KEYCLOAK_CLIENT_ID", "super-shop-console"),
    }),
};
