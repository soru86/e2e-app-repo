const { ApolloServer } = require("@apollo/server");
const { fetchUserByName } = require("../../apis/db.apis");
const { createNewUser } = require("../../apis/db.apis");

const typeDefs = `
  type User {
    id: String
    fullName: String
    userName: String
    email: String
    password: String
    createdAt: String
  }

  type Query {
    getUserByName(userName: String): User
  }

  type Mutation {
    addUser: String
  }
`;

const resolvers = {
  Query: {
    getUserByName: async (_, args, __, ___) => {
      try {
        const { userName } = args;
        return await fetchUserByName(userName);
      } catch (error) {
        throw new Error("Error while retrieving user details");
      }
    },
  },
  Mutation: {
    addUser: async (_, { user }, __, ___) => {
      return await createNewUser(user);
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

module.exports = {
  typeDefs,
  resolvers,
  default: apolloServer,
};
