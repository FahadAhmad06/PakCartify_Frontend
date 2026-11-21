import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Link, useParams } from 'react-router-dom'
import PageTitle from '../coponents/PageTitle'
import {
    updateProduct,
    getAdminProductDetails,
    removeErrors,
    removeSuccess
} from '../features/Admin/AdminSlice'

import {
    CloudUpload,
    Dashboard,
    AddBox,
    Inventory,
    People,
    Star,
    ShoppingCart,
} from '@mui/icons-material'

import { X, Trash2, Palette } from 'lucide-react'

// ─── Reuse the same variant dictionary from CreateProduct ──────────────────────

const PAKISTANI_VARIANT_DICTIONARY = {
    menTShirts: ['S — Chest 36-38"','M — Chest 38-40"','L — Chest 40-42"','XL — Chest 42-44"','XXL — Chest 44-46"','3XL — Chest 46-48"'],
    menJeans:   ['28 — Waist 28"','30 — Waist 30"','32 — Waist 32"','34 — Waist 34"','36 — Waist 36"','38 — Waist 38"','40 — Waist 40"','42 — Waist 42"'],
    menKurta:   ['S — 38','M — 40','L — 42','XL — 44','XXL — 46','3XL — 48'],
    menGeneralAlpha: ['S','M','L','XL','XXL','3XL'],
    menUndergarments: ['S — Waist 28-30"','M — Waist 30-32"','L — Waist 32-34"','XL — Waist 34-36"','XXL — Waist 36-38"','3XL — Waist 38-40"'],
    womenTops:   ['XS — Chest 32-34"','S — Chest 34-36"','M — Chest 36-38"','L — Chest 38-40"','XL — Chest 40-42"','XXL — Chest 42-44"'],
    womenJeans:  ['26 — Waist 26"','28 — Waist 28"','30 — Waist 30"','32 — Waist 32"','34 — Waist 34"','36 — Waist 36"','38 — Waist 38"'],
    womenPret:   ['XS — Size 8','S — Size 10','M — Size 12','L — Size 14','XL — Size 16','XXL — Size 18'],
    womenAbaya:  ['52','54','56','58','60','62'],
    womenUnstitched: ['2 Piece','3 Piece'],
    womenGeneralAlpha: ['XS','S','M','L','XL','XXL'],
    babyInfantMonths: ['Newborn','0-3 Months','3-6 Months','6-12 Months','12-18 Months','18-24 Months'],
    babyNumeric: ['0','1','2'],
    kidsYears:   ['1-2 Years','2-3 Years','3-4 Years','4-5 Years','5-6 Years','7-8 Years','8-9 Years','9-10 Years','11-12 Years','13-14 Years','15-16 Years'],
    kidsNumeric: ['18','20','22','24','26','28','30','32','34'],
    menFootwear: ['PK/UK 6 — EU 40','PK/UK 7 — EU 41','PK/UK 8 — EU 42','PK/UK 9 — EU 43','PK/UK 10 — EU 44','PK/UK 11 — EU 45','PK/UK 12 — EU 46'],
    womenFootwear: ['PK/UK 3 — EU 36','PK/UK 4 — EU 37','PK/UK 5 — EU 38','PK/UK 6 — EU 39','PK/UK 7 — EU 40','PK/UK 8 — EU 41','PK/UK 9 — EU 42'],
    kidsFootwear: ['Baby','Toddler','Junior','EU 25','EU 26','EU 27','EU 28','EU 29','EU 30','EU 31','EU 32','EU 33','EU 34','EU 35'],
    jewelryRings: ['US 5','US 6','US 7','US 8','US 9','US 10','US 11','US 12'],
    jewelryBangles: ['2.2','2.4','2.6','2.8'],
    jewelryBracelets: ['6 inch','7 inch','8 inch','9 inch','Adjustable'],
    jewelryNecklaces: ['16 inch','18 inch','20 inch','22 inch','24 inch'],
    jewelryAnklets: ['8 inch','9 inch','10 inch','Adjustable'],
    bagsGeneral: ['Mini','Small','Medium','Large','XL'],
    suitcases:   ['20 inch','24 inch','28 inch','32 inch'],
    beltsWaist:  ['28','30','32','34','36','38','40','42','44'],
    menWatches:  ['38mm','40mm','42mm','44mm','46mm'],
    womenWatches: ['28mm','30mm','32mm','34mm','36mm'],
    generalEyewear: ['Small','Medium','Large','One Size','Free Size'],
    mobileStorage: ['32GB','64GB','128GB','256GB','512GB','1TB'],
    screenSizes: ['8 inch','10 inch','11 inch','13.3 inch','14 inch','15.6 inch','16 inch','17.3 inch','24 inch','27 inch','32 inch'],
    chargingCables: ['1 Meter','1.5 Meter','2 Meter','3 Meter'],
    powerBanks: ['5000mAh','10000mAh','20000mAh','30000mAh'],
    skincareVolume: ['30ml','50ml','100ml','150ml','200ml','250ml','500ml'],
    perfumeVolume:  ['10ml','30ml','50ml','75ml','100ml','125ml','150ml'],
    shampooVolume:  ['50ml','100ml','200ml','250ml','400ml','500ml','1 Liter'],
    makeupShades:   ['Shade 01','Shade 02','Shade 03','Shade 04','Shade 05','Shade 06','Shade 07','Shade 08','Shade 09','Shade 10'],
    bedSheets:    ['Single','Double','Queen','King','Super King','90 x 100 inch','100 x 100 inch','108 x 108 inch'],
    curtainsLength: ['5 ft','7 ft','9 ft','10 ft','12 ft'],
    kitchenCapacity: ['250ml','500ml','750ml','1 Liter','1.5 Liter','2 Liter','3 Liter','5 Liter','10 Liter','20 Liter','50 Liter'],
    kitchenWeight:  ['250g','500g','1kg','2kg','5kg','10kg'],
    quantitySets:   ['1 Piece','2 Piece','4 Piece','6 Piece','12 Piece','Set','Dozen'],
    cricketBat:   ['Short Handle','Long Blade','Harrow'],
    sportsBalls:  ['Size 3','Size 4','Size 5'],
    tentsCapacity:['1 Person','2 Person','3 Person','4 Person','6 Person','8 Person'],
    generalSizes: ['XS','S','M','L','XL','XXL','3XL','Small','Medium','Large','Extra Large','One Size','Free Size','Adjustable','Custom Size'],
}

