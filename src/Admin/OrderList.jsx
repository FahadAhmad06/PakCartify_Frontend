import React, { useEffect, useState } from "react";

import PageTitle from "../coponents/PageTitle";

import { Edit, Trash2, PackageOpen, ChevronRight, Search, X } from "lucide-react";
import {
    Dashboard,
    AddBox,
    Inventory,
    People,
    Star,
    ShoppingCart,
    LocalPrintshop,
} from "@mui/icons-material";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
    fetchAllOrders,
    deleteOrder,
    removeErrors,
    removeSuccess,
    clearMessage
} from "../features/Admin/AdminSlice";

import { toast } from "react-toastify";

import { formatPKR } from "../utils/formatCurrency";

import Loader from "../coponents/Loader";

const navSections = [
    {
        title: "Products",
        links: [
            { to: "/admin/products", label: "All Products", icon: Inventory },
            { to: "/admin/product/create", label: "Create Products", icon: AddBox },
        ],
    },
    { title: "User", links: [{ to: "/admin/user", label: "All Users", icon: People }] },
    { title: "Orders", links: [{ to: "/admin/orders", label: "All Orders", icon: ShoppingCart }] },
    { title: "Reviews", links: [{ to: "/admin/reviews", label: "All Reviews", icon: Star }] },
];

const statusStyles = {
    Processing: "bg-yellow-100 text-yellow-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
};

const deletableStatuses = ["Processing", "Delivered"];

