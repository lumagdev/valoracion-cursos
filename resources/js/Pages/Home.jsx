import React from "react";
import { NavLink } from "react-router-dom";
const Home = () => 
{
    return (
        <div style={{ padding: 10 }}>
            
            <h1>Home</h1>
            <NavLink to={"/profile"}>Profile</NavLink>
            <br/>
            <NavLink
                to={"/login"}
            >
                Login
            </NavLink>
        </div>
    );
};

export default Home;
        