import Order from "../models/orderModel";
import ErrorHandler from "../utils/errorHandler";

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return next(new ErrorHandler("Order Not Found", 404));
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
    res.status(200).json({ success: true, orders, totalAmount });
  } catch (error) {
    next(error);
  }
};
