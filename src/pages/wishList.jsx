import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyFavorites, removeAllFavorites } from "../features/favorite/favoriteSlice";
import { addToCart } from "../features/cart/cartSlice";
import Products from "../coponents/Products";
import Loader from "../coponents/Loader";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import SortIcon from "@mui/icons-material/Sort";

function Wishlist() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { favorites, loading } = useSelector(
        (state) => state.favorite
    );

    const [sortBy, setSortBy] = useState("recent");
    const [showMoveModal, setShowMoveModal] = useState(false);

    useEffect(() => {
        dispatch(getMyFavorites());
    }, [dispatch]);

    const sortedFavorites = useMemo(() => {

        const items = [...favorites];

        switch (sortBy) {

            case "priceLow":
                return items.sort((a, b) => a.price - b.price);

            case "priceHigh":
                return items.sort((a, b) => b.price - a.price);

            case "nameAZ":
                return items.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );

            case "nameZA":
                return items.sort((a, b) =>
                    b.name.localeCompare(a.name)
                );

            default:
                return items;
        }

    }, [favorites, sortBy]);


    const handleRemoveAll = () => {

        const confirmDelete = window.confirm(
            "Are you sure you want to remove all items from your wishlist?"
        );

        if (!confirmDelete) return;

        dispatch(removeAllFavorites());

    };

    const handleMoveAllToCart = async () => {
        for (const product of favorites) {
            await dispatch(addToCart({ id: product._id, quantity: 1 }));
        }
        dispatch(removeAllFavorites());
        setShowMoveModal(false);
        navigate("/cart");
    };

    return (

        <>

            {/* ── Move All to Cart Confirmation Modal ── */}
            {showMoveModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.45)" }}
                    onClick={() => setShowMoveModal(false)}
                >
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8"
                        style={{ animation: "modalPop 0.25s cubic-bezier(.34,1.56,.64,1) both" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-5">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0E5D33] to-[#19934f] flex items-center justify-center shadow-lg">
                                <span className="text-4xl">🛒</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-2">
                            Move All to Cart?
                        </h2>

                        {/* Warning */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mt-4 mb-6">
                            <p className="text-amber-700 font-semibold text-sm text-center">
                                ⚠️ This will <span className="underline">permanently delete</span> all items from your Wishlist.
                            </p>
                            <p className="text-amber-600 text-sm text-center mt-1">
                                {favorites.length} item{favorites.length !== 1 ? "s" : ""} will be moved to your cart and removed from your wishlist. This action cannot be undone.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowMoveModal(false)}
                                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleMoveAllToCart}
                                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#0E5D33] to-[#19934f] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                            >
                                ✅ Yes, Move All
                            </button>
                        </div>
                    </div>

                    <style>{`
                        @keyframes modalPop {
                            0%   { opacity: 0; transform: scale(0.85); }
                            100% { opacity: 1; transform: scale(1); }
                        }
                    `}</style>
                </div>
            )}

            {loading ? (
                <Loader />
            ) : (

                <div className="min-h-screen bg-gradient-to-b from-[#f8fbf9] via-white to-[#eef7f1] pt-24 mt-10 pb-14">
                    {/* Header */}
                    <div className="max-w-7xl mx-auto px-5 mb-10">

                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0E5D33] via-[#12713f] to-[#19934f] p-8 md:p-10 shadow-xl">

                            {/* Background Circles */}

                            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10"></div>

                            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/5"></div>

                            <div className="relative flex flex-col lg:flex-row justify-between items-center gap-8">

                                {/* Left */}

                                <div>

                                    <p className="uppercase tracking-widest text-green-100 text-sm">

                                        Your Favourite Collection

                                    </p>

                                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2">

                                        ❤️ My Wishlist

                                    </h1>

                                    <p className="mt-3 text-green-100 max-w-lg">

                                        Save products you love and purchase them whenever you're ready.

                                    </p>

                                </div>

                                {/* Right */}

                                <div className="flex flex-wrap justify-center gap-4">

                                    {/* Count */}

                                    <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl px-8 py-5 text-center shadow-lg">

                                        <p className="text-green-100 text-sm">

                                            Saved Products

                                        </p>

                                        <h2 className="text-5xl font-bold text-white mt-1">

                                            {favorites.length}

                                        </h2>

                                    </div>

                                    {/* Move All */}

                                    <div className="flex items-center gap-3">

                                        {/* Move All */}

                                        <button
                                            onClick={() => setShowMoveModal(true)}
                                            disabled={favorites.length === 0}
                                            className="group inline-flex items-center gap-2 bg-white text-[#0E5D33] px-5 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ShoppingCartCheckoutIcon fontSize="small" />
                                            Move All
                                        </button>

                                        {/* Remove All */}

                                        <button
                                            onClick={handleRemoveAll}
                                            className="group inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                                        >
                                            🗑
                                            Remove All
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                    {/* Empty State */}

                    {sortedFavorites.length === 0 ? (

                        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-14 text-center">

                            <div className="text-7xl mb-6">
                                🤍
                            </div>

                            <h2 className="text-3xl font-bold text-gray-700">
                                Your Wishlist is Empty
                            </h2>

                            <p className="text-gray-500 mt-4">
                                Browse products and tap the heart icon to save your favourite items.
                            </p>

                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 mt-8 bg-[#0E5D33] hover:bg-[#0A4A28] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                            >
                                🛍 Continue Shopping
                            </Link>

                        </div>

                    ) : (

                        <div className="max-w-7xl mx-auto px-5">

                            <div className="flex flex-col lg:flex-row justify-between items-center mb-7 gap-5">

                                <div>

                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Saved Products
                                    </h2>

                                    <p className="text-gray-500 mt-1">
                                        {sortedFavorites.length} products in your wishlist
                                    </p>

                                </div>

                                <div className="flex items-center gap-3">


                                    <div className="relative">

                                        <SortIcon
                                            className="absolute left-3 top-3 text-gray-500"
                                            fontSize="small"
                                        />

                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="pl-10 pr-5 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-[#0E5D33] "
                                        >
                                            <option value="recent">Recently Added</option>
                                            <option value="priceLow">Price: Low → High</option>
                                            <option value="priceHigh">Price: High → Low</option>
                                            <option value="nameAZ">Name A-Z</option>
                                            <option value="nameZA">Name Z-A</option>
                                        </select>

                                    </div>
                                    <span className="bg-green-100 text-[#0E5D33] px-5 py-2 rounded-full font-semibold">

                                        {sortedFavorites.length} Items

                                    </span>


                                </div>

                            </div>

                            {/* Products */}

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-5 w-full">

                                {sortedFavorites.map((product) => (

                                    <Products
                                        key={product._id}
                                        product={product}
                                    />

                                ))}

                            </div>

                        </div>

                    )}

                </div>

            )}

        </>

    );

}

export default Wishlist;