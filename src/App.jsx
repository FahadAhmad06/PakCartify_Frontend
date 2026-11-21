
import React from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./coponents/Navbar";
import AboutUs from "./pages/AboutUs";
import Footer from "./coponents/Footer";
import ContactUs from "./pages/ContactUs";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import ComingSoon from "./pages/ComingSoon";

import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Register from "./user/Register";
import VerifyOtp from "./user/VerifyOtp";
import Login from "./user/Login"
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./features/user/userSlice";
import UserDashboard from "./user/userDashboard"
import Profile from "./user/Profile";
import ProtectRoute from "./coponents/ProtectRoute";
import UpdateProfile from "./user/UpdateProfile";
import { getMyFavorites } from './features/favorite/favoriteSlice'
import Wishlist from "./pages/wishList";
import UpdatePassword from "./user/UpdatePassword";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
// import Cart from "./Cart/Cart";
import ChatWidget from "./coponents/ChatWidget";
import AdminChatPanel from "./coponents/AdminChatPanel";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from "./Cart/Cart";
import Shipping from "./Cart/Shipping";
import OrderConfirm from "./Cart/OrderConfirm"
import Payment from "./Cart/Payment";
import OrderSuccess from "./Cart/OrderSuccess";
import MyOrders from "./Orders/MyOrders";
import OrderDetails from "./features/Order/OrderDetails";
import DashboardAdmin from "./Admin/DashboardAdmin";
import ProductsList from "./Admin/ProductsList";
import CreateProduct from "./Admin/CreateProduct";
import UpdateProduct from "./Admin/UpdateProduct";
import UserList from "./Admin/UserList";
import UpdateRole from "./Admin/UpdateRole";
import OrderList from "./Admin/OrderList";
import UpdateOrder from "./Admin/UpdateOrder";
import ReviewList from "./Admin/ReviewList";
import ShippingPrint from "./Admin/ShippingPrint";





function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return null;
}

function App() {

  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadUser())
  },[dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMyFavorites());
    }
  }, [isAuthenticated, dispatch])
  

  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/products" element={<Products />} />

        <Route path="/products/:keyword" element={<Products />} />

        <Route path="/register" element={<Register />} />

        <Route path="/register/verify" element={<VerifyOtp />} />

        <Route path="/login" element={<Login />} />
 
        <Route path="/comingsoon/track-order" element={<ComingSoon />} />
        
        <Route path="/comingsoon/cart" element={<ComingSoon />} />

        <Route path="/about-us" element={<AboutUs />} />

        <Route path="/contact-us" element={<ContactUs />} />

        <Route path="/profile" element={<ProtectRoute element= {<Profile />} />}/>

        <Route path="/profile/update" element={<ProtectRoute element= {<UpdateProfile />} />}/>

        <Route path="/wishlist" element={<ProtectRoute element= {<Wishlist />} />}/>
         
        <Route path="/password/update" element={<ProtectRoute element= {<UpdatePassword />} />}/>

        <Route path="/password/forgot" element={<ForgotPassword />} />
        
        <Route path="/admin/messages" element={<ProtectRoute element={<AdminChatPanel />} />} />


        <Route path="/process/payment" element={<ProtectRoute element={<Payment />} />} />


        <Route path="/order/success" element={<ProtectRoute element={<OrderSuccess />} />} />


        <Route path="/order/confirm" element={<ProtectRoute element={<OrderConfirm />} />} />

        <Route path="/cart" element={<Cart/>} />
        
        <Route path="/password/reset/:token" element={<ResetPassword />}/>
        
        <Route path="/shipping" element={<ProtectRoute element={<Shipping />} />} />

        <Route path="/order/user" element={<ProtectRoute element={<MyOrders />} />} />

        <Route path="/order/:orderId" element={<ProtectRoute element={<OrderDetails />} />} />


        {/*  Admin routes */}
        <Route path="/admin/dashboard" element={<ProtectRoute element={<DashboardAdmin />} adminOnly={user} />} />

        <Route path="/admin/products" element={<ProtectRoute element={<ProductsList />} adminOnly={user} />} />

        <Route path="/admin/products/update/:id" element={<ProtectRoute element={<UpdateProduct />} adminOnly={user} />} />
        
        <Route path="/admin/user" element={<ProtectRoute element={<UserList />} adminOnly={user} />} />

        <Route path="/admin/user/update/:userId" element={<ProtectRoute element={<UpdateRole />} adminOnly={user} />} />

        <Route path="/admin/orders" element={<ProtectRoute element={<OrderList/>} adminOnly={user} />} />

        <Route path="/admin/order/:id" element={<ProtectRoute element={<UpdateOrder/>} adminOnly={user} />} />
        
        <Route path="/admin/reviews" element={<ProtectRoute element={<ReviewList/>} adminOnly={user} />} />

        <Route path="/admin/shipping/print" element={<ProtectRoute element={<ShippingPrint />} adminOnly={user} />} />

        <Route path="/admin/product/create" element={<ProtectRoute element={<CreateProduct />} adminOnly={user} />} />

      </Routes>


      {/* {isAuthenticated && <UserDashboard user={user}/>} */}

      {isAuthenticated && <ChatWidget user={user} />}

        <ToastContainer />
      <Footer />
    </Router>
  )
}

export default App;