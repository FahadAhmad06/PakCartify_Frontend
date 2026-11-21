import React, { useEffect, useState } from "react";
import PageTitle from "../coponents/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePassword, removeErrors, removeSuccess, } from "../features/user/userSlice";
import { toast } from "react-toastify";
import Loader from "../coponents/Loader";
import { FiLock, FiEye, FiEyeOff, FiShield, } from "react-icons/fi";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function UpdatePassword() {
    const { success, loading, error } = useSelector(
        (state) => state.user
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const updatePassowrdSubmit = (e) => {
        e.preventDefault();

        if (!currentPassword.trim()) {
        toast.warning("Please enter your current password.",{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
        return;
    }

    if (!newPassword.trim()) {
        toast.warning("Please enter your new password.",{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
        return;
    }

    if (!confirmPassword.trim()) {
        toast.warning("Please confirm your new password.",{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
        return;
    }

    if (newPassword !== confirmPassword) {
        toast.warning("New password and confirm password do not match.",{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
        return;
    }

        const myForm = new FormData();

        myForm.set("oldPassword", currentPassword);
        myForm.set("newPassword", newPassword);
        myForm.set("confirmPassword", confirmPassword);


        dispatch(updatePassword(myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Update password failed. Please try again.", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
            toast.success(success.message || "Password updated successfully.", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
            dispatch(removeSuccess());
            navigate("/profiled");
        }
    }, [dispatch, success, navigate]);

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}/]/.test(newPassword);
    const hasMinLength = newPassword.length >= 8;

    const score = [
        hasUpperCase,
        hasNumber,
        hasSpecialChar,
        hasMinLength,
    ].filter(Boolean).length;



    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <PageTitle title="Update Password" />

                    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 flex items-center justify-center px-4 py-10 pt-20 mt-20">

                        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 ">

                            <div className="flex justify-center">
                                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <FiLock className="text-emerald-600 text-4xl" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-center mt-6">
                                Update Password
                            </h2>

                            <p className="text-center text-gray-500 mt-2 mb-8">
                                Keep your account secure with a strong password.
                            </p>

                            <form
                                onSubmit={updatePassowrdSubmit}
                                className="space-y-6"
                            >
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Current Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={showCurrent ? "text" : "password"}
                                            placeholder="Enter current password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowCurrent(!showCurrent)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                                        >
                                            {showCurrent ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>

                                    <div className="relative">
                                        <input type={showNew ? "text" : "password"} placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} onFocus={() => setShowTooltip(true)} onBlur={() => setShowTooltip(false)} className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-24 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                        />

                                        <div className="absolute right-12 top-1/2 -translate-y-1/2">

                                            <Tooltip
                                                open={showTooltip && newPassword.length > 0}
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
                                                {hasMinLength &&
                                                    hasUpperCase &&
                                                    hasNumber &&
                                                    hasSpecialChar ? (
                                                    <CheckCircleIcon className="text-green-600 cursor-pointer" />
                                                ) : (
                                                    <InfoOutlinedIcon className="text-gray-500 cursor-pointer" />
                                                )}
                                            </Tooltip>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                                        >
                                            {showNew ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                        </button>
                                    </div>


                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                                        >
                                            {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                {/* Update Button */}
                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                                >
                                    Update Password
                                </button>

                                {/* Security Info */}
                                <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
                                    <FiShield className="text-emerald-600" />
                                    <span>Your password is securely encrypted.</span>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default UpdatePassword;