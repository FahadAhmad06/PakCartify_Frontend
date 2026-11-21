import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";

// createAsyncThunk is used to create asynchronous actions that can be dispatched to the Redux store. It generates action types and action creators for handling asynchronous operations, such as API calls. The generated actions include pending, fulfilled, and rejected states, which can be handled in the reducers to update the state accordingly.

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async ({ keyword, page = 1, category,subcategory }, { rejectWithValue }) => {
    try {
      let link = "/api/v1/products?page=" + page;
      if (category) {
        link += `&category=${encodeURIComponent(category)}`;
      }

      if (subcategory) {
        link += `&subcategory=${encodeURIComponent(subcategory)}`;
      }
      if (keyword) {
        link += `&keyword=${encodeURIComponent(keyword)}`;
      }

      // const link = keyword?`/api/v1/products?keyword=${encodeURIComponent(keyword)} & page=${page}` : `/api/v1/products?page=${page}`;

      const data = await axios.get(link);
      console.log("Response", data);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "An error occurred",
      );
    }
  },
);

// product Details
export const getProductdetails = createAsyncThunk(
  "product/getProductdetails",
  async (id, { rejectWithValue }) => {
    try {
      const link = `/api/v1/product/${id}`;
      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "An error occurred",
      );
    }
  },
);


// Submit Reviews
export const createReview = createAsyncThunk(
  "product/createReview",
  async ({rating,comment,productId}, { rejectWithValue }) => {
    try {
      const config={
        headers:{
          'content-Type':'application/json'
        }
      }
      const { data } = await axios.put('/api/v1/review',{rating,comment,productId},config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "An error occurred",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productCount: 0,
    loading: false,
    error: null,
    product: null,
    resultsPerPage: 4,
    totalPages: 0,
    reviewSuccess:false,
    reviewLoading:false,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.reviewSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        console.log("Fullfilled action payload", action.payload);
        state.loading = false;
        state.error = null;
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
        state.resultsPerPage = action.payload.resultsPerPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
        state.products = [];
      });

    // get product details:

    builder
      .addCase(getProductdetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductdetails.fulfilled, (state, action) => {
        console.log("Product details:", action.payload);
        state.loading = false;
        state.error = null;
        state.product = action.payload.product;
      })
      .addCase(getProductdetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product details";
      });


    // create review

    builder
      .addCase(createReview.pending, (state) => {
        state.reviewLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviewLoading=false,
        state.reviewSuccess=true
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error = action.payload || "Failed to fetch product review.";
      });
  },
});

export const { removeErrors, removeSuccess } = productSlice.actions;
export default productSlice.reducer;
