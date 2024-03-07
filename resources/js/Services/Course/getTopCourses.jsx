import axios from "axios";

export const getTopCourses = async () =>
{
    const headers = {
        'Content-Type': 'application/json',
    }

    const response = await axios.get('http://127.0.0.1:8000/api/courses/top-courses', {headers})

    return response.data;
}