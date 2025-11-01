const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB Connection
const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
};

module.exports = { connectDatabase };
