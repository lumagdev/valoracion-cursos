import axios from 'axios';
import { useState } from 'react';

export const useRegister = () =>
{
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    
    const postRegister = async (registrationData) => 
    {
        try 
        {
            const responseByRegister = await axios.post('http://127.0.0.1:8000/api/register', registrationData);
            //console.log('AAAA: ',responseByRegister.data);
            setResponse(responseByRegister.data);
            setError(null);
        } catch (error) 
        {
            //console.log('BBBBB: ',error);
            if (error.response && error.response.data && error.response.data.errors) 
            {
                setError(error.response.data.errors);
            } else {
                setError("Ha habido un error en la peticion")
            }
            
        }
    }
          
    return {
        postRegister,
        response,
        error
    };
}
