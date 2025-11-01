import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";
import apolloServer from "./lib/apollo/apollo.server.js";
import { startStandaloneServer } from "@apollo/server/standalone";

const app = express();
app.use(bodyParser.json());
app.use(cors());

await startStandaloneServer(apolloServer);

app.all(
  "/graphql/",
  cors(),
  express.json({ limit: "50mb" }),
  expressMiddleware(apolloServer, {
    context: (request) => ({
      // Add optional configuration options
      request: request,
    }),
  })
);

export default app;
