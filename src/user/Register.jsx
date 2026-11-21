import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import {
    register,
    removeErrors,
} from '../features/user/userSlice'
import { Person, Email, Lock, Visibility, VisibilityOff, } from "@mui/icons-material";
import PhoneIcon from "@mui/icons-material/Phone";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function Register() {

    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const [avatar, setAvatar] = useState("")
    const [avatarPreview, setAvatarPreview] = useState('/profile.png');
    const [avatarName, setAvatarName] = useState("");

    const { name, email, phone, password } = user;

    const { loading, error, otpSent, pendingEmail } = useSelector(state => state.user)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const registerDataChange = (e) => {

        if (e.target.name === "avatar") {

            const file = e.target.files[0];
            if (!file) return;

            setAvatarName(file.name);

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };

            reader.readAsDataURL(file);

        } else {
            setUser({
                ...user,
                [e.target.name]: e.target.value
            });
        }

    };

    const registerSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !phone || !password) {
            toast.error('Please fill out all required fields', { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined })
            return;
        }
        const myForm = new FormData();
        myForm.set('name', name)
        myForm.set('email', email)
        myForm.set("phone", phone);
        myForm.set('password', password)
        myForm.set('avatar', avatar)

        for (let pair of myForm.entries()) {
            console.log(pair);
        }

        if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
            toast.error(
                "Password must contain at least 8 characters, 1 uppercase letter, 1 number and 1 special character (@).", { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined }
            );
            return;
        }

        dispatch(register(myForm));
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
            dispatch(removeErrors());
        }
    }, [dispatch, error])

    useEffect(() => {
        if (otpSent && pendingEmail) {
            toast.info('OTP sent to your email. Valid for 1 minute.', {
                position: 'top-center',
                autoClose: 3000,
            });
            navigate('/register/verify', { state: { email: pendingEmail } });
        }
    }, [otpSent, pendingEmail, navigate]);



    return (
        <div className="relative min-h-screen flex flex-col lg:flex-row bg-[#042C1D] pt-16 lg:pt-20  lg:mt-32 pb-6 ">

            {/* Top Right Login Button */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
                <Link
                    to="/login"
                    className="bg-white text-[#042C1D] px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold shadow-xl hover:bg-green-100 transition-all duration-300"
                >
                    Login →
                </Link>
            </div>

            {/* Left Side - Desktop Image */}
            <div className="hidden lg:block lg:w-[60%]">
                <img
                    src="/signup.png"
                    alt="Signup Banner"
                    className="w-full h-full object-fill rounded-r-[40px]"
                />
            </div>

            {/* Mobile Image */}
            <div className="lg:hidden w-full flex items-center justify-center px-4 sm:px-5 mt-14 sm:mt-16">
                <div className="w-full max-w-[1000px] h-[220px] sm:h-[320px] md:h-[420px] rounded-[24px] overflow-hidden">
                    <img
                        src="/signup.png"
                        alt="Signup Banner"
                        className="w-full h-full object-fill"
                    />
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-[40%] flex items-center justify-center px-4 sm:px-5 py-8 lg:py-0">

                <div className="bg-white w-full max-w-lg rounded-[24px] sm:rounded-[30px] shadow-2xl p-5 sm:p-8">

                    <div className="text-center mb-6 sm:mb-8">

                        <h1 className="text-3xl sm:text-4xl font-bold text-[#042C1D]">
                            Create Your <span className="text-green-700">Account</span>
                        </h1>

                        <p className="text-gray-500 mt-3 text-sm sm:text-base">
                            Join <span className="font-semibold text-green-700">PakBazaar</span> and start
                            shopping with thousands of amazing products.
                        </p>

                    </div>

                    <form onSubmit={registerSubmit} className="space-y-5">

                        <div className="relative mb-4">
                            <label className="absolute -top-2 left-3 bg-white px-2 text-sm text-gray-600 z-10">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <Person className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700" />

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={registerDataChange}
                                className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-green-600 outline-none"
                            />
                        </div>

                        <div className="relative mb-4">
                            <label className="absolute -top-2 left-3 bg-white px-2 text-sm text-gray-600 z-10">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <Email className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700" />

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={registerDataChange}
                                className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-green-600 outline-none"
                            />
                        </div>

                        <div className="relative mb-5">
                            <label className="absolute -top-2 left-3 bg-white px-2 text-sm text-gray-600 z-10">
                                Phone Number <span className="text-red-500">*</span>
                            </label>

                            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700" />

                            <input
                                type="tel"
                                name="phone"
                                placeholder="03XXXXXXXXX"
                                value={phone}
                                onChange={registerDataChange}
                                className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                            />
                        </div>

                        <div className="relative mb-5">
                            <label className="absolute -top-2 left-3 bg-white px-2 text-sm text-gray-600 z-10">
                                Password <span className="text-red-500">*</span>
                            </label>

                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700" />

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={password}
                                onFocus={() => setShowTooltip(true)}
                                onBlur={() => setShowTooltip(false)}
                                onChange={registerDataChange}
                                className="w-full pl-12 pr-24 py-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-green-600 outline-none"
                            />

                            <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                <Tooltip
                                    open={showTooltip && password.length > 0}
                                    placement="right"
                                    arrow
                                    title={
                                        <div className="text-sm space-y-2 p-1">

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
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </button>

                        </div>

                        {/* Upload Image */}
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 sm:p-5">

                            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                Profile Picture
                            </h3>

                            <div className="flex flex-wrap items-center justify-between gap-3">

                                <div className="flex items-center gap-3 sm:gap-4">

                                    <img
                                        src={avatarPreview}
                                        alt="Avatar"
                                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-green-600 object-cover shrink-0"
                                    />

                                    <div>
                                        <p className="text-sm font-medium text-gray-700 break-all">
                                            {avatarName || "No file selected"}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            PNG, JPG or JPEG
                                        </p>
                                    </div>

                                </div>

                                <label
                                    htmlFor="avatar"
                                    className="cursor-pointer rounded-xl bg-[#0E5D33] px-4 py-2 sm:px-5 text-sm sm:text-base text-white font-medium hover:bg-[#084424] transition"
                                >
                                    Browse
                                </label>

                            </div>

                            <input
                                id="avatar"
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={registerDataChange}
                                className="hidden"
                            />

                            <div className="mt-4 h-10">
                                {avatar ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAvatar("");
                                            setAvatarName("");
                                            setAvatarPreview("/profile.png");
                                            document.getElementById("avatar").value = "";
                                        }}
                                        className="w-full rounded-xl bg-red-500 py-2 text-white text-sm sm:text-base hover:bg-red-600 transition cursor-pointer"
                                    >
                                        Remove Picture
                                    </button>
                                ) : null}
                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-[#0B6B3A] via-[#0E5D33] to-[#15803D] py-3 text-base sm:text-lg font-semibold text-white shadow-lg hover:from-[#09592F] hover:via-[#0B6B3A] hover:to-[#166534] transition-all duration-500 disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                        <div className="text-center lg:hidden">
                            <Link
                                to="/login"
                                className="text-green-700 font-semibold hover:text-green-800 transition"
                            >
                                ← Back to Login
                            </Link>
                        </div>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default Register