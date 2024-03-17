import React, { useEffect, useState } from 'react';
import "./Courses.scss";
import { BsSearch, BsFilter, BsListUl } from "react-icons/bs";
import CourseCard from '../../Components/CourseCard/CourseCard';
import { getCourses } from '../../Services/Course/getCourses';
import { useQuery } from '@tanstack/react-query';
import useUserStore from '../../Store/useUserStore';
import Modal from '../../Components/Modal/Modal';
const Courses = () =>
{
    //const { isAuth } = useUserStore();
    // TantstanckQuery para getcourses
    const [authorsList, setAuthorsList] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [technologiesList, setTechnologiesList] = useState([]);
    const [locationsList, setLocationsList] = useState([]);
    const [authorFilter, setAuthorFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [technologyFilter, setTechnologyFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [coursesDisplay, setCoursesDisplay] = useState([]);
    const [isOpenModalFilter, setIsOpenModalFilter] = useState(false);
    const [orderBy, setOrderBy] = useState('');
    const [searcher, setSearcher] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsCardsPage = 5;

    const {isError: isErrorCourses, data: dataCourses, error:errorCourses} = useQuery({
        queryKey: ['courses'],
        queryFn: getCourses,
    });
    console.log(dataCourses);
    if (isErrorCourses) {
        console.error(errorCourses.message);
    }

    const onSubmitFilter = () => {
        setOrderBy('');
        setSearcher('');

        const itemsFiltered = dataCourses.data.filter(course => {
            const technologiesNames = course.technologies.map(tech => tech.name);

            return (
                (!categoryFilter || course.category === categoryFilter) &&
                (!locationFilter || course.location === locationFilter) &&
                (!authorFilter || course.authors.name === authorFilter) &&
                (!technologyFilter || technologiesNames.includes(technologyFilter))
            )
        });

        setCoursesDisplay(itemsFiltered);
        setIsOpenModalFilter(false);
    }

    useEffect(() => {
        if(dataCourses){
            console.log('entra', dataCourses);
            const authors = [];
            const categories = [];
            const technologies = [];
            const locations = [];

            dataCourses.data.forEach(element => {
                if(!authors.includes(element.authors.name)) {
                    authors.push(element.authors.name);
                }

                if(!categories.includes(element.category)) {
                    categories.push(element.category);
                }

                if(!locations.includes(element.location)) {
                    locations.push(element.location);
                }

                element.technologies.map(tech => {
                    if(!technologies.includes(tech.name)) {
                        technologies.push(tech.name);
                    }
                });
            });

            setCoursesDisplay([...dataCourses.data]);
            setAuthorsList(authors);
            setCategoriesList(categories);
            setTechnologiesList(technologies);
            setLocationsList(locations);
        }
    }, [dataCourses]);

    useEffect(() => {console.log(coursesDisplay);}, [coursesDisplay]);

    useEffect(() => {
        if(dataCourses){
            if(searcher){
                const itemsFiltered = dataCourses.data.filter(
                    item => item.name.toLowerCase().includes(searcher.toLowerCase()) || 
                    item.authors.name.toLowerCase().includes(searcher.toLowerCase()) || 
                    item.category.toLowerCase().includes(searcher.toLowerCase())
                );
    
                setCoursesDisplay(itemsFiltered);
            }else{
                setCoursesDisplay([...dataCourses.data]);
            }
        }

        setOrderBy('');
    }, [searcher]);

    useEffect(() => {
        if(coursesDisplay.length > 0){
            const items = [...coursesDisplay];

            if(orderBy === 'mejor_valorados'){
                items.sort((a, b) => b.rating - a.rating);
            }else if(orderBy === 'peor_valorados'){
                items.sort((a, b) => a.rating - b.rating);
            }

            setCoursesDisplay(items);
        }
    }, [orderBy]);

    console.log(Math.floor(coursesDisplay.length / itemsCardsPage) + 1);
    
    return (
        <section className='section-courses'>
            <section className='section-courses__filters-buttons'>
                <div className='section-courses__filters-buttons__seeker-container'>
                    <input 
                        type="text" 
                        name="seeker" 
                        id="seeker" 
                        placeholder='Buscador'
                        onChange={e => setSearcher(e.target.value)}
                        />
                    <BsSearch/>
                </div>
                <select 
                    className='section-courses__filters-buttons__order-by'
                    name="orderBy" 
                    id="orderBy" 
                    onChange={e => setOrderBy(e.target.value)} 
                    value={orderBy}
                >
                    <option value="">Ordenar por</option>
                    <option value="mejor_valorados">Mejor valorados</option>
                    <option value="peor_valorados">Peor valorados</option>
                </select>
                <div className='section-courses__filters-buttons__container-filter' onClick={() => setIsOpenModalFilter(true)}>
                    <p>Filtros</p>
                    <BsFilter />
                </div>
            </section>
            <section className='section-courses__courses-cards'>
                <CourseCard dataCourses={coursesDisplay.slice(itemsCardsPage * currentPage - itemsCardsPage, itemsCardsPage * currentPage)} descripcion={false} moreDetails={true} goWebsite={false} />
            </section>
            <section className='section-courses__pagination'>
                <button 
                    onClick={() => {
                        setCurrentPage(currentPage - 1);
                        scrollTo(0, 0);
                    }} 
                    disabled={currentPage === 1}> &lt; Anterior
                </button>
                <button 
                    onClick={() => {
                        setCurrentPage(currentPage + 1);
                        scrollTo(0, 0);
                    }} 
                    disabled={currentPage === Math.floor(coursesDisplay.length / itemsCardsPage) + 1}>Siguiente &gt; 
                </button>
            </section>
            <Modal 
                isOpen={isOpenModalFilter} 
                title={'Filtros'} 
                onClose={() => setIsOpenModalFilter(false)}
                buttonNameSuccess={'Filtrar'}
                onSubmit={onSubmitFilter}
            >
                <form className='section-courses__section-form'>
                    <select name="category" id="category" onChange={e => setCategoryFilter(e.target.value)} value={categoryFilter}>
                        <option value="">Selecciona una categoría</option>
                        {categoriesList.map(category => {
                            return <option key={category} value={category}>{category}</option>
                        })}
                    </select>
                    <select name="author" id="author" onChange={e => setAuthorFilter(e.target.value)} value={authorFilter}>
                        <option value="">Selecciona un autor</option>
                        {authorsList.map(author => {
                            return <option key={author} value={author}>{author}</option>
                        })}
                    </select>
                    <select name="technology" id="technology" onChange={e => setTechnologyFilter(e.target.value)} value={technologyFilter}>
                        <option value="">Selecciona una tecnología</option>
                        {technologiesList.map(technology => {
                            return <option key={technology} value={technology}>{technology}</option>
                        })}
                    </select>
                    <select name="location" id="location" onChange={e => setLocationFilter(e.target.value)} value={locationFilter}>
                        <option value="">Selecciona una plataforma</option>
                        {locationsList.map(location => {
                            return <option key={location} value={location}>{location}</option>
                        })}
                    </select>
                </form>
            </Modal>
        </section>
  )
}

export default Courses;