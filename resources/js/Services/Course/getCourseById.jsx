import axios from "axios";

export const getCourseById = async (id) =>
{
    const headers = {
        'Content-Type': 'application/json',
    }

    const response = await axios.get(`http://127.0.0.1:8000/api/courses/${id}`, {headers})

    return response.data;
}