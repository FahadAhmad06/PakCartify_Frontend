import React, { useEffect, useState } from "react";
import PageTitle from "../coponents/PageTitle";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
    Lock,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";

import {
    resetPassword,
    removeErrors,
    removeSuccess,
} from "../features/user/userSlice";
import { FiArrowLeft } from "react-icons/fi";

function ResetPassword() {

    const { loading, success, error } = useSelector(
        (state) => state.user
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token } = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [showTooltip, setShowTooltip] = useState(false);

    const resetPasswordSubmit = (e) => {
        e.preventDefault();

        dispatch(
            resetPassword({
                token,
                userData: {
                    password,
                    confirmPassword,
                },
            })
        );
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Password reset failed. Please try again.", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
            toast.success(success.message || "Your password has been reset successfully. Please log in with your new password.", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
            dispatch(removeSuccess());
            navigate("/login");
        }
    }, [dispatch, success, navigate]);

    // Password Validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    const score = [
        hasUpperCase,
        hasNumber,
        hasSpecialChar,
        hasMinLength,
    ].filter(Boolean).length;

    let strength = "Weak";
    let strengthColor = "bg-red-500";
    let strengthWidth = "25%";

    if (score === 2) {
        strength = "Medium";
        strengthColor = "bg-yellow-500";
        strengthWidth = "50%";
    } else if (score === 3) {
        strength = "Good";
        strengthColor = "bg-lime-500";
        strengthWidth = "75%";
    } else if (score === 4) {
        strength = "Strong";
        strengthColor = "bg-emerald-600";
        strengthWidth = "100%";
    }

    return (
        <>
            <PageTitle title="Reset Password" />

            <div className="relative min-h-screen flex flex-col lg:flex-row bg-[#022c22] pt-16 lg:pt-20 lg:mt-32 pb-8">

                {/* Login Button */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 ">
                    <Link
                        to="/login"
                        className="flex items-center gap-2 bg-white text-[#022c22] px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold shadow-xl hover:bg-green-100 transition-all duration-300 hover:scale-105 "
                    >
                        <FiArrowLeft className="text-lg" />
                        <span>Login</span>
                    </Link>
                </div>

                {/* Desktop Image */}

                <div className="hidden lg:block lg:w-[60%]">
                    <img
                        src="/reset p.png"
                        alt="Reset Password"
                        className="w-full h-full object-fill rounded-r-[40px]"
                    />
                </div>

                {/* Mobile Image */}

                <div className="lg:hidden w-full flex items-center justify-center px-4 sm:px-5 mt-14 sm:mt-16">
                    <div className="w-full max-w-[1000px] h-[220px] sm:h-[320px] md:h-[420px] rounded-[24px] overflow-hidden">
                        <img
                            src="/reset p.png"
                            alt="Reset Password"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full lg:w-[40%] flex items-center justify-center px-4 sm:px-5 py-8 lg:py-0">

                    <div className="bg-white w-full max-w-lg rounded-[24px] sm:rounded-[30px] shadow-2xl p-5 sm:p-8">

                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-100 flex items-center justify-center">
                                <Lock sx={{ fontSize: 40 }} className="text-green-700 sm:!text-[45px]" />
                            </div>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#022c22]">
                            Reset
                            <span className="text-green-700"> Password</span>
                        </h2>

                        <p className="text-center text-gray-500 mt-3 mb-8 text-sm sm:text-base">
                            Enter your new password below.
                        </p>

                        <form onSubmit={resetPasswordSubmit} className="space-y-6">

                            {/* New Password */}
                            <div className="relative">
                                <label className="absolute -top-2 left-3 bg-white px-2 text-sm text-gray-600 z-10">
                                    New Password <span className="text-red-500">*</span>
                                </label>

                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setShowTooltip(true)}
                                    onBlur={() => setShowTooltip(false)}
                                    required
                                    className="w-full pl-12 pr-24 py-3 border border-gray-300 rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                                />

                                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                    <Tooltip
                                        open={showTooltip && password.length > 0}
                                        placement="right"
                                        arrow
                                        title={
                                            <div className="text-sm space-y-2">
                                                <p className={hasMinLength ? "text-green-400" : "text-red-400"}>
                                                    {hasMinLength ? "✔" : "✖"} Minimum 8 characters
                                                </p>
                                                <p className={hasUpperCase ? "text-green-400" : "text-red-400"}>
                                                    {hasUpperCase ? "✔" : "✖"} 1 Uppercase Letter
                                                </p>
                                                <p className={hasNumber ? "text-green-400" : "text-red-400"}>
                                                    {hasNumber ? "✔" : "✖"} 1 Number
                                                </p>
                                                <p className={hasSpecialChar ? "text-green-400" : "text-red-400"}>
                                                    {hasSpecialChar ? "✔" : "✖"} 1 Special Character (@)
                                                </p>
                                            </div>
                                        }
                                    >
                                        {hasMinLength && hasUpperCase && hasNumber && hasSpecialChar ? (
                                            <CheckCircleIcon className="text-green-600 cursor-pointer" />
                                        ) : (
                                            <InfoOutlinedIcon className="text-gray-500 cursor-pointer" />
                                        )}
                                    </Tooltip>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </button>
                            </div>

                            {/* Password Strength */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Password Strength</span>
                                    <span
                                        className={`font-semibold ${strength === "Weak"
                                            ? "text-red-500"
                                            : strength === "Medium"
                                                ? "text-yellow-500"
                                                : strength === "Good"
                                                    ? "text-lime-600"
                                                    : "text-green-600"
                                            }`}
                                    >
                                        {strength}
                                    </span>
                                </div>

                                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                                    <div
                                        className={`${strengthColor} h-full transition-all duration-500`}
                                        style={{ width: strengthWidth }}
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <label className="absolute -top-2 left-3 bg-white px-2 text-sm text-gray-600">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>

                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700" />

                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                    className="w-full pl-12 pr-14 py-3 border border-gray-300 rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </button>
                            </div>

                            {confirmPassword.length > 0 && password !== confirmPassword && (
                                <p className="text-sm text-red-500 -mt-4">Passwords do not match</p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gradient-to-r from-[#0B6B3A] via-[#0E5D33] to-[#15803D] py-3 text-base sm:text-lg font-semibold text-white shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? "Resetting Password..." : "Reset Password"}
                            </button>

                            <div className="text-center lg:hidden">
                                <Link
                                    to="/login"
                                    className="text-green-700 font-semibold hover:text-green-800 transition"
                                >
                                    ← Back to Login
                                </Link>
                            </div>

                            {/* Security Card */}
                            <div className="rounded-2xl bg-green-50 border border-green-100 p-4 flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <Lock className="text-green-700" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-green-800">
                                        Secure Password
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1 leading-6">
                                        Your password should contain at least
                                        <strong> 8 characters</strong>,
                                        <strong> one uppercase letter</strong>,
                                        <strong> one number</strong> and
                                        <strong> one special character </strong>
                                        to keep your account secure.
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

export default ResetPassword;