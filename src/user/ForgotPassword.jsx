import React, { useEffect, useState } from "react";
import PageTitle from "../coponents/PageTitle";
import { Link } from "react-router-dom";
import { Email } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MdArrowBack } from "react-icons/md";

import {
  forgotPassword,
  removeErrors,
  removeSuccess,
} from "../features/user/userSlice";

function ForgotPassword() {
  const { loading, error, success, message } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const forgotPasswordEmail = (e) => {
    e.preventDefault();

    dispatch(forgotPassword(email.trim().toLowerCase()));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      dispatch(removeSuccess());

      setEmail("");
    }
  }, [dispatch, success]);

  return (
    <>
      <PageTitle title="Forgot Password" />

      <div className="relative min-h-screen flex flex-col lg:flex-row bg-[#042C1D] pt-6 lg:pt-20 lg:mt-32 pb-8 pt-16">
        {/* Login Button */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 hidden lg:block">
          <Link
            to="/login"
            className="bg-white text-[#042C1D] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold shadow-xl hover:bg-green-100 transition text-sm sm:text-base"
          >
            Login
          </Link>
        </div>

        {/* Left Side (Desktop Image) */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
          <img
            src="/forgot.png"
            alt="Forgot Password"
            className="w-full h-full object-cover rounded-r-[40px]"
          />
        </div>

        {/* Mobile Image */}
        <div className="lg:hidden w-full flex items-center justify-center px-4 sm:px-5 mt-16 sm:mt-16">
          <div className="w-full max-w-[1000px] h-[230px] sm:h-[320px] md:h-[420px] rounded-[24px] overflow-hidden">
            <img
              src="/forgot.png"
              alt="Forgot Password"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10">
          <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-[30px] shadow-2xl p-5 sm:p-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-green-100 flex items-center justify-center">
                <Email sx={{ fontSize: { xs: 32, sm: 45 } }} className="text-green-700" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#042C1D]">
              Forgot <span className="text-green-700">Password</span>
            </h1>

            <p className="text-center text-gray-500 text-sm sm:text-base mt-2 sm:mt-3 mb-6 sm:mb-8 px-2">
              Enter your registered email address.
              <br className="hidden sm:block" />
              We'll send you a password reset link.
            </p>

            <form onSubmit={forgotPasswordEmail} className="space-y-5 sm:space-y-6">
              {/* Email Input */}
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-2 text-xs sm:text-sm text-gray-600">
                  Email Address <span className="text-red-500">*</span>
                </label>

                <Email className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700" fontSize="small" />

                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                  className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-[#0B6B3A] via-[#0E5D33] to-[#15803D] py-2.5 sm:py-3 text-base sm:text-lg font-semibold text-white shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending Reset Link..." : "Send Reset Link"}
              </button>

              {/* Back to Login */}
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-green-700 font-semibold hover:text-green-800 transition lg:hidden text-sm sm:text-base"
              >
                <MdArrowBack />
                Back to Login
              </Link>

              {/* Security Info */}
              <div className="rounded-2xl bg-green-50 border border-green-100 p-3.5 sm:p-4 flex items-start gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Email className="text-green-700" fontSize="small" />
                </div>

                <div>
                  <h4 className="font-semibold text-green-800 text-sm sm:text-base">
                    Secure Password Recovery
                  </h4>

                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    We'll send a secure password reset link to your registered
                    email address. Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;