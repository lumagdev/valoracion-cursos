import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar} from "react-icons/fa";
const StarsRating = (rating) => 
{
    if (rating === 5) {
        // 'complete':'5','half':'0','reg':'0'
        return <> <FaStar/><FaStar/><FaStar/><FaStar/><FaStar/> </>
    }else if(rating >= 4.5 && rating < 5){
        // 'complete':'4','half':'1','reg':'0';
        return <> <FaStar/><FaStar/><FaStar/><FaStar/><FaStarHalfAlt/> </>
    }else if(rating >= 4 && rating < 4.5){
        // 'complete':'4','half':'0','reg':'1';
        return <> <FaStar/><FaStar/><FaStar/><FaStar/><FaRegStar/> </>
    }else if(rating >= 3.5 && rating < 4){
        // 'complete':'3','half':'1','reg':'1';
        return <> <FaStar/><FaStar/><FaStar/><FaStarHalfAlt/><FaRegStar/> </>
    }else if(rating >= 3 && rating < 3.5){
        // 'complete':'3','half':'0','reg':'2';
        return <> <FaStar/><FaStar/><FaStar/><FaRegStar/><FaRegStar/> </>
    }else if(rating >= 2.5 && rating < 3){
        // 'complete':'2','half':'1','reg':'2';
        return <> <FaStar/><FaStar/><FaStarHalfAlt/><FaRegStar/><FaRegStar/> </>
    }else if(rating >= 2 && rating < 2.5){
        // 'complete':'2','half':'0','reg':'3';
        return <> <FaStar/><FaStar/><FaRegStar/><FaRegStar/><FaRegStar/> </>
    }else if(rating >= 1.5 && rating < 2){
        // 'complete':'1','half':'1','reg':'3';
        return <> <FaStar/><FaStarHalfAlt/><FaRegStar/><FaRegStar/><FaRegStar/> </>
    }else if(rating >= 1 && rating < 1.5){
        // 'complete':'1','half':'0','reg':'4';
        return <> <FaStar/><FaRegStar/><FaRegStar/><FaRegStar/><FaRegStar/> </>
    }else if(rating >= 0.5 && rating < 1){
        // 'complete':'0','half':'1','reg':'4';
        return <> <FaStarHalfAlt/><FaRegStar/><FaRegStar/><FaRegStar/><FaRegStar/> </>
    }else {
        // 'complete':'0','half':'0','reg':'0';
        return <> <FaRegStar/><FaRegStar/><FaRegStar/><FaRegStar/><FaRegStar/> </>
    }
};
export default StarsRating;