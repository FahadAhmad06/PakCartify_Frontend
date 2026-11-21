import React from "react";
import PageTitle from "../coponents/PageTitle";
import CheckoutPath from "./CheckoutPath";
import { useSelector } from "react-redux";
import { Country, State } from "country-state-city";
import { useNavigate, Link } from "react-router-dom";
import { formatPKR } from "../utils/formatCurrency";

import {
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  Truck,
  User,
  ShoppingBag,
} from "lucide-react";

function OrderConfirm() {
  const { shippingInfo, cartItems, appliedCoupon } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ) || 0;

  const shipping = subtotal > 2999 ? 0 : 100;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;

  const discountPercent = appliedCoupon === "WELCOME20" ? 20 : 0;
  const discountAmount = (subtotal * discountPercent) / 100;

  const total = subtotal + shipping + tax - discountAmount;

  const countryName = shippingInfo?.country
    ? Country.getCountryByCode(shippingInfo.country)?.name || shippingInfo.country
    : "";
  const stateName =
    shippingInfo?.state && shippingInfo?.country
      ? State.getStateByCodeAndCountry(shippingInfo.state, shippingInfo.country)?.name || shippingInfo.state
      : "";
  const cityName = shippingInfo?.city || "";

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shipping,
      tax,
      discountAmount,
      couponCode: appliedCoupon || null,
      total,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/process/payment");
  };

  return (
    <>
      <PageTitle title="Confirm Order" />
      <CheckoutPath activepath={1} />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 pt-5 pb-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          
          {/* Shipping & Items Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Shipping Info Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <User className="text-emerald-600" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Shipping Details
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Please verify your delivery address.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                <div className="flex gap-3 items-start">
                  <User className="text-emerald-600 mt-1" size={18} />
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Name
                    </span>
                    <span className="font-semibold text-gray-800">
                      {user && user.name}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Phone className="text-emerald-600 mt-1" size={18} />
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Phone Number
                    </span>
                    <span className="font-semibold text-gray-800">
                      {shippingInfo && shippingInfo.phoneNumber}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-start md:col-span-2">
                  <MapPin className="text-emerald-600 mt-1" size={18} />
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Address
                    </span>
                    <span className="font-semibold text-gray-800 leading-relaxed">
                      {shippingInfo && shippingInfo.address}, {cityName}, {stateName} {shippingInfo && shippingInfo.pincode}, {countryName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Items Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <ShoppingBag className="text-emerald-600" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Your Cart Items
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Review items in your order.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto pr-2">
                {cartItems &&
                  cartItems.map((item) => (
                    <div
                      key={item.product}
                      className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <img
                        src={item.image || null}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-2xl border border-gray-100 flex-shrink-0 bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/no-image.png';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product}`}
                          className="font-bold text-gray-800 hover:text-emerald-600 transition block truncate text-base"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.quantity} ×{" "}
                          <span className="font-semibold text-gray-700">
                            {formatPKR(item.price)}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-800 text-lg">
                          {formatPKR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>

          {/* Order Summary Column */}
          <div className="h-fit sticky top-28">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
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

                <hr className="border-gray-100" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#0E5D33]">{formatPKR(total)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={proceedToPayment}
                className="w-full flex items-center justify-center gap-3 bg-[#0E5D33] hover:bg-green-800 text-white font-semibold py-4 rounded-4xl transition-all duration-300 shadow-lg cursor-pointer mt-6"
              >
                Proceed to Payment
                <ArrowRight size={20} />
              </button>

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
                  <p className="text-sm text-gray-700 font-medium">
                    Free delivery on orders above {formatPKR(2999)}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default OrderConfirm;