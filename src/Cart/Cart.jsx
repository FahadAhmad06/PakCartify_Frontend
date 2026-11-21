import React, { useState } from 'react'
import PageTitle from '../coponents/PageTitle'
import Cartitem from './Cartitem'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { applyCoupon, removeCoupon } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'
import { FiLock, FiTruck, FiClock, FiShield, FiHeadphones, FiCreditCard } from 'react-icons/fi'
import { formatPKR } from '../utils/formatCurrency'
import { ShoppingCart } from "lucide-react";


function Cart() {

  const { cartItems, appliedCoupon } = useSelector(state => state.cart)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isFirstTimeUser = !localStorage.getItem('welcomeCouponUsed')

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const shipping = subtotal > 2999 ? 0 : 100
  const taxRate = 0.08
  const tax = subtotal * taxRate

  const discountPercent = appliedCoupon === 'WELCOME20' ? 20 : 0
  const discountAmount = (subtotal * discountPercent) / 100

  const total = subtotal + shipping + tax - discountAmount

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase()

    if (!code) {
      setCouponError('Please enter a coupon code')
      return
    }
    if (code !== 'WELCOME20') {
      setCouponError('Invalid coupon code')
      dispatch(removeCoupon())
      return
    }
    if (!isFirstTimeUser) {
      setCouponError('WELCOME20 is valid for first-time users only')
      dispatch(removeCoupon())
      return
    }

    dispatch(applyCoupon('WELCOME20'))
    setCouponError('')
    toast.success('Coupon applied! You got 20% off 🎉', {
      position: 'top-center', autoClose: 3000,
      closeOnClick: true, pauseOnHover: true, draggable: true,
    })

  }

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon())
    setCouponInput('')
    setCouponError('')
  }

  const handleCheckout = async () => {
    setCheckoutLoading(true)
      
      if (appliedCoupon === 'WELCOME20') {
        localStorage.setItem('welcomeCouponUsed', 'true')
      }
      navigate(`/login?redirect=/shipping`) 

  }


  
  return (
    <>
      <PageTitle title="Your Cart" />
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 px-6 pt-32 mt-32 ">
          <div className="w-20 h-20 rounded-full bg-[#0E5D33]/10 flex items-center justify-center mb-6 animate-in fade-in zoom-in duration-500">
            <ShoppingCart className="w-9 h-9 text-[#0E5D33]" strokeWidth={1.5} />
          </div>

          <h3 className="text-gray-800 text-xl font-semibold mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-400 text-sm mb-8 max-w-xs">
            Looks like you haven't added anything yet. Explore our products and find something you'll love.
          </p>

          <Link
            to="/products"
            className="px-7 py-3 rounded-full bg-[#0E5D33] text-white text-sm font-medium shadow-sm hover:bg-[#127a43] hover:shadow-md hover:scale-[1.03] transition-all duration-200"
          >
            View Products
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 pt-20 mt-20">

          <div className="flex flex-col lg:flex-row gap-6">

            {/* Cart Items */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="hidden sm:grid grid-cols-4 gap-4 pb-3 mb-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <div className="col-span-1">Product</div>
                <div>Quantity</div>
                <div>Item Total</div>
                <div className="text-right">Actions</div>
              </div>

              <div className="flex flex-col gap-3">
                {cartItems && cartItems.map(item => (
                  <Cartitem item={item} key={item.cartItemId || item.product} />
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 sticky top-6">

                <h3 className="font-bold text-gray-800 text-lg mb-5">Order Summary</h3>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <p>Subtotal ({itemCount} item{itemCount > 1 ? 's' : ''})</p>
                  <p className="font-medium text-gray-800">{formatPKR(subtotal)}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <p>Shipping</p>
                  <p className="font-medium text-gray-800">{shipping === 0 ? 'Free' : formatPKR(shipping)}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <p>Tax ({(taxRate * 100).toFixed(0)}%)</p>
                  <p className="font-medium text-gray-800">{formatPKR(tax)}</p>
                </div>

                <div className="border-t border-gray-100 mb-4" />

                {/* Coupon Section */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Coupon Code</p>
                  {!appliedCoupon ? (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value)
                            setCouponError('')
                          }}
                          placeholder="Enter coupon code"
                          className="flex-1 min-w-0 text-sm px-3.5 py-2.5 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-[#0E5D33]/40 focus:bg-white transition-all uppercase placeholder:normal-case"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-5 py-2.5 rounded-full bg-[#0E5D33] text-white text-xs font-semibold hover:bg-[#127a43] transition-colors cursor-pointer flex-shrink-0"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-red-500 text-xs mt-1.5 px-1">{couponError}</p>
                      )}
                      {isFirstTimeUser && !couponError && (
                        <p className="text-[#0E5D33] text-xs mt-1.5 px-1">
                          🎉 Use <strong>WELCOME20</strong> for 20% off on your first order!
                        </p>
                      )}
                      {import.meta.env.DEV && (
                        <button
                          type="button"
                          onClick={() => {
                            localStorage.removeItem('welcomeCouponUsed')
                            toast.info('Coupon reset (dev only)')
                          }}
                          className="text-[10px] text-gray-400 underline mt-2"
                        >
                          Reset Coupon (dev)
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-3.5 py-2.5">
                      <div>
                        <p className="text-xs font-semibold text-green-700">WELCOME20 applied</p>
                        <p className="text-[11px] text-green-600">20% discount on your order</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[11px] font-medium text-red-500 hover:text-red-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 mb-4" />

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-sm mb-3">
                    <p className="text-gray-600">Discount</p>
                    <p className="font-semibold text-green-600">-{formatPKR(discountAmount)}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-5">
                  <p className="font-bold text-gray-800 text-base">Total</p>
                  <p className="font-bold text-[#0E5D33] text-2xl">{formatPKR(total)}</p>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-br from-[#0E5D33] to-[#127a43] text-white font-semibold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" 
                >
                  <FiLock size={15} />
                  {checkoutLoading ? 'Placing Order...' : 'Proceed to Checkout'}
                </button>

                {/* Trust badges */}
                <div className="flex flex-col gap-2.5 mt-5">
                  <div className="flex items-center gap-2.5 text-xs text-gray-500">
                    <FiTruck size={15} className="text-[#0E5D33]" />
                    Free shipping on orders over {formatPKR(2999)}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-500">
                    <FiClock size={15} className="text-[#0E5D33]" />
                    30-day money-back guarantee
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-500">
                    <FiShield size={15} className="text-[#0E5D33]" />
                    Secure payment
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6">
            <div className="flex flex-wrap items-center justify-around gap-6 divide-x divide-gray-100">
              <div className="flex items-center gap-3 px-2">
                <div className="w-11 h-11 rounded-full bg-[#0E5D33]/10 flex items-center justify-center text-[#0E5D33] flex-shrink-0">
                  <FiHeadphones size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">24/7 Support</p>
                  <p className="text-xs text-gray-400">Dedicated support</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2">
                <div className="w-11 h-11 rounded-full bg-[#0E5D33]/10 flex items-center justify-center text-[#0E5D33] flex-shrink-0">
                  <FiTruck size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Fast Delivery</p>
                  <p className="text-xs text-gray-400">On-time, every time</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2">
                <div className="w-11 h-11 rounded-full bg-[#0E5D33]/10 flex items-center justify-center text-[#0E5D33] flex-shrink-0">
                  <FiCreditCard size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-400">100% protected checkout</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2">
                <div className="w-11 h-11 rounded-full bg-[#0E5D33]/10 flex items-center justify-center text-[#0E5D33] flex-shrink-0">
                  <FiShield size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Money-Back</p>
                  <p className="text-xs text-gray-400">30-day guarantee</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </>
  )
}

export default Cart