const categoriesData = [
    { name: "Men's Fashion", subCategories: [
        { name: "T-Shirts & Polos", variantType: "menTShirts" },
        { name: "Shirts", variantType: "menTShirts" },
        { name: "Jeans & Trousers", variantType: "menJeans" },
        { name: "Kurta & Shalwar Kameez", variantType: "menKurta" },
        { name: "Waistcoats & Blazers", variantType: "menGeneralAlpha" },
        { name: "Jackets, Hoodies & Sweaters", variantType: "menGeneralAlpha" },
        { name: "Undergarments", variantType: "menUndergarments" },
        { name: "Footwear", variantType: "menFootwear" },
    ]},
    { name: "Women's Fashion", subCategories: [
        { name: "Tops & Shirts", variantType: "womenTops" },
        { name: "Jeans & Trousers", variantType: "womenJeans" },
        { name: "Pret / Ready to Wear", variantType: "womenPret" },
        { name: "Shalwar Kameez & Dresses", variantType: "womenGeneralAlpha" },
        { name: "Abayas & Hijabs", variantType: "womenAbaya" },
        { name: "Unstitched Suits", variantType: "womenUnstitched" },
        { name: "Jackets & Coats", variantType: "womenGeneralAlpha" },
        { name: "Footwear", variantType: "womenFootwear" },
    ]},
    { name: "Kids & Baby", subCategories: [
        { name: "Baby Clothing (Months)", variantType: "babyInfantMonths" },
        { name: "Baby Sizes (0-2)", variantType: "babyNumeric" },
        { name: "Kids Clothing (Age)", variantType: "kidsYears" },
        { name: "Kids Numeric Shirts (18-34)", variantType: "kidsNumeric" },
        { name: "Kids Footwear", variantType: "kidsFootwear" },
    ]},
    { name: "Jewelry & Accessories", subCategories: [
        { name: "Rings", variantType: "jewelryRings" },
        { name: "Bangles", variantType: "jewelryBangles" },
        { name: "Bracelets", variantType: "jewelryBracelets" },
        { name: "Necklaces", variantType: "jewelryNecklaces" },
        { name: "Anklets", variantType: "jewelryAnklets" },
        { name: "Belts", variantType: "beltsWaist" },
        { name: "Caps & Hats", variantType: "generalEyewear" },
        { name: "Sunglasses", variantType: "generalEyewear" },
    ]},
    { name: "Bags & Luggage", subCategories: [
        { name: "Handbags & Backpacks", variantType: "bagsGeneral" },
        { name: "Travel Bags & Suitcases", variantType: "suitcases" },
    ]},
    { name: "Watches", subCategories: [
        { name: "Men's Watches", variantType: "menWatches" },
        { name: "Women's Watches", variantType: "womenWatches" },
    ]},
    { name: "Electronics & Gadgets", subCategories: [
        { name: "Mobile Phones (Storage)", variantType: "mobileStorage" },
        { name: "Tablets & Laptops (Screen)", variantType: "screenSizes" },
        { name: "Monitors", variantType: "screenSizes" },
        { name: "Charging Cables", variantType: "chargingCables" },
        { name: "Power Banks", variantType: "powerBanks" },
        { name: "Headphones & Earbuds", variantType: "generalSizes" },
    ]},
    { name: "Beauty & Personal Care", subCategories: [
        { name: "Skincare", variantType: "skincareVolume" },
        { name: "Perfumes & Fragrances", variantType: "perfumeVolume" },
        { name: "Shampoo & Hair Care", variantType: "shampooVolume" },
        { name: "Makeup & Lipsticks", variantType: "makeupShades" },
    ]},
    { name: "Home & Kitchen", subCategories: [
        { name: "Bed Sheets & Linen", variantType: "bedSheets" },
        { name: "Curtains", variantType: "curtainsLength" },
        { name: "Kitchen Storage (Volume)", variantType: "kitchenCapacity" },
        { name: "Food & Ingredients (Weight)", variantType: "kitchenWeight" },
        { name: "Cookware & Sets", variantType: "quantitySets" },
    ]},
    { name: "Sports & Fitness", subCategories: [
        { name: "Cricket Bats", variantType: "cricketBat" },
        { name: "Footballs", variantType: "sportsBalls" },
        { name: "Tents & Outdoor", variantType: "tentsCapacity" },
        { name: "Gym & Sportswear", variantType: "menGeneralAlpha" },
    ]},
]

