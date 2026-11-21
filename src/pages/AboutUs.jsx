import React from "react";
import { Link } from "react-router-dom";
import PageTitle from "../coponents/PageTitle";


function AboutUs() {
  return (

    <>

      <PageTitle title="AboutUs-PakCartify" />

      <div className="bg-white min-h-screen">

        {/* Hero Section */}
        <section className="relative w-full h-[350px] md:h-[590px] mt-[115px]">
          <img
            src="/About.png"
            alt="About PakCatify"
            className="w-full h-full object-fill"
          />

          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl font-bold text-white mb-4">
              About Us
            </h1>

            <p className="text-white text-lg max-w-2xl">
              Welcome to PakCartify — your trusted online shopping destination
              for quality products, amazing deals, and fast delivery.
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

          {/* Left Image */}
          <div>
            <img
              src="public/About1.png"
              alt="Shopping"
              className="rounded-2xl shadow-lg w-full h-[300px] md:h-[450px] object-cover"
            />
          </div>

          {/* Right Content */}
          <div>
            <h2 className="text-4xl font-bold text-[#0E5D33] mb-6">
              Who We Are
            </h2>

            <p className="text-gray-700 text-lg leading-8 mb-6">
              PakCartify is an eCommerce platform designed to provide customers
              with a seamless and enjoyable shopping experience. We focus on
              delivering high-quality products at affordable prices while
              ensuring excellent customer service.
            </p>

            <p className="text-gray-700 text-lg leading-8 mb-6">
              Our mission is to make online shopping simple, secure, and
              accessible for everyone. From electronics to fashion and daily
              essentials, PakCartify offers everything in one place.
            </p>

            <Link to="/products">
              <button className="bg-[#0E5D33] hover:bg-[#094726] text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-md cursor-pointer">
                Explore Products
              </button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-6">

            <h2 className="text-4xl font-bold text-center text-[#0E5D33] mb-12">
              Why Choose Us
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

              {/* Card 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">🚚</div>

                <h3 className="text-2xl font-semibold mb-4">
                  Fast Delivery
                </h3>

                <p className="text-gray-600">
                  We ensure quick and reliable delivery for all your orders.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">💳</div>

                <h3 className="text-2xl font-semibold mb-4">
                  Secure Payment
                </h3>

                <p className="text-gray-600">
                  Your transactions are fully safe and protected with us.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">⭐</div>

                <h3 className="text-2xl font-semibold mb-4">
                  Quality Products
                </h3>

                <p className="text-gray-600">
                  We provide premium quality products at affordable prices.
                </p>
              </div>

            </div>
          </div>
        </section>

      </div>
    </>
  );
}

export default AboutUs;