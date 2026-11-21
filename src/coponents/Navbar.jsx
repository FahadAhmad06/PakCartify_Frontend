import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LocalShipping, Person, ShoppingCart } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import DiscountIcon from '@mui/icons-material/Discount';
import ReplayIcon from '@mui/icons-material/Replay';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useSelector } from 'react-redux';
import UserDashboard from "../user/UserDashboard";



const announcements = [
    { icon: LocalShipping, text: 'FREE DELIVERY on orders above PKR 2,999' },
    { icon: DiscountIcon, text: 'FLAT 20% OFF on your first order — code WELCOME20' },
    { icon: ReplayIcon, text: '7-Day Easy Returns, No Questions Asked' },
    { icon: VerifiedIcon, text: '100% Original Products, Guaranteed' },
    { icon: SupportAgentIcon, text: '24/7 Customer Support' },
];

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // For search now
    const [searchQuery, setSearchQuery] = useState("")
    const { isAuthenticated } = useSelector(state => state.user)
    const { cartItems } = useSelector(state => state.cart)

    const navigate = useNavigate()
    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
        } else {
            navigate(`/products`)
        }
        setSearchQuery("")
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isSearchOpen) setIsSearchOpen(false); // Agar menu kholein toh search band ho jaye
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isMenuOpen) setIsMenuOpen(false); // Agar search kholein toh menu band ho jaye
    };

    const navLinkClass = ({ isActive }) =>
        `no-underline font-medium transition-colors duration-300 relative pb-1 ${isActive
            ? 'text-[#1E8E5A] drop-shadow-[0_0_10px_#1E8E5A] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-[2px] after:bg-[#1E8E5A] after:shadow-[0_0_8px_#1E8E5A] after:rounded-full after:animate-pulse'
            : 'hover:text-[#1E8E5A] text-gray-700 md:text-black'
        }`;


    // Render the list twice so the marquee scroll loops seamlessly
    const announcementTrack = [...announcements, ...announcements];

    return (
        <nav className="fixed top-0 w-full z-[1000] shadow-sm bg-white">

            {/* Top Announcement Bar (scrolling marquee with diagonal pattern) */}
            <div className="relative bg-[#021A10] text-white py-2.5 overflow-hidden">

                {/* Subtle diagonal stripe pattern in the background */}
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(45deg, #FFD24C 0, #FFD24C 1px, transparent 1px, transparent 14px)',
                    }}
                />

                <div className="relative flex w-max animate-marquee">
                    {announcementTrack.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <span
                                key={index}
                                className="flex items-center gap-2 text-sm px-6 whitespace-nowrap"
                            >
                                <Icon fontSize="small" className="text-yellow-500 shrink-0" />
                                {item.text}
                                <span className="ml-6 text-yellow-500/40">✦</span>
                            </span>
                        );
                    })}
                </div>

                {/* Fades on either edge so the scroll looks clean */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#021A10] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#021A10] to-transparent" />

                <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                    .animate-marquee {
                    animation: marquee 22s linear infinite;
                    }
                    .animate-marquee:hover {
                    animation-play-state: paused;
                    }
                `}</style>
            </div>

            {/* Main Navbar Row */}
            <div className="max-w-[1800px] mx-auto px-3 sm:px-5 h-16 md:h-20 flex items-center justify-between relative">

                {/* Logo */}
                <div className="z-50 shrink-0">
                    <Link to="/" onClick={() => { setIsMenuOpen(false); setIsSearchOpen(false); }}>
                        <img src="/logo.png" alt="logo" className='w-28 sm:w-36 md:w-48 h-auto object-contain bg-transparent' />
                    </Link>
                </div>

                {/* Navigation Links  */}
                <div className={`
                    fixed top-0 right-0 h-full w-[60%] max-w-[300px] bg-white shadow-xl pt-24 px-6 transition-transform duration-300 ease-in-out z-40
                    md:static md:h-auto md:w-auto md:max-w-none md:bg-transparent md:shadow-none md:p-0 md:flex md:flex-1 md:ml-8
                    ${isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                `}>
                    <ul className='flex flex-col gap-6 list-none text-lg font-serif md:flex-row md:gap-6 m-0 p-0'>
                        <li><NavLink to="/" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
                        <li><NavLink to="/products" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Products</NavLink></li>
                        <li><NavLink to="/about-us" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>About Us</NavLink></li>
                        <li><NavLink to="/contact-us" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Contact Us</NavLink></li>
                    </ul>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">

                    {/* Desktop Search Bar  */}
                    <div className="hidden lg:flex items-center">
                        <form className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm m-0" onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="px-4 py-2 w-[240px] xl:w-[320px] outline-none text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="bg-[#0E5D33] hover:bg-[#0A4A28] text-white px-3 py-2 transition-all duration-300">
                                <SearchIcon focusable="false" />
                            </button>
                        </form>
                    </div>

                    {/* Mobile Search Icon Toggle Button (Hidden on Desktop) */}
                    <div className="block lg:hidden cursor-pointer text-[#021A10]" onClick={toggleSearch}>
                        {isSearchOpen ? <CloseIcon /> : <SearchIcon />}
                    </div>

                    {/* Track Order */}
                    <div className='relative flex items-center text-sm md:text-base'>
                        <NavLink to="/order/user" className={({ isActive }) => `${navLinkClass({ isActive })} flex items-center gap-2`}>
                            <LocalShipping className="hover:text-[#0E5D33] text-white stroke-black stroke-1" />
                            <span className='font-serif hidden md:inline'>  Track Order</span>
                        </NavLink>
                    </div>

                    {/* Cart */}
                    <div className="relative flex items-center text-sm md:text-base">
                        <NavLink
                            to="/cart"
                            className={({ isActive }) => `${navLinkClass({ isActive })} flex items-center gap-2`}>
                            <div className="relative">
                                <ShoppingCart className="text-white stroke-black stroke-1 hover:text-[#0E5D33]" />
                                <span className="absolute -top-2 -right-2 bg-[#0B6B3A] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            </div>

                            <span className="hidden md:inline font-serif">Cart</span>
                        </NavLink>
                    </div>

                    {/* Profile */}
                    {!isAuthenticated ? (
                        <NavLink to="/register" className={({ isActive }) => `${navLinkClass({ isActive })} flex items-center gap-1`}>
                            <Person className='hover:text-[#0E5D33] text-white stroke-black stroke-1' />
                            <p className='text-sm md:text-lg font-serif ml-1 hidden md:block m-0 md:pr-8'>
                                Login/Signup
                            </p>
                        </NavLink>
                    ) : (
                        <div className="md:pr-8">
                            <UserDashboard />
                        </div>
                    )}

                    {/* Hamburger Menu Icon */}
                    <div className="block md:hidden cursor-pointer z-50 text-[#141515]" onClick={toggleMenu}>
                        {isMenuOpen ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
                    </div>
                </div>
            </div>

            {/* Mobile Expandable Search Input Bar (Slick Slide Down Animation) */}
            <div className={`
                w-full bg-gray-50 border-t border-b border-gray-200 px-4 py-2 transition-all duration-300 ease-in-out lg:hidden
                ${isSearchOpen ? 'block opacity-100' : 'hidden opacity-0'}
            `}>
                <form className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm max-w-md mx-auto m-0">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="px-4 py-2 w-full outline-none text-sm"
                        autoFocus={isSearchOpen}
                    />
                    <button type="submit" className="bg-[#0E5D33] text-white px-4 py-2">
                        <SearchIcon focusable="false" fontSize="small" />
                    </button>
                </form>
            </div>

            {/* Mobile Menu Backdrop Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setIsMenuOpen(false)} />
            )}
        </nav>
    );
}

export default Navbar;