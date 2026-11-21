
import React, { useState } from 'react'
import { SpaRounded } from '@mui/icons-material';
import { FaStar } from "react-icons/fa";

function Rating({ value, onRatingChange, disabled }) {

    const [hoverRating, setHoverRating] = useState(0);
    const [selectsRating, setSelectedRating] = useState(value || 0);
  
    // ! Handle star hover
    const handlMouseEnter = (rating) => {
        if (!disabled) {
            setHoverRating(rating)
        }
    }

    //!  Mouse leave
    const handleMousLeve = () => {
        if (!disabled) {
            setHoverRating(0);
        }
    }

    // !  handle Click
    const handleClick = (rating) => {
        if (!disabled) {
            setSelectedRating(rating)
            if (onRatingChange) {
                onRatingChange(rating)
            }
        }
    }

    // !  Function to generate stars based on the slected rating

    const generateStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= (hoverRating || selectsRating);
            stars.push(
                <span
                    key={i}
                    className={`star ${isFilled ? 'filled' : 'empty'}`}
                    onMouseEnter={() => handlMouseEnter(i)}
                    onMouseLeave={handleMousLeve}
                    onClick={() => handleClick(i)}
                    style={{ pointerEvents: disabled ? 'none' : 'auto',
                        color: isFilled ? 'gold' : 'gray'  
                     }}
                ><FaStar /></span>
            )

        } return stars;
    }


    return (
        <div>
            <div className="flex items-center justify-center gap-1">
                {generateStars()}
            </div>
        </div>
    )
}

export default Rating