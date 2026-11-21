import React, { useEffect, useRef } from "react";
import PageTitle from "../coponents/PageTitle";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import {CheckCircle2,Home,ShoppingBag,Truck,Mail,AlertCircle,} from "lucide-react";
import { toast } from "react-toastify";
import { createOrder, removeErrors, removeSuccess } from "../features/Order/OrderSlice";
import { clearCart, removeCoupon } from "../features/cart/cartSlice";

function OrderSuccess() {

  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference')
  const { loading, success, error } = useSelector(state => state.order)
  const { cartItems, shippingInfo, appliedCoupon } = useSelector(state => state.cart)
  const dispatch = useDispatch()

  const hasFired = useRef(false)

  useEffect(() => {
    if (hasFired.current) return
    hasFired.current = true

    const createOrderData = async () => {
      try {
        const orderItem = JSON.parse(sessionStorage.getItem('orderInfo'))

        if (!orderItem) {
          toast.error('Order info not found. Please try again.', { position: 'top-center', autoClose: 5000 })
          return
        }

        if (!cartItems || cartItems.length === 0) {
          toast.error('Cart is empty. Cannot place order.', { position: 'top-center', autoClose: 5000 })
          return
        }

        const orderData = {
          shippingInfo: {
            address: shippingInfo?.address,
            city: shippingInfo?.city,
            state: shippingInfo?.state,
            country: shippingInfo?.country,
            pinCode: shippingInfo?.pincode,
            PhoneNumber: shippingInfo?.phoneNumber,
          },
          orderItems: cartItems.map((item) => ({
            name:     item.name,
            price:    item.price,
            quantity: item.quantity,
            image:    item.image,
            product:  item.product,
            color:    item.color  || null,   // variant color (null for non-variant products)
            size:     item.size   || null,   // variant size  (null for non-variant products)
          })),
          paymentInfo: {
            id: 'COD',
            status: 'succeeded'
          },
          itemsPrice: orderItem.subtotal,
          taxPrice: orderItem.tax,
          shippingPrice: orderItem.shipping,
          totalPrice: orderItem.total,
          couponCode: appliedCoupon || null,
          discountAmount: orderItem.discountAmount || 0,
        }

        const result = await dispatch(createOrder(orderData))
        sessionStorage.removeItem('orderInfo')

        if (createOrder.rejected.match(result)) {
          console.error('PAYLOAD:', result.payload)
          const errMsg = result.payload?.message
            || result.payload
            || result.error?.message
            || 'Order creation failed.'
          toast.error(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg), {
            position: 'top-center', autoClose: 5000
          })
        }

      } catch (err) {
        toast.error(err.message || 'Order Creation Failed', { position: 'top-center', autoClose: 5000 })
      }
    }

    createOrderData()
  }, [])

  useEffect(() => {
    if (success) {
      toast.success('Order Placed Successfully! 🎉', { position: 'top-center', autoClose: 5000 })
      dispatch(removeSuccess())
      dispatch(clearCart())
      dispatch(removeCoupon())
    }
  }, [dispatch, success])

  useEffect(() => {
    if (error) {
      const message = typeof error === 'string'
        ? error
        : error?.message || 'Order creation failed. Please contact support.'
      toast.error(message, { position: 'top-center', autoClose: 5000 })
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  return (
    <>
      <PageTitle title="Order Confirmed" />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 flex items-center justify-center px-4 py-16 pt-19 mt-19">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">

          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-40" />
            <div className="relative w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
              {error
                ? <AlertCircle className="text-red-500" size={56} />
                : <CheckCircle2 className="text-[#0E5D33]" size={56} />
              }
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {error ? 'Order Placed Failed!' : 'Order Placed Successfully!'}
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {error
              ? 'Your payment was received but order saving encountered an issue. Please contact support.'
              : 'Thank you for shopping with us. Your order has been confirmed and is now being processed.'
            }
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col items-center gap-2">
              <Mail className="text-emerald-600" size={22} />
              <span className="text-xs text-gray-600 leading-snug">Confirmation email sent</span>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col items-center gap-2">
              <Truck className="text-emerald-600" size={22} />
              <span className="text-xs text-gray-600 leading-snug">Shipping in 2–4 business days</span>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col items-center gap-2">
              <ShoppingBag className="text-emerald-600" size={22} />
              <span className="text-xs text-gray-600 leading-snug">Track order anytime</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 bg-[#0E5D33] hover:bg-green-800 text-white font-semibold py-3 rounded-4xl transition-all duration-300 shadow-lg"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <Link
              to="/order/user"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-4xl transition-all duration-300"
            >
              <ShoppingBag size={18} />
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderSuccess;