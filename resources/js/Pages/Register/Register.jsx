import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../Components/Logo/Logo";
import "./Register.scss";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { postRegister } from "../../Services/Auth/postRegister";
const RegisterForm = () => 
{
    const navigate = useNavigate();

    const schema = yup.object({
        name: yup.string().required('El nombre es obligatorio.').min(4, 'Debe ser un nombre con un mínimo de 4 caracteres'),
        email: yup.string().required('El email es obligatorio.').email('Formato email inválido.'),
        password: yup.string().required('Introduce la contraseña.').min(8, 'Debe ser un nombre con un mínimo de 8 caracteres')    
    })

    const {register, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(schema)
    });

    const {mutate, error} = useMutation({
        mutationFn: postRegister,
        onSuccess: (data) => {
            console.log(data);
            navigate('/login');
        },
        onError: (e) => {
            console.log(e);
        }
    })
    
    
    const onSubmit = (dataForm) => 
    {
        mutate({
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
                <form className='section-register__contenedor-register__form' onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="name">Username</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        {...register('name')}
                    />
                    <span>{errors.name?.message}</span>
                    {error?.response.data.errors && error.response.data.errors.name && error.response.data.errors.name[0] && <span> {error.response.data.errors.name[0]} </span> }
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        {...register('email')}
                    />
                    <span>{errors.email?.message}</span>
                    {error?.response.data.errors && error.response.data.errors.email && error.response.data.errors.email[0] && <span> {error.response.data.errors.email[0]} </span> }
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        {...register('password')}
                    />
                    <span>{errors.password?.message}</span>
                    {error?.response.data.errors && error.response.data.errors.password && error.response.data.errors.password[0] && <span> {error.response.data.errors.password[0]} </span> }
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