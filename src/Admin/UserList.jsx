import React, { useEffect, useMemo, useState } from "react";
import PageTitle from "../coponents/PageTitle";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Search, Edit, Trash2, ShieldCheck, User, Mail, Calendar, Users, ChevronRight, } from "lucide-react";
import { Dashboard, AddBox, Inventory, People, Star, ShoppingCart, } from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";

import { fetchUsers, deleteUser, removeErrors, clearMessage, } from "../features/Admin/AdminSlice";

import { toast } from "react-toastify";
import Loader from "../coponents/Loader";

const navSections = [
  {
    title: "Products",
    links: [
      { to: "/admin/products", label: "All Products", icon: Inventory },
      { to: "/admin/product/create", label: "Create Products", icon: AddBox },
    ],
  },
  { title: "User", links: [{ to: "/admin/user", label: "All Users", icon: People }] },
  { title: "Orders", links: [{ to: "/admin/orders", label: "All Orders", icon: ShoppingCart }] },
  { title: "Reviews", links: [{ to: "/admin/reviews", label: "All Reviews", icon: Star }] },
];

function UserList() {
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    users = [],
    loading,
    error,
    message,
  } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");

  // Load Users
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Error & Success
  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });

      dispatch(removeErrors());
    }

    if (message) {
      toast.success(message, { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });

      dispatch(clearMessage());

      navigate("/admin/user");
    }
  }, [dispatch, error, message, navigate]);

  // Delete User
  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(
      `Delete "${name}" permanently?`
    );

    if (!confirmDelete) return;

    dispatch(deleteUser(id));
    navigate("/admin/user");
  };

  // Search Users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [users, search]);

  // Statistics
  const totalUsers = users.length;

  const totalAdmins = users.filter(
    (u) => u.role === "admin"
  ).length;

  const totalCustomers = users.filter(
    (u) => u.role === "user"
  ).length;

  return (
    <>
      <PageTitle title="All Users" />

      <div className="min-h-screen bg-slate-100 pt-16 mt-16">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 mx-4 sm:mx-6 mt-6 rounded-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-600 border-2 border-white/40 flex items-center justify-center text-white font-semibold text-lg">
              <Users size={26} />
            </div>
            <div className="text-white">
              <p className="font-semibold text-lg leading-tight">Users Management</p>
              <p className="text-emerald-100 text-sm">Manage all registered users of PakCartify</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 py-6">
          {/* Sidebar */}

          <div className="lg:hidden w-full mb-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-full bg-emerald-800 text-white rounded-xl px-5 py-4 flex items-center justify-between shadow-md"
            >
              <span className="flex items-center gap-3 font-semibold">
                Admin Menu
              </span>
              <span className={`transition-transform duration-300 ${showMenu ? "rotate-90" : ""}`}>▶</span>
            </button>
          </div>
          <aside className={`w-full lg:w-64 shrink-0 ${showMenu ? "block" : "hidden"} lg:block self-start sticky top-32 max-h-[calc(100vh-3rem)] overflow-y-auto`}>
            <div className="bg-emerald-800 rounded-xl px-5 py-4 mb-3">
              <p className="text-white font-semibold">Admin Panel</p>
              <p className="text-emerald-200 text-xs mt-0.5">Manage everything from here</p>
            </div>
            <nav className="bg-white rounded-xl p-3 space-y-4">
              <Link
                to="/admin/dashboard"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-800 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Dashboard fontSize="small" className="text-slate-400" />
                  Dashboard
                </span>
                <ChevronRight size={16} className="text-slate-300" />
              </Link>
              {navSections.map((section) => (
                <div key={section.title}>
                  <h3 className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {section.title}
                  </h3>
                  {section.links.map(({ to, label, icon: Icon }) => {
                    const isActive = to === "/admin/users";
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                          }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon fontSize="small" className={isActive ? "" : "text-slate-400"} />
                          {label}
                        </span>
                        <ChevronRight size={16} className="text-slate-300" />
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {loading ? (<Loader />) : (
              <>
                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Total */}
                  <div className="bg-white rounded-2xl shadow-lg p-4 border border-emerald-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-slate-500 text-sm">Total Users</p>
                        <h2 className="text-2xl font-bold text-emerald-700 mt-1">{totalUsers}</h2>
                      </div>
                      <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Users size={22} className="text-emerald-700" />
                      </div>
                    </div>
                  </div>

                  {/* Admin */}
                  <div className="bg-white rounded-2xl shadow-lg p-4 border border-emerald-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-slate-500 text-sm">Admins</p>
                        <h2 className="text-2xl font-bold text-green-700 mt-1">{totalAdmins}</h2>
                      </div>
                      <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                        <ShieldCheck size={22} className="text-green-700" />
                      </div>
                    </div>
                  </div>

                  {/* Customers */}
                  <div className="bg-white rounded-2xl shadow-lg p-4 border border-emerald-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-slate-500 text-sm">Customers</p>
                        <h2 className="text-2xl font-bold text-blue-700 mt-1">{totalCustomers}</h2>
                      </div>
                      <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={22} className="text-blue-700" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-5 mb-6">
                  <div className="relative">
                    <Search
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Search user by name, email or role..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-emerald-700 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left">#</th>
                          <th className="px-6 py-4 text-left">User</th>
                          <th className="px-6 py-4 text-left">Email</th>
                          <th className="px-6 py-4 text-left">Role</th>
                          <th className="px-6 py-4 text-left">Joined</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-16 text-slate-500 text-lg">
                              No Users Found
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((user, index) => (
                            <tr
                              key={user._id}
                              className="border-b border-slate-100 hover:bg-emerald-50 transition duration-300"
                            >
                              {/* Serial */}
                              <td className="px-6 py-5 font-semibold text-slate-600">
                                {index + 1}
                              </td>

                              {/* User */}
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-700 text-white flex items-center justify-center font-bold text-lg uppercase shadow">
                                    {user.name.charAt(0)}
                                  </div>

                                  <div>
                                    <h3 className="font-semibold text-slate-800">{user.name}</h3>
                                    <p className="text-sm text-slate-500">
                                      ID : {user._id.slice(-6)}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Email */}
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                  <Mail size={16} className="text-slate-400" />
                                  <span className="text-slate-700">{user.email}</span>
                                </div>
                              </td>

                              {/* Role */}
                              <td className="px-6 py-5">
                                {user.role === "admin" ? (
                                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                                    <ShieldCheck size={16} />
                                    Admin
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                                    <User size={16} />
                                    User
                                  </span>
                                )}
                              </td>

                              {/* Created */}
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                  <Calendar size={16} className="text-slate-400" />
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="px-6 py-5">
                                <div className="flex justify-center gap-3">
                                  <Link
                                    to={`/admin/user/update/${user._id}`}
                                    className="w-11 h-11 rounded-xl bg-blue-100 text-blue-400 hover:bg-green-600  hover:text-white flex items-center justify-center transition duration-300"
                                  >
                                    <Edit size={18} />
                                  </Link>

                                  <button
                                    onClick={() => handleDelete(user._id, user.name)}
                                    className="w-11 h-11 rounded-xl bg-red-100 text-red-400 hover:bg-red-400 cursor-pointer hover:text-white flex items-center justify-center transition duration-300"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default UserList;