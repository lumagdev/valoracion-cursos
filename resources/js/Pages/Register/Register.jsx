import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../Components/Logo/Logo";
import "./Register.scss";
import { useRegister } from "../../Services/useRegister";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
const RegisterForm = () => 
{
    const { postRegister, response, error: hookError } = useRegister();
    const navigate = useNavigate();

    const schema = yup.object({
        name: yup.string().required('El nombre es obligatorio.').min(4, 'Debe ser un nombre con un mínimo de 4 caracteres'),
        email: yup.string().required('El email es obligatorio.').email('Formato email inválido.'),
        password: yup.string().required('Introduce la contraseña.').min(8, 'Debe ser un nombre con un mínimo de 8 caracteres')    
    })

    const {register, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        if (response) {
            navigate('/login');
        }
    }, [response])
    
    
    const onSubmit = async (dataForm) => 
    {
        await postRegister({
            name: dataForm.name,
            email: dataForm.email,
            password: dataForm.password
        })
    };

    return (
        <section className="section-register">
            <div className='section-register__contenedor-register'>
                <h1 className='section-register__contenedor-register__title'>Register</h1>
                <p className='section-register__contenedor-register__parrafo-inicia-sesion'>¿Ya tienes cuenta? <span><Link to={'/login'}>Inicia sesión</Link></span> </p>
                {response && <p>Registro exitoso. Redirigiendo...</p> }
                <form className='section-register__contenedor-register__form' onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="name">Username</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        {...register('name')}
                    />
                    <span>{errors.name?.message}</span>
                    {hookError && hookError.name && hookError.name[0] && <span> {hookError.name[0]} </span> }
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        {...register('email')}
                    />
                    <span>{errors.email?.message}</span>
                    {hookError && hookError.email && hookError.email[0] && <span> {hookError.email[0]} </span> }
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        {...register('password')}
                    />
                    <span>{errors.password?.message}</span>
                    {hookError && hookError.password && hookError.password[0] && <span> {hookError.password[0]} </span> }
                    <button type="submit">Register</button>
                </form>
                <figure className='section-register__contenedor-register__figure-logo'>
                    <Logo/>
                </figure>
            </div>
        </section>
    );
}

export default RegisterForm;