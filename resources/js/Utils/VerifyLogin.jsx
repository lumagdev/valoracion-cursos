import React from 'react'
import { Navigate, Outlet} from 'react-router-dom';

export const VerifyLogin = ({children, redirectTo }) => 
{
    let user = localStorage.getItem("currentUser")

    console.log('USER: ', user);
    if (!user || user===undefined) {
        return <Navigate to={redirectTo} />
        //return <Login pathName={pathName} />
    }    
    
    return children ?  children : <Outlet/>
}