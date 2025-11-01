import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_PRODUCT_DETAILS } from "../graphql/queries";
import { useState } from "react";
import parse from "html-react-parser";
import ProductAttributes from "../components/ProductAttributes";
import ImageCarousel from "../components/ImageCarousel";
import { addToCart, openCart } from "../store/cartSlice";
import { useDispatch } from "react-redux";
import Spinner from "../components/Spinner";

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const { loading, error, data } = useQuery(GET_PRODUCT_DETAILS, {
        variables: { productId: parseInt(productId) },
    });

    const [selectedAttributes, setSelectedAttributes] = useState({});

    const allAttributesSelected = data?.product?.attributes?.length
        ? data.product.attributes.every((attr) => selectedAttributes[attr.name])
        : false;

    const dispatch = useDispatch();

    if (error) return `Error! ${error.message}`;

    return (
        <section>
            <div className="container">
                {loading ? (
                    <Spinner loading={loading} />
                ) : (
                    <>
                        <section className="py-10">
                            <div className="container">
                                <div className="flex flex-col md:flex-row gap-10 justify-between">
                                    <div
                                        className="w-full md:w-[60%] flex flex-col md:flex-row justify-between gap-5"
                                        data-testid="product-gallery"
                                    >
                                        {/* image carousel  */}
                                        <ImageCarousel gallery={data.product.gallery} />
                                    </div>
                                    <div className="w-full md:w-[40%]">
                                        {/* name  */}
                                        <h1 className="text-4xl font-raleway font-semibold mb-5">
                                            {data.product.name}
                                        </h1>
                                        {/* attributes  */}
                                        <ProductAttributes
                                            attributes={data.product.attributes}
                                            onChange={setSelectedAttributes}
                                        />
                                        {/* price  */}
                                        <div>
                                            <h3 className="text-xl font-roboto font-semibold">
                                                Price:
                                            </h3>
                                            <p className="font-raleway text-2xl font-bold mb-5">
                                                {data.product.prices[0].currency.symbol +
                                                    data.product.prices[0].amount}
                                            </p>
                                        </div>
                                        {/* add to cart btn  */}
                                        {data.product.inStock && (
                                            <button
                                                disabled={
                                                    data.product.attributes.length > 0 &&
                                                    !allAttributesSelected
                                                }
                                                className={`px-6 py-3 rounded w-full uppercase ${
                                                    data.product.attributes.length > 0 &&
                                                    !allAttributesSelected
                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                        : "bg-primary text-white hover:bg-[#6ed388] cursor-pointer"
                                                }`}
                                                onClick={() => {
                                                    dispatch(
                                                        addToCart({
                                                            productId: data.product.id,
                                                            selectedAttributes,
                                                            quantity: 1,
                                                            product: data.product,
                                                        })
                                                    );
                                                    dispatch(openCart());
                                                }}
                                                data-testid="add-to-cart"
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                        {/* description  */}
                                        <div
                                            className="font-roboto my-5"
                                            data-testid="product-description"
                                        >
                                            {parse(data.product.description)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </section>
    );
};

export default ProductDetailsPage;
