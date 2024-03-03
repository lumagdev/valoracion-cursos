import axios from "axios";
import useUserStore from "../../Store/useUserStore";

export const deleteCourse = async ({id}) => 
{
    console.log('delete course');
    const token = useUserStore.getState().token;
    const headers = {
        'Authorization': `Bearer ${token}`,
    }

    const response = await axios.delete(`http://127.0.0.1:8000/api/courses/delete/${id}`, {headers});

    return response;
}