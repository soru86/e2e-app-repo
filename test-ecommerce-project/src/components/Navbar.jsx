import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import cart from "../assets/cart.png";
import { GET_CATEGORIES } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import CartOverlay from "./CartOverlay";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart, closeCart } from "../store/cartSlice";
import { useState } from "react";

const Navbar = () => {
    const linkClass = ({ isActive }) =>
        isActive ? "text-primary uppercase border-b-2 border-primary py-5" : "uppercase py-5";
    const [activeLink, setActiveLink] = useState("all");
    const { loading, error, data } = useQuery(GET_CATEGORIES);
    const dispatch = useDispatch();
    const isCartOpen = useSelector((state) => state.cart.isCartOpen);
    const cartItems = useSelector((state) => state.cart.items);
    const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const handleLinkClick = (category) => {
        setActiveLink(category);
    };
    return (
        <>
            {/* backdrop */}
            {isCartOpen && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black/30 z-40"
                    onClick={() => dispatch(closeCart())}
                />
            )}
            <nav className="font-raleway relative z-50 bg-white">
                <div className="container">
                    <div className="flex items-center justify-between">
                        {/* <!-- Navigation --> */}
                        <div className="flex items-center justify-center gap-4">
                            <NavLink
                                to="/all"
                                className={linkClass}
                                data-testid={`${
                                    activeLink === "all" ? "active-category-link" : "category-link"
                                }`}
                                onClick={() => handleLinkClick("all")}
                            >
                                ALL
                            </NavLink>
                            {loading
                                ? "Loading..."
                                : data.categories.map((category) => (
                                      <NavLink
                                          to={`/${category.name.toLowerCase()}`}
                                          className={linkClass}
                                          key={category.id}
                                          data-testid={`${
                                              activeLink === category.name
                                                  ? "active-category-link"
                                                  : "category-link"
                                          }`}
                                          onClick={() => handleLinkClick(category.name)}
                                      >
                                          {category.name}
                                      </NavLink>
                                  ))}
                        </div>
                        {/* <!-- Logo --> */}
                        <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
                            <img className="h-10 w-auto" src={logo} alt="logo" />
                        </NavLink>
                        {/* <!-- Cart --> */}
                        <div className="flex items-center justify-center gap-4">
                            {/* cart icon  */}
                            <button
                                className="cursor-pointer relative"
                                onClick={() => {
                                    dispatch(toggleCart());
                                }}
                                data-testid="cart-btn"
                            >
                                <img src={cart} alt="cart" className="w-6" />
                                {/* cart count  */}
                                {totalItemsCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalItemsCount}
                                    </span>
                                )}
                            </button>
                            {/* cart overlay  */}
                            <CartOverlay isCartOpen={isCartOpen} />
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
