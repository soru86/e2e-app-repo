import app from "./app.js";
import connectDatabase from "./lib/db/database.js";

const PORT = process.env.PORT || 3099;

// UncaughtException Error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

// Conect to Mongo DB
connectDatabase();

const server = app.listen(PORT, () => {
  console.log(`Server running`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
});
