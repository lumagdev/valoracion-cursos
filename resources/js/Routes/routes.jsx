import React from "react";
import Login from '../Pages/Login';
import PageNotFound from '../Pages/NotFound';
import Home from "../Pages/Home";
import Register from "../Pages/Register";


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
        path: "*",
        element: <PageNotFound/>,
        isPrivate: true
    }
];

export default routes;