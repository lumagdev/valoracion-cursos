import Logo from "../Logo/Logo";
import "./Footer.scss";
import { FaWhatsapp, FaTelegramPlane, FaLinkedin } from "react-icons/fa";
import { TbBrandNotion } from "react-icons/tb";
const Footer = () => 
{
  return (
    <footer className='footer'>
        {/* <figure className='footer__section-logo'>
            <Logo/>
        </figure> */}
        <section className='footer__section-contactForm'>
            <h4 className='footer__section-contactForm__title'>Si tienes sugerencias y quieres contactarme ↴</h4>
            <form className='footer__section-contactForm__form'>
                <label htmlFor="email">Correo:</label>
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                />
                <label htmlFor="message">Mensaje:</label>
                <textarea
                    name="message" 
                    id="message" 
                    cols="20" 
                    rows="6"
                ></textarea>
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