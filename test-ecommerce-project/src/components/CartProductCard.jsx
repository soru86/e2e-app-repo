import { useDispatch } from "react-redux";
import { decrementQty, incrementQty } from "../store/cartSlice";
import parse from "html-react-parser";
import { toKebabCase } from "./../helpers/stringHelper";

const CartProductCard = ({ item }) => {
    const dispatch = useDispatch();

    return (
        <div key={item.productId} className="flex justify-between gap-2 mb-5">
            <div className="w-[70%] flex justify-between gap-2">
                <div className="flex flex-col gap-2">
                    <p className="text-xl">{item.product.name}</p>
                    <p className="font-bold">${item.product.prices[0].amount}</p>
                    <div className="flex flex-col gap-2 my-3">
                        {/* product attributes */}
                        {item.product.attributes.map((attr) => (
                            <div
                                key={attr.name}
                                data-testid={`cart-item-attribute-${toKebabCase(attr.name)}`}
                            >
                                <h4 className="font-bold text-sm mb-1">{attr.name}:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {attr.values.map((val, i) => {
                                        const isSelected =
                                            item.selectedAttributes[attr.name] === val.label;

                                        // const attributeName = toKebabCase(attr.name);
                                        // const testId = `cart-item-attribute-${attributeName}${
                                        //     isSelected ? `-${attributeName}-selected` : ""
                                        // }`;
                                        return (
                                            <button
                                                key={i}
                                                className={`border-2 min-w-8 min-h-8 ${
                                                    isSelected ? "border-black" : "border-gray-300"
                                                }`}
                                                // data-testid={testId}
                                                data-testid={`product-attribute-${toKebabCase(
                                                    attr.name
                                                )}-${val.label}`}
                                            >
                                                {parse(val.rendered)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* increament & decreament */}
                <div className="flex flex-col justify-between items-center text-xl">
                    <button
                        className="border-1 border-black w-8 h-8 cursor-pointer"
                        onClick={() => dispatch(incrementQty(item.productId))}
                        data-testid="cart-item-amount-increase"
                    >
                        +
                    </button>
                    <p data-testid="cart-item-amount">{item.quantity}</p>

                    <button
                        className="border-1 border-black w-8 h-8 cursor-pointer"
                        onClick={() => dispatch(decrementQty(item.productId))}
                        data-testid="cart-item-amount-decrease"
                    >
                        -
                    </button>
                </div>
            </div>
            {/* product image */}
            <div className="w-[30%]">
                <img src={item.product.gallery[0]} className="w-full" alt={item.product.name} />
            </div>
        </div>
    );
};

export default CartProductCard;
