import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, removeErrors, removeSuccess } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import {Email, Lock, Visibility, VisibilityOff,} from "@mui/icons-material";
import { FiUserPlus, FiArrowRight } from "react-icons/fi";

function Login() {

    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("");
    const { error, loading, success, isAuthenticated } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const location=useLocation()
    const redirect = new URLSearchParams(location.search).get("redirect") ||"/"

    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email: loginEmail, password: loginPassword }))
    }

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
            dispatch(removeErrors());
        }
    }, [dispatch, error])

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect)
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (success) {
            toast.success('Login Successful', { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined })
            dispatch(removeSuccess())
        }
    }, [dispatch, success])

    return (

        <div className="relative min-h-screen flex flex-col lg:flex-row bg-[#042C1D] pt-16 lg:pt-20 lg:mt-32 pb-6">

            {/* Top Right Register Button */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
                <Link
                    to="/register"
                    className="flex items-center gap-1.5 sm:gap-2 bg-white text-[#042C1D] px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold shadow-xl hover:bg-green-100 transition-all duration-300 hover:scale-105"
                >
                    <FiUserPlus className="text-base sm:text-lg" />
                    Register
                    <FiArrowRight className="text-base sm:text-lg" />
                </Link>
            </div>

            {/* Left Side - Desktop Image */}
            <div className="hidden lg:block lg:w-[60%]">
                <img
                    src="/login.png"
                    alt="Login Banner"
                    className="w-full h-screen object-cover rounded-r-[40px]"
                />
            </div>

            {/* Mobile Image */}
            <div className="lg:hidden w-full flex items-center justify-center px-4 sm:px-5 mt-14 sm:mt-16">
                <div className="w-full max-w-[1000px] h-[220px] sm:h-[320px] md:h-[420px] rounded-[24px] overflow-hidden">
                    <img
                        src="/login.png"
                        alt="Login Banner"
                        className="w-full h-full object-fill"
                    />
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-[40%] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10">

                <div className="bg-white w-full max-w-lg rounded-[24px] sm:rounded-[30px] shadow-2xl p-5 sm:p-8">

                    <div className='flex flex-col justify-center items-center'>
                        <img src="/logo1.png" alt="" className='w-[50%] sm:w-[60%] pb-4 sm:pb-5' />
                    </div>

                    <div className="text-center mb-6 sm:mb-8">

                        <h1 className="text-3xl sm:text-4xl font-bold text-[#042C1D]">
                            Welcome <span className="text-green-700">Back!</span>
                        </h1>

                        <p className="text-gray-500 mt-3 text-sm sm:text-base">
                            Login to <span className="font-semibold text-green-700">PakBazaar</span> and continue shopping.
                        </p>

                    </div>

                    <form onSubmit={loginSubmit} className="space-y-5">

                        {/* Email */}
                        <div className="relative">

                            <label className="absolute -top-2 left-3 bg-white px-2 text-sm text-gray-600 z-10">
                                Email Address <span className="text-red-500">*</span>
                            </label>

                            <Email className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700" />

                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-green-600 outline-none"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">

                            <label className="absolute -top-2 left-3 bg-white px-2 text-sm text-gray-600 z-10">
                                Password <span className="text-red-500">*</span>
                            </label>

                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700" />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-green-600 outline-none"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </button>

                        </div>

                        <div className="text-right">
                            <Link
                                to="/password/forgot"
                                className="text-green-700 text-sm sm:text-base font-medium hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-[#0B6B3A] via-[#0E5D33] to-[#15803D] py-3 text-base sm:text-lg font-semibold text-white shadow-lg hover:from-[#09592F] hover:via-[#0B6B3A] hover:to-[#166534] transition-all duration-500 disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>

                        <div className="text-center lg:hidden">
                            <Link
                                to="/register"
                                className="text-green-700 font-semibold hover:text-green-800 transition"
                            >
                                ← Back to Register
                            </Link>
                        </div>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default Login