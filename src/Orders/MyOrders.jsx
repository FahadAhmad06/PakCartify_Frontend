import React, { useEffect } from 'react'
import PageTitle from '../coponents/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { getAllMyOrders, removeErrors, cancelMyOrder, removeSuccess } from '../features/Order/OrderSlice';
import { Link } from 'react-router-dom';
import { ExternalLink, PackageX, ChevronRight, Package, Clock, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import Loader from '../coponents/Loader';
import { toast } from 'react-toastify';

function MyOrders() {
    const { orders, loading, error, success } = useSelector(state => state.order)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllMyOrders())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'top-center', autoClose: 3000,
                closeOnClick: true, pauseOnHover: true, draggable: true,
            });
            dispatch(removeErrors());
        }
    }, [dispatch, error])

    useEffect(() => {
        if (success) {
            toast.success(success, {
                position: 'top-center', autoClose: 3000,
            });
            dispatch(removeSuccess());
        }
    }, [dispatch, success])

    const handleCancelOrder = (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        dispatch(cancelMyOrder(orderId));
    }

    const statusConfig = {
        Processing: { style: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
        Shipped: { style: 'bg-blue-50 text-blue-700 border-blue-200', icon: Package },
        Delivered: { style: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
        Cancelled: { style: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
    }

    const getStatus = (status) => statusConfig[status] || { style: 'bg-gray-50 text-gray-600 border-gray-200', icon: Package }

    return (
        <>
            <PageTitle title="User Order" />

            <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-gray-50 to-gray-50 pt-24 lg:pt-20 lg:mt-16 pb-16 px-4">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="mb-8 flex items-end justify-between flex-wrap gap-3">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
                            <p className="text-gray-500 text-sm mt-1.5">Track and manage your recent purchases</p>
                        </div>
                        {!loading && orders.length > 0 && (
                            <span className="text-xs font-medium text-gray-400 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm">
                                {orders.length} order{orders.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <Loader />
                    ) : orders.length > 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Desktop table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/70 border-b border-gray-100">
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {orders.map((order) => {
                                            const { style, icon: StatusIcon } = getStatus(order.orderStatus)
                                            return (
                                                <tr key={order._id} className="group hover:bg-emerald-50/30 transition-colors duration-200">
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-semibold text-gray-700 font-mono tracking-tight">
                                                            #{order._id.slice(-8).toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${style}`}>
                                                            <StatusIcon size={12} strokeWidth={2.5} />
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-[#0E5D33]">
                                                        Rs. {order.totalPrice.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="inline-flex items-center gap-3">
                                                            {order.orderStatus === 'Processing' && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCancelOrder(order._id)}
                                                                    className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                                                >
                                                                    <Trash2 size={14} />
                                                                    Cancel
                                                                </button>
                                                            )}
                                                            <Link
                                                                to={`/order/${order._id}`}
                                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0E5D33] group-hover:text-[#127a43] transition-colors"
                                                            >
                                                                View
                                                                <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className="md:hidden divide-y divide-gray-50">
                                {orders.map((order) => {
                                    const { style, icon: StatusIcon } = getStatus(order.orderStatus)
                                    return (
                                        <div
                                            key={order._id}
                                            className="flex items-center justify-between p-4 active:bg-emerald-50/50 transition-colors"
                                        >
                                            <Link
                                                to={`/order/${order._id}`}
                                                className="min-w-0 flex-1 space-y-2"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-gray-800 font-mono">
                                                        #{order._id.slice(-8).toUpperCase()}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''} • Rs. {order.totalPrice.toLocaleString()}
                                                </p>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${style}`}>
                                                    <StatusIcon size={11} strokeWidth={2.5} />
                                                    {order.orderStatus}
                                                </span>
                                            </Link>
                                            {order.orderStatus === 'Processing' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700"
                                                    aria-label="Cancel order"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                            <Link to={`/order/${order._id}`} className="ml-2 flex-shrink-0">
                                                <ChevronRight size={18} className="text-gray-300" />
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-24 px-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 rounded-full bg-[#0E5D33]/10 flex items-center justify-center mb-6 animate-in fade-in zoom-in duration-500">
                                <PackageX className="w-9 h-9 text-[#0E5D33]" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-gray-800 text-xl font-semibold mb-2">No orders yet</h3>
                            <p className="text-gray-400 text-sm mb-8 max-w-xs">
                                You haven't placed any orders. Start shopping to see them here.
                            </p>
                            <Link
                                to="/products"
                                className="px-7 py-3 rounded-full bg-gradient-to-br from-[#0E5D33] to-[#127a43] text-white text-sm font-medium shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-200"
                            >
                                Browse Products
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default MyOrders