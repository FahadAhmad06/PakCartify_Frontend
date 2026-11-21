import React, { useEffect, useState } from "react";
import PageTitle from "../coponents/PageTitle";
import {Search,Star,Trash2,MessageSquare,RefreshCw,ChevronRight,} from "lucide-react";
import {Dashboard,AddBox,Inventory,People,Star as StarIcon,ShoppingCart,} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {fetchAdminProducts,fetchProductReviews,deleteReview,removeErrors,removeSuccess,} from "../features/Admin/AdminSlice";

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
    { title: "Reviews", links: [{ to: "/admin/reviews", label: "All Reviews", icon: StarIcon }] },
];

const ReviewList = () => {
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteReviewId, setDeleteReviewId] = useState("");

    const {products,loading,success,message,error,} = useSelector((state) => state.admin);

    const [selectedProduct, setSelectedProduct] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const filteredProducts = (products || []).filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (selectedProduct) {
            dispatch(fetchProductReviews(selectedProduct));
        }
    }, [dispatch, selectedProduct]);

    const product = (products || []).find((item) => item._id === selectedProduct);

    const deleteReviewHandler = () => {
        dispatch(
            deleteReview({
                reviewId: deleteReviewId,
                productId: selectedProduct,
            })
        );
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {position: "top-center",autoClose: 3000,closeOnClick: true,pauseOnHover: true,draggable: true,
            });
            dispatch(removeErrors());
        }

        if (success) {
            toast.success(message || "Review Deleted Successfully", {position: "top-center",autoClose: 3000,closeOnClick: true,pauseOnHover: true,draggable: true,
            });
            dispatch(removeSuccess());
            setShowDeleteModal(false);
            setDeleteReviewId("");
            if (selectedProduct) {
                dispatch(fetchProductReviews(selectedProduct));
            }
        }
    }, [dispatch, success, error, message, selectedProduct]);

    return (
        <>
            <PageTitle title="Product Reviews" />

            <div className="min-h-screen bg-slate-100 pt-16 mt-16">

                {/* Top banner */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 mx-4 sm:mx-6 mt-6 rounded-2xl px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-600 border-2 border-white/40 flex items-center justify-center text-white font-semibold text-lg">
                            <StarIcon fontSize="medium" />
                        </div>
                        <div className="text-white">
                            <p className="font-semibold text-lg leading-tight">Product Reviews</p>
                            <p className="text-emerald-100 text-sm">View and manage product reviews</p>
                        </div>
                    </div>

                    <button
                        onClick={() => dispatch(fetchAdminProducts())}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl transition-all"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
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
                                        const isActive = to === "/admin/reviews";
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

                        {/* Search */}
                        <div className="bg-white rounded-2xl shadow p-6 mb-6">
                            <div className="grid lg:grid-cols-2 gap-6">

                                <div className="relative">
                                    <Search
                                        className="absolute left-4 top-3.5 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search Product..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-12 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <select
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                >
                                    <option value="">Select Product</option>
                                    {filteredProducts.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>

                        {/* Product Card */}
                        {product && (
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                                <div className="p-6 flex flex-col lg:flex-row lg:items-center gap-8">

                                    <div className="flex gap-5 items-center">
                                        <img
                                            src={product.image?.[0]?.url}
                                            alt={product.name}
                                            className="w-32 h-32 rounded-xl object-cover border"
                                        />

                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                {product.name}
                                            </h2>
                                            <p className="text-gray-500 mt-2">
                                                {product.category}
                                            </p>
                                            <p className="font-semibold text-emerald-600 mt-2">
                                                Rs. {product.price}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-5 flex-1">

                                        <div className="border rounded-xl p-5 text-center">
                                            <MessageSquare
                                                className="mx-auto text-emerald-600"
                                                size={30}
                                            />
                                            <h3 className="text-3xl font-bold mt-2">
                                                {product.numOfReviews}
                                            </h3>
                                            <p className="text-gray-500">Reviews</p>
                                        </div>

                                        <div className="border rounded-xl p-5 text-center">
                                            <Star
                                                className="mx-auto text-yellow-400 fill-yellow-400"
                                                size={30}
                                            />
                                            <h3 className="text-3xl font-bold mt-2">
                                                {(product.ratings ?? 0).toFixed(1)}
                                            </h3>
                                            <p className="text-gray-500">Rating</p>
                                        </div>

                                        <div className="border rounded-xl p-5 text-center">
                                            <h3 className="text-3xl font-bold text-emerald-600">
                                                {product.stock}
                                            </h3>
                                            <p className="text-gray-500">Stock</p>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        {selectedProduct && (
                            <div className="bg-white rounded-2xl shadow-lg">

                                <div className="border-b px-6 py-5">
                                    <h2 className="text-2xl font-bold">
                                        Customer Reviews
                                    </h2>
                                </div>

                                <div className="divide-y">
                                    {loading ? (
                                        <div className="py-16 flex justify-center">
                                            <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : product?.reviews?.length > 0 ? (
                                        product.reviews.map((review) => (
                                            <div
                                                key={review._id}
                                                className="flex flex-col lg:flex-row justify-between gap-6 p-6 hover:bg-slate-50 transition"
                                            >
                                                <div className="flex gap-5 flex-1">
                                                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700">
                                                        {review.name?.charAt(0)}
                                                    </div>

                                                    <div>
                                                        <h2 className="text-lg font-bold">
                                                            {review.name}
                                                        </h2>

                                                        <div className="flex items-center gap-1 mt-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    size={18}
                                                                    className={`${
                                                                        star <= review.rating
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300"
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>

                                                        <p className="mt-3 text-gray-600">
                                                            {review.comment}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => {
                                                            setDeleteReviewId(review._id);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition px-5 py-3 rounded-xl"
                                                    >
                                                        <Trash2 size={18} />
                                                        Delete Review
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center">
                                            <MessageSquare
                                                className="mx-auto text-gray-300"
                                                size={70}
                                            />
                                            <h2 className="mt-5 text-2xl font-bold">
                                                No Reviews Found
                                            </h2>
                                            <p className="text-gray-500 mt-2">
                                                This product doesn't have any reviews yet.
                                            </p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}

                    </main>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                    <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-8">

                        <div className="flex justify-center">
                            <div className="bg-red-100 p-4 rounded-full">
                                <Trash2 size={40} className="text-red-600" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-center mt-5">
                            Delete Review?
                        </h2>

                        <p className="text-gray-500 text-center mt-3">
                            This review will be permanently removed.
                        </p>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={deleteReviewHandler}
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default ReviewList;