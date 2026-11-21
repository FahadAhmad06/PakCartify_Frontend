import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  verifyRegistrationOtp,
  resendRegistrationOtp,
  removeErrors,
  removeSuccess,
} from "../features/user/userSlice";
import { Email, VerifiedUser } from "@mui/icons-material";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success, pendingEmail, message } = useSelector(
    (state) => state.user,
  );

  const email = location.state?.email || pendingEmail || "";
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (message) {
      toast.info(message, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success("Email verified! Welcome to PakCartify.", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      setTimeout(() => navigate("/"), 1000);
    }
  }, [success, dispatch, navigate]);

  const handleVerify = (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(verifyRegistrationOtp({ email, otp }));
  };

  const handleResend = () => {
    if (!canResend) return;

    dispatch(resendRegistrationOtp(email)).then((result) => {
      if (resendRegistrationOtp.fulfilled.match(result)) {
        setCountdown(60);
        setCanResend(false);
        setOtp("");
        toast.success("New OTP sent to your email.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    });
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-[#042C1D] pt-16 lg:pt-20 lg:mt-32 pb-6">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <Link
          to="/login"
          className="bg-white text-[#042C1D] px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold shadow-xl hover:bg-green-100 transition-all duration-300"
        >
          Login →
        </Link>
      </div>

      <div className="hidden lg:block lg:w-[60%]">
        <img
          src="/signup.png"
          alt="Verify Email"
          className="w-full h-full object-fill rounded-r-[40px]"
        />
      </div>

      <div className="lg:hidden w-full flex items-center justify-center px-4 sm:px-5 mt-14 sm:mt-16">
        <div className="w-full max-w-[1000px] h-[220px] sm:h-[320px] md:h-[420px] rounded-[24px] overflow-hidden">
          <img
            src="/signup.png"
            alt="Verify Email"
            className="w-full h-full object-fill"
          />
        </div>
      </div>

      <div className="w-full lg:w-[40%] flex items-center justify-center px-4 sm:px-5 py-8 lg:py-0">
        <div className="bg-white w-full max-w-lg rounded-[24px] sm:rounded-[30px] shadow-2xl p-5 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <VerifiedUser className="text-[#0E5D33]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#042C1D]">
              Verify Your <span className="text-green-700">Email</span>
            </h1>
            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              We sent a 6-digit OTP to your email. It expires in 1 minute.
            </p>
          </div>

          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <Email className="text-green-700" />
            <span className="text-sm font-medium text-gray-700 break-all">
              {email}
            </span>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                value={otp}
                onChange={handleOtpChange}
                className="w-full rounded-xl border py-3 text-center text-2xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-green-600 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#0B6B3A] via-[#0E5D33] to-[#15803D] py-3 text-base sm:text-lg font-semibold text-white shadow-lg hover:from-[#09592F] hover:via-[#0B6B3A] hover:to-[#166534] transition-all duration-500 disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-sm font-semibold text-[#0E5D33] hover:text-green-800 transition disabled:opacity-60"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend OTP in{" "}
                <span className="font-bold text-[#0E5D33]">{countdown}s</span>
              </p>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-sm text-gray-500 hover:text-[#0E5D33] transition"
            >
              ← Back to registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
