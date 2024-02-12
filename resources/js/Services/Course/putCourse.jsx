import axios from "axios";
import useUserStore from "../../Store/useUserStore";

export const putCourse = async ({courseData, id}) => 
{
    //console.log('DENTRO',courseData);
    const token = useUserStore.getState().token;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        'X-HTTP-Method-Override': 'PUT',
    }

    const response = await axios.post(`http://127.0.0.1:8000/api/courses/update/${id}`, courseData, {headers});

    return response;
}