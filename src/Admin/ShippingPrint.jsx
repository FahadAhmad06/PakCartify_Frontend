import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import PageTitle from "../coponents/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, removeErrors } from "../features/Admin/AdminSlice";
import { Link } from "react-router-dom";
import {Dashboard,AddBox,Inventory,People,Star,ShoppingCart,LocalPrintshop,} from "@mui/icons-material";
import {ChevronRight,Search,X,Printer,Package,MapPin,Phone,User,DollarSign,CheckCircle2,Clock,Truck,XCircle,PrinterCheck,Filter,CreditCard,ShieldCheck,Tag,} from "lucide-react";
import { formatPKR } from "../utils/formatCurrency";
import Loader from "../coponents/Loader";
import { toast } from "react-toastify";
import { Country, State } from "country-state-city";

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

const statusConfig = {
    Processing: { style: "bg-amber-100 text-amber-700",     icon: Clock },
    Shipped:    { style: "bg-blue-100 text-blue-700",       icon: Truck },
    Delivered:  { style: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
    Cancelled:  { style: "bg-red-100 text-red-700",         icon: XCircle },
};

function ShippingPrint() {
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();
    const { orders = [], loading, error } = useSelector((state) => state.admin);

    const [searchTerm,   setSearchTerm]   = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedIds,  setSelectedIds]  = useState(new Set());
    const [printMode,    setPrintMode]    = useState("selected"); // "selected" | "all"

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    // ─── helpers ─────────────────────────────────────────────────────────────
    const getCountryName = (code) =>
        code ? (Country.getCountryByCode(code)?.name || code) : "";

    const getStateName = (stateCode, countryCode) =>
        stateCode && countryCode
            ? (State.getStateByCodeAndCountry(stateCode, countryCode)?.name || stateCode)
            : "";

    const buildAddress = (info = {}) => {
        const parts = [
            info.address,
            info.city,
            getStateName(info.state, info.country),
            getCountryName(info.country),
        ].filter(Boolean);
        const pin = info.pincode || info.pinCode;
        return parts.join(", ") + (pin ? ` - ${pin}` : "");
    };

    // Color / Size / SKU of an ordered item (checks the common field names)
    const getVariantInfo = (item = {}) => {
        const v = item.variant || {};
        return [
            ["Color", item.color || item.selectedColor || v.color],
            ["Size",  item.size  || item.selectedSize  || v.size],
            ["SKU",   item.sku   || v.sku],
        ].filter(([, value]) => value && value !== "Default" && value !== "Standard");
    };

    // ─── filtering ───────────────────────────────────────────────────────────
    const filtered = orders.filter((o) => {
        const q = searchTerm.trim().toLowerCase();
        const matchSearch =
            !q ||
            o._id?.toLowerCase().includes(q) ||
            o.user?.name?.toLowerCase().includes(q);
        const matchStatus = statusFilter === "All" || o.orderStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    // ─── selection ───────────────────────────────────────────────────────────
    const toggleSelect = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (selectedIds.size === filtered.length && filtered.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filtered.map((o) => o._id)));
        }
    };

    const ordersToPrint =
        printMode === "all"
            ? filtered
            : filtered.filter((o) => selectedIds.has(o._id));

    // ─── print ───────────────────────────────────────────────────────────────
    const handlePrint = () => {
        if (ordersToPrint.length === 0) {
            toast.error(
                printMode === "all"
                    ? "No orders to print."
                    : "Please select at least one order to print.",
                { position: "top-center", autoClose: 3000 }
            );
            return;
        }
        window.print();
    };

    return (
        <>
            <PageTitle title="Print Shipping Labels" />

            {/* ─── PRINT STYLESHEET ─────────────────────────────────────── */}
            <style>{`
                @media print {
                    /* hide the entire screen UI */
                    body > * { display: none !important; }

                    /* reveal only the print area (portal is a direct child of body) */
                    #shipping-print-area {
                        display: block !important;
                        width: 100%;
                        font-family: 'Segoe UI', Arial, sans-serif;
                        color: #111;
                        background: #fff;
                    }

                    /* keep background colors (variant badges, headers) when printing */
                    #shipping-print-area,
                    #shipping-print-area * {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    @page {
                        size: A4;
                        margin: 8mm 10mm;
                    }

                    .pm-slip {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                        margin-bottom: 20mm !important;
                    }
                }

                /* hide print area on screen */
                #shipping-print-area { display: none; }
            `}</style>

            {/* ═══════════════════════════════════════════════════════════════
                PRINT AREA  –  only visible when window.print() is called
            ═══════════════════════════════════════════════════════════════ */}
            {ReactDOM.createPortal(
            <div id="shipping-print-area">

                {/* ── Page-level header (shows once at top of first page) ── */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "linear-gradient(135deg, #0a4f2b 0%, #0e6b38 100%)",
                    color: "#fff", padding: "14px 20px", borderRadius: "10px",
                    marginBottom: "20px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "42px", height: "42px", borderRadius: "8px",
                            background: "rgba(255,255,255,0.18)", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            fontSize: "24px",
                        }}>📦</div>
                        <div>
                            <p style={{ margin: 0, fontSize: "18px", fontWeight: "800", letterSpacing: "-0.3px" }}>PakCartify</p>
                            <p style={{ margin: 0, fontSize: "10px", opacity: 0.8, letterSpacing: "1px" }}>SHIPPING MANIFEST</p>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "11px", opacity: 0.75 }}>Printed</p>
                        <p style={{ margin: 0, fontSize: "12px", fontWeight: "600" }}>{new Date().toLocaleString("en-PK")}</p>
                        <p style={{ margin: "4px 0 0", fontSize: "11px", opacity: 0.8 }}>{ordersToPrint.length} slip{ordersToPrint.length !== 1 ? "s" : ""}</p>
                    </div>
                </div>

                {/* ── One slip per order ── */}
                {ordersToPrint.map((order, idx) => {
                    const statusColors = {
                        Processing: { bg: "#fffbeb", text: "#92400e", border: "#fcd34d" },
                        Shipped:    { bg: "#eff6ff", text: "#1e40af", border: "#93c5fd" },
                        Delivered:  { bg: "#f0fdf4", text: "#14532d", border: "#86efac" },
                        Cancelled:  { bg: "#fef2f2", text: "#991b1b", border: "#fca5a5" },
                    };
                    const sc = statusColors[order.orderStatus] || { bg: "#f8fafc", text: "#334155", border: "#cbd5e1" };
                    const phone = order.shippingInfo?.PhoneNumber || order.shippingInfo?.phoneNumber || "—";
                    const address = buildAddress(order.shippingInfo);
                    const isPaid = order.orderStatus === "Delivered";

                    return (
                        <div
                            key={order._id}
                            className="pm-slip"
                            style={{
                                border: "1.5px solid #d1fae5",
                                borderRadius: "12px",
                                marginBottom: "20px",
                                overflow: "hidden",
                                pageBreakInside: "avoid",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            }}
                        >
                            {/* ── Slip Header ── */}
                            <div style={{
                                background: "linear-gradient(90deg, #064e29 0%, #0e5d33 60%, #1a7a47 100%)",
                                padding: "12px 18px",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{
                                        background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)",
                                        borderRadius: "6px", padding: "4px 10px",
                                        color: "#fff", fontSize: "10px", fontWeight: "700", letterSpacing: "1px",
                                    }}>SHIPPING LABEL</div>
                                    <span style={{ color: "#86efac", fontSize: "11px" }}>Slip #{idx + 1}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                    {/* Order ID (last 8 chars) */}
                                    <span style={{ color: "#fff", fontFamily: "monospace", fontSize: "14px", fontWeight: "800", letterSpacing: "1px" }}>
                                        #{order._id?.slice(-8).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* ── Body ── */}
                            <div style={{ padding: "16px 18px" }}>

                                {/* Row 1 – Customer | Phone | Payment */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "14px" }}>

                                    {/* Customer */}
                                    <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "10px 12px", border: "1px solid #e2e8f0" }}>
                                        <p style={{ margin: "0 0 5px", fontSize: "9px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "4px" }}>
                                            <User size={10} strokeWidth={2.5} style={{ display: "inline" }} /> Customer
                                        </p>
                                        <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>
                                            {order.user?.name || "—"}
                                        </p>
                                    </div>

                                    {/* Phone */}
                                    <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "10px 12px", border: "1px solid #e2e8f0" }}>
                                        <p style={{ margin: "0 0 5px", fontSize: "9px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "4px" }}>
                                            <Phone size={10} strokeWidth={2.5} style={{ display: "inline" }} /> Phone
                                        </p>
                                        <p style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#0f172a", letterSpacing: "0.5px" }}>{phone}</p>
                                    </div>

                                    {/* Payment */}
                                    <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "10px 12px", border: "1px solid #e2e8f0" }}>
                                        <p style={{ margin: "0 0 5px", fontSize: "9px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "4px" }}>
                                            <CreditCard size={10} strokeWidth={2.5} style={{ display: "inline" }} /> Payment
                                        </p>
                                        <p style={{ margin: "0 0 3px", fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>
                                            {order.paymentInfo?.id === "COD" ? "Cash on Delivery" : "Online Payment"}
                                        </p>
                                        <span style={{
                                            display: "inline-block",
                                            fontSize: "10px", fontWeight: "700",
                                            padding: "1px 8px", borderRadius: "12px",
                                            background: isPaid ? "#dcfce7" : "#fef9c3",
                                            color: isPaid ? "#15803d" : "#854d0e",
                                        }}>{isPaid ? "✓ Paid" : "⏳ Pending"}</span>
                                    </div>
                                </div>

                                {/* Row 2 – Delivery Address (full width) */}
                                <div style={{
                                    background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                                    borderRadius: "8px", padding: "10px 14px",
                                    border: "1px solid #bbf7d0", marginBottom: "14px",
                                    display: "flex", alignItems: "flex-start", gap: "10px",
                                }}>
                                    <MapPin size={16} strokeWidth={2} style={{ color: "#166534", marginTop: "2px", flexShrink: 0 }} />
                                    <div>
                                        <p style={{ margin: "0 0 3px", fontSize: "9px", color: "#166534", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                            Delivery Address
                                        </p>
                                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#0f172a", lineHeight: "1.5" }}>
                                            {address || "—"}
                                        </p>
                                    </div>
                                </div>

                                {/* Row 3 – Items table + Price summary side by side */}
                                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: "12px" }}>

                                    {/* Items table */}
                                    <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                                        <div style={{
                                            background: "#0e5d33", color: "#fff",
                                            padding: "7px 12px", fontSize: "10px", fontWeight: "700",
                                            letterSpacing: "0.08em", textTransform: "uppercase",
                                            display: "flex", alignItems: "center", gap: "6px",
                                        }}>
                                             Items Ordered
                                        </div>
                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                                            <thead>
                                                <tr style={{ background: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
                                                    <th style={{ padding: "5px 10px", textAlign: "left", color: "#475569", fontWeight: "600" }}>Product</th>
                                                    <th style={{ padding: "5px 10px", textAlign: "center", color: "#475569", fontWeight: "600" }}>Qty</th>
                                                    <th style={{ padding: "5px 10px", textAlign: "right", color: "#475569", fontWeight: "600" }}>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.orderItems?.map((item, i) => {
                                                    const variantInfo = getVariantInfo(item);

                                                    return (
                                                        <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                                            <td style={{ padding: "6px 10px", color: "#1e293b", fontWeight: "500" }}>
                                                                {item.name}

                                                                {/* Color / Size / SKU */}
                                                                {variantInfo.length > 0 && (
                                                                    <div style={{ marginTop: "3px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                                                        {variantInfo.map(([label, value]) => (
                                                                            <span
                                                                                key={label}
                                                                                style={{
                                                                                    fontSize: "9px", fontWeight: "700",
                                                                                    background: "#ecfdf5", color: "#065f46",
                                                                                    border: "1px solid #a7f3d0", borderRadius: "4px",
                                                                                    padding: "1px 6px",
                                                                                }}
                                                                            >
                                                                                {label}: {value}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td style={{ padding: "6px 10px", textAlign: "center", color: "#64748b" }}>×{item.quantity}</td>
                                                            <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: "600", color: "#0e5d33" }}>
                                                                {formatPKR(item.price * item.quantity)}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Price summary */}
                                    <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                                        <div style={{
                                            background: "#0e5d33", color: "#fff",
                                            padding: "7px 12px", fontSize: "10px", fontWeight: "700",
                                            letterSpacing: "0.08em", textTransform: "uppercase",
                                            display: "flex", alignItems: "center", gap: "6px",
                                        }}>
                                            Price
                                        </div>
                                        <div style={{ padding: "10px 12px" }}>
                                            {[
                                                ["Items",    formatPKR(order.itemsPrice),    "#334155"],
                                                ["Shipping", order.shippingPrice === 0 ? "FREE" : formatPKR(order.shippingPrice), "#334155"],
                                                ["Tax",      formatPKR(order.taxPrice),      "#334155"],
                                            ].map(([label, value, color]) => (
                                                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "11px" }}>
                                                    <span style={{ color: "#64748b" }}>{label}</span>
                                                    <span style={{ color, fontWeight: "500" }}>{value}</span>
                                                </div>
                                            ))}

                                            {order.discountAmount > 0 && (
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "11px" }}>
                                                    <span style={{ color: "#64748b" }}>Discount</span>
                                                    <span style={{ color: "#dc2626", fontWeight: "600" }}>-{formatPKR(order.discountAmount)}</span>
                                                </div>
                                            )}

                                            {/* Total */}
                                            <div style={{
                                                marginTop: "8px", paddingTop: "8px",
                                                borderTop: "2px dashed #d1fae5",
                                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                            }}>
                                                <span style={{ fontWeight: "800", fontSize: "12px", color: "#0f172a" }}>TOTAL</span>
                                                <span style={{
                                                    fontWeight: "900", fontSize: "15px", color: "#0e5d33",
                                                    background: "#f0fdf4", padding: "2px 8px", borderRadius: "6px",
                                                    border: "1px solid #bbf7d0",
                                                }}>
                                                    {formatPKR(order.totalPrice)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* ── Slip Footer ── */}
                            <div style={{
                                borderTop: "1.5px dashed #bbf7d0",
                                background: "#f0fdf4",
                                padding: "8px 18px",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                            }}>
                                <span style={{ fontSize: "9px", color: "#6b7280", fontFamily: "monospace", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Package size={9} strokeWidth={2} style={{ display: "inline" }} /> ORDER ID: #{order._id?.slice(-8).toUpperCase()}
                                </span>
                                <span style={{ fontSize: "10px", color: "#166534", fontWeight: "600" }}>
                                    PakCartify.pk &nbsp;·&nbsp; Thank you for your order!
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* Page footer */}
                <div style={{ textAlign: "center", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #e2e8f0" }}>
                    <p style={{ margin: 0, fontSize: "10px", color: "#9ca3af" }}>
                        Generated by PakCartify Admin · {new Date().toLocaleDateString("en-PK")}
                    </p>
                </div>
            </div>
            , document.body)}


            {/* ─── SCREEN UI ───────────────────────────────────────────────── */}
            <div className="min-h-screen bg-slate-100 pt-16 mt-16">
                {/* Top banner */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 mx-4 sm:mx-6 mt-6 rounded-2xl px-6 py-5 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-600 border-2 border-white/40 flex items-center justify-center text-white">
                            <LocalPrintshop fontSize="large" />
                        </div>
                        <div className="text-white">
                            <p className="font-semibold text-lg leading-tight">Shipping Labels</p>
                            <p className="text-emerald-100 text-sm">Select orders and print shipping slips</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <select
                            value={printMode}
                            onChange={(e) => setPrintMode(e.target.value)}
                            className="text-sm rounded-lg px-3 py-2 border border-emerald-600 bg-emerald-700 text-white focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                        >
                            <option value="selected">Print Selected</option>
                            <option value="all">Print All Filtered</option>
                        </select>

                        <button
                            type="button"
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-white text-emerald-800 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow cursor-pointer"
                        >
                            <Printer size={18} />
                            Print
                            {printMode === "selected" && selectedIds.size > 0 && (
                                <span className="bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {selectedIds.size}
                                </span>
                            )}
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
                                    {section.links.map(({ to, label, icon: Icon }) => (
                                        <Link
                                            key={to}
                                            to={to}
                                            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                                        >
                                            <span className="flex items-center gap-3">
                                                <Icon fontSize="small" className="text-slate-400" />
                                                {label}
                                            </span>
                                            <ChevronRight size={16} className="text-slate-300" />
                                        </Link>
                                    ))}
                                </div>
                            ))}

                            {/* Print section – active */}
                            <div>
                                <h3 className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Print</h3>
                                <Link
                                    to="/admin/shipping/print"
                                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-800"
                                >
                                    <span className="flex items-center gap-3">
                                        <LocalPrintshop fontSize="small" />
                                        Shipping Labels
                                    </span>
                                    <ChevronRight size={16} className="text-slate-300" />
                                </Link>
                            </div>
                        </nav>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 min-w-0">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
                                {/* Toolbar */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h1 className="text-2xl font-bold text-emerald-700 flex items-center gap-2">
                                                <PrinterCheck size={24} />
                                                Print Shipping Labels
                                            </h1>
                                            <p className="text-slate-500 text-sm mt-1">
                                                Select orders below, then click <strong>Print</strong> to generate slips
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            {/* Status filter */}
                                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                                                <Filter size={14} className="text-slate-400" />
                                                <select
                                                    value={statusFilter}
                                                    onChange={(e) => setStatusFilter(e.target.value)}
                                                    className="text-sm text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                                                >
                                                    <option value="All">All Status</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>

                                            {/* Search */}
                                            <div className="relative">
                                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder="Order ID or name…"
                                                    className="pl-9 pr-8 py-2 rounded-full border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52"
                                                />
                                                {searchTerm && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSearchTerm("")}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="bg-emerald-700 text-white px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap">
                                                {filtered.length} order{filtered.length !== 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Print mode info banner */}
                                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-800 flex items-start gap-2">
                                        <Printer size={16} className="shrink-0 mt-0.5" />
                                        <span>
                                            {printMode === "selected"
                                                ? selectedIds.size === 0
                                                    ? "Check the boxes next to orders you want to print."
                                                    : `${selectedIds.size} order${selectedIds.size > 1 ? "s" : ""} selected for printing.`
                                                : `All ${filtered.length} filtered order${filtered.length !== 1 ? "s" : ""} will be printed.`
                                            }
                                        </span>
                                    </div>
                                </div>

                                {/* Orders table */}
                                {filtered.length === 0 ? (
                                    <div className="py-24 flex flex-col items-center text-gray-400">
                                        <Package size={60} className="text-emerald-300 mb-4" />
                                        <p className="text-lg font-semibold">No orders found</p>
                                        <p className="text-sm mt-1">Try adjusting your search or status filter</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-emerald-700 text-white">
                                                <tr>
                                                    <th className="p-4 w-12">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.size === filtered.length && filtered.length > 0}
                                                            onChange={toggleAll}
                                                            className="w-4 h-4 cursor-pointer accent-emerald-400"
                                                            title="Select all"
                                                        />
                                                    </th>
                                                    <th className="p-4 text-left"># Order ID</th>
                                                    <th className="p-4 text-left">
                                                        <span className="flex items-center gap-1.5"><User size={13} /> Customer</span>
                                                    </th>
                                                    <th className="p-4 text-left">
                                                        <span className="flex items-center gap-1.5"><Phone size={13} /> Phone</span>
                                                    </th>
                                                    <th className="p-4 text-left">
                                                        <span className="flex items-center gap-1.5"><MapPin size={13} /> Address</span>
                                                    </th>
                                                    <th className="p-4 text-left">
                                                        <span className="flex items-center gap-1.5"><DollarSign size={13} /> Total</span>
                                                    </th>
                                                    <th className="p-4 text-left">Status</th>
                                                    <th className="p-4 text-center">Items</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtered.map((order) => {
                                                    const isChecked = selectedIds.has(order._id);
                                                    const cfg = statusConfig[order.orderStatus] || {
                                                        style: "bg-slate-100 text-slate-600",
                                                        icon: Package,
                                                    };
                                                    const StatusIcon = cfg.icon;
                                                    const phone =
                                                        order.shippingInfo?.PhoneNumber ||
                                                        order.shippingInfo?.phoneNumber ||
                                                        "—";
                                                    const address = buildAddress(order.shippingInfo);

                                                    return (
                                                        <tr
                                                            key={order._id}
                                                            onClick={() => toggleSelect(order._id)}
                                                            className={`border-b cursor-pointer transition-colors duration-150 ${
                                                                isChecked
                                                                    ? "bg-emerald-50 hover:bg-emerald-100/70"
                                                                    : "hover:bg-slate-50"
                                                            }`}
                                                        >
                                                            {/* Checkbox */}
                                                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => toggleSelect(order._id)}
                                                                    className="w-4 h-4 cursor-pointer accent-emerald-600"
                                                                />
                                                            </td>

                                                            {/* Order ID */}
                                                            <td className="p-4 font-mono font-semibold text-slate-700 whitespace-nowrap">
                                                                #{order._id?.slice(-8).toUpperCase()}
                                                            </td>

                                                            {/* Customer */}
                                                            <td className="p-4">
                                                                <p className="font-semibold text-slate-800 whitespace-nowrap">{order.user?.name || "—"}</p>
                                                                <p className="text-xs text-slate-400">{order.user?.email || ""}</p>
                                                            </td>

                                                            {/* Phone */}
                                                            <td className="p-4 text-slate-700 whitespace-nowrap">{phone}</td>

                                                            {/* Address */}
                                                            <td className="p-4 text-slate-600 max-w-xs">
                                                                <p className="line-clamp-2 text-xs">{address || "—"}</p>
                                                            </td>

                                                            {/* Total */}
                                                            <td className="p-4 font-bold text-emerald-700 whitespace-nowrap">
                                                                {formatPKR(order.totalPrice)}
                                                            </td>

                                                            {/* Status */}
                                                            <td className="p-4">
                                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.style}`}>
                                                                    <StatusIcon size={11} strokeWidth={2.5} />
                                                                    {order.orderStatus}
                                                                </span>
                                                            </td>

                                                            {/* Items count */}
                                                            <td className="p-4 text-center text-slate-600 font-medium">
                                                                {order.orderItems?.length || 0}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Bottom action bar */}
                                {filtered.length > 0 && (
                                    <div className="p-4 border-t border-gray-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                                        <p className="text-sm text-slate-500">
                                            <span className="font-semibold text-slate-700">{selectedIds.size}</span> of {filtered.length} selected
                                            {printMode === "all" && (
                                                <span className="text-emerald-700 font-medium"> · Printing all {filtered.length}</span>
                                            )}
                                        </p>

                                        <div className="flex items-center gap-3">
                                            {printMode === "selected" && selectedIds.size > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedIds(new Set())}
                                                    className="text-sm text-slate-500 hover:text-red-600 underline cursor-pointer transition-colors"
                                                >
                                                    Clear selection
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={handlePrint}
                                                disabled={printMode === "selected" && selectedIds.size === 0}
                                                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow cursor-pointer"
                                            >
                                                <Printer size={16} />
                                                {printMode === "selected"
                                                    ? `Print ${selectedIds.size || 0} Label${selectedIds.size !== 1 ? "s" : ""}`
                                                    : `Print All ${filtered.length} Labels`
                                                }
                                            </button>
                                        </div>
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

export default ShippingPrint;