import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logout, removeSuccess } from '../features/user/userSlice';
import wishlist from '../pages/wishList';

function UserDashboard() {

    const { user } = useSelector(state => state.user)  
    const {cartItems}=useSelector(state=>state.cart)

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false)

    function toggleMnu() {
        setMenuVisible(!menuVisible)
    }

    const options = [
        { name: 'Orders', funcName: orders },
        { name: 'Profile', funcName: profile },
        { name: 'Cart', funcName: myCart },
        { name: 'Wishlist', funcName: wishlist },
        { name: 'LogOut', funcName: logoutUser }
    ]

    if (user?.role === 'admin') {
        options.unshift({ name: 'Messages', funcName: messages })
        options.unshift({ name: 'Admin Dashboard', funcName: dashboard })
    }

    function orders() { navigate("/order/user") }
    function profile() { navigate("/profile") }
    function wishlist() { navigate("/wishlist") }
    function dashboard() { navigate("/admin/dashboard") }
    function messages() { navigate("/admin/messages") }
    function myCart () { navigate("/cart") }

    function logoutUser() {
        dispatch(logout())
            .unwrap()
            .then(() => {
                toast.success('Logout Successful', {
                    position: 'top-center', autoClose: 3000,
                    closeOnClick: true, pauseOnHover: true,
                    draggable: true, progress: undefined
                })
                dispatch(removeSuccess())
                navigate('/login')
            })
            .catch((error) => {
                toast.error(error.message || 'Unable to log out. Please try again', {
                    position: 'top-center', autoClose: 3000,
                    closeOnClick: true, pauseOnHover: true,
                    draggable: true, progress: undefined
                })
                dispatch(removeSuccess())
                navigate('/login')
            })
    }

    return (
        <>
            {/* Dark Overlay */}
            {menuVisible && (
                <div
                    className="fixed inset-0 z-[999] bg-black/60 transition-all duration-300"
                    onClick={toggleMnu}
                />
            )}

            {/* Profile Button — Navbar mein inline */}
            <div className="relative flex items-center">
                <div
                    className="flex items-center cursor-pointer transition-colors duration-300"
                    onClick={toggleMnu}
                >
                    <img
                        src={user?.avatar?.url || '/profile.png'}
                        alt="profile picture"
                        className='w-[38px] h-[38px] rounded-full mr-[8px] object-cover border-2 border-[#0E5D33]'
                    />
                    <span className='text-[15px] font-serif text-[#021A10] font-bold hidden md:block max-w-[130px] truncate'>
                        {user?.name || 'User'}
                    </span>
                </div>

                {/* Dropdown Menu */}
                {menuVisible && (
                    <div className="absolute top-[50px] right-0 z-[1000] w-[160px]  rounded-lg shadow-lg p-[10px]">
                        {options.map((item) => (
                            <button
                                key={item.name}
                                className="w-full rounded-lg bg-[#0E5D33] p-3 mb-[8px] text-[14px] text-white transition-colors duration-300 hover:bg-[#1E8E5A] cursor-pointer last:mb-0"
                                onClick={() => { item.funcName(); toggleMnu(); }}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default UserDashboard