import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

export const OnlyAdmin = ({ user, children }) => 
{
    const roleUser = user?.role[0];

    if (roleUser !== 'admin') return <Navigate to={'/unauthorized'}/>
    return children ? children : <Outlet/>
}