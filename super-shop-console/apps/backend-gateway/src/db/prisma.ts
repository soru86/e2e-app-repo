import { PrismaClient } from "@prisma/client";
import { logger } from "../logger";

export const prisma = new PrismaClient({
  log: ["error"],
});

prisma
  .$connect()
  .then(() => logger.info("Connected to PostgreSQL"))
  .catch((error) => {
    logger.error({ error }, "Failed to connect to PostgreSQL");
  });


