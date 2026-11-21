import React, { use } from 'react'
import { useEffect } from 'react';
import { getProducts } from '../features/Products/productslice';
import Footer from '../coponents/Footer'
// import Navbar from '../coponents/Navbar
import ImageSlider from '../coponents/ImageSlider'
import Products from '../coponents/Products'
import PageTitle from '../coponents/PageTitle'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../coponents/Loader';
import { toast } from 'react-toastify';
import { removeErrors } from '../features/Products/productslice';

function Home() {
  const { loading, error, products, productCunt } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts({ keyword: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'An error occurred while fetching products', { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
      dispatch(removeErrors());
    }
  }, [dispatch, error])


  return (
    <>
      {loading ? (<Loader />) : (<>
        <PageTitle title="Home-PakCartify" />

        <ImageSlider />


        <div className='p-2 sm:p-4 md:p-8 text-[#1F2937] flex flex-col items-center justify-around mt-12 w-full'>
          <div className="flex items-center gap-2 lg:gap-4 w-full lg:w-1/2 px-2 sm:px-4 md:px-8 lg:px-16 my-4 sm:my-8">
            <div className="flex-1 h-[2px] md:h-[3px] bg-[#0E5D33] rounded-full" />
            <h2 className="text-xl md:text-3xl lg:text-5xl font-bold text-[#0E5D33] whitespace-nowrap">
              Trending Now
            </h2>
            <div className="flex-1 h-[2px] md:h-[3px] bg-[#0E5D33] rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 w-full">
            {products.map((product, index) => (
              <Products product={product} key={index} />
            ))}
          </div>
        </div>

      </>)}
    </>
  )
}

export default Home