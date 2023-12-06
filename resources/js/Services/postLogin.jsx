import axios from "axios";

const csrfToken = document.head.querySelector('meta[name="csrf-token"]').content;

export const postLogin = async (loginData) => 
{
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
    }

    const response = await axios.post('http://127.0.0.1:8000/api/login', loginData, {headers});

    return response.data;
}