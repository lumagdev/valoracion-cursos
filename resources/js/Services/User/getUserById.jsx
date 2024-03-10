import axios from "axios";
import useUserStore from "../../Store/useUserStore";

export const getUserById = async (id) => 
{
    const token = useUserStore.getState().token;
    const headers = {
        'Authorization': `Bearer ${token}`,
    }

    const response = await axios.get(`http://127.0.0.1:8000/api/users/${id}`, {headers});

    return response.data;
}