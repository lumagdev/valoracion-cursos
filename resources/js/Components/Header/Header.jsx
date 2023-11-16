import { NavLink } from "react-router-dom";
import Logo from "../Logo/Logo";
import "./Header.scss";
const Header = () => 
{
    return (
        <header className="header">
            <nav className="header__nav">
                <ul className="header__nav__ul">
                    <li className="header__nav__ul__li">Home</li>
                    <li className="header__nav__ul__li">Cursos</li>
                    <li className="header__nav__ul__li-logo">
                        <figure className="header__nav__ul__li-logo__figure-logo">
                            <Logo/>
                        </figure>
                    </li>
                    <li className="header__nav__ul__li">Profesores</li>
                    <li className="header__nav__ul__li">
                        <NavLink to={"/profile"}>Usuario</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
