import React from 'react'
import { useNavigate } from "react-router-dom";
import useUserStore from '../../Store/useUserStore';

const Profile = () => 
{
    let navigate = useNavigate();
    const logout = useUserStore((state) => state.logout);
    const user = useUserStore((state) => state.user);

    const handleLogout = () => 
    {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <h1>Perfil de usuario</h1>
            
            <p>Bienvenid@ {user?.name}</p>
            <p>Con el rol {user?.role[0]} </p>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
        
    );
}

export default Profile