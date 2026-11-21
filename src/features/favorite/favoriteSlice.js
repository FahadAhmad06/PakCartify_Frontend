import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Toggle add/remove favorite
export const toggleFavorite = createAsyncThunk(
  "favorite/toggleFavorite",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/v1/favorite/toggle/${productId}`);
      return { productId, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "An error occurred",
      );
    }
  },
);

// Get logged-in user's favorites
export const getMyFavorites = createAsyncThunk(
  "favorite/getMyFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/favorites/me`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "An error occurred",
      );
    }
  },
);

export const removeAllFavorites = createAsyncThunk(
    "favorite/removeAll",
    async (_, { rejectWithValue }) => {

        try {

            const { data } = await axios.delete(
                "/api/v1/favorites/remove-all"
            );

            return data;

        } catch (error) {

            return rejectWithValue(error.response.data);

        }

    }
);


const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    favorites: [],
    loading: false,
    error: null,
  },
  reducers: {
    removeFavoriteErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload.favorites;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload || "Failed to update favorite";
      });

    builder
      .addCase(getMyFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload.favorites;
      })
      .addCase(getMyFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch favorites";
      });

    builder
      .addCase(removeAllFavorites.pending, (state) => {
        state.loading = true;
      })

      .addCase(removeAllFavorites.fulfilled, (state) => {
        state.loading = false;
        state.favorites = [];
      })

      .addCase(removeAllFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { removeFavoriteErrors } = favoriteSlice.actions;
export default favoriteSlice.reducer;
