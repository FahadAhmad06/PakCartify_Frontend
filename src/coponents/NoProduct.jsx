
import { useNavigate } from 'react-router-dom'

function NoProduct({ keyword, onClear }) {
    const navigate = useNavigate();
    const suggestions = ['Electronics', 'Fashion', 'Kids & Baby', 'Beauty & Personal Care', 'Health & Wellness', 'Home & Kitchen', 'Home Decor', 'Furniture', 'Grocery', 'Sports & Outdoors', 'Automotive', 'Books & Stationery', 'Office Supplies', 'Toys & Games', 'Pet Supplies', 'Tools & Hardware', 'Garden & Outdoor', 'Musical Instruments', 'Gift Items'];

    return (
        <div className="min-h-[60vh] flex justify-center items-center px-6" >
            <div className="flex flex-col items-center text-center bg-white rounded-3xl p-10 max-w-md w-full border border-gray-100 shadow-sm">

                <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6"
                    style={{ animation: 'float 3s ease-in-out infinite' }}>
                    <span className="text-5xl">🔍</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>

                <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
                    {keyword
                        ? <>We couldn't find anything matching <span className="text-[#0B6B3A] font-semibold">"{keyword}"</span>. Try different keywords or browse our catalog.</>
                        : 'No products are available right now. Please check back later.'
                    }
                </p>

                <div className="w-full border-t border-dashed border-gray-100 mb-6" />

                <div className="mb-7 w-full">
                    <p className="text-xs text-gray-300 mb-3 uppercase tracking-widest">Try searching for</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {suggestions.map((s) => (
                            <span
                                key={s}
                                onClick={() => navigate(`/products?keyword=${s}`)}
                                className="text-xs px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-gray-500 cursor-pointer hover:border-[#0B6B3A] hover:text-[#0B6B3A] hover:bg-[#f0faf4] transition-all duration-200"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 flex-wrap justify-center">
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2.5 bg-[#0B6B3A] hover:bg-[#054A28] text-white rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
                    >
                        🛍️ Browse all products
                    </button>
                    <button
                        onClick={onClear}
                        className="px-6 py-2.5 bg-white border border-gray-200 hover:border-[#0B6B3A] hover:text-[#0B6B3A] text-gray-400 rounded-xl text-sm transition-all duration-200 cursor-pointer"
                    >
                        ✕ Clear search
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    )
}

export default NoProduct

