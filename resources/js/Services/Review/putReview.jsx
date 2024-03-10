import axios from "axios";
import useUserStore from "../../Store/useUserStore";

export const putReview = async ({reviewData, id}) => 
{
    console.log(reviewData);
    const token = useUserStore.getState().token;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }

    const response = await axios.put(`http://127.0.0.1:8000/api/reviews/update/${id}`, reviewData, {headers});

    return response;
}