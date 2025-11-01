import ProductCard from "../components/ProductCard";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/queries";
import Spinner from "../components/Spinner";

const HomePage = () => {
    const { loading, error, data } = useQuery(GET_PRODUCTS);
    if (error) return `Error! ${error.message}`;
    return (
        <>
            <section className="py-10">
                <div className="container">
                    <h1 className="text-4xl mb-5">ALL</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {loading ? (
                            <Spinner loading={loading} />
                        ) : (
                            data.products.map((product) => (
                                <ProductCard product={product} key={product.id} />
                            ))
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
