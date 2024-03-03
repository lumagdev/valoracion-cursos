import React from "react";
import Login from '../Pages/Login/Login';
import PageNotFound from '../Pages/NotFound/NotFound';
import Home from "../Pages/Home/Home";
import Register from "../Pages/Register/Register";
import Unauthorized from "../Pages/Unauthorized/Unauthorized";
import Courses from "../Pages/Courses/Courses";

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
        path: "/courses-list",
        element: <Courses/>,
        isPrivate: false
    },
    {
        path: "/course-detail/:id",
        element: <Courses/>,
        isPrivate: false
    },
    {
        path: "*",
        element: <PageNotFound/>,
        isPrivate: true
    }
];

export default routes;