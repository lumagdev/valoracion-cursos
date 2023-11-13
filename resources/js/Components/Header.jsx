import { NavLink } from "react-router-dom";
import Logo from "./Logo";
const Header = () => 
{
    return (
        <header className="header">
            <nav className="header__nav">
                <ul className="nav__ul">
                    <li>Home</li>
                    <li>Cursos</li>
                    <li>
                        <Logo/>
                    </li>
                    <li>Profesores</li>
                    <li>
                        <NavLink to={"/profile"}>Usuario</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
