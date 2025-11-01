const express = require("express");
const { expressMiddleware } = require("@apollo/server/express4");
const { startStandaloneServer } = require("@apollo/server/standalone");
const cors = require("cors");
const { connectDatabase } = require("./common/db/db-connection");
const { default: apolloServer } = require("./common/graphql/gql-server");

const PORT = process.env.PORT || 5000;


const startServer = async () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  connectDatabase();

  await startStandaloneServer(apolloServer);

  app.all(
    "/graphql/",
    cors(),
    express.json({ limit: "50mb" }),
    expressMiddleware(apolloServer, {
      context: (request) => ({
        request,
      }),
    })
  );

  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
};

startServer();
