import axios from "axios";
import useUserStore from "../../Store/useUserStore";

export const postReview = async (reviewData) => 
{
    console.log(reviewData);
    const token = useUserStore.getState().token;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }

    const response = await axios.post('http://127.0.0.1:8000/api/reviews/create', reviewData, {headers});

    return response;
}