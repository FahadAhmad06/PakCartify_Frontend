import React, { useEffect, useRef, useState, useCallback } from 'react'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const images = [
    "14aug.png",
    "14aug1.png",
    "14aug2.png",
    "img9.png",
    "img10.png",
    "img11.png",
    "img.png",
    "immg 1.png",
    "immg 2.png",
    "img 1.png",
    "img 2.png",
    "img 3.png",
    "img 4.png",
    "img 5.png",
    "img 6.png",
    "img7.png",
    "img8.png",
]

const extendedImages = [images[images.length - 1], ...images, images[0]]

const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(1)
    const [withTransition, setWithTransition] = useState(true)
    const trackRef = useRef(null)
    // Prevent clicks while a transition is in progress
    const isTransitioning = useRef(false)
    const intervalRef = useRef(null)

    const startInterval = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
            if (!isTransitioning.current) {
                isTransitioning.current = true
                setWithTransition(true)
                setCurrentIndex((prev) => prev + 1)
            }
        }, 5000)
    }, [])

    useEffect(() => {
        startInterval()
        return () => clearInterval(intervalRef.current)
    }, [startInterval])

    const goNext = () => {
        // Ignore clicks while transitioning to prevent index going out of bounds
        if (isTransitioning.current) return
        isTransitioning.current = true
        startInterval() // reset the auto-play timer on manual click
        setWithTransition(true)
        setCurrentIndex((prev) => prev + 1)
    }

    const goPrev = () => {
        if (isTransitioning.current) return
        isTransitioning.current = true
        startInterval()
        setWithTransition(true)
        setCurrentIndex((prev) => prev - 1)
    }

    const goToDot = (index) => {
        if (isTransitioning.current) return
        isTransitioning.current = true
        startInterval()
        setWithTransition(true)
        setCurrentIndex(index + 1) // +1 to account for the leading clone
    }

    const handleTransitionEnd = () => {
        if (currentIndex === extendedImages.length - 1) {
            // We were on the cloned-first slide → jump silently to real first
            setWithTransition(false)
            setCurrentIndex(1)
        } else if (currentIndex === 0) {
            // We were on the cloned-last slide → jump silently to real last
            setWithTransition(false)
            setCurrentIndex(images.length)
        }
        // Unlock clicks after transition finishes
        isTransitioning.current = false
    }

    // Which dot should be highlighted (maps the extended index back to 0..images.length-1)
    const activeDot =
        currentIndex === 0
            ? images.length - 1
            : currentIndex === extendedImages.length - 1
                ? 0
                : currentIndex - 1

    return (
        <div className='relative w-full h-[250px] sm:h-[400px] md:h-[570px] lg:h-[590px] overflow-hidden mt-[100px] md:mt-[125px] lg:mt-[113px] object-contain'>
            <div
                ref={trackRef}
                className={`flex h-full ${withTransition ? 'transition-transform duration-600 ease' : ''}`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                onTransitionEnd={handleTransitionEnd}
            >
                {extendedImages.map((image, index) => (
                    <div className="min-w-[100%] h-full w-full" key={index}>
                        <img
                            src={image}
                            alt={`slider ${index + 1}`}
                            className="w-full h-[250px] sm:h-[400px] md:h-[570px] lg:h-[590px] object-fill"
                        />
                    </div>
                ))}
            </div>

            {/* Left Arrow */}
            <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10 cursor-pointer"
            >
                <ArrowBackIosNewIcon fontSize="small" />
            </button>

            <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10 cursor-pointer"
            >
                <ArrowForwardIosIcon fontSize="small" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-[1rem]">
                {images.map((_, index) => (
                    <span
                        className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full cursor-pointer transition-all duration-300 hover:bg-gray-200 ${index === activeDot ? 'bg-white' : 'bg-white/50'}`}
                        onClick={() => goToDot(index)}
                        key={index}
                    />
                ))}
            </div>
        </div>
    )
}

export default ImageSlider