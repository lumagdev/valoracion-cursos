import axios from "axios";
import useUserStore from "../../Store/useUserStore";

export const postCourse = async (courseData) => 
{
    console.log(courseData);
    const token = useUserStore.getState().token;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
    }

    const response = await axios.post('http://127.0.0.1:8000/api/courses/create', courseData, {headers});

    return response;
}