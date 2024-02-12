import axios from "axios";

export const postRegister = async (registrationData) => 
{
    const response = await axios.post('http://127.0.0.1:8000/api/register', registrationData);

    return response;
}