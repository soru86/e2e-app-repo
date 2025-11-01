import { useActionState, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { searchOrders } from "../common/redux/reducers/order-slice";

const ordersData = [
  {
    _id: "ORD23456",
    orderReferenceNo: "ORD23456",
    portfolioNo: "X123",
    stockDetails: {
      stockCode: "DFM",
      stockName: "DFM Co.",
      stockValueAED: 200,
      createdOn: "Wed Jan 01 2025 00:00:00 GMT+0400 (Gulf Standard Time)",
      createdBy: "Saurabh",
      updatedOn: "Wed Jan 15 2025 00:00:00 GMT+0400 (Gulf Standard Time)",
      updatedBy: "Saurabh",
    },
    orderStatus: "Pending",
    transactionType: "Buy",
    orderValueAED: 25000,
    createdOn: "Wed Jun 15 2025 00:00:00 GMT+0400 (Gulf Standard Time)",
    createdBy: "Saurabh",
  },
  {
    _id: "ORD23433456",
    orderReferenceNo: "ORD23433456",
    portfolioNo: "U656",
    stockDetails: {
      stockCode: "HCL",
      stockName: "HCL Technologies.",
      stockValueAED: 250,
      createdOn: "Wed Jan 23 2025 00:00:00 GMT+0400 (Gulf Standard Time)",
      createdBy: "Saurabh",
      updatedOn: "Wed Jan 24 2025 00:00:00 GMT+0400 (Gulf Standard Time)",
      updatedBy: "Saurabh",
    },
    orderStatus: "Completed",
    transactionType: "Buy",
    orderValueAED: 10000,
    createdOn: "Wed Jun 18 2025 00:00:00 GMT+0400 (Gulf Standard Time)",
    createdBy: "Saurabh",
  },
  {
    _id: "ORD2323456",
    orderReferenceNo: "ORD2323456",
    portfolioNo: "V5454",
    stockDetails: {
      stockCode: "ETS",
      stockName: "Etisalat",
      stockValueAED: 255,
      createdOn: "Wed Jan 11 2025 00:00:00 GMT+0400 (Gulf Standard Time)",
      createdBy: "Saurabh",
      updatedOn: "Wed Jan 25 2025 00:00:00 GMT+0400 (Gulf Standard Time)",
      updatedBy: "Saurabh",
    },
    orderStatus: "Completed",
    transactionType: "Buy",
    orderValueAED: 22000,
    createdOn: "Wed Jun 08 2025 00:00:00 GMT+0400 (Gulf Standard Time)",
    createdBy: "Saurabh",
  },
];

const TransactionHistory = () => {
  const [orders, setOrders] = useState([]);
  const [sf, setSF] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sf) {
      const fo = ordersData.filter(
        (od) =>
          od.portfolioNo === sf.portfolioNo ||
          od.orderStatus === sf.orderStatus ||
          od.transactionType === sf.transactionType
      );
      setOrders(fo);
    }
  }, [sf]);

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const searchFilter = {
        portfolioNo: formData.get("portfolioNo"),
        transactionType: formData.get("transactionType"),
        orderStatus: formData.get("orderStatus"),
      };

      setSF(searchFilter);

      console.log(searchFilter);

      return null;
    },
    null
  );

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Top Filter Section */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <form action={submitAction}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Portfolio No
              </label>
              <input
                name="portfolioNo"
                type="text"
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {/*
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From
              </label>
              <DatePicker
                name="fromDate"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select start date"
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                To
              </label>
              <DatePicker
                name="toDate"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="Select end date"
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transaction Type
              </label>
              <select
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                name="transactionType"
              >
                <option>All</option>
                <option>Buy</option>
                <option>Sell</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order Status
              </label>
              <select
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                name="orderStatus"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                Search
              </button>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Order Ref. ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Order Summary
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Order Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Transaction Type
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Order Value (AED)
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Created On
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Created By
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr>
                <td className="px-4 py-2 text-sm">{order.orderReferenceNo}</td>
                <td className="px-4 py-2 text-sm">{order.stockName}</td>
                <td className="px-4 py-2 text-sm text-yellow-600">
                  {order.orderStatus}
                </td>
                <td className="px-4 py-2 text-sm">{order.transactionType}</td>
                <td className="px-4 py-2 text-sm">{order.orderValueAED}</td>
                <td className="px-4 py-2 text-sm">{order.createdOn}</td>
                <td className="px-4 py-2 text-sm">{order.createdBy}</td>
              </tr>
            ))}

            {/* Add more rows dynamically here */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
