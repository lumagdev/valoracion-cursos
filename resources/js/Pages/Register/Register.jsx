import React from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../Services/register";
import Logo from "../../Components/Logo/Logo";
import "./Register.scss";
const RegisterForm = () => 
{
    const navigate = useNavigate();
    const validateForm = (values) => 
    {
        const errors = {};
        if (!values.name) 
        {
            errors.name = "Requerido";
        } else if (values.name.length < 3) 
        {
            errors.name = "Debe tener 3 carácteres o mas";
        }
        if (!values.email) 
        {
          errors.email = "Requerido";
        } else if (values.email.length < 4) 
        {
          errors.email = "Debe tener 5 carácteres o mas";
        }
    
        if (!values.password) 
        {
          errors.password = "Requerido";
        } else if (values.password.length < 8) 
        {
          errors.password = "Debe tener 8 carácteres o mas";
        }
    
        return errors;
    };

    const registerFormik = useFormik({
        initialValues: 
        {
            name: "",
            email: "",
            password: "",
        },
        validateForm,
        onSubmit: (values) => {
            //alert(JSON.stringify(values, null, 2));
            console.log('values', values);
            handleSubmit(values);
        },
    });

    const handleSubmit = (data) => {
        if (register(data)) {
            navigate('/login');
        }else 
        {
            console.log('Error');
        }
    }
    return (
        <section className="section-register">
            <div className='section-register__contenedor-register'>
                <h1 className='section-register__contenedor-register__title'>Register</h1>
                <p className='section-register__contenedor-register__parrafo-inicia-sesion'>¿Ya tienes cuenta? <span><Link to={'/login'}>Inicia sesión</Link></span> </p>
                <form className='section-register__contenedor-register__form' onSubmit={registerFormik.handleSubmit}>
                    <label htmlFor="name">Username</label>
                    <input
                        onChange={registerFormik.handleChange}
                        onBlur={registerFormik.handleBlur}
                        value={registerFormik.values.name}
                        id="name"
                        name="name"
                    />
                    {
                        registerFormik.touched.name && registerFormik.errors.name ?
                            <div>
                                {registerFormik.errors.name}
                            </div>
                        : null
                    }
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={registerFormik.handleChange}
                        onBlur={registerFormik.handleBlur}
                        value={registerFormik.values.email}
                        id="email"
                        name="email"
                    />
                    {
                        registerFormik.touched.email && registerFormik.errors.email ?
                            <div>
                                {registerFormik.errors.email}
                            </div>
                        : null
                    }
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={registerFormik.handleChange}
                        onBlur={registerFormik.handleBlur}
                        value={registerFormik.values.password}
                        id="password"
                        name="password"
                        type="password"
                    />
                    {
                        registerFormik.touched.password && registerFormik.errors.password ?
                            <div>
                                {registerFormik.errors.password}
                            </div>
                        : null
                    }
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