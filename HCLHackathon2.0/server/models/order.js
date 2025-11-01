const mongoose = require("mongoose");
const { stockSchema } = require("./stock");

const OrderSchema = new mongoose.Schema(
  {
    orderReferenceNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    portfolioNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    stockDetails: [stockSchema],
    orderStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Completed", "Cancelled"],
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["Buy", "Sell"],
    },
    orderValueAED: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
