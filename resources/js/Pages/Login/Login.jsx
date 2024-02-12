import React, { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Logo from '../../Components/Logo/Logo';
import "./Login.scss";
import useUserStore from '../../Store/useUserStore';
import { useMutation } from '@tanstack/react-query';
import { postLogin } from '../../Services/Auth/postLogin';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';

const Login = () => 
{
    const navigate = useNavigate();

    const schema = yup.object({
        email: yup.string().required('El email es obligatorio.').email('Formato email inválido.'),
        password: yup.string().required('Introduce la contraseña.').min(8, 'Debe ser un nombre con un mínimo de 8 caracteres')    
    })

    /**
     * Estas son variables y funciones propias de de yup y react hook form
     */
    const {register, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(schema)
    });

    const { isAuth, setUser, setToken} = useUserStore();

    /**
     * Cuando hacemos login exitoso debemos mandar nuestros datos al zustand para que los almacene en localstorage
     */
    const {mutate, error, isLoading} = useMutation({
        mutationFn: postLogin,
        onSuccess: (data) => 
        {
            setUser(data.user);
            setToken(data.access_token);

            navigate('/profile');
        },
        onError: (e) => 
        {
            console.log(e);
        }
    })

    useLayoutEffect(() => 
    {
        if (isAuth) navigate('/profile');
    }, []);

    /**
     * Usamos react query para las peticiones, con su funcion mutation especializada en peticiones cuando se hace click 
    */
    const onSubmit = (dataForm) => 
    {
        mutate({
            email: dataForm.email,
            password: dataForm.password
        });
    }

    return (
        <section className='section-login'>
            <div className='section-login__contenedor-login'>
                <h2 className='section-login__contenedor-login__title'>Inicio de sesión</h2>
                <p className='section-login__contenedor-login__parrafo-registrate'>¿Aún no tienes cuenta? <span><Link to={'/register'}>Regístrate</Link></span> </p>
                {error ? <p className='section-login__contenedor-login__parrafo-error'>Usuario o contraseña incorrecta o inexistente</p> : null}
                <form className='section-login__contenedor-login__form' onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor='email'>Email:</label>
                    <input 
                        type='text' 
                        id='email'
                        name='email'
                        disabled={isLoading}
                        {...register('email')}
                    />
                    <span>{errors.email?.message}</span>
                    <label htmlFor='password'>Contraseña:</label>
                    <input 
                        type='password'
                        id='password' 
                        name='password'
                        disabled={isLoading} 
                        {...register('password')}
                    />
                    <span>{errors.password?.message}</span>
                    <button type='submit'>Iniciar sesión</button>
                </form>
                <figure className='section-login__contenedor-login__figure-logo'>
                    <Logo/>
                </figure>
            </div>
        </section>
    );
}

export default Login;