import { ApolloServer } from "@apollo/server";

import { authenticate, createUser, clearSession } from "../../apis/db.apis.js";

export const typeDefs = `
    type Avatar {
        public_id: String!
        url: String!
    }

    type User {
        name: String!
        email: String!
        password: String!
        avatar: Avatar!
        createdAt: String
        resetPasswordToken: String
        resetPasswordExpire: String
    }

    type Query {
        login: Boolean
        logout: Boolean
    }

    type Mutation {
        register: User
    }
`;

export const resolvers = {
  Query: {
    login: async (_, __, ___, { variableValues }) => {
      const { userName, password } = variableValues;
      return await authenticate({ userName, password });
    },
    logout: async () => await clearSession(),
  },
  Mutation: {
    register: async (_, { user }, __, ___) => {
      return await createUser(user);
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });
export default apolloServer;
