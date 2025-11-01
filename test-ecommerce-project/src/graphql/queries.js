import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
    query GetProducts {
        products {
            id
            name
            inStock
            gallery
            prices {
                amount
                currency {
                    symbol
                }
            }
            attributes {
                name
                values {
                    label
                    rendered
                }
            }
        }
    }
`;

export const GET_CATEGORIES = gql`
    query GetCategories {
        categories {
            id
            name
        }
    }
`;

export const GET_CATEGORY_PRODUCTS = gql`
    query GetProductsByCategory($categoryId: String!) {
        productsByCategory(categoryId: $categoryId) {
            categoryName
            products {
                id
                name
                inStock
                gallery
                prices {
                    amount
                    currency {
                        symbol
                    }
                }
            }
        }
    }
`;

export const GET_PRODUCT_DETAILS = gql`
    query GetProductDetails($productId: Int!) {
        product(id: $productId) {
            id
            name
            description
            brand
            inStock
            gallery
            category
            prices {
                amount
                currency {
                    label
                    symbol
                }
            }
            attributes {
                name
                type
                values {
                    label
                    rendered
                }
            }
        }
    }
`;
