const userModel = require("../models/user");
const orderModel = require("../models/order");

const fetchUserByName = async (name) => {
  try {
    return await userModel.findOne({
      userName: name,
    });
  } catch (error) {
    throw new Error("Error while fetching user details", error);
  }
};

const searchOrders = async (searchFilter) => {
  try {
    const filterArray = Object.entries(searchFilter).filter((a) => !!a[1]);

    const availableCriteria = filterArray.map(
      (ac) => `{ ${[ac[0]]}: ${ac[1]} }`
    );

    console.log(availableCriteria);

    const dbOrders = await orderModel.find({
      $or: [
        { portfolioNo: searchFilter.portfolioNo },
        { orderStatus: searchFilter.orderStatus },
        { transactionType: searchFilter.transactionType },
      ],
    });

    const orders = dbOrders.map((o) => ({
      orderReferenceNo: o.orderReferenceNo,
      stockName: o.stockDetails[0].stockName,
      orderStatus: o.orderStatus,
      transactionType: o.transactionType,
      orderValueAED: o.orderValueAED,
      createdOn: o.createdOn,
      createdBy: o.createdBy,
    }));

    console.log(orders);
    return orders;
  } catch (error) {
    throw new Error("Error while searching order transactions", error);
  }
};

module.exports = {
  fetchUserByName,
  searchOrders,
};
