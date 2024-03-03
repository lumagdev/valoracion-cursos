import axios from "axios";
import useUserStore from "../../Store/useUserStore";

export const putTechnology = async ({technologyData, id}) => 
{
    console.log('put technology',technologyData);
    const token = useUserStore.getState().token;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        'X-HTTP-Method-Override': 'PUT',
    }

    const response = await axios.post(`http://127.0.0.1:8000/api/technologies/update/${id}`, technologyData, {headers});

    return response;
}