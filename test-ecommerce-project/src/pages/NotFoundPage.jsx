import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <section className="py-10 flex justify-center flex-col items-center gap-5 font-raleway">
            <h1 className="text-4xl">404</h1>
            <p className="text-2xl text-gray-500">Page not found</p>
            <Link className="bg-primary text-white py-2 px-4 rounded" to="/">
                Back to Home
            </Link>
        </section>
    );
};

export default NotFoundPage;
