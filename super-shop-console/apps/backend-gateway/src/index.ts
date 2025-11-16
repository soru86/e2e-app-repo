import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { buildContext } from "./graphql/context";
import { appConfig } from "./config";
import { keycloakAuth } from "./auth/keycloak";
import { bearerAuthMiddleware } from "./auth/bearer";
import { logger } from "./logger";
import { httpRequestHistogram } from "./metrics";
import promClient from "prom-client";

async function bootstrap() {
  const app = express();
  app.use(
    cors({
      origin: appConfig.corsOrigins,
      credentials: true,
    }),
  );
  app.use(bodyParser.json());
  app.use(keycloakAuth.initialize());
  app.use(bearerAuthMiddleware);

  app.use((req, res, next) => {
    const stop = httpRequestHistogram.startTimer({ method: req.method, route: req.path });
    res.on("finish", () => {
      stop({ code: res.statusCode, route: req.route?.path ?? req.path });
    });
    next();
  });

  app.get("/healthz", (_, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/metrics", async (_, res) => {
    res.set("Content-Type", promClient.register.contentType);
    res.end(await promClient.register.metrics());
  });

  app.get("/auth/keycloak", keycloakAuth.authenticate("keycloak"));
  app.get(
    "/auth/callback",
    keycloakAuth.authenticate("keycloak", { failureRedirect: "/auth/failure" }),
    (_req, res) => {
      res.redirect(process.env.AUTH_SUCCESS_REDIRECT ?? "http://localhost:4173");
    },
  );
  app.get("/auth/failure", (_req, res) => {
    res.status(401).json({ error: "Authentication failed" });
  });

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apollo.start();

  app.use(
    "/graphql",
    expressMiddleware(apollo, {
      context: async ({ req }) => buildContext({ req }),
    }),
  );

  app.listen(appConfig.port, () => {
    logger.info(`Backend gateway listening on :${appConfig.port}`);
  });
}

bootstrap().catch((error) => {
  logger.error({ error }, "Failed to bootstrap server");
  process.exit(1);
});

