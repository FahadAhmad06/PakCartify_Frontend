import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch All Products
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/products");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error while  Fetching the products.",
      );
    }
  },
);

// create products
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/api/v1/admin/product/create",
        productData,
        {
          withCredentials: true,
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Product creation failed.",
      );
    }
  },
);

// Get Single Product Details (Admin)
export const getAdminProductDetails = createAsyncThunk(
  "admin/getAdminProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`, {
        withCredentials: true,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details.",
      );
    }
  },
);

// Update Product
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/v1/admin/products/${id}`,
        productData,
        {
          withCredentials: true,
        },
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Product update failed.",
      );
    }
  },
);

// ! Delete Product
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/products/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

// ! Fetch all user Product
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/Admin/user");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch Users.",
      );
    }
  },
);

// ! Get single user
export const getSingleUser = createAsyncThunk(
  "admin/getSingleUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/Admin/user/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch User.",
      );
    }
  },
);

// ! Update User role
export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/admin/user/${userId}`, {
        role,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to update User ROle.",
      );
    }
  },
);

// ! Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/Admin/user/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to Delete User.",
      );
    }
  },
);

// ! Delete user
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/orders");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch Orders.",
      );
    }
  },
);

// ! Delete order
export const deleteOrder = createAsyncThunk(
  "admin/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/order/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to delete order.",
      );
    }
  },
);

// ! Get Single Order Admin

export const getSingleOrder = createAsyncThunk(
  "admin/getSingleOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/order/${id}`, {
        withCredentials: true,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order",
      );
    }
  },
);

// ! Update Order Status
export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/v1/admin/order/${orderId}`,
        {
          status,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status",
      );
    }
  },
);

// ! Fetch All review
export const fetchProductReviews = createAsyncThunk(
  "admin/fetchProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/reviews?id=${productId}`);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to Fetch Reviews",
      );
    }
  },
);

// ! Delete Reviews
export const deleteReview = createAsyncThunk(
  "admin/deleteReview",
  async ({ reviewId, productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/admin/reviews?id=${reviewId}&productId=${productId}`,
        { withCredentials: true },
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    product: null,
    success: false,
    loading: false,
    error: null,
    users: [],
    user: {},
    message: null,
    orders: [],
    totalAmount: 0,
    order: {},
    reviews: [],
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
    clearMessage: (state) => {
      state.message = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "Error while Fetching products"));
      });

    builder
      // create product
      .addCase(createProduct.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.products.push(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "Product creation failed"));
      });

    builder
      // Get Product Details
      .addCase(getAdminProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(getAdminProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.product = action.payload.product;

        state.products = state.products.map((item) =>
          item._id === action.payload.product._id
            ? action.payload.product
            : item,
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      // ! Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      // ! fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch Users.";
      });

    builder
      // ! fecthsingleuser
      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch User.";
      });

    builder
      // ! update user ROle
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch User.";
      });

    builder
      // ! Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to Delete User.";
      });

    builder
      // ! fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders.";
      });

    builder
      // ! delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete order.";
      })

      // ! getsingleorder
      .addCase(getSingleOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })

      .addCase(getSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      // ! update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.order = action.payload.order;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update Order Status.";
      });

    builder
      // ! fetch product reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch product reviews.";
      });

    // ! Delete reviews
    builder
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { removeErrors, removeSuccess, clearMessage } = adminSlice.actions;
export default adminSlice.reducer;
