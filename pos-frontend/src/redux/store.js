import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./slices/customerSlice";
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
    reducer: {
        customer: customerSlice,
        cart: cartSlice,
        user: userSlice
    },
    // 👇 PERHATIKAN: Pake UNDERSCORE (_), bukan titik (.)
    devTools: import.meta.env.NODE_ENV !== "production",
});

export default store;