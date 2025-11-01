// graphql/mutations.js
import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
    mutation CreateOrder($products: [OrderProductInput!]!) {
        createOrder(products: $products) {
            id
            totalPrice
            itemsNumber
            products {
                productId
                selectedAttributes {
                    name
                    value
                }
            }
        }
    }
`;
