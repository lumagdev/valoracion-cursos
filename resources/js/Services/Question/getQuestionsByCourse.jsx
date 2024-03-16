import axios from "axios";
import useUserStore from "../../Store/useUserStore";

export const getQuestionsByCourse = async (id) => 
{
    //const token = useUserStore.getState().token;
    const headers = {
    //    'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }

    const response = await axios.get(`http://127.0.0.1:8000/api/questions/questions-by-course/${id}`, {headers})
    
    return response.data;
}