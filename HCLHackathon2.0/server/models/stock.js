const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    stockCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    stockName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    stockValueAED: {
      type: Number,
      required: true,
      min: [0, "Order value must be non-negative"],
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    updatedOn: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = {
  stockSchema: StockSchema,
  stock: mongoose.model("Stock", StockSchema),
};
