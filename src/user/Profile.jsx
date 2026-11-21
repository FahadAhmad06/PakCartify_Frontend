import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../coponents/Loader";
import PageTitle from "../coponents/PageTitle";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import EditIcon from "@mui/icons-material/Edit";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { logout, removeSuccess } from "../features/user/userSlice";
import { removeErrors } from "../features/user/userSlice";
import { toast } from "react-toastify";
import { getAllMyOrders } from "../features/order/OrderSlice";  

function Profile() {

    const [showMenu, setShowMenu] = useState(false);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { loading, isAuthenticated, user } = useSelector(
        (state) => state.user
    );

    const { favorites } = useSelector(
        (state) => state.favorite
    );

    const orders = useSelector((state) => state.order?.orders);

    
    useEffect(() => {

        if (!isAuthenticated) {

            navigate("/login");

        }

    }, [isAuthenticated, navigate]);

    useEffect(() => {
    if (isAuthenticated) {
        dispatch(getAllMyOrders());
    }
}, [dispatch, isAuthenticated]);

    function logoutUser() {
        dispatch(logout())
            .unwrap()
            .then(() => {
                toast.success('Logout Successful', {
                    position: 'top-center', autoClose: 3000,
                    closeOnClick: true, pauseOnHover: true,
                    draggable: true, progress: undefined
                })
                dispatch(removeSuccess())
                navigate('/login')
            })
            .catch((error) => {
                toast.error(error.message || 'Unable to log out. Please try again', {
                    position: 'top-center', autoClose: 3000,
                    closeOnClick: true, pauseOnHover: true,
                    draggable: true, progress: undefined
                })
                dispatch(removeErrors())
                navigate('/login')
            })
    }

    return (

        <>

            {

                loading ?

                    (<Loader />)


                    :

                    <div className="min-h-screen bg-[#F7F9FA] pt-16 mt-20 pb-14">

                        <PageTitle title="My Profile" />

                        <div className="max-w-7xl mx-auto px-5">
                            <div className="rounded-3xl bg-gradient-to-r from-[#0E5D33] to-[#1D8A4A] p-8 shadow-xl">

                                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">

                                    <div className="flex items-center gap-6">

                                        <img

                                            src={user?.avatar?.url || "/profile.png"}

                                            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover"

                                        />

                                        <div>

                                            <h1 className="text-2xl md:text-4xl font-bold text-white">

                                                {user.name}

                                            </h1>

                                            <div className="mt-4 space-y-2 text-green-100">

                                                <div className="flex items-center gap-2">

                                                    <EmailOutlinedIcon fontSize="small" />

                                                    {user.email}

                                                </div>

                                                <div className="flex items-center gap-2">

                                                    <PhoneOutlinedIcon fontSize="small" />

                                                    {user.phone}

                                                </div>

                                                <div className="flex items-center gap-2">

                                                    <CalendarMonthOutlinedIcon fontSize="small" />

                                                    Joined {String(user.createdAt).substring(0, 10)}

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <Link

                                        to="/profile/update"

                                        className="mt-4 lg:mt-0 w-full sm:w-auto text-center bg-white text-[#0E5D33] px-7 py-3 rounded-xl font-semibold shadow"

                                    >

                                        Edit Profile

                                    </Link>

                                </div>

                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-5 lg:gap-4 mt-6 lg:mt-8 items-start px-4 lg:px-0">

                            {/* Mobile Menu */}

                            <div className="lg:hidden mb-6">

                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="w-full bg-[#0E5D33] text-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg"
                                >

                                    <span className="flex items-center gap-3 font-semibold">

                                        <DashboardIcon />

                                        My Account

                                    </span>

                                    <ChevronRightIcon
                                        className={`transition-transform duration-300 ${showMenu ? "rotate-90" : ""
                                            }`}
                                    />

                                </button>

                            </div>

                            {/* Sidebar */}

                            <div
                                className={`bg-white rounded-3xl border border-gray-100 ml-2 shadow-md overflow-hidden ${showMenu ? "block" : "hidden"} lg:block lg:sticky lg:top-28`}>

                                <div className="bg-[#0E5D33] px-6 py-7 border-b border-green-700">

                                    <h2 className="text-2xl font-bold text-white">

                                        My Account

                                    </h2>

                                    <p className="text-green-100 text-sm mt-2">

                                        Manage everything from here

                                    </p>

                                </div>

                                <div className="py-3">

                                    <Link
                                        to="/profile"
                                        className="group flex items-center justify-between px-6 py-4 border-l-4 border-[#0E5D33] bg-[#F5FAF7] text-[#0E5D33] font-semibold"
                                    >

                                        <span className="flex items-center gap-4 text-gray-700 group-hover:text-[#0E5D33] font-medium">

                                            <DashboardIcon fontSize="small" />

                                            Dashboard

                                        </span>

                                        <ChevronRightIcon fontSize="small" />

                                    </Link>

                                    <Link
                                        to="/order/user"
                                        className="group flex items-center justify-between px-6 py-4 border-l-4 border-transparent hover:border-[#0E5D33] hover:bg-[#F5FAF7] transition-all duration-300"
                                    >

                                        <span className="flex items-center gap-4 text-gray-700 hover:text-white group-hover:text-[#0E5D33] font-medium">

                                            <ShoppingBagOutlinedIcon fontSize="small" />

                                            My Orders

                                        </span>

                                        <ChevronRightIcon fontSize="small" />

                                    </Link>

                                    <Link
                                        to="/wishlist"
                                        className="group flex items-center justify-between px-6 py-4 border-l-4 border-transparent hover:border-[#0E5D33] hover:bg-[#F5FAF7] transition-all duration-300"
                                    >

                                        <span className="flex items-center gap-4 text-gray-700 group-hover:text-[#0E5D33] font-medium">

                                            <FavoriteBorderOutlinedIcon fontSize="small" />

                                            Wishlist

                                        </span>

                                        <span className="min-w-[28px] h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-semibold">

                                            {favorites?.length || 0}

                                        </span>

                                    </Link>

                                    <Link
                                        to="/profile/update"
                                        className="group flex items-center justify-between px-6 py-4 border-l-4 border-transparent hover:border-[#0E5D33] hover:bg-[#F5FAF7] transition-all duration-300"
                                    >

                                        <span className="flex items-center gap-4 text-gray-700 group-hover:text-[#0E5D33] font-medium">

                                            <EditIcon fontSize="small" />

                                            Edit Profile

                                        </span>

                                        <ChevronRightIcon fontSize="small" />

                                    </Link>

                                    <Link
                                        to="/password/update"
                                        className="group flex items-center justify-between px-6 py-4 border-l-4 border-transparent hover:border-[#0E5D33] hover:bg-[#F5FAF7] transition-all duration-300"
                                    >

                                        <span className="flex items-center gap-4 text-gray-700 group-hover:text-[#0E5D33] font-medium">

                                            <LockOutlinedIcon fontSize="small" />

                                            Password

                                        </span>

                                        <ChevronRightIcon fontSize="small" />

                                    </Link>

                                    <Link
                                        to="/contact-Us"
                                        className="group flex items-center justify-between px-6 py-4 border-l-4 border-transparent hover:border-[#0E5D33] hover:bg-[#F5FAF7] transition-all duration-300"
                                    >

                                        <span className="flex items-center gap-4 text-gray-700 group-hover:text-[#0E5D33] font-medium">

                                            <ContactSupportOutlinedIcon fontSize="small" />

                                            Contact Us

                                        </span>

                                        <ChevronRightIcon fontSize="small" />

                                    </Link>

                                    <button
                                        onClick={logoutUser}
                                        className="w-[calc(100%-32px)] mx-4 mt-4 mb-4 flex items-center justify-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 text-white py-3 font-semibold transition-all duration-300 cursor-pointer"
                                    >

                                        <LogoutIcon fontSize="small" />

                                        Logout

                                    </button>

                                </div>

                            </div>

                            {/* Right Side */}

                            <div className="space-y-5 pr-2 mr-3">

                                <div className="flex items-center justify-between mb-4">

                                    <div>

                                        <h2 className="text-3xl font-bold">

                                            Dashboard

                                        </h2>

                                        <p className="text-gray-500 mt-1">

                                            Welcome back! Here's your account overview.

                                        </p>

                                    </div>

                                </div>

                                {/* Dashboard Cards */}

                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                                    <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                                        <ShoppingBagOutlinedIcon
                                            className="text-[#0E5D33]"
                                            sx={{ fontSize: 40 }}
                                        />

                                        <h2 className="text-4xl font-bold mt-5">

                                            {orders?.length || 0}

                                        </h2>

                                        <p className="text-gray-500 mt-2">

                                            Orders

                                        </p>

                                    </div>

                                    <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                                        <FavoriteBorderOutlinedIcon
                                            className="text-red-500"
                                            sx={{ fontSize: 40 }}
                                        />

                                        <h2 className="text-4xl font-bold mt-5">

                                            {favorites?.length || 0}

                                        </h2>

                                        <p className="text-gray-500 mt-2">

                                            Wishlist

                                        </p>

                                    </div>

                                    <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                                        <CalendarMonthOutlinedIcon
                                            className="text-blue-500"
                                            sx={{ fontSize: 40 }}
                                        />

                                        <h2 className="text-lg font-bold mt-5">

                                            {user.createdAt
                                                ? String(user.createdAt).substring(0, 10)
                                                : "N/A"}

                                        </h2>

                                        <p className="text-gray-500 mt-2">

                                            Member Since

                                        </p>

                                    </div>

                                    <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                                        <EditIcon
                                            className="text-yellow-500"
                                            sx={{ fontSize: 40 }}
                                        />

                                        <h2 className="text-lg font-bold mt-5">

                                            Profile

                                        </h2>

                                        <p className="text-gray-500 mt-2">

                                            Keep your details updated

                                        </p>

                                    </div>

                                </div>
                                {/* Account Information + Quick Actions */}

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
                                    {/* Account Information */}

                                    <div className="xl:col-span-2 bg-white rounded-3xl shadow-lg p-8">

                                        <div className="flex items-center justify-between mb-8">

                                            <h2 className="text-2xl font-bold text-gray-800">

                                                Account Information

                                            </h2>

                                            <Link
                                                to="/profile/update"
                                                className="text-[#0E5D33] font-semibold hover:underline"
                                            >

                                                Edit

                                            </Link>

                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">

                                            <div className="bg-gray-50 rounded-2xl p-6 hover:bg-green-50 transition-all duration-300">

                                                <p className="text-gray-500 text-sm">

                                                    Full Name

                                                </p>

                                                <h3 className="text-lg font-semibold mt-2">

                                                    {user.name}

                                                </h3>

                                            </div>

                                            <div className="bg-gray-50 rounded-2xl p-5">

                                                <p className="text-gray-500 text-sm">

                                                    Email Address

                                                </p>

                                                <h3 className="text-lg font-semibold mt-2 break-all">

                                                    {user.email}

                                                </h3>

                                            </div>

                                            <div className="bg-gray-50 rounded-2xl p-5">

                                                <p className="text-gray-500 text-sm">

                                                    Phone Number

                                                </p>

                                                <h3 className="text-lg font-semibold mt-2">

                                                    {user.phone || "Not Added"}

                                                </h3>

                                            </div>

                                            <div className="bg-gray-50 rounded-2xl p-5">

                                                <p className="text-gray-500 text-sm">

                                                    Joined On

                                                </p>

                                                <h3 className="text-lg font-semibold mt-2">

                                                    {user.createdAt
                                                        ? String(user.createdAt).substring(0, 10)
                                                        : "N/A"}

                                                </h3>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Quick Actions */}

                                    <div className="bg-white rounded-3xl shadow-lg p-8">

                                        <h2 className="text-2xl font-bold mb-6">

                                            Quick Actions

                                        </h2>

                                        <div className="space-y-4">

                                            <Link
                                                to="/order/user"
                                                className="flex justify-between items-center p-4 rounded-xl border hover:bg-[#0E5D33] text-black hover:text-white shadow-lg transition"
                                            >

                                                <span className="flex items-center gap-4 text-gray-700 hover:text-white group-hover:text-[#0E5D33] font-medium">

                                                    <ShoppingBagOutlinedIcon />

                                                    My Orders

                                                </span>

                                                <ChevronRightIcon />

                                            </Link>

                                            <Link
                                                to="/wishlist"
                                                className="flex justify-between items-center p-4 rounded-xl border hover:bg-red-50 transition"
                                            >

                                                <span className="flex items-center gap-4 text-gray-700 group-hover:text-[#0E5D33] font-medium">

                                                    <FavoriteBorderOutlinedIcon />

                                                    Wishlist

                                                </span>

                                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">

                                                    {favorites?.length || 0}

                                                </span>

                                            </Link>

                                            <Link
                                                to="/profile/update"
                                                className="flex justify-between items-center p-4 rounded-xl border hover:bg-blue-50 transition"
                                            >

                                                <span className="flex items-center gap-4 text-gray-700 group-hover:text-[#0E5D33] font-medium">

                                                    <EditIcon />

                                                    Edit Profile

                                                </span>

                                                <ChevronRightIcon />

                                            </Link>

                                            <Link
                                                to="/password/update"
                                                className="flex justify-between items-center p-4 rounded-xl border hover:bg-yellow-50 transition"
                                            >

                                                <span className="flex items-center gap-4 text-gray-700 group-hover:text-[#0E5D33] font-medium">

                                                    <LockOutlinedIcon />

                                                    Change Password

                                                </span>

                                                <ChevronRightIcon />

                                            </Link>

                                        </div>

                                    </div>

                                </div>

                                {/* Recent Orders */}

                                <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-5 md:p-8">

                                    <div className="flex justify-between items-center mb-6">

                                        <h2 className="text-2xl font-bold">

                                            Recent Orders

                                        </h2>

                                        <Link
                                            to="/order/user"
                                            className="text-[#0E5D33] font-semibold"
                                        >

                                            View All →

                                        </Link>

                                    </div>

                                    {

                                        orders?.length > 0 ?

                                            (

                                                orders.slice(0, 5).map((order) => (

                                                    <div
                                                        key={order._id}
                                                        className="flex justify-between items-center py-5 px-2 rounded-xl hover:bg-gray-50 border-b last:border-none transition-all"
                                                    >

                                                        <div>

                                                            <h3 className="font-semibold">

                                                                #{order._id.slice(-6)}

                                                            </h3>

                                                            <p className="text-gray-500 text-sm">

                                                                {order.orderStatus}

                                                            </p>

                                                        </div>

                                                        <div className="text-right">

                                                            <h3 className="font-bold text-[#0E5D33]">

                                                                Rs. {order.totalPrice}

                                                            </h3>

                                                        </div>

                                                    </div>

                                                ))

                                            )

                                            :

                                            (

                                                <div className="text-center py-12">

                                                    <ShoppingBagOutlinedIcon
                                                        sx={{ fontSize: 70 }}
                                                        className="text-gray-300"
                                                    />

                                                    <h3 className="text-xl font-semibold mt-4">

                                                        No Orders Yet

                                                    </h3>

                                                    <p className="text-gray-500 mt-2">

                                                        Your latest orders will appear here.

                                                    </p>

                                                </div>

                                            )

                                    }

                                </div>
                                {/* Need Help */}

                                <div className="bg-gradient-to-r from-[#0E5D33] via-[#12713f] to-[#19934f] rounded-3xl p-10 shadow-xl">

                                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

                                        <div>

                                            <h2 className="text-3xl font-bold text-white">

                                                Need Help?

                                            </h2>

                                            <p className="text-green-100 mt-2 max-w-xl">

                                                Have questions about your account, orders or payments?
                                                Our support team is always ready to help you.

                                            </p>

                                        </div>

                                        <Link
                                            to="/contact-Us"
                                            className="bg-white text-[#0E5D33] hover:bg-gray-100 px-7 py-3 rounded-2xl font-semibold shadow-lg transition duration-300"
                                        >

                                            Contact Us

                                        </Link>

                                    </div>

                                </div>
                                {/* Right Content End */}

                            </div>

                            {/* Grid End */}

                        </div>

                        

                    </div>

            }

        </>

    );

}

export default Profile;