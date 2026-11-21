import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ─────────────────────────────────────────────────────────────
// Add to Cart
// Supports variant (color + size) items with unique cartItemId
// ─────────────────────────────────────────────────────────────
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, quantity, color, size }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      const product  = data.product;

      // ── Variant stock check ──────────────────────────────
      if (product.hasVariants && product.variants?.length > 0 && color && size) {
        const variant = product.variants.find(v => v.color === color && v.size === size);
        if (!variant) {
          return rejectWithValue("This variant is not available.");
        }
        if (variant.stock < 1) {
          return rejectWithValue(`${product.name} (${color} / ${size}) is out of stock.`);
        }
        if (quantity > variant.stock) {
          return rejectWithValue(`Only ${variant.stock} items available for ${color} / ${size}.`);
        }
        return {
          cartItemId: `${product._id}-${color}-${size}`,
          product:    product._id,
          name:       product.name,
          price:      variant.price || product.price,
          image:      product.image[0]?.url,
          stock:      variant.stock,
          quantity,
          color,
          size,
        };
      }

      // ── Flat stock check ─────────────────────────────────
      if (product.stock < 1) {
        return rejectWithValue(`${product.name} is out of stock.`);
      }
      if (quantity > product.stock) {
        return rejectWithValue(`Only ${product.stock} items available.`);
      }

      return {
        cartItemId: product._id,
        product:    product._id,
        name:       product.name,
        price:      product.price,
        image:      product.image[0]?.url,
        stock:      product.stock,
        quantity,
        color:  null,
        size:   null,
      };

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        "Add to cart failed. Please try again later."
      );
    }
  }
);

// ─────────────────────────────────────────────────────────────
// Local storage helpers
// ─────────────────────────────────────────────────────────────
const safeParse = (key) => {
  try {
    const value = localStorage.getItem(key);
    if (!value || value === "undefined") return null;
    return JSON.parse(value);
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems:    safeParse("cartItems") || [],
    loading:      false,
    error:        null,
    success:      false,
    message:      null,
    removingId:   null,
    shippingInfo: safeParse("shippingInfo") || {},
    appliedCoupon: safeParse("appliedCoupon") || null,
  },
  reducers: {
    removeErrors: (state) => { state.error = null; },
    removeMessage: (state) => { state.message = null; },
    removeSuccess: (state) => { state.success = false; },

    removeItemFromCart: (state, action) => {
      state.removingId = action.payload;
      state.cartItems  = state.cartItems.filter(item => (item.cartItemId || item.product) !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      state.removingId = null;
    },

    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find(i => (i.cartItemId || i.product) === id);
      if (item) {
        const safeQuantity = Math.max(1, Math.min(quantity, item.stock));
        item.quantity      = safeQuantity;
        state.message      = `Updated ${item.name} quantity in the cart`;
        state.success      = true;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingInfo");
      localStorage.removeItem("cartInfo");
    },

    applyCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
      localStorage.setItem("appliedCoupon", JSON.stringify(state.appliedCoupon));
    },

    removeCoupon: (state) => {
      state.appliedCoupon = null;
      localStorage.removeItem("appliedCoupon");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const item = action.payload;
        const existingItem = state.cartItems.find(
          i => (i.cartItemId || i.product) === item.cartItemId
        );

        if (existingItem) {
          const newQty           = Math.min(existingItem.quantity + item.quantity, item.stock);
          existingItem.quantity  = newQty;
          existingItem.stock     = item.stock; // refresh stock
          state.message          = `Updated ${item.name} quantity in the cart`;
        } else {
          state.cartItems.push(item);
          state.message = `${item.name} added to cart successfully`;
        }

        state.loading = false;
        state.error   = null;
        state.success = true;
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error   =
          action.payload?.message ||
          action.payload ||
          "Add to cart failed. Please try again later.";
      });
  },
});

export const {
  removeErrors, removeMessage, removeSuccess,
  removeItemFromCart, updateCartQuantity,
  saveShippingInfo, applyCoupon, removeCoupon, clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;