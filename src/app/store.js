import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/Products/productslice.js";
import userReducer from "../features/user/userSlice.js"
import favoriteReducer from "../features/favorite/favoriteSlice.js"
import cartReducer from "../features/cart/cartSlice.js"
import orderReducer from "../features/Order/OrderSlice.js"
import adminReducer from "../features/Admin/AdminSlice.js";


export const store = configureStore({
    reducer : {
        product : productReducer,
        user : userReducer,
        favorite : favoriteReducer,
        cart : cartReducer,
        order:orderReducer,
        admin:adminReducer
    }
})