const presetColors = [
    { name: "Black",          hex: "#000000" },
    { name: "White",          hex: "#FFFFFF" },
    { name: "Navy Blue",      hex: "#000080" },
    { name: "Royal Blue",     hex: "#4169E1" },
    { name: "Red",            hex: "#FF0000" },
    { name: "Maroon",         hex: "#800000" },
    { name: "Emerald Green",  hex: "#50C878" },
    { name: "Olive Green",    hex: "#556B2F" },
    { name: "Beige / Cream",  hex: "#F5F5DC" },
    { name: "Pink / Rose",    hex: "#FFC0CB" },
    { name: "Grey / Charcoal",hex: "#808080" },
    { name: "Gold / Mustard", hex: "#FFD700" },
]

const navSections = [
    { title: 'Products', links: [
        { to: '/admin/products',       label: 'All Products',    icon: Inventory },
        { to: '/admin/product/create', label: 'Create Products', icon: AddBox },
    ]},
    { title: 'User',    links: [{ to: '/admin/user',   label: 'All Users',  icon: People }] },
    { title: 'Orders',  links: [{ to: '/admin/orders', label: 'All Orders', icon: ShoppingCart }] },
    { title: 'Reviews', links: [{ to: '/admin/reviews',label: 'All Reviews',icon: Star }] },
]

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE PRODUCT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function UpdateProduct() {

    const { id } = useParams()
    const dispatch = useDispatch()

    const { success, loading, error, product } = useSelector(state => state.admin)

    const [showMenu, setShowMenu] = useState(false)

    // ── Form States ────────────────────────────────────────────
    const [name,             setName]             = useState("")
    const [price,            setPrice]            = useState("")
    const [originalPrice,    setOriginalPrice]    = useState("")
    const [showOriginalPrice,setShowOriginalPrice]= useState(false)
    const [description,      setDescription]      = useState("")
    const [category,         setCategory]         = useState("")
    const [subCategory,      setSubCategory]      = useState("")
    const [stock,            setStock]            = useState("")
    const [image,            setImage]            = useState([])
    const [imagePreview,     setImagePreview]     = useState([])
    const [existingImages,   setExistingImages]   = useState([])

    // ── Variant States ─────────────────────────────────────────
    const [enableVariants,   setEnableVariants]   = useState(false)
    const [selectedColors,   setSelectedColors]   = useState([])
    const [selectedSizes,    setSelectedSizes]    = useState([])
    const [customColorInput, setCustomColorInput] = useState("")
    const [customSizeInput,  setCustomSizeInput]  = useState("")
    const [variants,         setVariants]         = useState([])

    // ── NEW: Color wise images ─────────────────────────────────
    // Already saved images:  { "Red": [{ public_id, url }] }
    const [colorExistingImages, setColorExistingImages] = useState({})
    // Newly selected files:  { "Red": [File] }
    const [colorNewImages,      setColorNewImages]      = useState({})
    const [colorNewPreviews,    setColorNewPreviews]    = useState({})
    // Hex of colors (custom colors keep their saved hex)
    const [colorHexMap,         setColorHexMap]         = useState({})

    // ── NEW: Size chart ────────────────────────────────────────
    const [existingSizeChart, setExistingSizeChart] = useState(null) // { public_id, url }
    const [sizeChartImage,    setSizeChartImage]    = useState(null) // File
    const [sizeChartPreview,  setSizeChartPreview]  = useState("")

    const getColorHex = (colorName) =>
        colorHexMap[colorName] ||
        presetColors.find(p => p.name === colorName)?.hex ||
        "#cccccc"

    // ── Fetch product on mount ─────────────────────────────────
    useEffect(() => {
        dispatch(getAdminProductDetails(id))
        return () => dispatch(removeErrors())
    }, [dispatch, id])

    // ── Populate form once product loads ───────────────────────
    useEffect(() => {
        if (!product || product._id !== id) return

        setName(product.name || "")
        setPrice(product.price || "")
        setOriginalPrice(product.originalPrice || "")
        setShowOriginalPrice(product.showOriginalPrice || false)
        setDescription(product.description || "")
        // Category / SubCategory (alag field names aur case ke liye safe matching)
        const rawCategory    = product.category ?? ""
        const rawSubCategory = product.subcategory ?? product.subCategory ?? product.sub_category ?? ""

        const matchedCategory =
            categoriesData.find(c => c.name.toLowerCase().trim() === String(rawCategory).toLowerCase().trim())?.name
            || rawCategory

        const matchedSubCategory =
            categoriesData
                .find(c => c.name === matchedCategory)
                ?.subCategories.find(s => s.name.toLowerCase().trim() === String(rawSubCategory).toLowerCase().trim())?.name
            || rawSubCategory

        setCategory(matchedCategory)
        setSubCategory(matchedSubCategory)
        setExistingImages(product.image || [])

        // NEW: saved color images + size chart
        const savedColors = product.colors || []
        const existingMap = {}
        const hexMap = {}
        savedColors.forEach(c => {
            existingMap[c.name] = c.images || []
            hexMap[c.name] = c.hex
        })
        setColorExistingImages(existingMap)
        setColorHexMap(hexMap)
        setColorNewImages({})
        setColorNewPreviews({})

        setExistingSizeChart(product.sizeChartImage?.url ? product.sizeChartImage : null)
        setSizeChartImage(null)
        setSizeChartPreview("")

        if (product.hasVariants && product.variants?.length > 0) {
            setEnableVariants(true)

            const variantColors = [...new Set(product.variants.map(v => v.color).filter(c => c !== 'Default'))]
            // saved colors ko bhi include karein (agar variants mein na hon)
            const colors = [...new Set([...savedColors.map(c => c.name), ...variantColors])]
            const sizes  = [...new Set(product.variants.map(v => v.size).filter(s => s !== 'Standard'))]

            setSelectedColors(colors)
            setSelectedSizes(sizes)
            setVariants(product.variants.map(v => ({
                color: v.color,
                size:  v.size,
                stock: String(v.stock ?? 0),
                price: v.price != null ? String(v.price) : "",
                sku:   v.sku || "",
            })))
        } else {
            setEnableVariants(false)
            setStock(product.stock || "")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?._id])

    // ── Category/subcategory data ──────────────────────────────
    const currentCategoryObj    = useMemo(() => categoriesData.find(c => c.name === category), [category])
    const availableSubCategories = currentCategoryObj?.subCategories || []
    const activeSubCatObj        = useMemo(() => availableSubCategories.find(s => s.name === subCategory), [availableSubCategories, subCategory])
    const activeVariantOptions   = useMemo(() => {
        if (!activeSubCatObj?.variantType) return PAKISTANI_VARIANT_DICTIONARY.generalSizes
        return PAKISTANI_VARIANT_DICTIONARY[activeSubCatObj.variantType] || PAKISTANI_VARIANT_DICTIONARY.generalSizes
    }, [activeSubCatObj])

    // ── Auto-computed total stock ──────────────────────────────
    const totalVariantStock = useMemo(() => {
        if (!enableVariants) return Number(stock || 0)
        return variants.reduce((sum, v) => sum + Number(v.stock || 0), 0)
    }, [variants, stock, enableVariants])

    // ── Rebuild variant matrix when colors/sizes change ────────
    useEffect(() => {
        if (!enableVariants) return

        setVariants(prev => {
            const colorsList = selectedColors.length > 0 ? selectedColors : ["Default"]
            const sizesList  = selectedSizes.length  > 0 ? selectedSizes  : ["Standard"]
            const newVariants = []

            colorsList.forEach(col => {
                sizesList.forEach(sz => {
                    const existing = prev.find(v => v.color === col && v.size === sz)
                    if (existing) {
                        newVariants.push(existing)
                    } else {
                        newVariants.push({
                            color: col,
                            size:  sz,
                            stock: "0",
                            price: "",
                            sku:   `${name ? name.substring(0,3).toUpperCase() : "PRD"}-${col.substring(0,3).toUpperCase()}-${sz.substring(0,4).toUpperCase()}`,
                        })
                    }
                })
            })

            return newVariants
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColors, selectedSizes, enableVariants])

    // ── Color image helpers (NEW) ──────────────────────────────
    const clearColorData = (colorName) => {
        const strip = (setter) =>
            setter(prev => {
                const copy = { ...prev }
                delete copy[colorName]
                return copy
            })
        strip(setColorExistingImages)
        strip(setColorNewImages)
        strip(setColorNewPreviews)
    }

    const handleColorImages = (colorName, e) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return

        setColorNewImages(prev => ({
            ...prev,
            [colorName]: [...(prev[colorName] || []), ...files],
        }))
        setColorNewPreviews(prev => ({
            ...prev,
            [colorName]: [...(prev[colorName] || []), ...files.map(f => URL.createObjectURL(f))],
        }))
        e.target.value = ""
    }

    const removeNewColorImage = (colorName, index) => {
        setColorNewImages(prev => ({
            ...prev,
            [colorName]: (prev[colorName] || []).filter((_, i) => i !== index),
        }))
        setColorNewPreviews(prev => ({
            ...prev,
            [colorName]: (prev[colorName] || []).filter((_, i) => i !== index),
        }))
    }

    const removeExistingColorImage = (colorName, index) => {
        setColorExistingImages(prev => ({
            ...prev,
            [colorName]: (prev[colorName] || []).filter((_, i) => i !== index),
        }))
    }

    // ── Size chart helpers (NEW) ───────────────────────────────
    const handleSizeChart = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setSizeChartImage(file)
        setSizeChartPreview(URL.createObjectURL(file))
        e.target.value = ""
    }

    const removeSizeChart = () => {
        setSizeChartImage(null)
        setSizeChartPreview("")
        setExistingSizeChart(null)
    }

    // ── Color handlers ─────────────────────────────────────────
    const removeColor = (colorName) => {
        setSelectedColors(prev => prev.filter(c => c !== colorName))
        clearColorData(colorName)
    }
    const toggleColor = (colorName) => {
        if (selectedColors.includes(colorName)) {
            removeColor(colorName)
        } else {
            setSelectedColors(prev => [...prev, colorName])
        }
    }
    const addCustomColor = () => {
        const color = customColorInput.trim()
        if (!color) return
        if (!selectedColors.includes(color)) setSelectedColors(prev => [...prev, color])
        setCustomColorInput("")
    }

    // ── Size handlers ──────────────────────────────────────────
    const toggleSize = (sizeLabel) => {
        setSelectedSizes(prev =>
            prev.includes(sizeLabel) ? prev.filter(s => s !== sizeLabel) : [...prev, sizeLabel]
        )
    }
    const addCustomSize = () => {
        const size = customSizeInput.trim()
        if (!size) return
        if (!selectedSizes.includes(size)) setSelectedSizes(prev => [...prev, size])
        setCustomSizeInput("")
    }

    // ── Variant row update ─────────────────────────────────────
    const updateVariantRow = (index, field, value) => {
        setVariants(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }
    const removeVariantRow = (index) => {
        setVariants(prev => prev.filter((_, i) => i !== index))
    }

    // ── Image handlers ─────────────────────────────────────────
    const updateProductImage = (e) => {
        const files = Array.from(e.target.files || [])
        setImage([])
        setImagePreview([])
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagePreview(old => [...old, reader.result])
                    setImage(old => [...old, file])
                }
            }
            reader.readAsDataURL(file)
        })
    }
    const removeImage = (index) => {
        setImage(old => old.filter((_, i) => i !== index))
        setImagePreview(old => old.filter((_, i) => i !== index))
    }

    // ── Submit ─────────────────────────────────────────────────
    const updateProductSubmit = (e) => {
        e.preventDefault()

        const myForm = new FormData()
        myForm.set('name',              name)
        myForm.set('price',             price)
        myForm.set('description',       description)
        myForm.set('category',          category)
        myForm.set('subcategory',       subCategory)
        myForm.set('showOriginalPrice', showOriginalPrice)
        if (showOriginalPrice && originalPrice) myForm.set('originalPrice', originalPrice)

        if (enableVariants) {
            if (variants.length === 0) {
                return toast.error("Please add at least one variant.", { position: 'top-center' })
            }
            const normalizedVariants = variants.map(v => ({
                ...v,
                stock: Math.max(0, Number(v.stock || 0)),
                price: v.price !== "" && v.price !== null && v.price !== undefined
                    ? Number(v.price)
                    : Number(price || 0),
                sku: v.sku || "",
            }))
            const totalStock = normalizedVariants.reduce((sum, v) => sum + v.stock, 0)
            myForm.set('stock',       totalStock)
            myForm.set('hasVariants', true)
            myForm.set('variants',    JSON.stringify(normalizedVariants))

            // NEW: colors meta + jo purani images rakhni hain (removed wali nahi aayengi)
            const colorsMeta = selectedColors.map(colorName => ({
                name:   colorName,
                hex:    getColorHex(colorName),
                images: colorExistingImages[colorName] || [],
            }))
            myForm.set('colors', JSON.stringify(colorsMeta))

            // NEW: nayi images -> colorImages_<index> (index = colorsMeta ka index)
            selectedColors.forEach((colorName, i) => {
                (colorNewImages[colorName] || []).forEach(file => {
                    myForm.append(`colorImages_${i}`, file)
                })
            })

            // NEW: size chart
            if (sizeChartImage) {
                myForm.append('sizeChartImage', sizeChartImage)
            } else if (existingSizeChart) {
                myForm.set('existingSizeChartImage', JSON.stringify(existingSizeChart))
            } else {
                myForm.set('removeSizeChartImage', true)
            }
        } else {
            myForm.set('stock',       Number(stock || 0))
            myForm.set('hasVariants', false)
        }

        image.forEach(img => myForm.append('image', img))

        dispatch(updateProduct({ id, productData: myForm }))
    }

    // ── Success / Error ────────────────────────────────────────
    useEffect(() => {
        if (error) {
            toast.error(error.message || 'An error occurred while updating product', { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
        if (success) {
            toast.success('Product updated successfully!', { position: 'top-center', autoClose: 3000 })
            dispatch(removeSuccess())
        }
    }, [dispatch, error, success])

    if (loading && !product) {
        return <div className="flex items-center justify-center min-h-screen text-xl text-slate-600">Loading Product...</div>
    }

    return (
        <>
            <PageTitle title="Update Product" />

            <div className="min-h-screen bg-slate-100 mt-16 pt-16">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 mx-4 sm:mx-6 mt-6 rounded-2xl px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-600 border-2 border-white/40 flex items-center justify-center text-white font-semibold text-lg">
                            UP
                        </div>
                        <div className="text-white">
                            <p className="font-semibold text-lg leading-tight">Update Product</p>
                            <p className="text-emerald-100 text-sm">Edit product details, variants & stock</p>
                        </div>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center">
                        <CloudUpload className="text-white" />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 py-6">

                    {/* MOBILE MENU TOGGLE */}
                    <div className="lg:hidden w-full mb-4">
                        <button
                            type="button"
                            onClick={() => setShowMenu(!showMenu)}
                            className="w-full bg-emerald-800 text-white rounded-xl px-5 py-4 flex items-center justify-between shadow-md"
                        >
                            <span className="flex items-center gap-3 font-semibold">Admin Menu</span>
                            <span className={`transition-transform duration-300 ${showMenu ? "rotate-90" : ""}`}>▶</span>
                        </button>
                    </div>

                    {/* SIDEBAR */}
                    <aside className={`w-full lg:w-64 shrink-0 ${showMenu ? "block" : "hidden"} lg:block self-start sticky top-32 max-h-[calc(100vh-3rem)] overflow-y-auto`}>
                        <div className="bg-emerald-800 rounded-xl px-5 py-4 mb-3">
                            <p className="text-white font-semibold">Admin Panel</p>
                            <p className="text-emerald-200 text-xs mt-0.5">Manage everything from here</p>
                        </div>
                        <nav className="bg-white rounded-xl p-3 space-y-4">
                            <Link to="/admin/dashboard" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-800 transition-colors">
                                <span className="flex items-center gap-3">
                                    <Dashboard fontSize="small" className="text-slate-400" />
                                    Dashboard
                                </span>
                                <span className="text-slate-300 text-xs">›</span>
                            </Link>
                            {navSections.map(section => (
                                <div key={section.title}>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-1">{section.title}</p>
                                    {section.links.map(link => (
                                        <Link key={link.to} to={link.to} className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-800 transition-colors">
                                            <span className="flex items-center gap-3">
                                                <link.icon fontSize="small" className="text-slate-400" />
                                                {link.label}
                                            </span>
                                            <span className="text-slate-300 text-xs">›</span>
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* MAIN FORM */}
                    <main className="flex-1 min-w-0">
                        <form onSubmit={updateProductSubmit}>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 space-y-8">

                                {/* ── BASIC INFO ── */}
                                <div>
                                    <h2 className="text-xl font-bold text-emerald-700 mb-6">Basic Information</h2>
                                    <div className="space-y-5">

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Name *</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                required
                                                placeholder="Enter product name"
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Base Price (Rs.) *</label>
                                                <input
                                                    type="number"
                                                    value={price}
                                                    onChange={e => setPrice(e.target.value)}
                                                    required min="0"
                                                    placeholder="e.g. 2499"
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                    Original Price (Rs.)
                                                    <span className="text-slate-400 font-normal ml-1">(for discount display)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={originalPrice}
                                                    onChange={e => setOriginalPrice(e.target.value)}
                                                    disabled={!showOriginalPrice}
                                                    min="0"
                                                    placeholder="e.g. 3499"
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 disabled:bg-slate-50 disabled:text-slate-400"
                                                />
                                                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={showOriginalPrice}
                                                        onChange={e => setShowOriginalPrice(e.target.checked)}
                                                        className="accent-emerald-600 w-4 h-4"
                                                    />
                                                    <span className="text-sm text-slate-600">Show discount badge on product</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
                                            <textarea
                                                rows="4"
                                                value={description}
                                                onChange={e => setDescription(e.target.value)}
                                                required
                                                placeholder="Describe your product..."
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
                                                <select
                                                    value={category}
                                                    onChange={e => { setCategory(e.target.value); setSubCategory("") }}
                                                    required
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 bg-white"
                                                >
                                                    <option value="">Select Category</option>
                                                    {categoriesData.map(c => (
                                                        <option key={c.name} value={c.name}>{c.name}</option>
                                                    ))}
                                                    {category && !categoriesData.some(c => c.name === category) && (
                                                        <option value={category}>{category}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sub Category</label>
                                                <select
                                                    value={subCategory}
                                                    onChange={e => setSubCategory(e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 bg-white"
                                                >
                                                    <option value="">Select Sub Category</option>
                                                    {availableSubCategories.map(s => (
                                                        <option key={s.name} value={s.name}>{s.name}</option>
                                                    ))}
                                                    {subCategory && !availableSubCategories.some(s => s.name === subCategory) && (
                                                        <option value={subCategory}>{subCategory}</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── STOCK & VARIANTS ── */}
                                <div className="border-t border-emerald-100 pt-8">
                                    <h2 className="text-xl font-bold text-emerald-700 mb-2">Stock & Variants</h2>

                                    {/* Total stock badge */}
                                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 mb-5">
                                        <span className="text-sm text-slate-600">Total Stock:</span>
                                        <span className={`text-lg font-bold ${totalVariantStock > 0 ? 'text-emerald-700' : 'text-red-500'}`}>
                                            {totalVariantStock}
                                        </span>
                                        {totalVariantStock === 0 && (
                                            <span className="text-xs text-red-500 font-medium">— OUT OF STOCK</span>
                                        )}
                                    </div>

                                    {/* Simple stock field (no variants) */}
                                    {!enableVariants && (
                                        <div className="max-w-xs mb-5">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stock Quantity *</label>
                                            <input
                                                type="number"
                                                value={stock}
                                                onChange={e => setStock(e.target.value)}
                                                min="0"
                                                placeholder="e.g. 50"
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                                            />
                                        </div>
                                    )}

                                    {/* Enable variants toggle */}
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 mb-5">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={enableVariants}
                                                onChange={e => setEnableVariants(e.target.checked)}
                                                className="accent-emerald-600 w-4 h-4"
                                            />
                                            <span className="text-sm font-semibold text-emerald-800">Enable Variants (Colors & Sizes)</span>
                                        </label>
                                    </div>

                                    {enableVariants && (
                                        <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">

                                            {/* COLOR SELECTOR */}
                                            <div>
                                                <label className="mb-2 text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                    <Palette size={16} /> Select Colors (Optional)
                                                </label>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {presetColors.map(col => {
                                                        const isSelected = selectedColors.includes(col.name)
                                                        return (
                                                            <button
                                                                key={col.name}
                                                                type="button"
                                                                onClick={() => toggleColor(col.name)}
                                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${isSelected
                                                                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                                                    : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                                                                }`}
                                                            >
                                                                <span className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: col.hex }} />
                                                                {col.name}{isSelected && " ✓"}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                                <div className="flex gap-2 max-w-sm">
                                                    <input
                                                        type="text"
                                                        value={customColorInput}
                                                        onChange={e => setCustomColorInput(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
                                                        placeholder="Custom color (e.g. Off-White, Teal)..."
                                                        className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                                                    />
                                                    <button type="button" onClick={addCustomColor} className="bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-900 transition">
                                                        + Add Color
                                                    </button>
                                                </div>
                                                {selectedColors.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                        {selectedColors.map(c => (
                                                            <span key={c} className="flex items-center gap-1 bg-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                                                {c}
                                                                <button type="button" onClick={() => removeColor(c)} className="hover:text-red-500 transition ml-1">×</button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* ==========================================
                                                NEW: COLOR WISE IMAGES
                                            ========================================== */}
                                            {selectedColors.length > 0 && (
                                                <div className="border-t border-slate-200 pt-4 space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-700">
                                                            Color Wise Images
                                                        </label>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Har color ki alag pics. Customer jab ye color select karega to yehi pics dikhengi. Purani images rehti hain, nayi add ho jati hain.
                                                        </p>
                                                    </div>

                                                    {selectedColors.map(colorName => {
                                                        const saved    = colorExistingImages[colorName] || []
                                                        const previews = colorNewPreviews[colorName]    || []

                                                        return (
                                                            <div key={colorName} className="bg-white border border-slate-200 rounded-xl p-4">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <div className="flex items-center gap-2 font-semibold text-sm text-slate-800">
                                                                        <span
                                                                            className="w-4 h-4 rounded-full border border-gray-300"
                                                                            style={{ backgroundColor: getColorHex(colorName) }}
                                                                        />
                                                                        {colorName}
                                                                        <span className="text-xs text-slate-400 font-normal">
                                                                            ({saved.length + previews.length} images)
                                                                        </span>
                                                                    </div>

                                                                    <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                                                                        + Upload
                                                                        <input
                                                                            type="file"
                                                                            hidden
                                                                            multiple
                                                                            accept="image/*"
                                                                            onChange={e => handleColorImages(colorName, e)}
                                                                        />
                                                                    </label>
                                                                </div>

                                                                {saved.length + previews.length > 0 ? (
                                                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                                                        {/* Purani (saved) images */}
                                                                        {saved.map((img, idx) => (
                                                                            <div key={`old-${idx}`} className="relative group rounded-lg overflow-hidden border border-slate-200">
                                                                                <img src={img.url} alt="" className="w-full h-24 object-cover" />
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeExistingColorImage(colorName, idx)}
                                                                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                                                >
                                                                                    <X size={12} />
                                                                                </button>
                                                                            </div>
                                                                        ))}

                                                                        {/* Nayi images */}
                                                                        {previews.map((src, idx) => (
                                                                            <div key={`new-${idx}`} className="relative group rounded-lg overflow-hidden border-2 border-emerald-300">
                                                                                <img src={src} alt="" className="w-full h-24 object-cover" />
                                                                                <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                                                    NEW
                                                                                </span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeNewColorImage(colorName, idx)}
                                                                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                                                >
                                                                                    <X size={12} />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-xs text-slate-400">Abhi koi image nahi hai.</p>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}

                                            {/* SIZE SELECTOR */}
                                            <div className="border-t border-slate-200 pt-4">
                                                <label className="block mb-1 text-sm font-semibold text-slate-700">
                                                    Select Size / Variant Options ({subCategory || "General"})
                                                </label>
                                                <p className="text-xs text-slate-400 mb-3">
                                                    {activeSubCatObj?.variantType
                                                        ? `Showing sizes for: ${subCategory}`
                                                        : "Select a sub-category above to see specific sizes, or use custom options"}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {activeVariantOptions.map(sizeLabel => {
                                                        const isSelected = selectedSizes.includes(sizeLabel)
                                                        return (
                                                            <button
                                                                key={sizeLabel}
                                                                type="button"
                                                                onClick={() => toggleSize(sizeLabel)}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${isSelected
                                                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                                                    : "bg-white text-slate-700 border-slate-300 hover:border-emerald-400"
                                                                }`}
                                                            >
                                                                {sizeLabel}{isSelected && " ✓"}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                                <div className="flex gap-2 max-w-sm">
                                                    <input
                                                        type="text"
                                                        value={customSizeInput}
                                                        onChange={e => setCustomSizeInput(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
                                                        placeholder="Custom size (e.g. 3XL, 48, 10mm)..."
                                                        className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                                                    />
                                                    <button type="button" onClick={addCustomSize} className="bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-900 transition">
                                                        + Add Size
                                                    </button>
                                                </div>
                                                {selectedSizes.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                        {selectedSizes.map(s => (
                                                            <span key={s} className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                                                {s}
                                                                <button type="button" onClick={() => setSelectedSizes(prev => prev.filter(x => x !== s))} className="hover:text-red-500 transition ml-1">×</button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* ==========================================
                                                NEW: SIZE CHART PIC
                                            ========================================== */}
                                            <div className="border-t border-slate-200 pt-4">
                                                <label className="block mb-1 text-sm font-semibold text-slate-700">
                                                    Size Chart Image (Optional)
                                                </label>
                                                <p className="text-xs text-slate-500 mb-3">
                                                    Customer ko product page par ye size pic dikhai jayegi.
                                                </p>

                                                <div className="flex items-center gap-4">
                                                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">
                                                        {(sizeChartPreview || existingSizeChart) ? "Change Size Pic" : "Upload Size Pic"}
                                                        <input type="file" hidden accept="image/*" onChange={handleSizeChart} />
                                                    </label>

                                                    {(sizeChartPreview || existingSizeChart?.url) && (
                                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-white">
                                                            <img
                                                                src={sizeChartPreview || existingSizeChart.url}
                                                                alt="Size chart"
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={removeSizeChart}
                                                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* VARIANT MATRIX TABLE */}
                                            {variants.length > 0 && (
                                                <div className="border-t border-slate-200 pt-4 overflow-x-auto">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="text-sm font-bold text-slate-700">
                                                            Variant Matrix ({variants.length} combinations)
                                                        </h3>
                                                        <div className="text-xs text-slate-400">
                                                            Total Stock: <span className={`font-bold ${totalVariantStock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{totalVariantStock}</span>
                                                        </div>
                                                    </div>

                                                    <table className="w-full text-xs border-collapse min-w-[600px]">
                                                        <thead>
                                                            <tr className="bg-slate-100">
                                                                <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">Color</th>
                                                                <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">Size</th>
                                                                <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">
                                                                    Stock *
                                                                    <span className="ml-1 text-slate-400 font-normal">(can be 0)</span>
                                                                </th>
                                                                <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">
                                                                    Price (Rs.)
                                                                    <span className="ml-1 text-slate-400 font-normal">(blank = base)</span>
                                                                </th>
                                                                <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">SKU</th>
                                                                <th className="px-3 py-2 text-center font-semibold text-slate-600 border border-slate-200">Status</th>
                                                                <th className="px-3 py-2 text-center font-semibold text-slate-600 border border-slate-200">Remove</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {variants.map((variant, index) => {
                                                                const variantStock = Number(variant.stock || 0)
                                                                const isOOS = variantStock === 0
                                                                return (
                                                                    <tr key={`${variant.color}-${variant.size}-${index}`} className={`${isOOS ? 'bg-red-50' : 'bg-white'} hover:bg-slate-50`}>
                                                                        <td className="px-3 py-2 border border-slate-200 font-medium text-slate-700">{variant.color}</td>
                                                                        <td className="px-3 py-2 border border-slate-200 text-slate-600">{variant.size}</td>
                                                                        <td className="px-3 py-2 border border-slate-200">
                                                                            <input
                                                                                type="number"
                                                                                min="0"
                                                                                value={variant.stock}
                                                                                onChange={e => updateVariantRow(index, 'stock', e.target.value)}
                                                                                className={`w-20 rounded-lg border px-2 py-1.5 text-xs focus:outline-none focus:ring-2 ${isOOS ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-slate-200 focus:ring-emerald-200'}`}
                                                                            />
                                                                        </td>
                                                                        <td className="px-3 py-2 border border-slate-200">
                                                                            <input
                                                                                type="number"
                                                                                min="0"
                                                                                value={variant.price}
                                                                                onChange={e => updateVariantRow(index, 'price', e.target.value)}
                                                                                placeholder={price || "Base price"}
                                                                                className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                                                            />
                                                                        </td>
                                                                        <td className="px-3 py-2 border border-slate-200">
                                                                            <input
                                                                                type="text"
                                                                                value={variant.sku}
                                                                                onChange={e => updateVariantRow(index, 'sku', e.target.value)}
                                                                                placeholder="SKU-001"
                                                                                className="w-28 rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                                                            />
                                                                        </td>
                                                                        <td className="px-3 py-2 border border-slate-200 text-center">
                                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isOOS ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                                                                {isOOS ? '⚠ OOS' : '✓ Available'}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-3 py-2 border border-slate-200 text-center">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeVariantRow(index)}
                                                                                className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 text-red-500 flex items-center justify-center mx-auto transition"
                                                                            >
                                                                                <Trash2 size={12} />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* ── EXISTING IMAGES ── */}
                                {existingImages.length > 0 && imagePreview.length === 0 && (
                                    <div className="border-t border-emerald-100 pt-8">
                                        <h2 className="text-xl font-bold text-emerald-700 mb-4">Current Product Images</h2>
                                        <p className="text-xs text-slate-400 mb-4">Upload new images below to replace these.</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {existingImages.map((img, i) => (
                                                <div key={i} className="rounded-2xl overflow-hidden border border-emerald-100 bg-white shadow-sm">
                                                    <img src={img.url} alt="" className="w-full h-32 object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── NEW IMAGES UPLOAD ── */}
                                <div className="border-t border-emerald-100 pt-8">
                                    <h2 className="text-xl font-bold text-emerald-700 mb-6">
                                        {existingImages.length > 0 ? 'Replace Product Images' : 'Product Images'}
                                    </h2>

                                    <label
                                        htmlFor="update-product-images"
                                        className="group flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-2xl p-10 cursor-pointer bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-500 transition-all duration-300"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-600 to-green-700 flex items-center justify-center shadow-xl mb-5 group-hover:scale-110 transition">
                                            <CloudUpload sx={{ fontSize: 40 }} className="text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-700">Upload New Product Images</h3>
                                        <p className="text-sm text-slate-500 mt-2 text-center">Click here or drag & drop. Uploading new images will replace existing ones.</p>
                                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG</p>
                                        <input
                                            type="file"
                                            id="update-product-images"
                                            hidden
                                            multiple
                                            accept="image/*"
                                            onChange={updateProductImage}
                                        />
                                    </label>

                                    {imagePreview.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-8">
                                            {imagePreview.map((img, index) => (
                                                <div key={index} className="relative group rounded-2xl overflow-hidden shadow-lg border border-emerald-200 bg-white">
                                                    <img src={img} alt="" className="w-full h-40 object-cover group-hover:scale-110 transition duration-300" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* ── SUBMIT ── */}
                                <div className="border-t border-emerald-100 pt-8">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-green-700 hover:to-emerald-800 shadow-xl shadow-emerald-300/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {loading ? "Updating Product..." : "Update Product"}
                                    </button>
                                </div>

                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </>
    )
}

export default UpdateProduct