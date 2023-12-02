const ROOT_URL = 'http://127.0.0.1:8000/api';
const csrfToken = document.head.querySelector('meta[name="csrf-token"]').content;

export async function loginUser(dispatch, loginPayload) 
{
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(loginPayload),
    };
    try 
    {
        dispatch({ type: 'REQUEST_LOGIN' });
        let response = await fetch(`${ROOT_URL}/login`, requestOptions);
        let data = await response.json();
        
        console.log('data', data);
        if(data.user) 
        {
            dispatch({ type: 'LOGIN_SUCCESS', payload: data });
            localStorage.setItem('currentUser', JSON.stringify(data));
            return data
        }else
        {
            dispatch({ type: 'LOGIN_ERROR', error: data.errors[0] });
            return;
        }
    } catch(error) 
    {
        dispatch({ type: 'LOGIN_ERROR', error: error });
        console.log('El usuario no existe');
    }
    
}
 
export async function logout(dispatch) 
{
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('currentUser');
    //localStorage.removeItem('token');
}