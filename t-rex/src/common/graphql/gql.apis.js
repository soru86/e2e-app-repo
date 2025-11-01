import { apolloClient } from "./apollo.client";
import { addNewUserMutation, loginUserQuery } from "./graphql-queries";

const login = async (userName, password) => {
  const { data } = await apolloClient.query({
    query: loginUserQuery,
    variables: {
      userName: userName,
    },
  });
  const { user } = data;
  return user?.password === password ? user : null;
};

const createNewUser = async (user) => {
  const id = await apolloClient.mutate({
    mutation: addNewUserMutation,
    variables: {
      user: user,
    },
  });
  return id;
};

export { login, createNewUser };
