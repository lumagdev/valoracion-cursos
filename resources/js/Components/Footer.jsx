import Logo from "./Logo";
import { FaWhatsapp, FaTelegramPlane, FaLinkedin } from "react-icons/fa";
import { TbBrandNotion } from "react-icons/tb";
const Footer = () => 
{
  return (
    <footer className='footer'>
        <figure className='footer__section-logo'>
            <Logo/>
        </figure>
        <section className='footer__section-contactForm'>
            <h4 className='section-contactForm__title'>Si tienes sugerencias y quieres contactarme</h4>
            <form className='section-contactForm__form'>
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
                    cols="30" 
                    rows="10"
                ></textarea>
            </form>
        </section>
        <section className="footer__section-author">
            <figure className="section-author__container1-icons">
              <FaWhatsapp/>
              <FaTelegramPlane/>
            </figure>
            <div className="section-author__container-text">
                <p>Desarrollado por: Lucía Gutiérrez (lumagdev)</p>
            </div>
            <figure className="section-author__container1-icons">
                <FaLinkedin/>
                <TbBrandNotion/>
            </figure>
        </section>
    </footer>
  )
}

export default Footer