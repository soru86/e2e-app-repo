import mongoose from "mongoose";
import uri from "./db.server.js";

const connectDatabase = () => {
  mongoose.connect(uri).then(() => {
    console.log("Mongoose Connected");
  });
};

export default connectDatabase;
