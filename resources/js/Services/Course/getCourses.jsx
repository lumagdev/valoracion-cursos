import axios from "axios";
import useUserStore from "../../Store/useUserStore";

export const getCourses = async () =>
{
    const token = useUserStore.getState().token;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }

    const response = await axios.get('http://127.0.0.1:8000/api/courses', {headers})

    return response.data;
}