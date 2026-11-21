import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Rating from './Rating'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '../features/favorite/favoriteSlice'
import { addToCart, removeMessage, removeSuccess as removeCartSuccess } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'

function Products({ product }) {

    const [rating, setRatting] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { favorites } = useSelector((state) => state.favorite);
    const { isAuthenticated } = useSelector((state) => state.user);

    // Keep the card compatible with products created with or without variants.
    const variantList = Array.isArray(product?.variants) ? product.variants : [];
    const hasVariants = Boolean(product?.hasVariants && variantList.length > 0);
    const effectiveStock = hasVariants
        ? variantList.reduce((sum, variant) => sum + Math.max(0, Number(variant?.stock) || 0), 0)
        : Math.max(0, Number(product?.stock) || 0);
    const basePrice = Math.max(0, Number(product?.price) || 0);
    const variantPrices = hasVariants
        ? variantList
            .map((variant) => {
                const price = Number(variant?.price);
                return Number.isFinite(price) && price > 0 ? price : basePrice;
            })
            .filter((value) => value > 0)
        : [];
    const displayPrice = variantPrices.length > 0
        ? Math.min(...variantPrices)
        : Math.max(0, Number(product?.price) || 0);
    const originalPrice = Math.max(0, Number(product?.originalPrice) || 0);
    const discountPercentage = product?.showOriginalPrice && originalPrice > displayPrice && displayPrice > 0
        ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
        : 0;
    const mainImage = product?.image?.[0]?.url || product?.images?.[0]?.url || '';
    const formattedPrice = (value) => Number(value || 0).toLocaleString('en-PK');

    const isFavorited = favorites?.some(
        (fav) => fav._id === product._id || fav === product._id
    );

    const handleRatingChange = (newRating) => {
        setRatting(newRating)
    }

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
             toast.warning('Please login to add to wishlist!', {
                position: 'top-center',
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        dispatch(toggleFavorite(product._id));

        if (isFavorited) {
            toast.info(`"${product?.name || 'Untitled Product'}" removed from wishlist`, {
                position: 'top-center',
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {
            toast.success(`"${product?.name || 'Untitled Product'}" added to wishlist! ❤️`, {
                position: 'top-center',
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (effectiveStock <= 0) {
            toast.error('Product is out of stock!', { position: 'top-center', autoClose: 3000 });
            return;
        }

        // Variant products need the customer to choose their options first.
        if (hasVariants) {
            navigate(`/product/${product._id}`);
            return;
        }

        dispatch(addToCart({ id: product._id, quantity: 1 }))
            .unwrap()
            .then(() => {
                toast.success(`${product?.name || 'Untitled Product'} added to cart!`,{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
                // Clear Redux success/message so ProductDetails doesn't re-fire the toast
                dispatch(removeMessage());
                dispatch(removeCartSuccess());
            })
            .catch((err) => toast.error(err || 'Failed to add to cart',{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined }));
    }

    return (
        <Link to={`/product/${product._id}`} className='no-underline text-inherit block h-full'>
            <div className="w-full h-full text-[#1F2937] rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.12)] text-center transition-all duration-300 flex flex-col border border-gray-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] relative">

                {product.showOriginalPrice && discountPercentage > 0 && (
                    <div className="absolute top-0 left-3 sm:left-4 z-20">
                        <div className="relative bg-[#0E5D33] text-white w-12 h-16 sm:w-16 sm:h-20 flex flex-col items-center justify-center shadow-lg rounded-b-md">

                            <span className="text-base sm:text-xl font-bold leading-none">
                                -{discountPercentage}%
                            </span>

                            <span className="text-[8px] sm:text-[10px] tracking-widest uppercase">
                                OFF
                            </span>

                            <div className="absolute -bottom-[10px] left-0 w-0 h-0 border-l-[24px] sm:border-l-[32px] border-r-[24px] sm:border-r-[32px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#0E5D33]"></div>

                        </div>
                    </div>
                )}

                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md z-10 cursor-pointer"
                >
                    {isFavorited ? (
                        <FavoriteIcon className="text-red-600 " fontSize="small" />
                    ) : (
                        <FavoriteBorderIcon className="text-gray-500 hover:text-red-500" fontSize="small" />
                    )}
                </button>

                <div className="w-full h-[160px] sm:h-[190px] md:h-[200px] lg:h-[220px] xl:h-[240px] flex items-center justify-center p-2 sm:p-3 md:p-4">
                    <img
                        src={mainImage}
                        alt={product?.name || 'Product image'}
                        onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
                        className="max-w-full max-h-full object-contain rounded-tl-lg rounded-tr-lg"
                    />
                </div>
                <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-grow">
                    <div className="h-[36px] sm:h-[52px] md:h-[50px] w-full flex items-start justify-center overflow-hidden">
                        <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 text-black line-clamp-2 leading-tight">
                            {product?.name || 'Untitled Product'}
                        </h3>
                    </div>
                    <div className="mt-1 sm:mt-2 flex flex-col items-start h-[70px] sm:h-[90px]">

                        {/* Fixed space for original price & savings */}
                        <div className="min-h-[24px] sm:min-h-[34px] flex items-center w-full">

                            {product.showOriginalPrice && discountPercentage > 0 ? (

                                <div className="flex items-center gap-1 sm:gap-3 flex-wrap">

                                    <span className="text-xs sm:text-sm md:text-base text-gray-400 line-through">
                                        Rs. {formattedPrice(originalPrice)}
                                    </span>

                                    <span className="bg-green-100 text-[#0E5D33] text-[9px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full font-semibold whitespace-nowrap">
                                        Save Rs. {formattedPrice(originalPrice - displayPrice)}
                                    </span>

                                </div>

                            ) : (

                                <div className="min-h-[24px] sm:min-h-[34px]"></div>

                            )}

                        </div>

                        {/* Current Price */}
                        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0E5D33] mt-1 sm:mt-2">
                            {hasVariants && variantPrices.length > 0 ? 'From ' : ''}Rs. {formattedPrice(displayPrice)}
                        </span>

                    </div>
                    
                    <div className="mt-auto w-full">
                        <div className="flex items-center justify-center">
                            <Rating className="flex items-center justify-center gap-1"
                                value={Number(product?.ratings) || 0}
                                onRatingChange={handleRatingChange}
                                disable={true}
                            />
                        </div>
                        <span className='flex items-center justify-center gap-1 text-xs sm:text-sm text-gray-500 mt-1'>
                            ( {Number(product?.numOfReviews) || 0} {(Number(product?.numOfReviews) || 0) === 1 ? 'Review' : 'Reviews'} )
                        </span>
                        <div className="mt-3 sm:mt-4 flex flex-col lg:flex-row gap-2 w-full">
                        <button className="w-full sm:flex-1 min-w-0 whitespace-nowrap bg-gradient-to-r from-[#0E5D33] to-[#0A4A28] text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-[6px] font-semibold text-[11px] sm:text-xs md:text-sm hover:scale-[1.02] hover:shadow-md transition-all duration-300 cursor-pointer">
                            View Detail
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={effectiveStock <= 0}
                            className={`flex items-center justify-center gap-1 w-full sm:flex-1 min-w-0 whitespace-nowrap py-1.5 sm:py-2 px-2 sm:px-3 rounded-[6px] font-semibold text-[11px] sm:text-xs md:text-sm transition-all duration-300 cursor-pointer border
                                ${effectiveStock <= 0
                                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'bg-white text-[#0E5D33] border-[#0E5D33] hover:bg-[#0E5D33] hover:text-white hover:scale-[1.02] hover:shadow-md'
                                }
                            `}
                        >
                            <ShoppingCartIcon sx={{ fontSize: 14, '@media (min-width:640px)': { fontSize: 16 } }} />
                            {effectiveStock <= 0 ? 'Out of Stock' : hasVariants ? 'Select Options' : 'Add to Cart'}
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Products