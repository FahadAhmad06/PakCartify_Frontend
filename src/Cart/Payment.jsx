import React, { useState } from "react";
import PageTitle from "../coponents/PageTitle";
import CheckoutPath from "./CheckoutPath";
import { useNavigate, Link } from "react-router-dom";
import { formatPKR } from "../utils/formatCurrency";

import {ShieldCheck,Truck,ArrowLeft,ChevronDown,Banknote,PackageCheck,MapPin,} from "lucide-react";

function Payment() {
  const navigate = useNavigate();

  const orderItem = JSON.parse(sessionStorage.getItem("orderInfo")) || {};
  const { subtotal = 0, shipping = 0, tax = 0, discountAmount = 0, total = 0 } =
    orderItem;

  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handlePay = () => {
    if (!agreed) return;
    sessionStorage.setItem("paymentMethod", "Cash on Delivery");
    navigate("/order/success");
  };

  const canPay = agreed;

  return (
    <>
      <PageTitle title="Cash on Delivery" />
      <CheckoutPath activepath={2} />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 pt-5 pb-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Payment Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 min-h-[640px] flex flex-col">
              <div className="flex items-center gap-3 mb-10">
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <Banknote className="text-emerald-600" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Cash on Delivery
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Pay in cash when your order arrives.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 items-center flex-1">
                {/* COD Illustration */}
                <div className="relative w-full aspect-[3/4] md:aspect-[4/5] rounded-3xl bg-gradient-to-br from-[#0E5D33] via-emerald-700 to-green-900 shadow-2xl overflow-hidden">
                  {/* soft glow shapes */}
                  <div className="absolute -top-10 -right-10 w-44 h-44 bg-emerald-400/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-20 -left-12 w-56 h-56 bg-white/10 rounded-full blur-2xl" />

                  {/* floating trust badge */}
                  <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
                    <ShieldCheck className="text-[#0E5D33]" size={18} />
                    <span className="text-xs font-semibold text-gray-800">
                      100% Safe & Verified
                    </span>
                  </div>

                  <div className="relative h-full flex flex-col justify-between p-7 text-white">
                    <div className="flex items-center gap-4 pt-5">
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl ">
                        <PackageCheck size={40} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold drop-shadow pt-2">
                          Your order is almost ready
                        </h3>
                        <p className="text-green-100 text-sm mt-1 drop-shadow">
                          Simply pay cash when it arrives.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Banknote size={18} />
                        <span>Payment collected at delivery</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin size={18} />
                        <span>Available across Pakistan</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Truck size={18} />
                        <span>Fast and secure home delivery</span>
                      </div>

                      <hr className="border-white/20" />

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <p className="text-lg font-bold leading-none">1-3</p>
                          <p className="text-[11px] text-white/70 mt-1">
                            Days to deliver
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold leading-none">4.8★</p>
                          <p className="text-[11px] text-white/70 mt-1">
                            Rated by customers
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-5 h-full flex flex-col justify-center">
                  <div className="bg-emerald-50 rounded-2xl p-6">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      No advance payment needed. Your order will be prepared
                      and dispatched right away, and you'll pay the rider in
                      cash once it's delivered to your doorstep.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <ShieldCheck className="text-emerald-600 flex-shrink-0" size={18} />
                    <span>Order verified before dispatch</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <Truck className="text-emerald-600 flex-shrink-0" size={18} />
                    <span>Reliable, tracked courier delivery</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <Banknote className="text-emerald-600 flex-shrink-0" size={18} />
                    <span>Pay exact amount, no hidden charges</span>
                  </div>
                </div>
              </div>

              {/* Info strip */}
              <div className="mt-10 pt-6 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Payment Method
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-4 py-2">
                    Cash on Delivery
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/order/confirm"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-700 font-medium transition"
            >
              <ArrowLeft size={18} />
              Go Back
            </Link>
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
                    <span>Discount</span>
                    <span>- {formatPKR(discountAmount)}</span>
                  </div>
                )}

                <hr className="border-gray-100" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#0E5D33]">{formatPKR(total)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-5 bg-emerald-50 rounded-xl p-4 flex justify-between">
                <span className="text-gray-700">Payment</span>
                <span className="font-semibold text-[#0E5D33]">
                  Cash on Delivery
                </span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePay}
                disabled={!canPay}
                className={`w-full flex items-center justify-center gap-3 font-semibold py-4 rounded-4xl transition-all duration-300 shadow-lg mt-6 ${
                  canPay
                    ? "bg-[#0E5D33] hover:bg-green-800 text-white cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Place Order
                <PackageCheck size={20} />
              </button>

              {/* Terms & Conditions - below button */}
              <div className="mt-5 border-t border-gray-100 pt-4">
                <label className="flex items-start gap-3 cursor-pointer select-none mb-2">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-[#0E5D33] cursor-pointer flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms((prev) => !prev)}
                      className="font-semibold text-[#0E5D33] underline underline-offset-2 hover:text-green-800"
                    >
                      Terms &amp; Conditions
                    </button>
                  </span>
                </label>

                {!agreed && (
                  <p className="text-xs text-red-500">
                    Please accept the terms &amp; conditions to continue.
                  </p>
                )}

                {/* Expandable terms panel */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    showTerms
                      ? "grid-rows-[1fr] opacity-100 mt-3"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-600 leading-relaxed space-y-2 max-h-48 overflow-y-auto">
                      <p>1. Order will be confirmed before dispatch.</p>
                      <p>
                        2. Customer must provide correct delivery information.
                      </p>
                      <p>
                        3. Payment will be collected in cash after receiving
                        the parcel.
                      </p>
                      <p>4. Return policy will follow store rules.</p>
                      <p>5. Fake or unconfirmed orders may be cancelled.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTerms((prev) => !prev)}
                  className="flex items-center gap-1 text-xs text-gray-400 mt-2 hover:text-gray-600 transition"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      showTerms ? "rotate-180" : ""
                    }`}
                  />
                  {showTerms ? "Hide details" : "View full terms"}
                </button>
              </div>

              {/* Security Box */}
              <div className="mt-6 bg-emerald-50 rounded-2xl p-4">
                <div className="flex gap-3 items-start">
                  <ShieldCheck className="text-emerald-600 mt-1" size={22} />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Safe & Secure
                    </h4>
                    <p className="text-sm text-gray-600">
                      Your COD order is protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;