function OrderList() {
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();

    const { orders = [], loading, error, success, message } = useSelector(
        (state) => state.admin
    );

    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error,{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });

            dispatch(removeErrors());
        }

        if (success) {
            toast.success(message,{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });

            dispatch(removeSuccess());
            dispatch(clearMessage());
            dispatch(fetchAllOrders());
        }
    }, [dispatch, error, success, message]);

    const handleDelete = (order) => {
        if (!deletableStatuses.includes(order.orderStatus)) {
            toast.error("Only Processing or Delivered orders can be deleted", {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this order?"
        );

        if (confirmDelete) {
            dispatch(deleteOrder(order._id));
        }
    };

    const handleDeleteAll = async () => {
        if (!orders || orders.length === 0) return;

        const deletableOrders = orders.filter((order) =>
            deletableStatuses.includes(order.orderStatus)
        );

        if (deletableOrders.length === 0) {
            toast.error("No Processing or Delivered orders to delete", {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        const skippedCount = orders.length - deletableOrders.length;

        const confirmDeleteAll = window.confirm(
            skippedCount > 0
                ? `Delete ${deletableOrders.length} Processing/Delivered order(s)? ${skippedCount} Shipped order(s) will be skipped. This cannot be undone.`
                : `Are you sure you want to delete ALL ${deletableOrders.length} orders? This cannot be undone.`
        );

        if (!confirmDeleteAll) return;

        setIsDeletingAll(true);

        try {
            for (const order of deletableOrders) {
                await dispatch(deleteOrder(order._id)).unwrap();
            }

            toast.success("Selected orders deleted successfully", {
                position: "top-center",
                autoClose: 3000
            });
        } catch (err) {
            toast.error(err || "Failed to delete all orders", {
                position: "top-center",
                autoClose: 3000
            });
        } finally {
            dispatch(fetchAllOrders());
            setIsDeletingAll(false);
        }
    };

    // Filter orders by Order ID (matches full _id or the shortened #xxxxxxxx shown in the table)
    const filteredOrders = orders.filter((order) =>
        order._id?.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    return (
        <>
            <PageTitle title="All Orders" />

            <div className="min-h-screen bg-slate-100 pt-16 mt-16">
                {/* Top banner */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 mx-4 sm:mx-6 mt-6 rounded-2xl px-6 py-5 flex flex-col md:flex-row items-center md:justify-between gap-5">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-14 h-14 rounded-full bg-emerald-600 border-2 border-white/40 flex items-center justify-center text-white font-semibold text-lg">
                            {orders.length}
                        </div>
                        <div className="text-white">
                            <p className="font-semibold text-lg leading-tight">All Orders</p>
                            <p className="text-emerald-100 text-sm">Manage customer orders</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
                        <Link
                            to="/admin/shipping/print"
                            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                        >
                            <LocalPrintshop fontSize="small" />
                            Print Labels
                        </Link>

                        <button
                            type="button"
                            onClick={handleDeleteAll}
                            disabled={isDeletingAll || !orders || orders.length === 0}
                            className="flex items-center gap-2 bg-red-500/90 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                        >
                            <Trash2 size={16} />
                            {isDeletingAll ? "Deleting..." : "Delete All"}
                        </button>
                    </div>
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
                            <p className="text-white font-semibold">Admin Panel</p>
                            <p className="text-emerald-200 text-xs mt-0.5">Manage everything from here</p>
                        </div>
                        <nav className="bg-white rounded-xl p-3 space-y-4">
                            <Link
                                to="/admin/dashboard"
                                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-800 transition-colors"
                            >
                                <span className="flex items-center gap-3">
                                    <Dashboard fontSize="small" className="text-slate-400" />
                                    Dashboard
                                </span>
                                <ChevronRight size={16} className="text-slate-300" />
                            </Link>
                            {navSections.map((section) => (
                                <div key={section.title}>
                                    <h3 className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        {section.title}
                                    </h3>
                                    {section.links.map(({ to, label, icon: Icon }) => {
                                        const isActive = to === "/admin/orders";
                                        return (
                                            <Link
                                                key={to}
                                                to={to}
                                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? "bg-emerald-50 text-emerald-800"
                                                        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                                                }`}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <Icon fontSize="small" className={isActive ? "" : "text-slate-400"} />
                                                    {label}
                                                </span>
                                                <ChevronRight size={16} className="text-slate-300" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 min-w-0">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden p-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                                    <div>
                                        <h1 className="text-2xl font-bold text-emerald-700">All Orders</h1>
                                        <p className="text-slate-500 text-sm">Manage customer orders</p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
                                        {/* Search box */}
                                        <div className="relative">
                                            <Search
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search by Order ID"
                                                className="w-56 sm:w-64 pl-10 pr-9 py-2 rounded-full border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            />
                                            {searchTerm && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSearchTerm("")}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="bg-emerald-700 text-white px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap">
                                            Total: {filteredOrders.length}
                                        </div>
                                    </div>
                                </div>

                                {orders.length === 0 ? (
                                    <div className="py-20 flex flex-col items-center text-gray-500">
                                        <PackageOpen size={70} className="text-emerald-600" />
                                        <h2 className="text-2xl font-bold mt-3">No Orders Found</h2>
                                    </div>
                                ) : filteredOrders.length === 0 ? (
                                    <div className="py-20 flex flex-col items-center text-gray-500">
                                        <Search size={70} className="text-emerald-600" />
                                        <h2 className="text-2xl font-bold mt-3">No Orders Match "{searchTerm}"</h2>
                                        <button
                                            type="button"
                                            onClick={() => setSearchTerm("")}
                                            className="mt-4 text-emerald-700 font-medium hover:underline cursor-pointer"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-emerald-700 text-white">
                                                <tr>
                                                    <th className="p-4 text-left">#</th>
                                                    <th className="p-4 text-left">Order ID</th>
                                                    <th className="p-4 text-left">Status</th>
                                                    <th className="p-4 text-left">Price</th>
                                                    <th className="p-4 text-left">Items</th>
                                                    <th className="p-4 text-center">Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {filteredOrders.map((order, index) => (
                                                    <tr
                                                        key={order._id}
                                                        className="border-b hover:bg-emerald-50 transition"
                                                    >
                                                        <td className="p-4">{index + 1}</td>

                                                        <td className="p-4 font-semibold">
                                                            #{order._id.slice(-8)}
                                                        </td>

                                                        <td className="p-4">
                                                            <span
                                                                className={`px-4 py-1 rounded-full font-semibold text-sm ${
                                                                    statusStyles[order.orderStatus] ||
                                                                    "bg-slate-100 text-slate-700"
                                                                }`}
                                                            >
                                                                {order.orderStatus}
                                                            </span>
                                                        </td>

                                                        <td className="p-4 font-bold text-emerald-700">
                                                            {formatPKR(order.totalPrice)}
                                                        </td>

                                                        <td className="p-4">{order.orderItems?.length || 0}</td>

                                                        <td className="p-4">
                                                            <div className="flex justify-center gap-3">
                                                                <Link
                                                                    to={`/admin/order/${order._id}`}
                                                                    className="w-10 h-10 rounded-xl bg-blue-100 text-blue-400 flex items-center justify-center hover:bg-blue-400 hover:text-white transition"
                                                                >
                                                                    <Edit size={18} />
                                                                </Link>

                                                                <button
                                                                    onClick={() => handleDelete(order)}
                                                                    disabled={
                                                                        isDeletingAll ||
                                                                        !deletableStatuses.includes(order.orderStatus)
                                                                    }
                                                                    title={
                                                                        deletableStatuses.includes(order.orderStatus)
                                                                            ? "Delete order"
                                                                            : "Only Processing or Delivered orders can be deleted"
                                                                    }
                                                                    className="w-10 h-10 rounded-xl bg-red-100 text-red-400 flex items-center justify-center hover:bg-red-400 hover:text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}

export default OrderList;