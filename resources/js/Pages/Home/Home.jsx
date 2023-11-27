import React, { useState } from "react";
import cursoUno from "../../Assets/curso-frontend-ejemplo.jpg";
import cursoDos from "../../Assets/bootcamp-full-stack-gratis-2021.jpg";
import cursoTres from "../../Assets/curso-brais-python.jpg";
import devUno from "../../Assets/midudev-photo.jpg";
import devDos from "../../Assets/fernandoHerrera.jpg";
import devTres from "../../Assets/brais-moure.jpg";
import "./Home.scss";
import { useEffect } from "react";
//import { NavLink } from "react-router-dom";
import { FaRegStar, FaReact } from "react-icons/fa";

const Home = () => 
{
    const [coursesCarrousel, setCoursesCarrousel] = useState(0);
    const [developersCarrousel, setDevelopersCarrousel] = useState(0);

    function handlerCourseCarrousel(position)
    {
        const content = document.querySelector('.main__section-cursosPopulares__carrousel__contenido');

        let operation = position * -33.5;
        content.style.transform = `translateX(${operation}%)`;
        setCoursesCarrousel(position);
    }

    function handlerDeveloperCarrousel(position)
    {
        const content = document.querySelector('.main__section-desarrolladores__carrousel__contenido');

        let operation = position * -33.5;
        content.style.transform = `translateX(${operation}%)`;
        setDevelopersCarrousel(position);
    }


    return (
        <main className="main">
            <section className="main__section-cursosPopulares">
                <h1 className="main__section-cursosPopulares__titulo">CURSOS MAS POPULARES</h1>
                <div className="main__section-cursosPopulares__carrousel">
                    <div className="main__section-cursosPopulares__carrousel__contenido">
                        <div className="main__section-cursosPopulares__carrousel__contenido__curso">
                            <h4 className="main__section-cursosPopulares__carrousel__contenido__curso__titulo">Titulo curso 1</h4>
                            <div className="main__section-cursosPopulares__carrousel__contenido__curso__puntuacion">
                                <div className="main__section-cursosPopulares__carrousel__contenido__curso__puntuacion__contenedorEstrellas">
                                    <FaRegStar />
                                    <FaRegStar />
                                    <FaRegStar />
                                    <FaRegStar />
                                    <FaRegStar />
                                </div>
                                <p className="main__section-cursosPopulares__carrousel__contenido__curso__puntuacion__puntaje">4.8/5 <span>(10 opiniones)</span> </p>
                            </div>
                            <figure className="main__section-cursosPopulares__carrousel__contenido__curso__contenedorImagen">
                                <img src={cursoUno} alt="img_course" />
                            </figure>
                            <div className="main__section-cursosPopulares__carrousel__contenido__curso__contenedorEtiquetas">
                                <FaReact />
                                <FaReact />
                                <FaReact />
                                <FaReact />
                                <FaReact />
                            </div>
                        </div>
                        <div className="main__section-cursosPopulares__carrousel__contenido__curso">
                            <h4 className="main__section-cursosPopulares__carrousel__contenido__curso__titulo">Titulo curso 2</h4>
                            <div className="main__section-cursosPopulares__carrousel__contenido__curso__puntuacion">
                                <div className="main__section-cursosPopulares__carrousel__contenido__curso__puntuacion__contenedorEstrellas">
                                    <FaRegStar />
                                    <FaRegStar />
                                    <FaRegStar />
                                    <FaRegStar />
                                    <FaRegStar />
                                </div>
                                <p className="main__section-cursosPopulares__carrousel__contenido__curso__puntuacion__puntaje">4.8/5 <span>(10 opiniones)</span> </p>
                            </div>
                            <figure className="main__section-cursosPopulares__carrousel__contenido__curso__contenedorImagen">
                                <img src={cursoDos} alt="img_course" />
                            </figure>
                            <div className="main__section-cursosPopulares__carrousel__contenido__curso__contenedorEtiquetas">
                                <FaReact />
                            </div>
                        </div>
                        <div className="main__section-cursosPopulares__carrousel__contenido__curso">
                            <h4 className="main__section-cursosPopulares__carrousel__contenido__curso__titulo">Titulo curso 3</h4>
                            <div className="main__section-cursosPopulares__carrousel__contenido__curso__puntuacion">
                                <div className="main__section-cursosPopulares__carrousel__contenido__curso__puntuacion__contenedorEstrellas">
                                    <FaRegStar />
                                    <FaRegStar />
                                    <FaRegStar />
                                    <FaRegStar />
                                    <FaRegStar />
                                </div>
                                <p className="main__section-cursosPopulares__carrousel__contenido__curso__puntuacion__puntaje">4.8/5 <span>(10 opiniones)</span> </p>
                            </div>
                            <figure className="main__section-cursosPopulares__carrousel__contenido__curso__contenedorImagen">
                                <img src={cursoTres} alt="img_course" />
                            </figure>
                            <div className="main__section-cursosPopulares__carrousel__contenido__curso__contenedorEtiquetas">
                                <FaReact />
                            </div>
                        </div>
                    </div>
                    <ul className="main__section-cursosPopulares__carrousel__puntos">
                        <li onClick={() => handlerCourseCarrousel(0)} className={`main__section-cursosPopulares__carrousel__puntos__punto ${coursesCarrousel === 0 ? 'activo' : ''}`}></li>
                        <li onClick={() => handlerCourseCarrousel(1)} className={`main__section-cursosPopulares__carrousel__puntos__punto ${coursesCarrousel === 1 ? 'activo' : ''}`}></li>
                        <li onClick={() => handlerCourseCarrousel(2)} className={`main__section-cursosPopulares__carrousel__puntos__punto ${coursesCarrousel === 2 ? 'activo' : ''}`}></li>
                    </ul>
                </div>
            </section>

            <section className="main__section-categorias">
                <h1 className="main__section-categorias__titulo">CATEGORÍAS</h1>
                <div className="main__section-categorias__contenedorCategorias">
                    <div className="main__section-categorias__contenedorCategorias__categoria">
                        <p>Backend</p>
                    </div>
                    <div className="main__section-categorias__contenedorCategorias__categoria">
                        <p>Frontend</p>
                    </div>
                    <div className="main__section-categorias__contenedorCategorias__categoria">
                        <p>FullStack</p>
                    </div>
                    <div className="main__section-categorias__contenedorCategorias__categoria">
                        <p>Desarrollo Móvil</p>
                    </div>
                    <div className="main__section-categorias__contenedorCategorias__categoria">
                        <p>Machine learning</p>
                    </div>
                    <div className="main__section-categorias__contenedorCategorias__categoria">
                        <p>IA</p>
                    </div>
                    <div className="main__section-categorias__contenedorCategorias__categoria">
                        <p>Videojuegos</p>
                    </div>
                </div>
            </section>

            <section className="main__section-desarrolladores">
                <h1 className="main__section-desarrolladores__titulo">DESARROLLADORES</h1>
                <div className="main__section-desarrolladores__carrousel">
                    <div className="main__section-desarrolladores__carrousel__contenido">
                        <div className="main__section-desarrolladores__carrousel__contenido__desarrollador">
                            <h4 className="main__section-desarrolladores__carrousel__contenido__desarrollador__nombre">Nombre desarrolador 1</h4>
                            <div className="main__section-desarrolladores__carrousel__contenido__desarrollador__contenedorFotoNombre">
                                <figure className="main__section-desarrolladores__carrousel__contenido__desarrollador__contenedorFotoNombre__contenedorFoto">
                                    <img src={devUno} alt="img_developer" />
                                </figure>
                                <p className="main__section-desarrolladores__carrousel__contenido__desarrollador__contenedorFotoNombre__descripcion">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                            </div>
                        </div>
                        <div className="main__section-desarrolladores__carrousel__contenido__desarrollador">
                            <h4 className="main__section-desarrolladores__carrousel__contenido__desarrollador__nombre">Nombre desarrolador 2</h4>
                            <div className="main__section-desarrolladores__carrousel__contenido__desarrollador__contenedorFotoNombre">
                                <figure className="main__section-desarrolladores__carrousel__contenido__desarrollador__contenedorFotoNombre__contenedorFoto">
                                    <img src={devDos} alt="img_developer" />
                                </figure>
                                <p className="main__section-desarrolladores__carrousel__contenido__desarrollador__contenedorFotoNombre__descripcion">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                            </div>
                        </div>
                        <div className="main__section-desarrolladores__carrousel__contenido__desarrollador">
                            <h4 className="main__section-desarrolladores__carrousel__contenido__desarrollador__nombre">Nombre desarrolador 3</h4>
                            <div className="main__section-desarrolladores__carrousel__contenido__desarrollador__contenedorFotoNombre">
                                <figure className="main__section-desarrolladores__carrousel__contenido__desarrollador__contenedorFotoNombre__contenedorFoto">
                                    <img src={devTres} alt="img_developer" />
                                </figure>
                                <p className="main__section-desarrolladores__carrousel__contenido__desarrollador__contenedorFotoNombre__descripcion">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                            </div>
                        </div>
                    </div>
                    <ul className="main__section-desarrolladores__carrousel__puntos">
                        <li onClick={() => handlerDeveloperCarrousel(0)} className={`main__section-desarrolladores__carrousel__puntos__punto ${developersCarrousel === 0 ? 'activo' : ''}`}></li>
                        <li onClick={() => handlerDeveloperCarrousel(1)} className={`main__section-desarrolladores__carrousel__puntos__punto ${developersCarrousel === 1 ? 'activo' : ''}`}></li>
                        <li onClick={() => handlerDeveloperCarrousel(2)} className={`main__section-desarrolladores__carrousel__puntos__punto ${developersCarrousel === 2 ? 'activo' : ''}`}></li>
                    </ul>
                </div>
            </section>
        </main>
    );
};

export default Home;
        