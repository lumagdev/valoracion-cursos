import { NavLink } from "react-router-dom";
import Logo from "../Logo/Logo";
import { TiThMenu } from "react-icons/ti";
import { FaRegWindowClose } from "react-icons/fa";
import "./Header.scss";
import { useState } from "react";
const Header = () => 
{
    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className="header">
            <nav className="header__nav">
                <div className="header__nav__contenedor-button">
                    <button
                        className="header__nav__contenedor-button__button-menu"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <TiThMenu />
                    </button>
                </div>
                <div className={`header__nav__contenedor-menu1 ${showMenu ? 'activo' : ''}`}>
                    <div className={`header__nav__contenedor-menu1__header-menu-mobile ${showMenu ? 'activo' : ''}`}>
                        <span 
                            className="header__nav__contenedor-menu1__header-menu-mobile__icon-cerrar"
                            onClick={() => setShowMenu(false)}
                        >
                            <FaRegWindowClose />
                        </span>
                    </div>
                    <ul className="header__nav__contenedor-menu1__ul menu1">
                        <li className="header__nav__contenedor-menu1__ul__li">Home</li>
                        <li className="header__nav__contenedor-menu1__ul__li">Cursos</li>
                        <li className="header__nav__contenedor-menu1__ul__li">Plataformas</li>
                        <li className="header__nav__contenedor-menu1__ul__li oculto-escritorio"> Desarrolladores</li>
                        <li className="header__nav__contenedor-menu1__ul__li oculto-escritorio"> Contacto</li>
                    </ul>
                </div>
                <div className="header__nav__contenedor-logo">
                    <figure className="header__nav__contenedor-logo__figure-logo">
                        <Logo/>
                    </figure>
                </div>
                <ul className={`header__nav__ul menu2 ${showMenu ? 'activo' : ''} `}>
                    <li className="header__nav__ul__li oculto-movil">Desarrolladores</li>
                    <li className="header__nav__ul__li oculto-movil">Contacto</li>
                    <li className="header__nav__ul__li">
                        <NavLink to={"/profile"}>Usuario</NavLink>
                    </li>
                </ul>
                
            </nav>
        </header>
    )
}

export default Header;
