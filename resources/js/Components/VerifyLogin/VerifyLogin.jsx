import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

export const VerifyLogin = ({ isAuth, children }) => 
{
    if (!isAuth) return <Navigate to={'/login'}/>
    return children ? children : <Outlet/>
}