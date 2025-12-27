import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItems: (state, action) => {
            state.push(action.payload);
        },
        removeItem: (state, action) => {
            return state.filter(item => item.id != action.payload);
        },
        removeAllItems: (state) => {
            return [];
        },
        updateItem: (state, action) => {
            const item = state.find(
                (i) => i.productId === action.payload.productId
            );

            if (item) {
                item.quantity = action.payload.quantity;
                item.price = action.payload.price;
            }
        }
    }
});

export const getTotalPrice = (state) => state.cart.reduce((total, item) => total + item.price, 0);
export const { addItems, removeItem, removeAllItems, updateItem } = cartSlice.actions;
export default cartSlice.reducer;