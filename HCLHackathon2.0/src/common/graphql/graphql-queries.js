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

const searchOrders = gql`
  query searchOrders($searchFilter: SearchFilter!) {
    orders: searchOrders(searchFilter: $searchFilter) {
      orderReferenceNo
      stockName
      orderStatus
      transactionType
      orderValueAED
      createdOn
      createdBy
    }
  }
`;

export { loginUserQuery, searchOrders };
