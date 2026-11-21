import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  removeErrors,
  removeSuccess,
  updateProfile,
} from "../features/user/userSlice";

import Loader from "../coponents/Loader";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PersonIcon from "@mui/icons-material/Person";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function UpdateProfile() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/profile.png");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user,
    error,
    success,
    message,
    loading,
  } = useSelector((state) => state.user);


  const profileImageUpdate = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      if (reader.readyState === 2) {

        setAvatarPreview(reader.result);
        setAvatar(reader.result);

      }

    };

    reader.readAsDataURL(file);

  };


  const updateSubmit = (e) => {

    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("phone", phone);
    myForm.set("avatar", avatar);

    dispatch(updateProfile(myForm));

  };


  useEffect(() => {

    if (error) {

      toast.error(error.message,{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });

      dispatch(removeErrors());

    }

  }, [dispatch, error]);

  useEffect(() => {

    if (success) {

      toast.success(message,{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });

      dispatch(removeSuccess());

      navigate("/profile");

    }

  }, [dispatch, success, message, navigate]);

  useEffect(() => {

    if (user) {

      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setAvatarPreview(user?.avatar?.url || "/profile.png");

    }

  }, [user]);


  return (

    <>
      {
        loading ?

          (<Loader />)

          :

          <div className="min-h-screen bg-gradient-to-br from-[#f5faf7] via-white to-[#edf8f2] pt-16 mt-20 pb-16">

            <div className="max-w-7xl mx-auto px-5">
              <div className="grid lg:grid-cols-5 bg-white rounded-[30px] shadow-2xl overflow-hidden">

                {/* Left Side */}

                <div className="lg:col-span-2 bg-gradient-to-br from-[#0E5D33] via-[#12713f] to-[#19934f] relative p-10 text-white flex flex-col justify-between">

                  {/* Background */}

                  <div className="absolute top-0 left-0 w-full h-full opacity-10">

                    <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white"></div>

                    <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white"></div>

                  </div>

                  <div className="relative z-10">


                    <h1 className="text-5xl font-extrabold mt-12 leading-tight">

                      Update Your <br />

                      Profile

                    </h1>

                    <div className="w-20 h-1 bg-white rounded-full mt-6"></div>

                    <p className="mt-8 text-green-100 text-lg leading-8">

                      Keep your personal information updated to enjoy a secure and
                      better shopping experience on PakCartify.

                    </p>

                  </div>

                  {/* Bottom */}

                  <div className="relative z-10 grid grid-cols-3 gap-5 mt-12">

                    <div className="text-center">

                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">

                        🛡️

                      </div>

                      <p className="mt-3 text-sm">

                        Secure

                      </p>

                    </div>

                    <div className="text-center">

                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">

                        🔄

                      </div>

                      <p className="mt-3 text-sm">

                        Updated

                      </p>

                    </div>

                    <div className="text-center">

                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">

                        👤

                      </div>

                      <p className="mt-3 text-sm">

                        Personal

                      </p>

                    </div>

                  </div>

                </div>

                {/* Right Side */}

                <div className="lg:col-span-3 p-10">

                  <h2 className="text-3xl font-bold text-gray-800">

                    Profile Picture

                  </h2>

                  <p className="text-gray-500 mt-2">

                    Upload a new profile picture and update your personal information.

                  </p>

                  {/* Avatar */}

                  <div className="flex justify-center mt-10 mb-10">

                    <div className="relative">

                      <img
                        src={avatarPreview}
                        alt="Profile"
                        className="w-44 h-44 rounded-full object-cover border-[5px] border-[#0E5D33]"
                      />

                      <label
                        htmlFor="avatar"
                        className="absolute bottom-2 right-2 w-14 h-14 rounded-full bg-[#0E5D33] hover:bg-[#0A4A28] text-white flex items-center justify-center cursor-pointer shadow-lg transition"
                      >

                        <CameraAltIcon />

                      </label>

                      <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={profileImageUpdate}
                      />

                    </div>

                  </div>

                  <form
                    onSubmit={updateSubmit}
                    encType="multipart/form-data"
                    className="space-y-6"
                  >

                    {/* Full Name */}

                    <div>

                      <label className="block mb-2 font-semibold text-gray-700">

                        Full Name

                      </label>

                      <div className="flex items-center border border-gray-300 rounded-2xl px-5 py-4 focus-within:border-[#0E5D33] focus-within:ring-2 focus-within:ring-green-100 transition">

                        <PersonIcon className="text-gray-400 mr-3" />

                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full outline-none bg-transparent"
                        />

                      </div>

                    </div>

                    {/* Email */}

                    <div>

                      <label className="block mb-2 font-semibold text-gray-700">

                        Email Address

                      </label>

                      <div className="flex items-center border border-gray-300 rounded-2xl px-5 py-4 focus-within:border-[#0E5D33] focus-within:ring-2 focus-within:ring-green-100 transition">

                        <EmailOutlinedIcon className="text-gray-400 mr-3" />

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full outline-none bg-transparent"
                        />

                      </div>

                    </div>

                    {/* Phone */}

                    <div>

                      <label className="block mb-2 font-semibold text-gray-700">

                        Phone Number

                      </label>

                      <div className="flex items-center border border-gray-300 rounded-2xl px-5 py-4 focus-within:border-[#0E5D33] focus-within:ring-2 focus-within:ring-green-100 transition">

                        <PhoneOutlinedIcon className="text-gray-400 mr-3" />

                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="03XXXXXXXXX"
                          className="w-full outline-none bg-transparent"
                        />

                      </div>

                    </div>

                    {/* Buttons */}

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">

                      <Link
                        to="/profile"
                        className="flex-1 border border-gray-300 hover:border-[#0E5D33] rounded-2xl py-4 text-center font-semibold transition-all duration-300"
                      >

                        Cancel

                      </Link>

                      <button
                        type="submit"
                        className="flex-1 bg-[#0E5D33] hover:bg-[#0A4A28] text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-xl cursor-pointer"
                      >

                        <SaveOutlinedIcon />

                        Update Profile

                      </button>

                    </div>

                  </form>

                  {/* Security Note */}

                  <div className="mt-10 rounded-2xl bg-green-50 border border-green-100 p-5">

                    <h3 className="text-[#0E5D33] font-bold text-lg">

                      🔒 Your Information is Safe

                    </h3>

                    <p className="text-gray-600 mt-2 leading-7">

                      Your personal information is securely stored and protected.
                      Updating your profile helps us provide a better shopping experience.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>





      }

    </>

  );

}

export default UpdateProfile;