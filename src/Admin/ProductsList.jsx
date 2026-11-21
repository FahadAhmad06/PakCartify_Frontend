import React, { useEffect, useState } from "react";
import PageTitle from "../coponents/PageTitle";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {fetchAdminProducts,deleteProduct,removeErrors, removeSuccess} from "../features/Admin/AdminSlice";
import { toast } from "react-toastify";
import Loader from "../coponents/Loader";
import { Edit, Trash2, ChevronRight, PackageOpen, ArrowUp, ArrowDown } from "lucide-react";
import {Dashboard,AddBox,Inventory,People,Star,ShoppingCart,} from "@mui/icons-material";

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

function ProductsList() {
    const { products, loading, error, success } = useSelector((state) => state.admin);

    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();

    const [deletingId, setDeletingId] = useState(null);
    const [isNearTop, setIsNearTop] = useState(true);
    const [isDeletingAll, setIsDeletingAll] = useState(false);

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-center",
                autoClose: 3000
            });

            dispatch(removeErrors());
            setDeletingId(null);
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (success) {
            toast.success("Product Deleted Successfully", {
                position: "top-center",
                autoClose: 3000
            });

            dispatch(removeSuccess());
            dispatch(fetchAdminProducts());
            setDeletingId(null);
        }
    }, [success, dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            setIsNearTop(scrollY < maxScroll / 2);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product? This cannot be undone."
        );

        if (!confirmDelete) return;

        setDeletingId(id);
        dispatch(deleteProduct(id));
    };

    const handleDeleteAll = async () => {
        if (!products || products.length === 0) return;

        const confirmDeleteAll = window.confirm(
            `Are you sure you want to delete ALL ${products.length} products? This cannot be undone.`
        );

        if (!confirmDeleteAll) return;

        setIsDeletingAll(true);

        try {
            for (const product of products) {
                await dispatch(deleteProduct(product._id)).unwrap();
            }

            toast.success("All Products Deleted Successfully", {
                position: "top-center",
                autoClose: 3000
            });
        } catch (err) {
            toast.error(err || "Failed to delete all products", {
                position: "top-center",
                autoClose: 3000
            });
        } finally {
            dispatch(fetchAdminProducts());
            setIsDeletingAll(false);
        }
    };

    const handleScrollToggle = () => {
        if (isNearTop) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    return (
        <>
            <PageTitle title="All Products" />

            <div className="min-h-screen bg-slate-100 pt-16 mt-16">
                {/* Top banner */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 mx-4 sm:mx-6 mt-6 rounded-2xl px-6 py-5 flex flex-col md:flex-row items-center md:justify-between gap-5">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-14 h-14 rounded-full bg-emerald-600 border-2 border-white/40 flex items-center justify-center text-white font-semibold text-lg">
                            PC
                        </div>
                        <div className="text-white">
                            <p className="font-semibold text-lg leading-tight">All Products</p>
                            <p className="text-emerald-100 text-sm">Manage your store products</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                        <div className="bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-lg border border-white/20">
                            Total Products: <span className="font-bold">{products?.length || 0}</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleDeleteAll}
                            disabled={isDeletingAll || deletingId !== null || !products || products.length === 0}
                            className="flex items-center gap-2 bg-red-500/90 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                        >
                            <Trash2 size={16} />
                            {isDeletingAll ? "Deleting..." : "Delete All"}
                        </button>
                        <Link
                            to="/admin/product/create"
                            className="bg-white text-emerald-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors whitespace-nowrap"
                        >
                            + Add Product
                        </Link>
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
                                        const isActive = to === "/admin/products";
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
                        ) : products && products.length > 0 ? (
                            <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-emerald-700 text-white">
                                            <tr>
                                                <th className="p-5">#</th>
                                                <th className="p-5">Image</th>
                                                <th className="p-5">Product</th>
                                                <th className="p-5">Price</th>
                                                <th className="p-5">Rating</th>
                                                <th className="p-5">Category</th>
                                                <th className="p-5">Stock</th>
                                                <th className="p-5">Created</th>
                                                <th className="p-5">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {products.map((product, index) => (
                                                <tr
                                                    key={product._id}
                                                    className="border-b hover:bg-emerald-50 transition"
                                                >
                                                    <td className="p-5 font-semibold">{index + 1}</td>

                                                    <td className="p-5">
                                                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-emerald-200 shadow">
                                                            <img
                                                                src={product.image?.[0]?.url}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </td>

                                                    <td className="p-5">
                                                        <p className="font-semibold text-slate-800">{product.name}</p>
                                                        <p className="text-xs text-slate-400">{product.subcategory}</p>
                                                    </td>

                                                    <td className="p-5 font-bold text-emerald-700">
                                                        Rs. {product.price.toLocaleString()}
                                                    </td>

                                                    <td className="p-5">
                                                        <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full inline-flex font-semibold text-sm">
                                                            ⭐ {product.ratings?.toFixed(1) || 0}
                                                        </div>
                                                    </td>

                                                    <td className="p-5">
                                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                            {product.category}
                                                        </span>
                                                    </td>

                                                    <td className="p-5">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                                product.stock === 0
                                                                    ? "bg-red-100 text-red-600"
                                                                    : "bg-green-100 text-green-600"
                                                            }`}
                                                        >
                                                            {product.stock === 0 ? "Out" : product.stock}
                                                        </span>
                                                    </td>

                                                    <td className="p-5 text-slate-500 text-sm">
                                                        {new Date(product.createdAt).toLocaleDateString()}
                                                    </td>

                                                    <td className="p-5">
                                                        <div className="flex gap-3">
                                                            <Link
                                                                to={`/admin/products/update/${product._id}`}
                                                                className="p-3 rounded-xl bg-blue-50 text-green-800 hover:bg-green-800 hover:text-white transition"
                                                            >
                                                                <Edit size={18} />
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(product._id)}
                                                                disabled={deletingId === product._id || isDeletingAll}
                                                                className="p-3 rounded-xl bg-red-50 text-red-400 hover:bg-red-400 hover:text-white transition disabled:opacity-50 cursor-pointer"
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
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 flex flex-col items-center justify-center text-center px-6 py-20">
                                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                                    <PackageOpen size={36} className="text-emerald-600" />
                                </div>

                                <h3 className="text-lg font-bold text-slate-800">No Products Yet</h3>

                                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                                    Your store is empty right now. Add your first product to start
                                    selling on PakCartify.
                                </p>

                                <Link
                                    to="/admin/product/create"
                                    className="mt-6 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition shadow-lg shadow-emerald-200"
                                >
                                    <AddBox fontSize="small" />
                                    Create Your First Product
                                </Link>
                            </div>
                        )}
                    </main>
                </div>

                <button
                    type="button"
                    onClick={handleScrollToggle}
                    className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-emerald-700 text-white shadow-lg shadow-emerald-300 flex items-center justify-center hover:bg-emerald-800 transition cursor-pointer"
                    aria-label={isNearTop ? "Scroll to bottom" : "Scroll to top"}
                >
                    {isNearTop ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
                </button>
            </div>
        </>
    );
}

export default ProductsList;