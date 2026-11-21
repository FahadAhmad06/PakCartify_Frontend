import React, { useEffect } from 'react'
import PageTitle from '../../coponents/PageTitle'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, removeErrors, cancelMyOrder, removeSuccess } from './OrderSlice'
import { toast } from 'react-toastify'
import { Package, MapPin, Phone, CreditCard, Clock, CheckCircle2, XCircle, Truck, Trash2 } from 'lucide-react'
import Loader from '../../coponents/Loader'
import { formatPKR } from '../../utils/formatCurrency'

function OrderDetails() {

    const { orderId } = useParams()
    const { order, loading, error, success } = useSelector(state => state.order)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getOrderDetails(orderId))
    }, [dispatch, orderId])

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'top-center', autoClose: 3000,
                closeOnClick: true, pauseOnHover: true, draggable: true,
            })
            dispatch(removeErrors())
        }
    }, [dispatch, error])

    useEffect(() => {
        if (success) {
            toast.success(success, { position: 'top-center', autoClose: 3000 })
            dispatch(removeSuccess())
            navigate('/order/user')
        }
    }, [dispatch, success, navigate])

    const handleCancelOrder = () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return
        dispatch(cancelMyOrder(orderId))
    }

    const {
        shippingInfo = {},
        orderItems = [],
        paymentInfo = {},
        orderStatus,
        totalPrice,
        taxPrice,
        shippingPrice,
        itemsPrice,
        discountAmount = 0,
        couponCode,
    } = order || {};

    const statusConfig = {
        Processing: { style: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
        Shipped: { style: 'bg-blue-50 text-blue-700 border-blue-200', icon: Truck },
        Delivered: { style: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
        Cancelled: { style: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
    }
    const status = statusConfig[orderStatus] || { style: 'bg-gray-50 text-gray-600 border-gray-200', icon: Package }
    const StatusIcon = status.icon

    // Payment sirf tab "Paid" hoga jab order Delivered ho chuka ho (COD logic)
    const isPaid = orderStatus === 'Delivered'

    const steps = ['Processing', 'Shipped', 'Delivered']
    const currentStepIndex = orderStatus === 'Cancelled' ? -1 : steps.indexOf(orderStatus)

    return (
        <>
            <PageTitle title={`Order #${orderId?.slice(-8).toUpperCase()}`} />

            {loading ? (
                <Loader />
            ) : (
                <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-gray-50 to-gray-50 pt-24 lg:pt-20 lg:mt-20 pb-16 px-4">
                    <div className="max-w-4xl mx-auto space-y-6">

                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Order #{orderId?.slice(-8).toUpperCase()}
                                </h1>
                                <p className="text-gray-400 text-xs mt-1">Order details and tracking</p>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border shadow-sm ${status.style}`}>
                                    <StatusIcon size={14} strokeWidth={2.5} />
                                    {orderStatus || 'Processing'}
                                </span>
                                {orderStatus === 'Processing' && (
                                    <button
                                        type="button"
                                        onClick={handleCancelOrder}
                                        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Progress Tracker */}
{orderStatus !== 'Cancelled' && (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-7">
        <div className="flex items-center justify-center">
            {steps.map((step, idx) => {
                const completed = idx < currentStepIndex
                const active = idx === currentStepIndex
                const StepIcon = statusConfig[step].icon
                return (
                    <React.Fragment key={step}>
                        {/* Step */}
                        <div className="flex flex-col items-center relative">

                            <div
                                className={`
                                    relative
                                    flex items-center justify-center
                                    w-14 h-14 sm:w-16 sm:h-16
                                    rounded-full
                                    border-2
                                    transition-all duration-500
                                    ${
                                        completed
                                        ? "bg-[#0E5D33] border-[#0E5D33] text-white shadow-lg shadow-emerald-200"
                                        : active
                                        ? "bg-white border-[#0E5D33] text-[#0E5D33] scale-110 shadow-xl shadow-emerald-100"
                                        : "bg-gray-100 border-gray-300 text-gray-400"
                                    }
                                `}
                            >
                                <StepIcon size={20} strokeWidth={2.5} />

                                {active && (
                                    <span className="
                                        absolute inset-0 rounded-full
                                        border-2 border-emerald-400
                                        animate-ping opacity-40
                                    " />
                                )}
                            </div>

                            <div className="text-center mt-3">
                                <h3
                                    className={`
                                        text-sm sm:text-base font-bold
                                        ${
                                            active
                                            ? "text-[#0E5D33]"
                                            : completed
                                            ? "text-gray-700"
                                            : "text-gray-400"
                                        }
                                    `}
                                >
                                    {step}
                                </h3>
                            </div>

                        </div>

                        {/* Connector */}
                        {idx !== steps.length - 1 && (
                            <div className="flex items-center mx-3 sm:mx-8 mb-6">
                                <div
                                    className={`
                                        h-1 w-12 sm:w-28 rounded-full
                                        transition-all duration-500
                                        ${
                                            idx < currentStepIndex
                                            ? "bg-gradient-to-r from-emerald-500 to-green-400"
                                            : "bg-gray-200"
                                        }
                                    `}
                                />
                            </div>
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    </div>
)}

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                            <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                                <Package size={18} className="text-[#0E5D33]" />
                                Order items
                            </h2>
                            <div className="flex flex-col gap-3">
                                {orderItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/60 hover:bg-gray-50 transition-colors">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-100 bg-white flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-[#0E5D33] text-sm">{formatPKR(item.price)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {/* Shipping Info */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                                <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                                    <MapPin size={18} className="text-[#0E5D33]" />
                                    Shipping info
                                </h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-2 text-gray-600">
                                        <MapPin size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span>
                                            {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country} - {shippingInfo.pinCode}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone size={15} className="text-gray-400 flex-shrink-0" />
                                        <span>{shippingInfo.PhoneNumber}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                                <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                                    <CreditCard size={18} className="text-[#0E5D33]" />
                                    Payment
                                </h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Method</span>
                                        <span className="font-medium text-gray-800">
                                            {paymentInfo.id === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Status</span>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isPaid
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-amber-50 text-amber-700'
                                            }`}>
                                            {isPaid ? <CheckCircle2 size={12} strokeWidth={2.5} /> : <Clock size={12} strokeWidth={2.5} />}
                                            {isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                            <h2 className="font-bold text-gray-800 text-lg mb-4">Order summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between text-gray-600">
                                    <span>Items price</span>
                                    <span>{formatPKR(itemsPrice)}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>{formatPKR(taxPrice)}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{shippingPrice === 0 ? 'Free' : formatPKR(shippingPrice)}</span>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex items-center justify-between text-emerald-600 font-medium">
                                        <span className="flex items-center gap-1.5">
                                            Discount
                                            {couponCode && (
                                                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                                                    {couponCode}
                                                </span>
                                            )}
                                        </span>
                                        <span>- {formatPKR(discountAmount)}</span>
                                    </div>
                                )}

                                <div className="border-t border-gray-100 my-2" />

                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-800">Total</span>
                                    <span className="font-bold text-[#0E5D33] text-xl">{formatPKR(totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default OrderDetails