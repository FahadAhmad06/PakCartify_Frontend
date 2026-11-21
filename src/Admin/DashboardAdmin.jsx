import React, { useEffect, useState } from "react";
import PageTitle from "../coponents/PageTitle";

import {
    AddBox,
    AttachMoney,
    Dashboard,
    Error,
    Inventory,
    People,
    Star,
} from "@mui/icons-material";

import {
    CheckCircle,
    ShoppingCart,
    ChevronRight
} from "lucide-react";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
    fetchAdminProducts,
    fetchAllOrders,
    fetchUsers
} from "../features/Admin/AdminSlice";



function DashboardAdmin() {


    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();



    const {
        products,
        orders,
        users,
        totalAmount,
        loading
    } = useSelector((state) => state.admin);



    // Fetch Dashboard Data

    useEffect(() => {

        dispatch(fetchAdminProducts());
        dispatch(fetchAllOrders());
        dispatch(fetchUsers());

    }, [dispatch]);





    const navSections = [
        {
            title: "Products",
            links: [
                {
                    to: "/admin/products",
                    label: "All Products",
                    icon: Inventory
                },
                {
                    to: "/admin/product/create",
                    label: "Create Products",
                    icon: AddBox
                },
            ],
        },


        {
            title: "User",
            links: [
                {
                    to: "/admin/user",
                    label: "All Users",
                    icon: People
                }
            ]
        },


        {
            title: "Orders",
            links: [
                {
                    to: "/admin/orders",
                    label: "All Orders",
                    icon: ShoppingCart
                }
            ]
        },


        {
            title: "Reviews",
            links: [
                {
                    to: "/admin/reviews",
                    label: "All Reviews",
                    icon: Star
                }
            ]
        },

    ];
    return (

        <>

            <PageTitle title="Admin Dashboard" />

            <div className="min-h-screen bg-slate-100 mt-16 pt-16">

                {/* Top Banner */}

                <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 mx-4 sm:mx-6 mt-6 rounded-2xl px-6 py-5 flex items-center justify-between">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-full bg-emerald-600 border-2 border-white/40 flex items-center justify-center text-white font-semibold text-lg">

                            PC

                        </div>

                        <div className="text-white">

                            <p className="font-semibold text-lg">
                                Store Overview
                            </p>

                            <p className="text-emerald-100 text-sm">
                                Everything happening in your store, at a glance
                            </p>

                        </div>

                    </div>

                    <Link
                        to="/"
                        className="bg-white text-emerald-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-50 transition"
                    >
                        View Store

                    </Link>

                </div>

                <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 py-6">

                    {/* Sidebar */}

                    
                    <div className="lg:hidden w-full mb-4">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="w-full bg-emerald-800 text-white rounded-xl px-5 py-4 flex items-center justify-between shadow-md"
                        >
                            <span className="flex items-center gap-3 font-semibold">
                                Admin Menu
                            </span>
                            <span className={`transition-transform duration-300 ${showMenu ? "rotate-90" : ""}`}>▶</span>
                        </button>
                    </div>
                    <aside className={`w-full lg:w-64 shrink-0 ${showMenu ? "block" : "hidden"} lg:block self-start sticky top-32 max-h-[calc(100vh-3rem)] overflow-y-auto`}>

                        <div className="bg-emerald-800 rounded-xl px-5 py-4 mb-3">

                            <p className="text-white font-semibold">
                                Admin Panel
                            </p>

                            <p className="text-emerald-200 text-xs mt-0.5">
                                Manage everything from here
                            </p>

                        </div>

                        <nav className="bg-white rounded-xl p-3 space-y-4">

                            <Link
                                to="/admin/dashboard"
                                className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 font-medium text-sm"
                            >

                                <span className="flex items-center gap-3">

                                    <Dashboard fontSize="small" />

                                    Dashboard

                                </span>

                                <ChevronRight size={16} />

                            </Link>

                            {
                                navSections.map((section) => (


                                    <div key={section.title}>


                                        <h3 className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">

                                            {section.title}

                                        </h3>
                                        {
                                            section.links.map(
                                                ({to,label,icon: Icon
                                                }) => (

                                                    <Link key={to} to={to} className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-800 transition">
                                                        <span className="flex items-center gap-3">

                                                            <Icon fontSize="small" className="text-slate-400"
                                                            />

                                                            {label}

                                                        </span><ChevronRight size={16} className="text-slate-300"/>
                                                    </Link>
                                                ))
                                        }
                                    </div>
                                ))
                            }
                        </nav>

                    </aside>

                    {/* Main Content Start */}

                    <main className="flex-1 min-w-0">

                        {/* Dashboard Heading */}

                        <h1 className="text-xl font-semibold text-slate-800">
                            Dashboard
                        </h1>

                        <p className="text-sm text-slate-500 mb-5">
                            Welcome back! Here's your store overview.
                        </p>

                        {/* Dynamic Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                            {
                                [
                                    {label: "Total Products",value: products?.length || 0,icon: Inventory},

                                    {label: "Total Orders",value: orders?.length || 0,icon: ShoppingCart},

                                    {label: "Total Reviews",value:products?.reduce((total, item) =>total + (item.numOfReviews || 0),0) || 0,icon: Star},

                                    {label: "Total Revenue",value: `Rs. ${Number(totalAmount || 0).toFixed(2)}`,icon: AttachMoney},
                                    {label: "Out Of Stock",value:products?.filter(item => item.stock === 0).length || 0,icon: Error},

                                    {label: "In Stock", value:products?.filter(item => item.stock > 0).length || 0,icon: CheckCircle}

                                ].map(({ label, value, icon: Icon }) => (
                                    <div key={label} className="bg-white rounded-xl border border-slate-200 p-4"
                                    >
                                        <Icon className="text-emerald-700 mb-2" fontSize="small"
                                        />
                                        <p className="text-lg font-bold text-slate-800">
                                            {value}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {label}
                                        </p>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            {/* Store Information */}
                            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-semibold text-slate-800">
                                        Store Information
                                    </h2>
                                    <button className="text-xs text-emerald-700 font-medium hover:underline">
                                        Edit
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 rounded-lg px-4 py-3">
                                        <p className="text-xs text-slate-400">
                                            Store Name
                                        </p>
                                        <p className="text-sm font-medium text-slate-800 mt-0.5">
                                            PakCartify
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg px-4 py-3">
                                        <p className="text-xs text-slate-400">
                                            Support Email
                                        </p>
                                        <p className="text-sm font-medium text-slate-800 mt-0.5">
                                            support@pakcartify.com
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg px-4 py-3">
                                        <p className="text-xs text-slate-400">
                                            Products Listed
                                        </p>
                                        <p className="text-sm font-medium text-slate-800 mt-0.5">
                                            {products?.length || 0}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg px-4 py-3">
                                        <p className="text-xs text-slate-400">
                                            Last Order
                                        </p>
                                        <p className="text-sm font-medium text-slate-800 mt-0.5">
                                            {orders?.[0]?.createdAt?new Date(orders[0].createdAt).toLocaleDateString():"No Orders"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}

                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <h2 className="font-semibold text-slate-800 mb-4">
                                    Quick Actions
                                </h2>
                                <div className="space-y-2">
                                    {
                                        [
                                            {label: "Create Product", to: "/admin/product/create", icon: AddBox
                                            },
                                            {label: "All Orders", to: "/admin/orders", icon: ShoppingCart
                                            },
                                            {label: "All Reviews", to: "/admin/reviews",icon: Star
                                            },
                                            {label: "All Users",to: "/admin/user",icon: People}
                                        ].map(({ label, to, icon: Icon }) => (
                                            <Link key={label} to={to} className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 transition"
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <Icon fontSize="small" className="text-emerald-700"
                                                    />
                                                    {label}
                                                </span><ChevronRight size={16} className="text-slate-300"
                                                />
                                            </Link>
                                        ))
                                    }
                                </div>

                            </div>

                        </div>
                        {/* Recent Orders */}

                        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">

                            <div className="flex items-center justify-between mb-3">

                                <h2 className="font-semibold text-slate-800">
                                    Recent Orders
                                </h2>
                                <Link
                                    to="/admin/orders"
                                    className="text-xs text-emerald-700 font-medium hover:underline"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {orders?.length > 0 ? (orders.slice(0, 5).map((order) => (
                                            <div
                                                key={order._id}
                                                className="flex items-center justify-between py-3">
                                                <div>
                                                    <p className="text-sm font-medium text-emerald-700">
                                                        #{order._id.slice(-6)}
                                                    </p>
                                                    <p
                                                        className={`text-xs mt-1 ${order.orderStatus === "Delivered"? "text-emerald-600":order.orderStatus === "Shipped"?"text-blue-600":"text-amber-600"}`}
                                                    >
                                                        {order.orderStatus}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Rs. {Number(order.totalPrice).toFixed(2)}
                                                </p>
                                            </div>
                                        ))
                                    ):(

                                            <div className="py-10 text-center">

                                                <p className="text-gray-400">
                                                    No Orders Found
                                                </p>

                                            </div>
                                        )
                                }
                            </div>
                        </div>
                        {/* Help Banner */}
                        <div
                            className="bg-gradient-to-r from-emerald-800 to-emerald-700 rounded-xl px-6 py-5 flex items-center justify-between flex-wrap gap-4">
                            <div className="text-white">
                                <p className="font-semibold">
                                    Need Help?
                                </p>
                                <p className="text-emerald-100 text-sm mt-0.5">
                                    Questions about products, orders, or payments?
                                    Our team is ready to help.
                                </p>
                            </div>
                            <Link
                                to="/contact-us"
                                className="bg-white text-emerald-800 text-smfont-medium px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
                                Contact Support
                            </Link>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}
export default DashboardAdmin;