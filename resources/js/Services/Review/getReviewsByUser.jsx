import axios from "axios";
import useUserStore from "../../Store/useUserStore";

export const getReviewsByUser = async (id) =>
{
    const token = useUserStore.getState().token;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }

    const response = await axios.get(`http://127.0.0.1:8000/api/reviews/reviews-by-user/${id}`, {headers})

    return response.data;
}