import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import PageTitle from '../coponents/PageTitle'
import {
    createProduct,
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

import { X, ChevronRight, Trash2, Palette } from 'lucide-react'

// ==========================================
// 1. PAKISTANI VARIANT DATA DICTIONARY
// ==========================================

const PAKISTANI_VARIANT_DICTIONARY = {
    // MEN'S CLOTHING
    menTShirts: ['S — Chest 36-38"', 'M — Chest 38-40"', 'L — Chest 40-42"', 'XL — Chest 42-44"', 'XXL — Chest 44-46"', '3XL — Chest 46-48"'],
    menJeans: ['28 — Waist 28"', '30 — Waist 30"', '32 — Waist 32"', '34 — Waist 34"', '36 — Waist 36"', '38 — Waist 38"', '40 — Waist 40"', '42 — Waist 42"'],
    menKurta: ['S — 38', 'M — 40', 'L — 42', 'XL — 44', 'XXL — 46', '3XL — 48'],
    menEasternCollar: ['S — 14.5" Collar', 'M — 15.5" Collar', 'L — 16.5" Collar', 'XL — 17.5" Collar', 'XXL — 18.5" Collar', '3XL — 19.5" Collar'],
    menGeneralAlpha: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    menUndergarments: ['S — Waist 28-30"', 'M — Waist 30-32"', 'L — Waist 32-34"', 'XL — Waist 34-36"', 'XXL — Waist 36-38"', '3XL — Waist 38-40"'],

    // WOMEN'S CLOTHING
    womenTops: ['XS — Chest 32-34"', 'S — Chest 34-36"', 'M — Chest 36-38"', 'L — Chest 38-40"', 'XL — Chest 40-42"', 'XXL — Chest 42-44"'],
    womenJeans: ['26 — Waist 26"', '28 — Waist 28"', '30 — Waist 30"', '32 — Waist 32"', '34 — Waist 34"', '36 — Waist 36"', '38 — Waist 38"'],
    womenPret: ['XS — Size 8', 'S — Size 10', 'M — Size 12', 'L — Size 14', 'XL — Size 16', 'XXL — Size 18'],
    womenAbaya: ['52', '54', '56', '58', '60', '62'],
    womenUnstitched: ['2 Piece', '3 Piece'],
    womenGeneralAlpha: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

    // KIDS & BABY
    babyInfantMonths: ['Newborn', '0-3 Months', '3-6 Months', '6-12 Months', '12-18 Months', '18-24 Months'],
    babyNumeric: ['0', '1', '2'],
    kidsYears: ['1-2 Years', '2-3 Years', '3-4 Years', '4-5 Years', '5-6 Years', '7-8 Years', '8-9 Years', '9-10 Years', '11-12 Years', '13-14 Years', '15-16 Years'],
    kidsNumeric: ['18', '20', '22', '24', '26', '28', '30', '32', '34'],

    // FOOTWEAR
    menFootwear: ['PK/UK 6 — EU 40', 'PK/UK 7 — EU 41', 'PK/UK 8 — EU 42', 'PK/UK 9 — EU 43', 'PK/UK 10 — EU 44', 'PK/UK 11 — EU 45', 'PK/UK 12 — EU 46'],
    womenFootwear: ['PK/UK 3 — EU 36', 'PK/UK 4 — EU 37', 'PK/UK 5 — EU 38', 'PK/UK 6 — EU 39', 'PK/UK 7 — EU 40', 'PK/UK 8 — EU 41', 'PK/UK 9 — EU 42'],
    kidsFootwear: ['Baby', 'Toddler', 'Junior', 'EU 25', 'EU 26', 'EU 27', 'EU 28', 'EU 29', 'EU 30', 'EU 31', 'EU 32', 'EU 33', 'EU 34', 'EU 35'],

    // JEWELRY & ACCESSORIES
    jewelryRings: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    jewelryBangles: ['2.2', '2.4', '2.6', '2.8'],
    jewelryBracelets: ['6 inch', '7 inch', '8 inch', '9 inch', 'Adjustable'],
    jewelryNecklaces: ['16 inch', '18 inch', '20 inch', '22 inch', '24 inch'],
    jewelryAnklets: ['8 inch', '9 inch', '10 inch', 'Adjustable'],

    // BAGS, LUGGAGE & BELTS
    bagsGeneral: ['Mini', 'Small', 'Medium', 'Large', 'XL'],
    suitcases: ['20 inch', '24 inch', '28 inch', '32 inch'],
    beltsWaist: ['28', '30', '32', '34', '36', '38', '40', '42', '44'],

    // WATCHES & EYEWEAR
    menWatches: ['38mm', '40mm', '42mm', '44mm', '46mm'],
    womenWatches: ['28mm', '30mm', '32mm', '34mm', '36mm'],
    generalEyewear: ['Small', 'Medium', 'Large', 'One Size', 'Free Size'],

    // ELECTRONICS & TECH
    mobileStorage: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'],
    mobileRAM: ['4GB', '6GB', '8GB', '12GB', '16GB'],
    screenSizes: ['8 inch', '10 inch', '11 inch', '13.3 inch', '14 inch', '15.6 inch', '16 inch', '17.3 inch', '24 inch', '27 inch', '32 inch'],
    chargingCables: ['1 Meter', '1.5 Meter', '2 Meter', '3 Meter'],
    powerBanks: ['5000mAh', '10000mAh', '20000mAh', '30000mAh'],

    // COSMETICS & CARE
    skincareVolume: ['30ml', '50ml', '100ml', '150ml', '200ml', '250ml', '500ml'],
    perfumeVolume: ['10ml', '30ml', '50ml', '75ml', '100ml', '125ml', '150ml'],
    shampooVolume: ['50ml', '100ml', '200ml', '250ml', '400ml', '500ml', '1 Liter'],
    makeupShades: ['Shade 01', 'Shade 02', 'Shade 03', 'Shade 04', 'Shade 05', 'Shade 06', 'Shade 07', 'Shade 08', 'Shade 09', 'Shade 10'],

    // HOME & BEDDING
    bedSheets: ['Single', 'Double', 'Queen', 'King', 'Super King', '90 x 100 inch', '100 x 100 inch', '108 x 108 inch'],
    curtainsLength: ['5 ft', '7 ft', '9 ft', '10 ft', '12 ft'],

    // KITCHEN & STORAGE
    kitchenCapacity: ['250ml', '500ml', '750ml', '1 Liter', '1.5 Liter', '2 Liter', '3 Liter', '5 Liter', '10 Liter', '20 Liter', '50 Liter'],
    kitchenWeight: ['250g', '500g', '1kg', '2kg', '5kg', '10kg'],
    quantitySets: ['1 Piece', '2 Piece', '4 Piece', '6 Piece', '12 Piece', 'Set', 'Dozen'],

    // SPORTS & CAMPING
    cricketBat: ['Short Handle', 'Long Blade', 'Harrow'],
    sportsBalls: ['Size 3', 'Size 4', 'Size 5'],
    tentsCapacity: ['1 Person', '2 Person', '3 Person', '4 Person', '6 Person', '8 Person'],

    // GENERAL
    generalSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Small', 'Medium', 'Large', 'Extra Large', 'One Size', 'Free Size', 'Adjustable', 'Custom Size'],
}

// ==========================================
// 2. CATEGORIES TO VARIANT MAPPING
// ==========================================

const categoriesData = [
    {
        name: "Men's Fashion",
        subCategories: [
            { name: "T-Shirts & Polos", variantType: "menTShirts" },
            { name: "Shirts", variantType: "menTShirts" },
            { name: "Jeans & Trousers", variantType: "menJeans" },
            { name: "Kurta & Shalwar Kameez", variantType: "menKurta" },
            { name: "Waistcoats & Blazers", variantType: "menGeneralAlpha" },
            { name: "Jackets, Hoodies & Sweaters", variantType: "menGeneralAlpha" },
            { name: "Undergarments", variantType: "menUndergarments" },
            { name: "Footwear", variantType: "menFootwear" },
        ]
    },
    {
        name: "Women's Fashion",
        subCategories: [
            { name: "Tops & Shirts", variantType: "womenTops" },
            { name: "Jeans & Trousers", variantType: "womenJeans" },
            { name: "Pret / Ready to Wear", variantType: "womenPret" },
            { name: "Shalwar Kameez & Dresses", variantType: "womenGeneralAlpha" },
            { name: "Abayas & Hijabs", variantType: "womenAbaya" },
            { name: "Unstitched Suits", variantType: "womenUnstitched" },
            { name: "Jackets & Coats", variantType: "womenGeneralAlpha" },
            { name: "Footwear", variantType: "womenFootwear" },
        ]
    },
    {
        name: "Kids & Baby",
        subCategories: [
            { name: "Baby Clothing (Months)", variantType: "babyInfantMonths" },
            { name: "Baby Sizes (0-2)", variantType: "babyNumeric" },
            { name: "Kids Clothing (Age)", variantType: "kidsYears" },
            { name: "Kids Numeric Shirts (18-34)", variantType: "kidsNumeric" },
            { name: "Kids Footwear", variantType: "kidsFootwear" },
        ]
    },
    {
        name: "Jewelry & Accessories",
        subCategories: [
            { name: "Rings", variantType: "jewelryRings" },
            { name: "Bangles", variantType: "jewelryBangles" },
            { name: "Bracelets", variantType: "jewelryBracelets" },
            { name: "Necklaces", variantType: "jewelryNecklaces" },
            { name: "Anklets", variantType: "jewelryAnklets" },
            { name: "Belts", variantType: "beltsWaist" },
            { name: "Caps & Hats", variantType: "generalEyewear" },
            { name: "Sunglasses", variantType: "generalEyewear" },
        ]
    },
    {
        name: "Bags & Luggage",
        subCategories: [
            { name: "Handbags & Backpacks", variantType: "bagsGeneral" },
            { name: "Travel Bags & Suitcases", variantType: "suitcases" },
        ]
    },
    {
        name: "Watches",
        subCategories: [
            { name: "Men's Watches", variantType: "menWatches" },
            { name: "Women's Watches", variantType: "womenWatches" },
        ]
    },
    {
        name: "Electronics & Gadgets",
        subCategories: [
            { name: "Mobile Phones (Storage)", variantType: "mobileStorage" },
            { name: "Tablets & Laptops (Screen)", variantType: "screenSizes" },
            { name: "Monitors", variantType: "screenSizes" },
            { name: "Charging Cables", variantType: "chargingCables" },
            { name: "Power Banks", variantType: "powerBanks" },
            { name: "Headphones & Earbuds", variantType: "generalSizes" },
        ]
    },
    {
        name: "Beauty & Personal Care",
        subCategories: [
            { name: "Skincare", variantType: "skincareVolume" },
            { name: "Perfumes & Fragrances", variantType: "perfumeVolume" },
            { name: "Shampoo & Hair Care", variantType: "shampooVolume" },
            { name: "Makeup & Lipsticks", variantType: "makeupShades" },
        ]
    },
    {
        name: "Home & Kitchen",
        subCategories: [
            { name: "Bed Sheets & Linen", variantType: "bedSheets" },
            { name: "Curtains", variantType: "curtainsLength" },
            { name: "Kitchen Storage (Volume)", variantType: "kitchenCapacity" },
            { name: "Food & Ingredients (Weight)", variantType: "kitchenWeight" },
            { name: "Cookware & Sets", variantType: "quantitySets" },
        ]
    },
    {
        name: "Sports & Fitness",
        subCategories: [
            { name: "Cricket Bats", variantType: "cricketBat" },
            { name: "Footballs", variantType: "sportsBalls" },
            { name: "Tents & Outdoor", variantType: "tentsCapacity" },
            { name: "Gym & Sportswear", variantType: "menGeneralAlpha" },
        ]
    }
]

// ==========================================
// 3. PRESET COLORS
// ==========================================

const presetColors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Navy Blue", hex: "#000080" },
    { name: "Royal Blue", hex: "#4169E1" },
    { name: "Red", hex: "#FF0000" },
    { name: "Maroon", hex: "#800000" },
    { name: "Emerald Green", hex: "#50C878" },
    { name: "Olive Green", hex: "#556B2F" },
    { name: "Beige / Cream", hex: "#F5F5DC" },
    { name: "Pink / Rose", hex: "#FFC0CB" },
    { name: "Grey / Charcoal", hex: "#808080" },
    { name: "Gold / Mustard", hex: "#FFD700" },
]

