import axios from 'axios';

export async function register(registrationData) 
{
    console.log('Entra');
    try 
    {
        await axios.post('http://127.0.0.1:8000/api/register', registrationData)
        .then((response) => {
            if (response.data.success) 
            {
                console.log('El registro ha ido correctamente');
                return true
            } else 
            {
                console.log(response.data);
                console.log('No se ha podido registrar');
                return false
            }
        })
        .catch((error) => {
            console.log(error);
            return false
            // if (error.response.status === 401) {
            //     localStorage.removeItem('token');
            //     navigate('/login')
    
            // }
            // console.log('No se ha podido registrar');
        })   
    } catch (error) {
        console.log(error);
        return false
    }

}
