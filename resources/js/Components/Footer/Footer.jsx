import { useEffect, useState } from "react";
import "./Footer.scss";
import { FaWhatsapp, FaTelegramPlane, FaLinkedin } from "react-icons/fa";
import { TbBrandNotion } from "react-icons/tb";
import { postEmailContact } from "../../Services/Email/postEmailContact";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";


const Footer = () => 
{
    const [emailMessageSendSuccesfully, setEmailMessageSendSuccesfully] = useState(false);
    const [emailMessageSendError, setEmailMessageSendError] = useState(false);

    useEffect(() => {
        let timer;
        if (emailMessageSendSuccesfully) {
            timer = setTimeout(() => {
                setEmailMessageSendSuccesfully(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [emailMessageSendSuccesfully])

    useEffect(() => {
        let timer;
        if (emailMessageSendError) {
            timer = setTimeout(() => {
                setEmailMessageSendError(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [emailMessageSendError])
    
    
    const schema = yup.object({
        email: yup.string().email('Formato email inválido.').required('El email es obligatorio.'),
        message: yup.string().required('Introduce la contraseña.')   
    })

    const {register, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(schema)
    });

    const {mutate, error} = useMutation({
        mutationFn: postEmailContact,
        onSuccess: (data) => {
            console.log(data);
            setEmailMessageSendSuccesfully(true);
            setEmailMessageSendError(false);
        },
        onError: (e) => {
            console.log(e);
            setEmailMessageSendError(true);
            setEmailMessageSendSuccesfully(false);
        }
    })
    
    
    const onSubmit = (dataForm) => 
    {
        mutate({
            email: dataForm.email,
            message: dataForm.message
        })
    };

    return (
        <footer className='footer'>
            <section id="contact" className='footer__section-contactForm'>
                <h4 className='footer__section-contactForm__title'>Si tienes sugerencias y quieres contactarme ↴</h4>
                {emailMessageSendSuccesfully && <span className='footer__section-contactForm__message'>Mensaje enviado con exito</span>}
                {emailMessageSendError && <span className='footer__section-contactForm__message'>No se ha podido enviar el mensaje</span>}
                <form className='footer__section-contactForm__form'>
                    <label htmlFor="email">Correo:</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        {...register('email')}
                    />
                    {errors.email && <span>{errors.email?.message}</span>}
                    {error?.response.data.errors && error.response.data.errors.email && error.response.data.errors.email[0] && <span> {error.response.data.errors.email[0]} </span> }
                    <label htmlFor="message">Mensaje:</label>
                    <textarea
                        name="message" 
                        id="message" 
                        cols="20" 
                        rows="3"
                        {...register('message')}
                    ></textarea>
                    {errors.message && <span>{errors.message?.message}</span>}
                    {error?.response.data.errors && error.response.data.errors.message && error.response.data.errors.message[0] && <span> {error.response.data.errors.message[0]} </span> }
                    <button onClick={handleSubmit(onSubmit)}>Enviar</button>
                </form>
            </section>
            <section className="footer__section-author">
                <figure className="footer__section-author__container-icons">
                <FaWhatsapp className="footer__section-author__container-icons__icon"/>
                <FaTelegramPlane className="footer__section-author__container-icons__icon"/>
                </figure>
                
                <p className="footer__section-author__text">Desarrollado por Lucía Gutiérrez <br/> <span>(lumagdev)</span> </p>
                
                <figure className="footer__section-author__container-icons">
                    <FaLinkedin className="footer__section-author__container-icons__icon"/>
                    <TbBrandNotion className="footer__section-author__container-icons__icon"/>
                </figure>
            </section>
    </footer>
  )
}

export default Footer