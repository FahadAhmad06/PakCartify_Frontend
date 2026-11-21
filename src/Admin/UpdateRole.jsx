import React, { useEffect, useState } from "react";
import PageTitle from "../coponents/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {getSingleUser, removeErrors,removeSuccess,updateUserRole,} from "../features/Admin/AdminSlice";
import { toast } from "react-toastify";
import {User,Mail,Shield,ArrowLeft,Save,Loader2,} from "lucide-react";

function UpdateRole() {
  const { userId } = useParams();

  const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, success, error } = useSelector(
    (state) => state.admin
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const { name, email, role } = formData;

  useEffect(() => {
    dispatch(getSingleUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error,{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("User role updated successfully",{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
      dispatch(removeSuccess());
      navigate("/admin/users");
    }
  }, [dispatch, error, success, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updateUserRole({
        userId,
        role,
      })
    );
  };

  return (
    <>
      <PageTitle title="Update User Role" />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-white py-10 px-5 mt-18 pt-18">

        <div className="max-w-2xl mx-auto">

          {/* Header */}

          <div className="bg-gradient-to-r from-emerald-700 to-green-600 rounded-2xl shadow-lg p-6 mb-6">

            <h1 className="text-2xl font-bold text-white">
              Update User Role
            </h1>

            <p className="text-emerald-100 mt-1 text-sm">
              Manage user permissions securely.
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden"
          >

            <div className="bg-emerald-600 px-6 py-4">

              <h2 className="text-white text-base font-semibold">
                User Information
              </h2>

            </div>

            <div className="p-6 space-y-5">

              {/* Name */}

              <div>

                <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                  Name
                </label>

                <div className="relative">

                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                    size={17}
                  />

                  <input
                    type="text"
                    value={name}
                    readOnly
                    className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 bg-slate-100"
                  />

                </div>

              </div>

              {/* Email */}

              <div>

                <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                  Email
                </label>

                <div className="relative">

                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                    size={17}
                  />

                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 bg-slate-100"
                  />

                </div>

              </div>

              {/* Role */}

              <div>

                <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                  User Role
                </label>

                <div className="relative">

                  <Shield
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                    size={17}
                  />

                  <select
                    name="role"
                    value={role}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 outline-none"
                  >
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>

                </div>

              </div>

              {/* Info Card */}

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">

                <h3 className="font-bold text-emerald-700 mb-1.5 text-sm">
                  Permission Guide
                </h3>

                <ul className="space-y-1 text-xs text-slate-600 list-disc ml-4">
                  <li>User can browse and place orders.</li>
                  <li>Admin can manage products, users and orders.</li>
                  <li>Only assign Admin role to trusted users.</li>
                </ul>

              </div>

              {/* Buttons */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => navigate("/admin/user")}
                  className="flex-1 py-3 text-sm rounded-lg border-2 border-slate-300 font-semibold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm rounded-lg font-bold text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-green-700 hover:to-emerald-800 shadow-md transition disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Update Role
                    </>
                  )}
                </button>

              </div>

            </div>

          </form>

        </div>

      </div>
    </>
  );
}

export default UpdateRole;