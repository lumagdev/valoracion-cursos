import React from "react";
import "./Home.scss";
//import { NavLink } from "react-router-dom";
const Home = () => 
{
    return (
        <main className="main">
            <section className="main__section-cursosPopulares">
                <h1 className="main__section-cursosPopulares__titulo">CURSOS MAS POPULARES</h1>
            </section>
            <section className="main__section-categorias">
                <h1 className="main__section-categorias__titulo">CATEGORÍAS</h1>
            </section>
            <section className="main__section-desarrolladores">
                <h1 className="main__section-desarrolladores__titulo">DESARROLLADORES</h1>
            </section>
        </main>
    );
};

export default Home;
        