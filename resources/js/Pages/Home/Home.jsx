import React, { useState } from "react";
import "./Home.scss";
import { useQuery } from "@tanstack/react-query";
import { getTopCourses } from "../../Services/Course/getTopCourses";
import { getTopAuthors } from "../../Services/Author/getTopAuthors";
import StarsRating from "../../Components/StarsRating";

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

    const {isError: isErrorGetTopCourses, data: dataTopCourses, error: errorGetTopCourses} = useQuery({
        queryKey: ['topCourses'],
        queryFn: getTopCourses,
    });
    //console.log(dataTopCourses);
    if (isErrorGetTopCourses) {
        console.error(errorGetTopCourses.message);
    }

    const {isError: isErrorGetTopAuthors, data: dataTopAuthors, error: errorGetTopAuthors} = useQuery({
        queryKey: ['topAuthors'],
        queryFn: getTopAuthors,
    });
    console.log(dataTopAuthors);
    if (isErrorGetTopAuthors) {
        console.error(errorGetTopAuthors.message);
    }

    return (
        <main className="main">
            <section className="main__section-cursosPopulares">
                <h1 className="main__section-cursosPopulares__titulo">CURSOS MAS POPULARES</h1>
                <div className="main__section-cursosPopulares__carrousel">
                    
                    <div className="main__section-cursosPopulares__carrousel__contenido">
                        { dataTopCourses?.data?.map(itemTopCourse => {
                            let stars = StarsRating(itemTopCourse.rating);
                            return (
                                <div key={itemTopCourse.id} className="main__section-cursosPopulares__carrousel__contenido__curso">
                                    <h4 className="main__section-cursosPopulares__carrousel__contenido__curso__titulo"> {itemTopCourse.name} </h4>
                                    <div className="main__section-cursosPopulares__carrousel__contenido__curso__puntuacion">
                                        <div className="main__section-cursosPopulares__carrousel__contenido__curso__puntuacion__contenedorEstrellas">
                                            <div className="main__section-cursosPopulares__carrousel__contenido__curso__puntuacion__contenedorEstrellas__estrellas"> {stars} </div>
                                            <p className="main__section-cursosPopulares__carrousel__contenido__curso__puntuacion__contenedorEstrellas__puntaje"> {itemTopCourse.rating} </p>
                                        </div>
                                
                                    </div>
                                    <figure className="main__section-cursosPopulares__carrousel__contenido__curso__contenedorImagen">
                                        <img src={`http://127.0.0.1:8000/storage/${itemTopCourse.cover_image}`} alt="cover-image" />
                                    </figure>
                                    <div className="main__section-cursosPopulares__carrousel__contenido__curso__contenedorEtiquetas">
                                        {itemTopCourse.technologies?.map(itemTechnology => (
                                            <figure key={itemTechnology.id} className="main__section-cursosPopulares__carrousel__contenido__curso__contenedorEtiquetas__tagImageContainer">
                                                <img src={`http://127.0.0.1:8000/storage/${itemTechnology.image}`} alt="tag-image" />
                                            </figure>
                                        ))}
                                    </div>
                                </div>
                            )
                        })
                        }
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
                    { dataTopAuthors?.data?.map(itemTopAuthor => {
                        return (
                            <div className="main__section-desarrolladores__carrousel__contenido__desarrollador">
                                <h4 className="main__section-desarrolladores__carrousel__contenido__desarrollador__nombre"> {itemTopAuthor.name} </h4>
                                <div className="main__section-desarrolladores__carrousel__contenido__desarrollador__contenedorFotoNombre">
                                    <figure className="main__section-desarrolladores__carrousel__contenido__desarrollador__contenedorFotoNombre__contenedorFoto">
                                        <img src={`http://127.0.0.1:8000/storage/${itemTopAuthor.photo}`} alt="img_developer" />
                                    </figure>
                                    <p className="main__section-desarrolladores__carrousel__contenido__desarrollador__contenedorFotoNombre__descripcion">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                                </div>
                            </div>
                        )
                    })
                    }
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
        