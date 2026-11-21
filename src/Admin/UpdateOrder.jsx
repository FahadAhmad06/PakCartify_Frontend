import React, { useEffect, useState } from "react";

import PageTitle from "../coponents/PageTitle";

import { Package, User, MapPin, Phone, Truck, CheckCircle } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {getSingleOrder,updateOrderStatus,removeErrors,removeSuccess} from "../features/Admin/AdminSlice";

import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { formatPKR } from "../utils/formatCurrency";

function UpdateOrder() {
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const { order, loading, error, success } = useSelector((state) => state.admin);

    const [status, setStatus] = useState("");

    useEffect(() => {
        dispatch(getSingleOrder(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (order) {
            setStatus(order.orderStatus);
        }
    }, [order]);

    useEffect(() => {
        if (error) {
            toast.error(error,{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
            dispatch(removeErrors());
        }

        if (success) {
            toast.success("Order Status Updated",{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });

            dispatch(removeSuccess());
            navigate("/admin/orders");
        }
    }, [error, success, dispatch, navigate]);

    const updateStatus = () => {
        dispatch(
            updateOrderStatus({
                orderId: id,
                status
            })
        );
    };
    

    return (
        <>
            <PageTitle title="Update Order" />

            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 p-4 pt-20 mt-20">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-5">
                    <h1 className="text-xl font-bold text-emerald-700 mb-5">
                        Update Order Status
                    </h1>

                    {order && (
                        <>
                            {/* Order ID */}
                            <div className="mb-5 bg-slate-50 border rounded-xl p-3.5">
                                <p className="text-sm">
                                    Order ID: <b>#{order._id?.slice(-8)}</b>
                                </p>
                            </div>

                            {/* Price Details */}
                            <div className="border rounded-xl p-3.5 mb-5">
                                <h2 className="font-bold text-sm mb-2.5">Price Details</h2>

                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Items Price</span>
                                        <span>{formatPKR(order.itemsPrice)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Tax</span>
                                        <span>{formatPKR(order.taxPrice)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Shipping</span>
                                        <span>{formatPKR(order.shippingPrice)}</span>
                                    </div>

                                    {order.discountAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Discount</span>
                                            <span className="text-red-600">
                                                - {formatPKR(order.discountAmount)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between border-t pt-1.5 mt-1.5 font-bold">
                                        <span>Total</span>
                                        <span className="text-emerald-700">
                                            {formatPKR(order.totalPrice)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Information: Customer + Shipping */}
                            <div className="grid md:grid-cols-2 gap-4 mb-5">
                                <div className="border rounded-xl p-3.5">
                                    <div className="flex items-center gap-2 mb-2.5">
                                        <User size={18} className="text-emerald-600" />
                                        <h2 className="font-bold text-sm">Customer</h2>
                                    </div>

                                    <p className="text-sm">
                                        Name: <b>{order.user?.name}</b>
                                    </p>

                                    <p className="text-sm">
                                        Email: <b>{order.user?.email}</b>
                                    </p>
                                </div>

                                <div className="border rounded-xl p-3.5">
                                    <div className="flex items-center gap-2 mb-2.5">
                                        <MapPin size={18} className="text-emerald-600" />
                                        <h2 className="font-bold text-sm">Shipping</h2>
                                    </div>

                                    <p className="text-sm">
                                        {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.state}, {order.shippingInfo?.country} - {order.shippingInfo?.pinCode}
                                    </p>

                                    <p className="text-sm flex gap-1.5 items-center mt-1">
                                        <Phone size={14} />
                                        {order.shippingInfo?.PhoneNumber}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="border rounded-xl p-3.5 mb-5">
                                <div className="flex gap-2 items-center mb-3">
                                    <Package size={18} className="text-emerald-600" />
                                    <h2 className="text-sm font-bold">Order Items</h2>
                                </div>

                                {order.orderItems?.map((item) => (
                                    <div
                                        key={item.product}
                                        className="flex justify-between items-center border-b py-2 text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover border"
                                            />

                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-slate-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>

                                        <p className="font-bold text-emerald-700">
                                            {formatPKR(item.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Status */}
                            <div className="bg-emerald-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Truck size={18} className="text-emerald-600" />
                                    <h2 className="font-bold text-sm">Order Status</h2>
                                </div>

                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full text-sm border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option>Processing</option>
                                    <option>Shipped</option>
                                    <option>Delivered</option>
                                    <option>Cancelled</option>
                                </select>

                                <button
                                    onClick={updateStatus}
                                    className="mt-4 w-full bg-[#0E5D33] hover:bg-green-800 text-white py-2.5 text-sm rounded-lg font-bold flex justify-center items-center gap-2 transition cursor-pointer"
                                >
                                    <CheckCircle size={16} />
                                    Update Status
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default UpdateOrder;