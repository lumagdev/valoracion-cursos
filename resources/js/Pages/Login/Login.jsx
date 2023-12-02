import React, { useState, useLayoutEffect } from 'react';
import { loginUser, useAuthState, useAuthDispatch } from '../../Context';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Logo from '../../Components/Logo/Logo';
import "./Login.scss";

const Login = () => 
{
    const navigate = useNavigate();
    const dispatch = useAuthDispatch();
    const { loading, errorMessage } = useAuthState();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useLayoutEffect(() => {
        let user = localStorage.getItem("currentUser")
        if (user) {
            return navigate('/')
        }   
    }, [])


    const handleLogin = async (e) => 
    {
        e.preventDefault()
        try 
        {
            let response = await loginUser(dispatch, { email, password})
            if (!response.user) return;
            navigate('/profile', {replace: true})
        
        } catch(error) 
        {
            console.log(error);
        }
    }

    return (
        <section className='section-login'>
            <div className='section-login__contenedor-login'>
                <h2 className='section-login__contenedor-login__title'>Inicio de sesión</h2>
                <p className='section-login__contenedor-login__parrafo-registrate'>¿Aún no tienes cuenta? <span><Link to={'/register'}>Regístrate</Link></span> </p>
                {errorMessage ? <p className='section-login__contenedor-login__parrafo-error'>{errorMessage}</p> : null}
                <form className='section-login__contenedor-login__form'>
                    <label htmlFor='email'>Email:</label>
                    <input 
                        type='text' 
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <label htmlFor='password'>Contraseña:</label>
                    <input 
                        type='password'
                        id='password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <button 
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        Iniciar sesión
                    </button>
                </form>
                <figure className='section-login__contenedor-login__figure-logo'>
                    <Logo/>
                </figure>
            </div>
        </section>
    );
}

export default Login;