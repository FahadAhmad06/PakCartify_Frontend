import React, { useState } from "react";
import PageTitle from "../coponents/PageTitle";
import CheckoutPath from "./CheckoutPath";
import { useDispatch, useSelector } from "react-redux";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { saveShippingInfo } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { formatPKR } from "../utils/formatCurrency";

import {MapPin,Phone,Globe,Building2,MapPinned,ArrowRight,ShieldCheck,Truck,} from "lucide-react";



function Shipping() {
    const { shippingInfo, cartItems, appliedCoupon } = useSelector((state) => state.cart);
    const safeShippingInfo = shippingInfo || {};


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [address, setAddress] = useState(safeShippingInfo.address || "");
    const [pincode, setPinCode] = useState(safeShippingInfo.pincode || "");
    const [phoneNumber, setPhoneNumber] = useState(
        safeShippingInfo.phoneNumber || ""
    );
    const [country, setCountry] = useState(safeShippingInfo.country || "PK");
    const [state, setState] = useState(safeShippingInfo.state || "");
    const [city, setCity] = useState(safeShippingInfo.city || "");

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const shipping = subtotal > 2999 ? 0 : 100;

    const taxRate = 0.08;
    const tax = subtotal * taxRate;

    const discountPercent = appliedCoupon === "WELCOME20" ? 20 : 0;
    const discountAmount = (subtotal * discountPercent) / 100;

    const total = subtotal + shipping + tax - discountAmount;

    const shippingInfoSubmit = (e) => {
        e.preventDefault();

        if (!/^03[0-9]{9}$/.test(phoneNumber)) {
            toast.error("Please enter a valid Pakistan phone number (03XXXXXXXXX)", {
                position: "top-center",
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        dispatch(
            saveShippingInfo({
                address,
                pincode,
                phoneNumber,
                country,
                state,
                city,
            })
        );

        navigate("/order/confirm");
    };

    return (
        <>
            <PageTitle title="Shipping Details" />
            <CheckoutPath activepath={0} />

            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 pt-5 pb-16 px-4">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
                    {/* Shipping Form */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-emerald-100 p-3 rounded-xl">
                                <MapPin className="text-emerald-600" size={28} />
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">
                                    Shipping Information
                                </h2>

                                <p className="text-gray-500 text-sm">
                                    Please enter your delivery details carefully.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={shippingInfoSubmit} className="space-y-6">
                            {/* Address */}
                            <div>
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                    <MapPinned size={18} className="text-emerald-600" />
                                    Address
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your complete address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                                    required
                                />
                            </div>

                            {/* Country & State */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                        <Globe size={18} className="text-emerald-600" />
                                        Country
                                    </label>

                                    <select
                                        value={country}
                                        onChange={(e) => {
                                            setCountry(e.target.value);
                                            setState("");
                                            setCity("");
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        required
                                    >
                                        <option value="">Select Country</option>

                                        {Country.getAllCountries().map((item) => (
                                            <option key={item.isoCode} value={item.isoCode}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                        <Building2 size={18} className="text-emerald-600" />
                                        State
                                    </label>

                                    <select
                                        value={state}
                                        onChange={(e) => {
                                            setState(e.target.value);
                                            setCity("");
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        required
                                    >
                                        <option value="">Select State</option>

                                        {country &&
                                            State.getStatesOfCountry(country).map((item) => (
                                                <option key={item.isoCode} value={item.isoCode}>
                                                    {item.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            {/* City & Pincode */}
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                        <MapPin size={18} className="text-emerald-600" />
                                        City
                                    </label>

                                    <select
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        required
                                    >
                                        <option value="">Select City</option>

                                        {country &&
                                            state &&
                                            City.getCitiesOfState(country, state).map((item) => (
                                                <option key={item.name} value={item.name}>
                                                    {item.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                        <MapPinned size={18} className="text-emerald-600" />
                                        Pincode
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter pincode"
                                        value={pincode}
                                        onChange={(e) => setPinCode(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                    <Phone size={18} className="text-emerald-600" />
                                    Phone Number
                                </label>

                                <input
                                    type="text"
                                    placeholder="03XXXXXXXXX"
                                    value={phoneNumber}
                                    maxLength="11"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setPhoneNumber(value);
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-3 bg-[#0E5D33] hover:bg-green-800 text-white font-semibold py-4 rounded-4xl transition-all duration-300 shadow-lg cursor-pointer"
                            >
                                Continue To Confirm Order
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 h-fit sticky top-28">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-green-100 p-3 rounded-xl">
                                <Truck className="text-emerald-600" size={26} />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    Order Summary
                                </h3>
                                <p className="text-gray-500 text-sm">Your checkout details</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-gray-700">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold">{formatPKR(subtotal)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Shipping Charges</span>
                                <span className="font-semibold">
                                    {shipping === 0 ? "FREE" : formatPKR(shipping)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Tax (8%)</span>
                                <span className="font-semibold">{formatPKR(tax)}</span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-600 font-medium">
                                    <span>Discount ({discountPercent}%)</span>
                                    <span>- {formatPKR(discountAmount)}</span>
                                </div>
                            )}

                            <hr />

                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-[#0E5D33]">{formatPKR(total)}</span>
                            </div>
                        </div>

                        {/* Security Box */}
                        <div className="mt-6 bg-emerald-50 rounded-2xl p-4">
                            <div className="flex gap-3 items-start">
                                <ShieldCheck className="text-emerald-600 mt-1" size={22} />

                                <div>
                                    <h4 className="font-semibold text-gray-800">
                                        Secure Checkout
                                    </h4>

                                    <p className="text-sm text-gray-600">
                                        Your information is safe with us.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Free Delivery */}
                        <div className="mt-4 bg-green-50 rounded-2xl p-4">
                            <div className="flex gap-3 items-center">
                                <Truck className="text-green-600" size={22} />

                                <p className="text-sm text-gray-700">
                                    Free delivery on orders above {formatPKR(2999)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Shipping;