import axios from "axios";
import useUserStore from "../../Store/useUserStore";

export const postTechnology = async (technologyData) => 
{
    console.log(technologyData);
    const token = useUserStore.getState().token;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
    }

    const response = await axios.post('http://127.0.0.1:8000/api/technologies/create',technologyData, {headers});

    return response;
}