const getColorHex = (colorName) =>
    presetColors.find((p) => p.name === colorName)?.hex || "#cccccc"

// ==========================================
// 4. ADMIN NAVIGATION
// ==========================================

const navSections = [
    {
        title: 'Products',
        links: [
            { to: '/admin/products', label: 'All Products', icon: Inventory },
            { to: '/admin/product/create', label: 'Create Products', icon: AddBox },
        ],
    },
    {
        title: 'User',
        links: [{ to: '/admin/user', label: 'All Users', icon: People }]
    },
    {
        title: 'Orders',
        links: [{ to: '/admin/orders', label: 'All Orders', icon: ShoppingCart }]
    },
    {
        title: 'Reviews',
        links: [{ to: '/admin/reviews', label: 'All Reviews', icon: Star }]
    },
]

// ==========================================
// CREATE PRODUCT COMPONENT
// ==========================================

function CreateProduct() {

    const { success, loading, error } = useSelector((state) => state.admin)
    const [showMenu, setShowMenu] = useState(false)
    const dispatch = useDispatch()

    // ---------- MAIN FORM STATES ----------
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [originalPrice, setOriginalPrice] = useState("")
    const [showOriginalPrice, setShowOriginalPrice] = useState(false)
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [subCategory, setSubCategory] = useState("")
    const [stock, setStock] = useState("")

    const [image, setImage] = useState([])
    const [imagePreview, setImagePreview] = useState([])

    // ---------- VARIANT STATES ----------
    const [enableVariants, setEnableVariants] = useState(false)
    const [selectedColors, setSelectedColors] = useState([])
    const [selectedSizes, setSelectedSizes] = useState([])
    const [customColorInput, setCustomColorInput] = useState("")
    const [customSizeInput, setCustomSizeInput] = useState("")
    const [variants, setVariants] = useState([])

    // ---------- COLOR WISE IMAGES ----------
    // { "Red": [File, File], "Black": [File] }
    const [colorImages, setColorImages] = useState({})
    const [colorImagePreviews, setColorImagePreviews] = useState({})

    // ---------- CATEGORY DATA ----------
    const currentCategoryObj = useMemo(
        () => categoriesData.find((c) => c.name === category),
        [category]
    )

    const availableSubCategories = currentCategoryObj?.subCategories || []

    const activeSubCatObj = useMemo(
        () => availableSubCategories.find((s) => s.name === subCategory),
        [availableSubCategories, subCategory]
    )

    const activeVariantOptions = useMemo(() => {
        if (!activeSubCatObj?.variantType) {
            return PAKISTANI_VARIANT_DICTIONARY.generalSizes
        }
        return (
            PAKISTANI_VARIANT_DICTIONARY[activeSubCatObj.variantType] ||
            PAKISTANI_VARIANT_DICTIONARY.generalSizes
        )
    }, [activeSubCatObj])

    // ---------- AUTOMATIC TOTAL VARIANT STOCK ----------
    const totalVariantStock = useMemo(() => {
        if (!enableVariants) return Number(stock || 0)
        return variants.reduce((total, v) => total + Number(v.stock || 0), 0)
    }, [variants, stock, enableVariants])

    // When colors are selected, each color has its own images,
    // so the main "Product Images" upload is not needed.
    const useColorImages = enableVariants && selectedColors.length > 0

    // ---------- REBUILD VARIANT MATRIX ----------
    useEffect(() => {
        if (!enableVariants) return

        const newVariants = []
        const colorsList = selectedColors.length > 0 ? selectedColors : ["Default"]
        const sizesList = selectedSizes.length > 0 ? selectedSizes : ["Standard"]

        colorsList.forEach((col) => {
            sizesList.forEach((sz) => {
                const existing = variants.find((v) => v.color === col && v.size === sz)

                if (existing) {
                    newVariants.push(existing)
                } else {
                    newVariants.push({
                        color: col,
                        size: sz,
                        stock: "0",
                        price: "",
                        sku: `${name ? name.substring(0, 3).toUpperCase() : "PRD"}-${col
                            .substring(0, 3)
                            .toUpperCase()}-${sz.substring(0, 4).toUpperCase()}`
                    })
                }
            })
        })

        setVariants(newVariants)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColors, selectedSizes, enableVariants])

    // ==========================================
    // COLOR IMAGE HANDLERS
    // ==========================================

    const clearColorImages = (colorName) => {
        setColorImages((prev) => {
            const copy = { ...prev }
            delete copy[colorName]
            return copy
        })
        setColorImagePreviews((prev) => {
            const copy = { ...prev }
            delete copy[colorName]
            return copy
        })
    }

    const handleColorImages = (colorName, e) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return

        setColorImages((prev) => ({
            ...prev,
            [colorName]: [...(prev[colorName] || []), ...files],
        }))

        setColorImagePreviews((prev) => ({
            ...prev,
            [colorName]: [
                ...(prev[colorName] || []),
                ...files.map((f) => URL.createObjectURL(f)),
            ],
        }))

        e.target.value = ""
    }

    const removeColorImage = (colorName, index) => {
        setColorImages((prev) => ({
            ...prev,
            [colorName]: (prev[colorName] || []).filter((_, i) => i !== index),
        }))
        setColorImagePreviews((prev) => ({
            ...prev,
            [colorName]: (prev[colorName] || []).filter((_, i) => i !== index),
        }))
    }

    // ==========================================
    // COLOR TOGGLE
    // ==========================================

    const toggleColor = (colorName) => {
        if (selectedColors.includes(colorName)) {
            setSelectedColors(selectedColors.filter((c) => c !== colorName))
            clearColorImages(colorName)
        } else {
            setSelectedColors([...selectedColors, colorName])
        }
    }

    const addCustomColor = () => {
        const color = customColorInput.trim()
        if (!color) return

        if (!selectedColors.includes(color)) {
            setSelectedColors([...selectedColors, color])
        }
        setCustomColorInput("")
    }

    // ==========================================
    // SIZE TOGGLE
    // ==========================================

    const toggleSize = (sizeLabel) => {
        if (selectedSizes.includes(sizeLabel)) {
            setSelectedSizes(selectedSizes.filter((s) => s !== sizeLabel))
        } else {
            setSelectedSizes([...selectedSizes, sizeLabel])
        }
    }

    const addCustomSize = () => {
        const size = customSizeInput.trim()
        if (!size) return

        if (!selectedSizes.includes(size)) {
            setSelectedSizes([...selectedSizes, size])
        }
        setCustomSizeInput("")
    }

    // ==========================================
    // VARIANT ROW HELPERS
    // ==========================================

    const updateVariantRow = (index, field, value) => {
        const updated = [...variants]
        updated[index] = { ...updated[index], [field]: value }
        setVariants(updated)
    }

    const removeVariantRow = (index) => {
        setVariants(variants.filter((_, i) => i !== index))
    }

    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {
        setName("")
        setPrice("")
        setOriginalPrice("")
        setShowOriginalPrice(false)
        setDescription("")
        setCategory("")
        setSubCategory("")
        setStock("")

        setImage([])
        setImagePreview([])

        setEnableVariants(false)
        setSelectedColors([])
        setSelectedSizes([])
        setVariants([])
        setCustomColorInput("")
        setCustomSizeInput("")

        setColorImages({})
        setColorImagePreviews({})
    }

    // ==========================================
    // SUBMIT PRODUCT
    // ==========================================

    const createProductSubmit = (e) => {
        e.preventDefault()

        // ---------- WITH VARIANTS ----------
        if (enableVariants) {

            if (variants.length === 0) {
                toast.error("Please add at least one product variant.", {
                    position: "top-center"
                })
                return
            }

            // Every selected color needs its own images.
            // With no colors selected, the main product images are required instead.
            if (selectedColors.length > 0) {
                const missing = selectedColors.filter(
                    (c) => !(colorImages[c] || []).length
                )
                if (missing.length > 0) {
                    toast.error(
                        `Please upload at least one image for: ${missing.join(", ")}`,
                        { position: "top-center" }
                    )
                    return
                }
            } else if (image.length === 0) {
                toast.error("Please upload at least one product image.", {
                    position: "top-center"
                })
                return
            }

            const normalizedVariants = variants.map((variant) => ({
                ...variant,
                stock: Math.max(0, Number(variant.stock || 0)),
                price:
                    variant.price !== "" &&
                    variant.price !== null &&
                    variant.price !== undefined
                        ? Number(variant.price)
                        : Number(price || 0),
                sku: variant.sku || ""
            }))

            const calculatedTotalStock = normalizedVariants.reduce(
                (total, v) => total + Number(v.stock || 0),
                0
            )

            const myForm = new FormData()

            myForm.set('name', name)
            myForm.set('price', price)

            if (showOriginalPrice && originalPrice) {
                myForm.set('originalPrice', originalPrice)
            }

            myForm.set('showOriginalPrice', showOriginalPrice)
            myForm.set('description', description)
            myForm.set('category', category)
            myForm.set('subcategory', subCategory)
            myForm.set('stock', calculatedTotalStock)
            myForm.set('hasVariants', true)
            myForm.set('variants', JSON.stringify(normalizedVariants))

            // Colors meta (name + hex)
            const colorsMeta = selectedColors.map((colorName) => ({
                name: colorName,
                hex: getColorHex(colorName),
            }))
            myForm.set('colors', JSON.stringify(colorsMeta))

            // Each color's images -> field name: colorImages_<index>
            selectedColors.forEach((colorName, i) => {
                ;(colorImages[colorName] || []).forEach((file) => {
                    myForm.append(`colorImages_${i}`, file)
                })
            })

            // Main images only when no colors are selected
            if (selectedColors.length === 0) {
                image.forEach((img) => {
                    myForm.append('image', img)
                })
            }

            dispatch(createProduct(myForm))
            return
        }

        // ---------- WITHOUT VARIANTS ----------
        if (image.length === 0) {
            toast.error("Please upload at least one product image.", {
                position: "top-center"
            })
            return
        }

        const normalStock = Number(stock || 0)
        const myForm = new FormData()

        myForm.set('name', name)
        myForm.set('price', price)

        if (showOriginalPrice && originalPrice) {
            myForm.set('originalPrice', originalPrice)
        }

        myForm.set('showOriginalPrice', showOriginalPrice)
        myForm.set('description', description)
        myForm.set('category', category)
        myForm.set('subcategory', subCategory)
        myForm.set('stock', normalStock)
        myForm.set('hasVariants', false)

        image.forEach((img) => {
            myForm.append('image', img)
        })

        dispatch(createProduct(myForm))
    }

    // ==========================================
    // MAIN IMAGE UPLOAD
    // ==========================================

    const createProductImage = (e) => {
        const files = Array.from(e.target.files || [])

        setImage([])
        setImagePreview([])

        files.forEach((file) => {
            const reader = new FileReader()

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagePreview((old) => [...old, reader.result])
                    setImage((old) => [...old, file])
                }
            }

            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index) => {
        setImage((old) => old.filter((_, i) => i !== index))
        setImagePreview((old) => old.filter((_, i) => i !== index))
    }

    // ==========================================
    // SUCCESS / ERROR
    // ==========================================

    useEffect(() => {
        if (error) {
            toast.error(error.message || 'An error occurred while creating products', {
                position: 'top-center',
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
            })
            dispatch(removeErrors())
        }

        if (success) {
            toast.success(success.message || 'Product created successfully', {
                position: 'top-center',
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            dispatch(removeSuccess())
            resetForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, error, success])

    // ==========================================
    // UI
    // ==========================================

    return (
        <>
            <PageTitle title="Create Product" />

            <div className="min-h-screen bg-slate-100 mt-16 pt-16">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 mx-4 sm:mx-6 mt-6 rounded-2xl px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-600 border-2 border-white/40 flex items-center justify-center text-white font-semibold text-lg">
                            PC
                        </div>
                        <div className="text-white">
                            <p className="font-semibold text-lg leading-tight">Create Product</p>
                            <p className="text-emerald-100 text-sm">
                                Add new products to your PakCartify Store
                            </p>
                        </div>
                    </div>

                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center">
                        <CloudUpload className="text-white" />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 py-6">

                    {/* MOBILE ADMIN MENU */}
                    <div className="lg:hidden w-full mb-4">
                        <button
                            type="button"
                            onClick={() => setShowMenu(!showMenu)}
                            className="w-full bg-emerald-800 text-white rounded-xl px-5 py-4 flex items-center justify-between shadow-md"
                        >
                            <span className="flex items-center gap-3 font-semibold">Admin Menu</span>
                            <span className={`transition-transform duration-300 ${showMenu ? "rotate-90" : ""}`}>
                                ▶
                            </span>
                        </button>
                    </div>

                    {/* SIDEBAR */}
                    <aside
                        className={`w-full lg:w-64 shrink-0 ${
                            showMenu ? "block" : "hidden"
                        } lg:block self-start sticky top-32 max-h-[calc(100vh-3rem)] overflow-y-auto`}
                    >
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
                                        const isActive = to === '/admin/product/create'

                                        return (
                                            <Link
                                                key={to}
                                                to={to}
                                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? 'bg-emerald-50 text-emerald-800'
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-800'
                                                }`}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <Icon
                                                        fontSize="small"
                                                        className={isActive ? '' : 'text-slate-400'}
                                                    />
                                                    {label}
                                                </span>
                                                <ChevronRight size={16} className="text-slate-300" />
                                            </Link>
                                        )
                                    })}
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* MAIN FORM */}
                    <main className="flex-1 min-w-0">
                        <form
                            onSubmit={createProductSubmit}
                            encType="multipart/form-data"
                            className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden"
                        >
                            <div className="bg-emerald-800 px-8 py-5">
                                <h2 className="text-white text-xl font-semibold">Product Information</h2>
                            </div>

                            <div className="p-8 space-y-8">

                                {/* PRODUCT NAME */}
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        name="name"
                                        maxLength={100}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Lawn Embroidered 3PC, Slim Fit Denim Jeans, Wireless Earbuds..."
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                    />
                                </div>

                                {/* PRICE */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-slate-700">
                                            Base Price (Rs.)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={price}
                                            name="price"
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Enter Price"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">
                                            This price will be used for variants where no separate price is entered.
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm font-semibold text-slate-700">
                                                Original Price
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={showOriginalPrice}
                                                    onChange={(e) => setShowOriginalPrice(e.target.checked)}
                                                    className="accent-emerald-600"
                                                />
                                                Show Discount
                                            </label>
                                        </div>

                                        <input
                                            type="number"
                                            min="0"
                                            disabled={!showOriginalPrice}
                                            value={originalPrice}
                                            name="originalPrice"
                                            onChange={(e) => setOriginalPrice(e.target.value)}
                                            placeholder="Original Price"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                        />
                                    </div>
                                </div>

                                {/* DESCRIPTION */}
                                <div className="border-t border-emerald-100 pt-8">
                                    <h2 className="text-xl font-bold text-emerald-700 mb-6">
                                        Product Description
                                    </h2>

                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-slate-700">
                                            Description
                                        </label>
                                        <textarea
                                            rows={5}
                                            required
                                            maxLength={200}
                                            name="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Write product description..."
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 resize-none focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                        />
                                        <div className="flex justify-end mt-2">
                                            <span className="text-sm text-slate-500">
                                                {description.length}/200
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* CATEGORY */}
                                <div className="border-t border-emerald-100 pt-8">
                                    <h2 className="text-xl font-bold text-emerald-700 mb-6">
                                        Category Selection
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block mb-2 text-sm font-semibold text-slate-700">
                                                Category
                                            </label>
                                            <select
                                                required
                                                value={category}
                                                name="category"
                                                onChange={(e) => {
                                                    setCategory(e.target.value)
                                                    setSubCategory("")
                                                    setSelectedSizes([])
                                                    setVariants([])
                                                }}
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                            >
                                                <option value="">Select Category</option>
                                                {categoriesData.map((item) => (
                                                    <option key={item.name} value={item.name}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm font-semibold text-slate-700">
                                                Sub Category
                                            </label>
                                            <select
                                                required
                                                disabled={!category}
                                                value={subCategory}
                                                name="subcategory"
                                                onChange={(e) => {
                                                    setSubCategory(e.target.value)
                                                    setSelectedSizes([])
                                                    setVariants([])
                                                }}
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                            >
                                                <option value="">
                                                    {category ? "Select Sub Category" : "Select Category First"}
                                                </option>
                                                {availableSubCategories.map((item) => (
                                                    <option key={item.name} value={item.name}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* VARIANTS */}
                                <div className="border-t border-emerald-100 pt-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-emerald-700">
                                                Color & Size / Variant System
                                            </h2>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Sizing options dynamically adjust based on your selected subcategory
                                            </p>
                                        </div>

                                        <label className="flex items-center gap-2 cursor-pointer bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
                                            <input
                                                type="checkbox"
                                                checked={enableVariants}
                                                onChange={(e) => {
                                                    setEnableVariants(e.target.checked)
                                                    if (!e.target.checked) {
                                                        setVariants([])
                                                    }
                                                }}
                                                className="accent-emerald-600 w-4 h-4"
                                            />
                                            <span className="text-sm font-semibold text-emerald-800">
                                                Enable Variants
                                            </span>
                                        </label>
                                    </div>

                                    {enableVariants && (
                                        <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">

                                            {/* COLOR SELECTOR */}
                                            <div>
                                                <label className="mb-2 text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                    <Palette size={16} />
                                                    Select Colors (Optional)
                                                </label>

                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {presetColors.map((col) => {
                                                        const isSelected = selectedColors.includes(col.name)

                                                        return (
                                                            <button
                                                                key={col.name}
                                                                type="button"
                                                                onClick={() => toggleColor(col.name)}
                                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                                                                    isSelected
                                                                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                                                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                                                                }`}
                                                            >
                                                                <span
                                                                    className="w-3.5 h-3.5 rounded-full border border-gray-300"
                                                                    style={{ backgroundColor: col.hex }}
                                                                />
                                                                {col.name}
                                                                {isSelected && " ✓"}
                                                            </button>
                                                        )
                                                    })}
                                                </div>

                                                <div className="flex gap-2 max-w-sm">
                                                    <input
                                                        type="text"
                                                        value={customColorInput}
                                                        onChange={(e) => setCustomColorInput(e.target.value)}
                                                        placeholder="Custom color (e.g. Off-White, Teal)..."
                                                        className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={addCustomColor}
                                                        className="bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-900 transition"
                                                    >
                                                        + Add Color
                                                    </button>
                                                </div>

                                                {/* Custom colors (not in presets) with a remove button */}
                                                {selectedColors.filter(
                                                    (c) => !presetColors.some((p) => p.name === c)
                                                ).length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {selectedColors
                                                            .filter((c) => !presetColors.some((p) => p.name === c))
                                                            .map((c) => (
                                                                <span
                                                                    key={c}
                                                                    className="flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                                                                >
                                                                    {c}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => toggleColor(c)}
                                                                        className="hover:text-red-300"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                </span>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* COLOR WISE IMAGES */}
                                            {selectedColors.length > 0 && (
                                                <div className="border-t border-slate-200 pt-4 space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-700">
                                                            Color Wise Images
                                                        </label>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Upload at least one image for each selected color. These images are used as the product images.
                                                        </p>
                                                    </div>

                                                    {selectedColors.map((colorName) => {
                                                        const previews = colorImagePreviews[colorName] || []

                                                        return (
                                                            <div
                                                                key={colorName}
                                                                className="bg-white border border-slate-200 rounded-xl p-4"
                                                            >
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <div className="flex items-center gap-2 font-semibold text-sm text-slate-800">
                                                                        <span
                                                                            className="w-4 h-4 rounded-full border border-gray-300"
                                                                            style={{ backgroundColor: getColorHex(colorName) }}
                                                                        />
                                                                        {colorName}
                                                                        <span className="text-xs text-slate-400 font-normal">
                                                                            ({previews.length} images)
                                                                        </span>
                                                                    </div>

                                                                    <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                                                                        + Upload
                                                                        <input
                                                                            type="file"
                                                                            hidden
                                                                            multiple
                                                                            accept="image/*"
                                                                            onChange={(e) => handleColorImages(colorName, e)}
                                                                        />
                                                                    </label>
                                                                </div>

                                                                {previews.length > 0 ? (
                                                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                                                        {previews.map((src, idx) => (
                                                                            <div
                                                                                key={idx}
                                                                                className="relative group rounded-lg overflow-hidden border border-slate-200"
                                                                            >
                                                                                <img
                                                                                    src={src}
                                                                                    alt=""
                                                                                    className="w-full h-24 object-cover"
                                                                                />
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeColorImage(colorName, idx)}
                                                                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                                                >
                                                                                    <X size={12} />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-xs text-slate-400">
                                                                        No images uploaded for this color yet.
                                                                    </p>
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

                                                <p className="text-xs text-slate-500 mb-3">
                                                    Click to select sizes relevant for this product category:
                                                </p>

                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {activeVariantOptions.map((sz) => {
                                                        const isSelected = selectedSizes.includes(sz)

                                                        return (
                                                            <button
                                                                key={sz}
                                                                type="button"
                                                                onClick={() => toggleSize(sz)}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                                                                    isSelected
                                                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                                                        : "bg-white text-slate-700 border-slate-300 hover:border-emerald-500"
                                                                }`}
                                                            >
                                                                {sz} {isSelected ? "✓" : "+"}
                                                            </button>
                                                        )
                                                    })}
                                                </div>

                                                <div className="flex gap-2 max-w-md">
                                                    <input
                                                        type="text"
                                                        value={customSizeInput}
                                                        onChange={(e) => setCustomSizeInput(e.target.value)}
                                                        placeholder="Custom size (e.g. Free Size, 1.5 Liter, Model Specific)..."
                                                        className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={addCustomSize}
                                                        className="bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-emerald-800 transition"
                                                    >
                                                        + Add Custom Size
                                                    </button>
                                                </div>
                                            </div>

                                            {/* VARIANT TABLE */}
                                            {variants.length > 0 && (
                                                <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto mt-4 shadow-sm">
                                                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                                                        <thead>
                                                            <tr className="bg-slate-100 border-b text-slate-600 font-semibold">
                                                                <th className="p-3">Color</th>
                                                                <th className="p-3">Size / Attribute</th>
                                                                <th className="p-3">Stock Quantity</th>
                                                                <th className="p-3">Price (Rs.)</th>
                                                                <th className="p-3">SKU (Optional)</th>
                                                                <th className="p-3 text-right">Remove</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody className="divide-y text-slate-700">
                                                            {variants.map((v, idx) => (
                                                                <tr
                                                                    key={`${v.color}-${v.size}-${idx}`}
                                                                    className="hover:bg-slate-50"
                                                                >
                                                                    <td className="p-3 font-semibold text-slate-800">
                                                                        {v.color}
                                                                    </td>

                                                                    <td className="p-3 font-semibold text-emerald-800">
                                                                        {v.size}
                                                                    </td>

                                                                    {/* STOCK */}
                                                                    <td className="p-3">
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            step="1"
                                                                            value={v.stock}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value
                                                                                if (value === "" || Number(value) >= 0) {
                                                                                    updateVariantRow(idx, "stock", value)
                                                                                }
                                                                            }}
                                                                            className="w-24 border border-slate-300 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-emerald-200"
                                                                        />
                                                                    </td>

                                                                    {/* PRICE */}
                                                                    <td className="p-3">
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            step="0.01"
                                                                            value={v.price}
                                                                            placeholder={price ? `Base: Rs. ${price}` : "Base Price"}
                                                                            onChange={(e) =>
                                                                                updateVariantRow(idx, "price", e.target.value)
                                                                            }
                                                                            className="w-28 border border-slate-300 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-emerald-200"
                                                                        />
                                                                        <p className="text-[10px] text-slate-400 mt-1">
                                                                            Empty = Base Price
                                                                        </p>
                                                                    </td>

                                                                    {/* SKU */}
                                                                    <td className="p-3">
                                                                        <input
                                                                            type="text"
                                                                            value={v.sku}
                                                                            onChange={(e) =>
                                                                                updateVariantRow(idx, "sku", e.target.value)
                                                                            }
                                                                            className="w-28 border border-slate-300 rounded-lg p-1.5 text-xs uppercase focus:ring-2 focus:ring-emerald-200"
                                                                        />
                                                                    </td>

                                                                    {/* REMOVE */}
                                                                    <td className="p-3 text-right">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeVariantRow(idx)}
                                                                            className="text-red-500 hover:text-red-700 p-1"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* OVERALL INVENTORY */}
                                <div className="border-t border-emerald-100 pt-8">
                                    <h2 className="text-xl font-bold text-emerald-700 mb-6">
                                        Overall Inventory
                                    </h2>

                                    {enableVariants ? (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700">
                                                        Total Stock Quantity
                                                    </label>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        This value is automatically calculated from your variant quantities.
                                                    </p>
                                                </div>

                                                <div className="min-w-[180px]">
                                                    <input
                                                        type="number"
                                                        value={totalVariantStock}
                                                        readOnly
                                                        className="w-full rounded-xl border border-emerald-300 bg-white px-4 py-3 font-bold text-lg text-emerald-700 cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block mb-2 text-sm font-semibold text-slate-700">
                                                Total Stock Quantity
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                step="1"
                                                value={stock}
                                                name="stock"
                                                onChange={(e) => setStock(e.target.value)}
                                                placeholder="Enter Total Stock Quantity"
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* MAIN PRODUCT IMAGES
                                    Hidden when colors are selected, because the
                                    color-wise images are used as the product images. */}
                                {useColorImages ? (
                                    <div className="border-t border-emerald-100 pt-8">
                                        <p className="text-sm text-slate-500">
                                            Product images are taken from the color-wise images above.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="border-t border-emerald-100 pt-8">
                                        <h2 className="text-xl font-bold text-emerald-700 mb-6">
                                            Product Images
                                        </h2>

                                        <label
                                            htmlFor="product-images"
                                            className="group flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-2xl p-10 cursor-pointer bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-500 transition-all duration-300"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-600 to-green-700 flex items-center justify-center shadow-xl mb-5 group-hover:scale-110 transition">
                                                <CloudUpload sx={{ fontSize: 40 }} className="text-white" />
                                            </div>

                                            <h3 className="text-lg font-semibold text-slate-700">
                                                Upload Product Images
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-2 text-center">
                                                Click here or drag & drop your product images.
                                            </p>

                                            <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG</p>

                                            <input
                                                type="file"
                                                id="product-images"
                                                hidden
                                                multiple
                                                accept="image/*"
                                                name="image"
                                                onChange={createProductImage}
                                            />
                                        </label>

                                        {imagePreview.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-8">
                                                {imagePreview.map((img, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative group rounded-2xl overflow-hidden shadow-lg border border-emerald-200 bg-white"
                                                    >
                                                        <img
                                                            src={img}
                                                            alt=""
                                                            className="w-full h-40 object-cover group-hover:scale-110 transition duration-300"
                                                        />
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
                                )}

                                {/* ACTION BUTTONS */}
                                <div className="border-t border-emerald-100 pt-8">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="flex-1 py-4 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition cursor-pointer"
                                        >
                                            Reset Form
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-green-700 hover:to-emerald-800 shadow-xl shadow-emerald-300/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {loading ? "Creating Product..." : "Create Product"}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </>
    )
}

export default CreateProduct