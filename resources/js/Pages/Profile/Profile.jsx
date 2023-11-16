import React from 'react'
import { useAuthDispatch, logout, useAuthState } from '../../Context';
import { useNavigate } from "react-router-dom";

const Profile = () => 
{
    let navigate = useNavigate();
    const dispatch = useAuthDispatch(); // lee el método dispatch del contexto
    //const user = useAuthState(); //lee los detalles del usuario del contexto
    const user = JSON.parse(localStorage.getItem("currentUser"));
  

    console.log('useprofile', user );

    
    const handleLogout = () => 
    {
        logout(dispatch); //llama a la acción logout
        navigate("/login"); //navega de nuevo al login sin usuario
    };

    return (
        <div>
            <h1>Perfil de usuario</h1>
                
            <button onClick={handleLogout}>
                Logout
            </button>
            
            <p>Bienvenid@ {user.user?.name}</p>
        </div>
        
    );
}

export default Profile