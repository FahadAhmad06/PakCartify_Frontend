import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//  Regiter API

export const register = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/v1/register", userData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Registration Failed. Please try again later.",
      );
    }
  },
);

export const verifyRegistrationOtp = createAsyncThunk(
  "user/verifyRegistrationOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        "/api/v1/register/verify",
        { email, otp },
        config,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "OTP verification failed. Please try again.",
      );
    }
  },
);

export const resendRegistrationOtp = createAsyncThunk(
  "user/resendRegistrationOtp",
  async (email, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/register/resend-otp",
        { email },
        config,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to resend OTP. Please try again.",
      );
    }
  },
);

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/login",
        { email, password },
        config,
      );
      console.log("login data", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Regitration Failed. lease try again later.",
      );
    }
  },
);

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/profile", {
        withCredentials: true,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load User Profile.",
      );
    }
  },
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/logout", {
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Unable to log out. Please try again.",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.put(
        "/api/v1/profile/update",
        userData,
        config,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Profile update failed. Please try again later.",
        },
      );
    }
  },
);

// update Passowrd

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const { data } = await axios.put(
        "/api/v1/password/update",
        formData,
        config,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message ||
          "Password update failed. Please try again later.",
      );
    }
  },
);

//  forgot password
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/v1/password/forgot",
        { email },
        config,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Email sending failed. Please try again later",
      );
    }
  },
);

//  reset password
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, userData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `/api/v1/reset/${token}`,
        userData,
        config,
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Password reset failed. Please try again later.",
      );
    }
  },
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: false,
    message: null,
    otpSent: false,
    pendingEmail: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Registration cases
    builder
      .addCase(register.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.otpSent = true;
        state.pendingEmail = action.payload?.email || null;
        state.message = action.payload?.message || "OTP sent to your email.";
      })
      .addCase(register.rejected, (state, action) => {
        ((state.loading = false),
          (state.error =
            action.payload?.message ||
            "Registration Failed. Please try again later."));
        state.otpSent = false;
        state.pendingEmail = null;
      });

    builder
      .addCase(verifyRegistrationOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRegistrationOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.success;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        state.otpSent = false;
        state.pendingEmail = null;
        state.message = "Registration successful";
      })
      .addCase(verifyRegistrationOtp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          "OTP verification failed. Please try again.";
      });

    builder
      .addCase(resendRegistrationOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendRegistrationOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message || "OTP resent successfully.";
      })
      .addCase(resendRegistrationOtp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to resend OTP. Please try again.";
      });

    // login cases
    builder
      .addCase(login.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(login.fulfilled, (state, action) => {
        ((state.loading = false),
          (state.error = null),
          (state.success = action.payload.success));
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        console.log(state.user);
      })
      .addCase(login.rejected, (state, action) => {
        ((state.loading = false),
          (state.error =
            action.payload?.message ||
            "Login Failed. Please try again later."));
        state.user = null;
        state.isAuthenticated = false;
      });

    // loading user
    builder
      .addCase(loadUser.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        ((state.loading = false), (state.error = null));
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false;
      });

    // logout cases
    builder
      .addCase(logout.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(logout.fulfilled, (state, action) => {
        ((state.loading = false), (state.error = null), (state.user = null));
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        ((state.loading = false),
          (state.error =
            action.payload?.message || "Unable to log out. Please try again."));
      });

    //Update profile cases
    builder
      .addCase(updateProfile.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        ((state.loading = false),
          (state.error = null),
          (state.user = action.payload?.user || null));
        state.success = action.payload?.success;
        state.message = action.payload?.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        ((state.loading = false),
          (state.error =
            action.payload?.message ||
            "Profile update failed. Please try again later"));
      });

    //Update passowrd cases
    builder
      .addCase(updatePassword.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        ((state.loading = false),
          (state.error = null),
          (state.success = action.payload?.success));
      })
      .addCase(updatePassword.rejected, (state, action) => {
        ((state.loading = false),
          (state.error =
            action.payload ||
            "Password update failed. Please try again later"));
      });

    //forgot password cases
    builder
      .addCase(forgotPassword.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        ((state.loading = false),
          (state.error = null),
          (state.success = action.payload?.success));
        state.message = action.payload?.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        ((state.loading = false),
          (state.error =
            action.payload || "Email sending failed. Please try again later"));
      });

    //RESET password cases
    builder
      .addCase(resetPassword.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        ((state.loading = false),
          (state.error = null),
          (state.success = action.payload?.success),
          (state.user = null),
          (state.isAuthenticated = false));
      })
      .addCase(resetPassword.rejected, (state, action) => {
        ((state.loading = false),
          (state.error =
            action.payload || "Email sending failed. Please try again later"));
      });
  },
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;
