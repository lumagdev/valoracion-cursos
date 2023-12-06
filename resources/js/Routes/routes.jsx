import React from "react";
import Login from '../Pages/Login/Login';
import PageNotFound from '../Pages/NotFound/NotFound';
import Home from "../Pages/Home/Home";
import Register from "../Pages/Register/Register";
import Unauthorized from "../Pages/Unauthorized/Unauthorized";

const routes = [
    {
        path: "/",
        element: <Home/>,
        isPrivate: false
    },
    {
        path: "/login",
        element: <Login/>,
        isPrivate: false
    },
    {
        path: "/register",
        element: <Register/>,
        isPrivate: false
    },
    {
        path: "/unauthorized",
        element: <Unauthorized/>,
        isPrivate: true
    },
    {
        path: "*",
        element: <PageNotFound/>,
        isPrivate: true
    }
];

export default routes;