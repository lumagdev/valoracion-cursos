import axios from "axios";
import useUserStore from "../../Store/useUserStore";

export const putUser = async ({userData, id}) => 
{
    console.log(userData);
    const token = useUserStore.getState().token;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }

    const response = await axios.put(`http://127.0.0.1:8000/api/users/update/${id}`, userData, {headers});

    return response;
}