import React, { useState, useEffect } from "react";
import { Phone, Email, LocationOn } from "@mui/icons-material";
import PageTitle from "../coponents/PageTitle";

export default function ContactUs() {

  return (
    <>

      <PageTitle title="ContacUs-PakBazaar" />

      <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-6 mt-[90px]">

        <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white shadow-2xl rounded-3xl overflow-hidden">

          {/* LEFT SIDE */}
          <div className="bg-gradient-to-br bg-[#0A4A28]  text-white p-6 md:p-10 flex flex-col justify-center">

            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>

            <p className="text-green-100 mb-10 leading-relaxed">
              We’d love to hear from you! Whether you have questions about products,
              pricing, or support — our team is always ready to help you.
            </p>

            {/* Contact Cards */}
            <div className="space-y-5">

              {/* Address */}
              <div className="flex items-start gap-4 bg-white/10 p-4 rounded-xl hover:bg-white/20 transition">
                <div className="bg-white text-[#0A4A28] p-2 rounded-full">
                  <LocationOn />
                </div>
                <div>
                  <h4 className="font-semibold">Address</h4>
                  <p className="text-green-100 text-sm">
                    Lahore, Punjab, Pakistan
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 bg-white/10 p-4 rounded-xl hover:bg-white/20 transition">
                <div className="bg-white text-[#0A4A28] p-2 rounded-full">
                  <Phone />
                </div>
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <p className="text-green-100 text-sm">+92 328 9047057</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 bg-white/10 p-4 rounded-xl hover:bg-white/20 transition">
                <div className="bg-white text-[#0A4A28] p-2 rounded-full">
                  <Email />
                </div>
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-green-100 text-sm">fahadahmad0621@gmail.com</p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-6 md:p-10 bg-white">

            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              Send Message
            </h3>
            <p className="text-gray-500 mb-6">
              Fill this form and we’ll get back to you soon.
            </p>

            <form className="space-y-4">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-600 outline-none transition"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-600 outline-none transition"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-600 outline-none transition"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-600 outline-none transition"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-gradient-to-r bg-[#0A4A28]  text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition cursor-pointer"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>
      </div>

    </>
  );
}