import React, { useState, useEffect, useMemo } from 'react'
import { getProductdetails, removeErrors, createReview, removeSuccess } from '../features/Products/productslice'
import PageTitle from '../coponents/PageTitle'
import Rating from '../coponents/Rating'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from '../coponents/Loader'
import { addToCart, removeMessage, removeSuccess as removeCartSuccess, removeErrors as removeCartErrors } from '../features/cart/cartSlice'


function ProductDetails() {
    const [userRating, setUserRating] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [reviewText, setReviewText] = useState('')
    const [activeImage, setActiveImage] = useState(0)

    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)

    // NEW: size chart popup
    const [showSizeChart, setShowSizeChart] = useState(false)

    const { loading, error, product, reviewLoading, reviewSuccess } = useSelector(state => state.product)
    const { loading: cartLoading, error: cartError, success, message } = useSelector(state => state.cart)

    const dispatch  = useDispatch()
    const { id }    = useParams()
    const navigate  = useNavigate()

    // ── Fetch product ─────────────────────────────────────────
    useEffect(() => {
        if (id) dispatch(getProductdetails(id))
        return () => dispatch(removeErrors())
    }, [dispatch, id])

    // ── Auto-select first available color on product load ─────
    useEffect(() => {
        setActiveImage(0)
        setQuantity(1)
        setSelectedColor(null)
        setSelectedSize(null)
        setShowSizeChart(false)

        if (product?.hasVariants && product?.variants?.length > 0) {
            const colors = [...new Set(product.variants.map(v => v.color).filter(c => c !== 'Default'))]
            // Pick first color that has at least one size in stock
            const firstAvailColor = colors.find(c =>
                product.variants.some(v => v.color === c && Number(v.stock) > 0)
            ) || colors[0]
            if (firstAvailColor) setSelectedColor(firstAvailColor)
        }
    }, [product?._id])

    // ── NEW: color change hone par gallery ki pehli image dikhao ─
    useEffect(() => {
        setActiveImage(0)
    }, [selectedColor])

    // ── Auto-select first available size when color changes ───
    useEffect(() => {
        if (!product?.hasVariants || !selectedColor) return
        const sizesForColor = product.variants.filter(v => v.color === selectedColor)
        const firstAvailSize = sizesForColor.find(v => Number(v.stock) > 0)?.size || sizesForColor[0]?.size
        if (firstAvailSize) setSelectedSize(firstAvailSize)
        setQuantity(1)
    }, [selectedColor, product?._id])

    // ── Reset quantity when size changes ──────────────────────
    useEffect(() => {
        setQuantity(1)
    }, [selectedSize])

    // ── Size chart modal: Esc se band ─────────────────────────
    useEffect(() => {
        if (!showSizeChart) return
        const onKey = (e) => e.key === 'Escape' && setShowSizeChart(false)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [showSizeChart])

    // ── Active variant ────────────────────────────────────────
    const activeVariant = useMemo(() => {
        if (!product?.hasVariants || !product?.variants?.length) return null
        if (!selectedColor || !selectedSize) return null
        return product.variants.find(v => v.color === selectedColor && v.size === selectedSize) || null
    }, [product, selectedColor, selectedSize])

    // ── Derived display values ────────────────────────────────
    const displayPrice = useMemo(() => {
        if (activeVariant && activeVariant.price) return Number(activeVariant.price)
        return product?.price || 0
    }, [activeVariant, product])

    const displayStock = useMemo(() => {
        if (product?.hasVariants) {
            if (!activeVariant) return 0
            return Number(activeVariant.stock) || 0
        }
        return Number(product?.stock) || 0
    }, [activeVariant, product])

    // Is the entire product completely out of stock?
    const isCompletelyOutOfStock = useMemo(() => {
        if (!product) return true
        if (product.hasVariants && product.variants?.length > 0) {
            return product.variants.every(v => Number(v.stock) === 0)
        }
        return Number(product.stock) === 0
    }, [product])

    // ── Toast handlers ────────────────────────────────────────
    useEffect(() => {
        if (success && message) {
            toast.success(message, { position: 'top-center', autoClose: 3000 })
            dispatch(removeMessage())
            dispatch(removeCartSuccess())
        }
    }, [dispatch, success, message])

    useEffect(() => {
        if (error) {
            toast.error(error.message || error || 'An error occurred', { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
    }, [dispatch, error])

    useEffect(() => {
        if (cartError) {
            toast.error(cartError.message || cartError || 'An error occurred', { position: 'top-center', autoClose: 3000 })
            dispatch(removeCartErrors())
        }
    }, [dispatch, cartError])

    useEffect(() => {
        if (reviewSuccess) {
            toast.success('Thanks! Review submitted successfully', { position: 'top-center', autoClose: 3000 })
            setUserRating(0)
            setReviewText('')
            dispatch(removeSuccess())
            dispatch(getProductdetails(id))
        }
    }, [dispatch, reviewSuccess, id])

    if (loading || !product) return <Loader />

    // ── Gallery (NEW: selected color ki images, warna default images) ──
    const defaultGallery = Array.isArray(product.image) && product.image.length > 0
        ? product.image
        : (product.images?.length > 0 ? product.images : [])

    const selectedColorData = product.colors?.find(c => c.name === selectedColor)
    const colorGallery = selectedColorData?.images?.length > 0 ? selectedColorData.images : null

    const gallery = colorGallery || defaultGallery

    const currentImage = gallery[activeImage] || gallery[0]

    // Color ka hex (swatch dot ke liye)
    const getColorHex = (colorName) => product.colors?.find(c => c.name === colorName)?.hex

    // Size chart
    const sizeChartUrl = product.sizeChartImage?.url || ''

    // ── Quantity controls ─────────────────────────────────────
    const handleQuantityChange = (delta) => {
        setQuantity(prev => {
            const next = prev + delta
            if (next < 1) {
                toast.warn('Minimum 1 item required', { position: 'top-center', autoClose: 2500 })
                return prev
            }
            if (next > displayStock) {
                toast.warn(`Only ${displayStock} item${displayStock > 1 ? 's' : ''} available`, { position: 'top-center', autoClose: 2500 })
                return displayStock
            }
            return next
        })
    }

    // ── Add to Cart ───────────────────────────────────────────
    const handleAddToCart = () => {
        if (isCompletelyOutOfStock) {
            return toast.error('Product is not available.', { position: 'top-center' })
        }
        if (product.hasVariants) {
            if (!selectedColor) return toast.warn('Please select a color.', { position: 'top-center' })
            if (!selectedSize)  return toast.warn('Please select a size.', { position: 'top-center' })
            if (!activeVariant || Number(activeVariant.stock) === 0) {
                return toast.error('This size is out of stock.', { position: 'top-center' })
            }
            if (quantity > Number(activeVariant.stock)) {
                return toast.warn(`Only ${activeVariant.stock} items available.`, { position: 'top-center' })
            }
        }
        dispatch(addToCart({ id: product._id, quantity, color: selectedColor, size: selectedSize }))
    }

    // ── Buy Now ───────────────────────────────────────────────
    const handleBuyNow = async () => {
        if (isCompletelyOutOfStock) {
            return toast.error('Product is not available.', { position: 'top-center' })
        }
        if (product.hasVariants) {
            if (!selectedColor) return toast.warn('Please select a color.', { position: 'top-center' })
            if (!selectedSize)  return toast.warn('Please select a size.', { position: 'top-center' })
            if (!activeVariant || Number(activeVariant.stock) === 0) {
                return toast.error('This size is out of stock.', { position: 'top-center' })
            }
        }
        const result = await dispatch(addToCart({ id: product._id, quantity, color: selectedColor, size: selectedSize }))
        if (addToCart.fulfilled.match(result)) navigate('/shipping')
    }

    // ── Review submit ─────────────────────────────────────────
    const handleReviewSubmit = () => {
        if (!userRating)       return toast.warn('Rating is required', { position: 'top-center' })
        if (!reviewText.trim()) return toast.warn('Review is required', { position: 'top-center' })
        dispatch(createReview({ rating: userRating, comment: reviewText.trim(), productId: product._id }))
    }

    const discountPercentage =
        product.showOriginalPrice && product.originalPrice > displayPrice
            ? Math.round(((product.originalPrice - displayPrice) / product.originalPrice) * 100)
            : 0

    const stockStatus = displayStock === 0 ? 'out' : displayStock <= 10 ? 'low' : 'in'
    const stockStyles = {
        out: { dot: 'bg-red-400',    text: 'text-red-300',    label: 'Out of Stock' },
        low: { dot: 'bg-amber-400',  text: 'text-amber-300',  label: 'Low Stock' },
        in:  { dot: 'bg-[#5FBF88]', text: 'text-[#B7E4C7]', label: 'In Stock' },
    }

    const reviews      = product.reviews || []
    const totalReviews = reviews.length
    const ratingBuckets = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => Math.round(r.rating) === star).length
        const pct   = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
        return { star, count, pct }
    })

    // ── Unique colors & sizes from variants ───────────────────
    const uniqueColors = product.hasVariants
        ? [...new Set(product.variants.map(v => v.color).filter(c => c !== 'Default'))]
        : []

    const uniqueSizes = product.hasVariants
        ? [...new Set(product.variants.map(v => v.size).filter(s => s !== 'Standard'))]
        : []

    // Is a color completely out of stock (all sizes = 0)?
    const isColorOOS = (color) =>
        product.variants.filter(v => v.color === color).every(v => Number(v.stock) === 0)

    // Is a size out of stock for the currently selected color?
    const isSizeOOS = (size) => {
        const v = product.variants.find(vx => vx.color === selectedColor && vx.size === size)
        return !v || Number(v.stock) === 0
    }

    const canPurchase = !isCompletelyOutOfStock && displayStock > 0

    return (
        <>
            <PageTitle title={`${product.name} - Details`} />

            <div className="bg-white min-h-screen mt-30 lg:mt-20 pb-28 lg:pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 lg:pt-14">

                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-14 items-start">

                        {/* ── Image Panel ── */}
                        <div className="lg:sticky lg:top-10">
                            <div className="relative bg-white rounded-[28px] border-2 border-emerald-50 w-full max-w-md lg:max-w-lg mx-auto h-[380px] lg:h-[500px] overflow-hidden shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)]">

                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-white to-white pointer-events-none" />

                                <img
                                    key={currentImage?.url}
                                    src={currentImage?.url?.replace('./', '/') || ''}
                                    alt={product.name}
                                    className="relative z-10 w-full h-full object-contain p-4"
                                />

                                {isCompletelyOutOfStock && (
                                    <span className="absolute top-5 left-5 z-20 bg-red-500 text-white text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full shadow-[0_4px_14px_rgba(239,68,68,0.4)]">
                                        Out of Stock
                                    </span>
                                )}

                                {!isCompletelyOutOfStock && stockStatus === 'low' && (
                                    <span className="absolute top-5 left-5 z-20 bg-amber-500 text-white text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full shadow-[0_4px_14px_rgba(245,158,11,0.4)]">
                                        Only {displayStock} left
                                    </span>
                                )}
                            </div>

                            {gallery.length > 1 && (
                                <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                                    {gallery.map((img, index) => (
                                        <button
                                            key={img.public_id || index}
                                            type="button"
                                            onClick={() => setActiveImage(index)}
                                            className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 bg-white overflow-hidden transition-all duration-300 cursor-pointer ${activeImage === index
                                                ? "border-[#1B4332] shadow-[0_6px_16px_rgba(27,67,50,0.3)] scale-[1.03]"
                                                : "border-emerald-50 hover:border-emerald-200 hover:scale-[1.02]"
                                            }`}
                                        >
                                            <img
                                                src={img.url.replace('./', '/')}
                                                alt={`${product.name} thumbnail ${index + 1}`}
                                                className="w-full h-full object-contain p-1"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Content Panel ── */}
                        <div className="flex flex-col gap-6">

                            <div>
                                <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] text-slate-900 leading-[1.1] tracking-tight">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-3 mt-3">
                                    <Rating value={product.ratings} disabled={true} />
                                    <span className="text-sm text-slate-500">
                                        {product.numOfReviews} {product.numOfReviews === 1 ? 'review' : 'reviews'}
                                    </span>
                                </div>
                            </div>

                            {/* ── Purchase Card ── */}
                            <div className="bg-[#1B4332] rounded-[24px] p-6 sm:p-7 text-white shadow-[0_16px_40px_-12px_rgba(27,67,50,0.45)] relative overflow-hidden">

                                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

                                {/* Price row */}
                                <div className="relative flex items-end justify-between flex-wrap gap-2">
                                    <div className="flex items-baseline gap-3">
                                        <span className="font-serif text-4xl lg:text-5xl text-white">
                                            Rs. {displayPrice.toLocaleString()}
                                        </span>
                                        {product.showOriginalPrice && discountPercentage > 0 && (
                                            <span className="bg-[#5FBF88] text-[#0E2A1C] text-[11px] font-bold px-2.5 py-1 rounded-full">
                                                {discountPercentage}% off
                                            </span>
                                        )}
                                    </div>
                                    <span className={`flex items-center gap-1.5 text-xs font-medium ${stockStyles[stockStatus].text}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${stockStyles[stockStatus].dot} ${stockStatus !== 'out' ? 'animate-pulse' : ''}`} />
                                        {isCompletelyOutOfStock ? 'Out of Stock' : stockStyles[stockStatus].label}
                                    </span>
                                </div>

                                {product.showOriginalPrice && discountPercentage > 0 && (
                                    <div className="relative flex items-center gap-3 flex-wrap mt-1.5">
                                        <span className="text-sm text-[#B7E4C7]/70 line-through">
                                            Rs. {product.originalPrice.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-[#5FBF88] font-semibold">
                                            Save Rs. {(product.originalPrice - displayPrice).toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                {!isCompletelyOutOfStock && stockStatus === 'low' && (
                                    <p className="relative text-amber-300 text-xs font-medium mt-3">
                                        Only {displayStock} left — order soon
                                    </p>
                                )}

                                {/* ── VARIANT SELECTORS ── */}
                                {product.hasVariants && uniqueColors.length > 0 && (
                                    <div className="relative mt-6 space-y-4">

                                        {/* Colors */}
                                        <div>
                                            <p className="text-sm text-[#B7E4C7] mb-2">
                                                Color: <span className="font-semibold text-white">{selectedColor || '—'}</span>
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {uniqueColors.map(color => {
                                                    const oos = isColorOOS(color)
                                                    const hex = getColorHex(color)
                                                    return (
                                                        <button
                                                            key={color}
                                                            onClick={() => !oos && setSelectedColor(color)}
                                                            disabled={oos}
                                                            title={oos ? 'Out of Stock' : color}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                                                                oos
                                                                    ? 'opacity-40 cursor-not-allowed bg-transparent text-white/50 border-white/20 line-through'
                                                                    : selectedColor === color
                                                                        ? 'bg-white text-[#1B4332] border-white cursor-pointer'
                                                                        : 'bg-transparent text-white border-white/30 hover:border-white/60 cursor-pointer'
                                                            }`}
                                                        >
                                                            {hex && (
                                                                <span
                                                                    className="w-3 h-3 rounded-full border border-gray-300"
                                                                    style={{ backgroundColor: hex }}
                                                                />
                                                            )}
                                                            {color}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Sizes */}
                                        {uniqueSizes.length > 0 && (
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm text-[#B7E4C7]">
                                                        Size: <span className="font-semibold text-white">{selectedSize || '—'}</span>
                                                    </p>

                                                    {/* NEW: Size chart button */}
                                                    {sizeChartUrl && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowSizeChart(true)}
                                                            className="text-xs font-semibold text-[#5FBF88] underline underline-offset-2 hover:text-white transition cursor-pointer"
                                                        >
                                                            Size Chart
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {uniqueSizes.map(size => {
                                                        const oos = isSizeOOS(size)
                                                        const v   = product.variants.find(vx => vx.color === selectedColor && vx.size === size)
                                                        return (
                                                            <button
                                                                key={size}
                                                                onClick={() => !oos && setSelectedSize(size)}
                                                                disabled={oos}
                                                                title={oos ? 'Out of Stock' : `Stock: ${v?.stock ?? 0}`}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                                                                    oos
                                                                        ? 'opacity-40 cursor-not-allowed bg-transparent text-white/50 border-white/20 line-through'
                                                                        : selectedSize === size
                                                                            ? 'bg-[#5FBF88] text-[#0E2A1C] border-[#5FBF88] cursor-pointer'
                                                                            : 'bg-transparent text-white border-white/30 hover:border-white/60 cursor-pointer'
                                                                }`}
                                                            >
                                                                {size}
                                                                {!oos && v?.stock <= 5 && v?.stock > 0 && (
                                                                    <span className="ml-1 text-amber-300">({v.stock})</span>
                                                                )}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Combo unavailable message */}
                                        {selectedColor && selectedSize && !activeVariant && (
                                            <p className="text-red-300 text-xs mt-1">This combination is unavailable.</p>
                                        )}
                                    </div>
                                )}

                                <div className="h-px bg-white/10 my-5" />

                                {/* ── Quantity + Buttons ── */}
                                <>
                                    <div className={`relative flex items-center justify-between gap-4 ${!canPurchase ? 'opacity-40 pointer-events-none' : ''}`}>
                                        <span className="text-sm text-[#B7E4C7]">Quantity</span>
                                        <div className="flex items-center border border-white/20 rounded-full overflow-hidden">
                                            <button
                                                onClick={() => handleQuantityChange(-1)}
                                                className="w-9 h-9 text-lg hover:bg-white/10 transition cursor-pointer"
                                            >−</button>
                                            <input
                                                type="text"
                                                value={quantity}
                                                readOnly
                                                className="w-10 h-9 text-center bg-transparent text-sm"
                                            />
                                            <button
                                                onClick={() => handleQuantityChange(1)}
                                                disabled={quantity >= displayStock}
                                                className="w-9 h-9 text-lg hover:bg-white/10 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                            >+</button>
                                        </div>
                                    </div>

                                    <div className="relative flex items-center gap-3 mt-5">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={cartLoading || !canPurchase}
                                            className={`flex-1 py-3 px-5 rounded-full text-sm font-semibold transition-all duration-300 ${
                                                !canPurchase
                                                    ? 'bg-gray-500 text-white/60 cursor-not-allowed'
                                                    : cartLoading
                                                        ? 'bg-[#5FBF88] text-[#0E2A1C] cursor-wait'
                                                        : 'bg-white text-[#1B4332] hover:bg-emerald-50 cursor-pointer'
                                            }`}
                                        >
                                            {isCompletelyOutOfStock
                                                ? 'Out of Stock'
                                                : cartLoading
                                                    ? 'Adding to Cart...'
                                                    : 'Add to Cart'}
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            disabled={cartLoading || !canPurchase}
                                            className={`flex-1 py-3 px-5 flex items-center justify-center rounded-full text-sm font-semibold border border-white/30 text-white transition-all duration-300 ${
                                                !canPurchase
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : cartLoading
                                                        ? 'opacity-60 cursor-not-allowed'
                                                        : 'hover:bg-white/10 cursor-pointer'
                                            }`}
                                        >
                                            {isCompletelyOutOfStock
                                                ? 'Unavailable'
                                                : cartLoading
                                                    ? 'Please wait...'
                                                    : 'Buy Now'}
                                        </button>
                                    </div>

                                    {isCompletelyOutOfStock && (
                                        <p className="relative text-center text-sm text-red-300 mt-3 font-medium">
                                            ⚠ Product is not available. Check back soon.
                                        </p>
                                    )}
                                </>
                            </div>

                            {/* ── Description ── */}
                            <div>
                                <h3 className="font-serif text-lg text-slate-900 mb-2">About this item</h3>
                                <p className="text-slate-600 leading-7 text-[15px]">{product.description}</p>
                            </div>

                            {/* ── NEW: Size chart preview (page par bhi dikhe) ── */}
                            {sizeChartUrl && product.hasVariants && uniqueSizes.length > 0 && (
                                <div>
                                    <h3 className="font-serif text-lg text-slate-900 mb-3">Size guide</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowSizeChart(true)}
                                        className="block w-full max-w-xs rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition cursor-zoom-in"
                                    >
                                        <img
                                            src={sizeChartUrl.replace('./', '/')}
                                            alt="Size chart"
                                            className="w-full h-auto object-contain"
                                        />
                                    </button>
                                    <p className="text-xs text-slate-400 mt-2">Tap to enlarge</p>
                                </div>
                            )}

                            {/* ── Write a Review ── */}
                            <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.15)]">
                                <h3 className="font-serif text-lg text-slate-900 mb-3">Leave a review</h3>
                                <Rating value={userRating} disabled={false} onRatingChange={setUserRating} className="mb-3" />
                                <textarea
                                    value={reviewText}
                                    onChange={e => setReviewText(e.target.value)}
                                    placeholder="Write your review here..."
                                    className="w-full min-h-[100px] p-3 bg-white border border-slate-200 rounded-xl resize-y text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition"
                                />
                                <button
                                    onClick={handleReviewSubmit}
                                    disabled={reviewLoading}
                                    className="mt-3 bg-[#1B4332] text-white py-2.5 px-5 rounded-full text-sm font-semibold hover:bg-[#123024] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {reviewLoading ? "Submitting..." : "Submit Review"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Reviews ── */}
                    <div className="mt-14 pt-8 border-t border-slate-100">
                        <h3 className="font-serif text-2xl text-slate-900 mb-6">What people are saying</h3>

                        {totalReviews > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-12">
                                <div className="md:sticky md:top-10 h-fit bg-white border border-slate-200 rounded-[20px] p-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-serif text-4xl text-slate-900">
                                            {product.ratings?.toFixed ? product.ratings.toFixed(1) : product.ratings}
                                        </span>
                                        <span className="text-slate-400 text-sm">/ 5</span>
                                    </div>
                                    <Rating value={product.ratings} disabled={true} className="mt-1" />
                                    <p className="text-sm text-slate-500 mt-1.5">
                                        Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                                    </p>
                                    <div className="mt-5 flex flex-col gap-2">
                                        {ratingBuckets.map(({ star, count, pct }) => (
                                            <div key={star} className="flex items-center gap-2 text-xs">
                                                <span className="w-8 text-slate-500 font-medium">{star}★</span>
                                                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                    <div className="h-full bg-[#1B4332] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="w-6 text-right text-slate-400">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col divide-y divide-slate-100">
                                    {reviews.map((review, index) => (
                                        <div className="py-6 first:pt-0 flex flex-col items-start gap-2" key={index}>
                                            <div className="flex items-center gap-3">
                                                <span className="w-9 h-9 rounded-full bg-[#1B4332] text-white text-sm font-semibold flex items-center justify-center shrink-0">
                                                    {review.name?.charAt(0)?.toUpperCase() || "?"}
                                                </span>
                                                <div>
                                                    <p className="text-slate-900 text-sm font-semibold">{review.name}</p>
                                                    <Rating value={review.rating} disabled={true} />
                                                </div>
                                            </div>
                                            <p className="text-slate-600 leading-6 text-[15px]">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="border border-dashed border-slate-200 rounded-[20px] p-10 text-center">
                                <p className="text-slate-500">No reviews yet — be the first to share your thoughts.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Sticky Mobile Purchase Bar ── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B4332] px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 shadow-[0_-8px_24px_rgba(0,0,0,0.18)]">
                <div className="flex-1 w-full min-w-0 flex justify-between items-center sm:block">
                    <p className="text-[11px] sm:text-xs text-[#B7E4C7]/70 truncate max-w-[60%] sm:max-w-none">{product.name}</p>
                    <p className="font-serif text-base sm:text-lg text-[#E8C97A] leading-tight">
                        Rs. {displayPrice.toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleAddToCart}
                        disabled={cartLoading || !canPurchase}
                        className={`flex-1 sm:flex-none py-2 sm:py-2.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                            !canPurchase
                                ? 'bg-gray-500 text-white/60 cursor-not-allowed'
                                : cartLoading
                                    ? 'bg-[#5FBF88] text-[#0E2A1C] cursor-wait'
                                    : 'bg-white text-[#1B4332] hover:bg-emerald-50 cursor-pointer'
                        }`}
                    >
                        {isCompletelyOutOfStock ? 'Out of Stock' : cartLoading ? 'Adding...' : 'Add to Cart'}
                    </button>
                    <button
                        onClick={handleBuyNow}
                        disabled={cartLoading || !canPurchase}
                        className={`flex-1 sm:flex-none py-2 sm:py-2.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold border border-white/30 text-white transition-all duration-300 ${
                            !canPurchase ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'
                        }`}
                    >
                        {isCompletelyOutOfStock ? 'Unavailable' : 'Buy Now'}
                    </button>
                </div>
            </div>

            {/* ── NEW: Size Chart Modal ── */}
            {showSizeChart && sizeChartUrl && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                    onClick={() => setShowSizeChart(false)}
                >
                    <div
                        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-3"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setShowSizeChart(false)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center text-lg hover:bg-slate-900 cursor-pointer"
                            aria-label="Close size chart"
                        >
                            ×
                        </button>
                        <img
                            src={sizeChartUrl.replace('./', '/')}
                            alt="Size chart"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductDetails