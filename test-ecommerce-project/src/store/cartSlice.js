// 1. Redux Slice (cartSlice.js)
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    items: JSON.parse(localStorage.getItem("cart")) || [],
    isCartOpen: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(
                (item) =>
                    item.productId === newItem.productId &&
                    JSON.stringify(item.selectedAttributes) ===
                        JSON.stringify(newItem.selectedAttributes)
            );

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.items.push({
                    ...newItem,
                    product: newItem.product,
                });
            }

            localStorage.setItem("cart", JSON.stringify(state.items));
        },
        openCart: (state) => {
            state.isCartOpen = true;
        },
        closeCart: (state) => {
            state.isCartOpen = false;
        },
        toggleCart: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
        incrementQty: (state, action) => {
            const item = state.items.find((i) => i.productId === action.payload);
            if (item) item.quantity++;
            localStorage.setItem("cart", JSON.stringify(state.items));
        },
        decrementQty: (state, action) => {
            const index = state.items.findIndex((i) => i.productId === action.payload);
            if (index !== -1) {
                const item = state.items[index];
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    state.items.splice(index, 1);
                }
                localStorage.setItem("cart", JSON.stringify(state.items));
            }
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem("cart");
        },
    },
});



export const { addToCart, incrementQty, decrementQty, clearCart, openCart, closeCart, toggleCart } =
    cartSlice.actions;
export default cartSlice.reducer;
