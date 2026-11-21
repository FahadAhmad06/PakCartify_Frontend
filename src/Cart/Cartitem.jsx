import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { addToCart, removeErrors, removeItemFromCart, removeMessage, removeSuccess, updateCartQuantity } from '../features/cart/cartSlice'
import { formatPKR } from '../utils/formatCurrency'

function Cartitem({ item }) {

    const { success, loading, error, message } = useSelector(state => state.cart)

    const [quantity, setQuantity] = useState(item.quantity)

    const dispatch = useDispatch()

    const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='11' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"

    const getImageSrc = () => {
    let src = null
    if (typeof item.image === 'string' && item.image.trim() !== '') {
        src = item.image
    } else if (item.image?.url && item.image.url.trim() !== '') {
        src = item.image.url
    }
    if (!src) return PLACEHOLDER
    // agar backend se relative './public/...' path aaye, use frontend public path bana do
    if (src.startsWith('./public/')) {
        return src.replace('./public', '')
    }
    return src
}

    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error('Quantity cannot be less than 1', { position: 'top-center', autoClose: 3000 })
            return
        }
        setQuantity(qty => qty - 1)
    }

    const increaseQuantity = () => {
        if (quantity >= item.stock) {
            toast.error(`Only ${item.stock} items available!`, { position: 'top-center', autoClose: 3000 })
            return
        }
        setQuantity(qty => qty + 1)
    }

    const handleUpdate = () => {
        if (loading) return;

        if (quantity !== item.quantity)
            dispatch(updateCartQuantity({ id: item.cartItemId || item.product, quantity }))
    }

    useEffect(() => {
        if (error) {
            toast.error(error.message || error || 'An error occurred', {
                position: 'top-center', autoClose: 3000,
                closeOnClick: true, pauseOnHover: true, draggable: true,
            })
            dispatch(removeErrors())
        }
    }, [dispatch, error])

    useEffect(() => {
        if (success && message) {
            toast.success(message, {
                position: 'top-center', autoClose: 3000,
                closeOnClick: true, pauseOnHover: true, draggable: true, toastId: 'cart-update'
            })
            dispatch(removeMessage())
            dispatch(removeSuccess())
        }
    }, [dispatch, success, message])

    const handleRemove = () => {
        if (loading) return;
        dispatch(removeItemFromCart(item.cartItemId || item.product))
        toast.success("Item removed from cart successfully", {
            position: 'top-center', autoClose: 3000,
            closeOnClick: true, pauseOnHover: true, draggable: true, toastId: 'cart-update'
        })
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6">
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-5 sm:gap-6">

                {/* Product */}
                <div className="flex items-center gap-4 min-w-0 w-full">
                    <img
                        src={getImageSrc()}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover border border-gray-100 shadow-sm flex-shrink-0 bg-gray-50"
                        onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = '/no-image.png'
                        }}
                    />
                    <div className="min-w-0 flex-1 space-y-1.5">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base break-words">{item.name}</h3>
                        {(item.color || item.size) && (
                            <p className="text-xs text-slate-500 flex gap-2 flex-wrap">
                                {item.color && item.color !== 'Default' && (
                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{item.color}</span>
                                )}
                                {item.size && item.size !== 'Standard' && (
                                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{item.size}</span>
                                )}
                            </p>
                        )}
                        <p className="text-xs sm:text-sm text-gray-500">
                            Price: <strong className="text-[#0E5D33]">{formatPKR(item.price)}</strong>
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                            Quantity: <strong className="text-gray-700">{item.quantity}</strong>
                        </p>
                    </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between sm:justify-start gap-3 w-full py-1 sm:py-0">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Quantity</span>
                    <div className="flex items-center gap-2.5 bg-gray-100 rounded-full px-2.5 py-2">
                        <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 font-bold shadow-sm hover:bg-[#0E5D33] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            onClick={decreaseQuantity}
                            disabled={loading}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            className="w-10 text-center text-sm font-medium bg-transparent outline-none"
                            readOnly
                            min="1"
                        />
                        <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 font-bold shadow-sm hover:bg-[#0E5D33] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            onClick={increaseQuantity}
                            disabled={loading}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Item Total */}
                <div className="flex items-center justify-between sm:justify-start w-full py-1 sm:py-0">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Item Total</span>
                    <span className="font-bold text-[#0E5D33] text-base sm:text-lg">
                        {formatPKR(item.price * item.quantity)}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2.5 w-full sm:items-end pt-1 sm:pt-0">
                    <button
                        type="button"
                        className="w-full sm:w-28 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-full bg-[#0E5D33] text-white hover:bg-[#127a43] shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        onClick={handleUpdate}
                        disabled={loading || quantity === item.quantity}
                    >
                        {loading ? 'Updating' : 'Update'}
                    </button>
                    <button
                        type="button"
                        className="w-full sm:w-28 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        disabled={loading}
                        onClick={handleRemove}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cartitem