const { ApolloServer } = require("@apollo/server");
const { fetchUserByName } = require("../../apis/db.apis");
const { searchOrders } = require("../../apis/db.apis");

const typeDefs = `
  type User {
    id: String
    fullName: String
    userName: String
    email: String
    password: String
    createdAt: String
  }

  type Order {
    id: String
    orderReferenceNo: String
    stockName: String
    orderStatus: String
    transactionType: String
    orderValueAED: Int
    createdOn: String 
    createdBy: String
  }

  input SearchFilter {
    portfolioNo: String
    startDate: String
    endDate: String
    transactionType: String
    orderStatus: String
  }

  type Query {
    getUserByName(userName: String): User
    searchOrders(searchFilter: SearchFilter): Order
  }
`;

const resolvers = {
  Query: {
    getUserByName: async (_, args, __, ___) => {
      try {
        const { userName } = args;
        return await fetchUserByName(userName);
      } catch (error) {
        throw new Error("Error while retrieving user details", error);
      }
    },
    searchOrders: async (_, args, __, ___) => {
      try {
        const { searchFilter } = args;
        const dbOrders = await searchOrders(searchFilter);
        console.log(dbOrders);
        return dbOrders;
      } catch (error) {
        throw new Error("Error while retrieving user details", error);
      }
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

module.exports = {
  typeDefs,
  resolvers,
  default: apolloServer,
};
