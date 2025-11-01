import { gql } from "@apollo/client";

const loginUserQuery = gql`
  query getUserByName($userName: String!) {
    user: getUserByName(userName: $userName) {
      id
      fullName
      userName
      email
      password
      createdAt
    }
  }
`;

const addNewUserMutation = gql`
  mutation addNewUser($user: User!) {
    user: addNewUser(user: $user) {
      id
    }
  }
`;

export { loginUserQuery, addNewUserMutation };
