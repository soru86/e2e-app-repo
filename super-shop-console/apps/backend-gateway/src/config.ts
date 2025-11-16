import dotenv from "dotenv";

dotenv.config();

function required(key: string, fallback?: string) {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
}

export const appConfig = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:4173,http://localhost:4174,http://localhost:4175").split(","),
  databaseUrl: required("DATABASE_URL", "postgresql://super_shop:super_shop_pw@localhost:5432/super_shop"),
  keycloak: {
    issuer: required("KEYCLOAK_ISSUER_URL", "http://localhost:8080/auth/realms/super-shop"),
    clientId: required("KEYCLOAK_CLIENT_ID", "super-shop-console"),
    clientSecret: required("KEYCLOAK_CLIENT_SECRET", "local-secret"),
    callbackUrl: process.env.KEYCLOAK_CALLBACK_URL ?? "http://localhost:4000/auth/callback",
  },
};


