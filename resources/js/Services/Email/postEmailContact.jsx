import axios from "axios";

export const postEmailContact = async(contactData) => 
{
    const headers = {
        'Content-Type': 'multipart/form-data',
    }

    const response = await axios.post('http://127.0.0.1:8000/api/contact', contactData, {headers});
    
    return response;
}