import React, { useEffect, useState } from 'react'
import PageTitle from '../coponents/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../features/Products/productslice';
import Product from '../coponents/Products';
import Loader from '../coponents/Loader';
import { useLocation, useNavigation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { removeErrors } from '../features/Products/productslice';
import NoProduct from '../coponents/NoProduct';
import { useNavigate } from 'react-router-dom';
import Pagination from '../coponents/Pagination';




function Products() {

    const { loading, error, products, resultsPerPage, productCount } = useSelector(state => state.product);
    const dispatch = useDispatch();
    const [openCategory, setOpenCategory] = useState(null);
    const [showCategories, setShowCategories] = useState(false);


    // Keyword pairameter
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    const keyword = searchParams.get("keyword");
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const pageFromURL = parseInt(searchParams.get("page"), 10) || 1;
    const [currentPage, setCurrentPage] = useState(pageFromURL);
    const navigate = useNavigate();


    const categories = [
        {
            name: "Electronics",
            subCategories: [
                "Mobiles & Tablets",
                "Computers & Laptops",
                "Cameras",
                "Gaming",
                "Smart Watches",
                "Headphones",
                "Speakers",
                "Accessories",
            ],
        },
        {
            name: "Fashion",
            subCategories: [
                "Men's Fashion",
                "Women's Fashion",
                "Shoes",
                "Bags & Luggage",
                "Jewelry & Watches",
            ],
        },
        {
            name: "Kids & Baby",
            subCategories: [
                "Baby Clothing",
                "Baby Toys",
                "Diapers",
                "Baby Care",
            ],
        },
        {
            name: "Beauty & Personal Care",
            subCategories: [
                "Skincare",
                "Makeup",
                "Hair Care",
                "Perfumes",
            ],
        },
        {
            name: "Health & Wellness",
            subCategories: [
                "Vitamins",
                "Medicines",
                "Fitness Equipment",
                "Health Devices",
            ],
        },
        {
            name: "Home & Kitchen",
            subCategories: [
                "Kitchen Appliances",
                "Cookware",
                "Storage",
                "Dining",
            ],
        },
        {
            name: "Home Decor",
            subCategories: [
                "Wall Art",
                "Lighting",
                "Curtains",
                "Decor Items",
            ],
        },
        {
            name: "Furniture",
            subCategories: [
                "Sofas",
                "Beds",
                "Tables",
                "Office Furniture",
            ],
        },
        {
            name: "Grocery",
            subCategories: [
                "Rice",
                "Oil",
                "Snacks",
                "Beverages",
            ],
        },
        {
            name: "Sports & Outdoors",
            subCategories: [
                "Cricket",
                "Football",
                "Gym Equipment",
                "Camping",
            ],
        },
        {
            name: "Automotive",
            subCategories: [
                "Car Accessories",
                "Bike Accessories",
                "Tyres",
                "Engine Oil",
            ],
        },
        {
            name: "Books & Stationery",
            subCategories: [
                "Books",
                "Notebooks",
                "Pens",
                "School Supplies",
            ],
        },
        {
            name: "Office Supplies",
            subCategories: [
                "Office Chairs",
                "Desks",
                "Printers",
                "Office Accessories",
            ],
        },
        {
            name: "Toys & Games",
            subCategories: [
                "Educational Toys",
                "Board Games",
                "Remote Control Toys",
                "Soft Toys",
            ],
        },
        {
            name: "Pet Supplies",
            subCategories: [
                "Dog Food",
                "Cat Food",
                "Pet Toys",
                "Pet Accessories",
            ],
        },
        {
            name: "Tools & Hardware",
            subCategories: [
                "Power Tools",
                "Hand Tools",
                "Safety Equipment",
                "Tool Kits",
            ],
        },
        {
            name: "Garden & Outdoor",
            subCategories: [
                "Plants",
                "Pots",
                "Garden Tools",
                "Outdoor Furniture",
            ],
        },
        {
            name: "Musical Instruments",
            subCategories: [
                "Guitars",
                "Keyboards",
                "Drums",
                "Microphones",
            ],
        },
        {
            name: "Gift Items",
            subCategories: [
                "Gift Boxes",
                "Flowers",
                "Greeting Cards",
                "Personalized Gifts",
            ],
        },
    ];

    // Show Sub categories
    const toggleCategory = (categoryName) => {
        if (openCategory === categoryName) {
            setOpenCategory(null);
        } else {
            setOpenCategory(categoryName);
        }
    };

    useEffect(() => {
        dispatch(getProducts({ keyword, page: currentPage, category, subcategory }));
    }, [dispatch, keyword, currentPage, category, subcategory]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || 'An error occurred while fetching products', { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
            dispatch(removeErrors());
        }
    }, [dispatch, error])

    const handlePageChange = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
            const newSearchParams = new URLSearchParams(location.search)
            if (page === 1) {
                newSearchParams.delete('page')
            } else {
                newSearchParams.set('page', page)
            }

            navigate(`?${newSearchParams.toString()}`)
        }
    }

    const handleCategoryClick = (category, subcategory = null) => {
        setCurrentPage(1);

        const newSearchParams = new URLSearchParams(location.search);

        newSearchParams.set("category", category);

        if (subcategory) {
            newSearchParams.set("subcategory", subcategory);
        } else {
            newSearchParams.delete("subcategory");
        }

        newSearchParams.delete("keyword");
        newSearchParams.delete("page");

        navigate(`?${newSearchParams.toString()}`);
    };

    return (

        <>
            {loading ? (<Loader />) : (<>
                <PageTitle title="All Products" />

                <div className="lg:hidden mt-[110px] px-4">
                    <button
                        onClick={() => setShowCategories(true)}
                        className="w-full bg-[#0E5D33] text-white py-3 rounded-lg font-semibold"
                    >
                        ☰ Categories
                    </button>
                </div>

                {showCategories && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setShowCategories(false)}
                    />
                )}

                <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-5 px-3 sm:px-5 py-4 sm:py-5 sm:mt-[90px] lg:mt-[110px]">
                    <div className={`fixed lg:static top-[80px] lg:top-0 left-0 h-[calc(100vh-80px)] lg:h-auto w-[280px] lg:w-[280px] bg-white lg:bg-[var(--text-light)] z-50 p-5 overflow-y-auto border-r lg:border shadow-xl lg:shadow-sm rounded-none lg:rounded-xl transition-transform duration-300 ${showCategories ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

                        <div className="flex justify-between items-center mb-5 lg:hidden">
                            <h3 className="text-2xl font-bold">
                                Categories
                            </h3>

                            <button
                                onClick={() => setShowCategories(false)}
                                className="text-4xl"
                            >
                                ×
                            </button>
                        </div>

                        <h3 className="hidden lg:block text-black text-3xl font-bold mb-5">
                            Categories
                        </h3>

                        <ul className="space-y-2">
                            {categories.map((cat) => (
                                <li key={cat.name}>

                                    {/* Main Category */}
                                    <div
                                        onClick={() => toggleCategory(cat.name)
                                        }
                                        className="flex justify-between items-center px-3 md:px-4 py-3 rounded-lg cursor-pointer font-semibold text-gray-800 hover:bg-[#0E5D33] hover:text-white transition-all duration-300"
                                    >
                                        <span>{cat.name}</span>

                                        <span className="text-xl font-bold">
                                            {openCategory === cat.name ? "−" : "+"}
                                        </span>
                                    </div>

                                    {/* Sub Categories */}
                                    {openCategory === cat.name && (
                                        <ul className="ml-4 mt-2 space-y-1 border-l-2 border-green-200 pl-3">
                                            {cat.subCategories.map((sub) => (
                                                <li
                                                    key={sub}
                                                    onClick={() => handleCategoryClick(cat.name, sub)}
                                                    className="px-3 py-2 rounded-md text-sm md:text-base cursor-pointer text-gray-600 hover:bg-green-100 hover:text-green-700 transition-all duration-300"
                                                >
                                                    • {sub}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>

                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 w-full">
                                {products.map((product) => (
                                    <Product key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <NoProduct
                                keyword={keyword}
                                onClear={() => {
                                    navigate("?");
                                    setShowCategories(false);
                                }}
                            />
                        )}
                        <Pagination
                            currentPage={currentPage}
                            onPageChange={handlePageChange}

                        />

                    </div>
                </div>
            </>)}
        </>
    )
}

export default Products