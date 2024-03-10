import React, { useState } from 'react';
import "./Courses.scss";
import { BsSearch, BsFilter, BsListUl } from "react-icons/bs";
import CourseCard from '../../Components/CourseCard/CourseCard';
import { getCourses } from '../../Services/Course/getCourses';
import { useQuery } from '@tanstack/react-query';
import useUserStore from '../../Store/useUserStore';
const Courses = () =>
{
    //const { isAuth } = useUserStore();
    // TantstanckQuery para getcourses
    const {isError: isErrorCourses, data: dataCourses, error:errorCourses} = useQuery({
        queryKey: ['courses'],
        queryFn: getCourses,
    });
    if (isErrorCourses) {
        console.error(errorCourses.message);
    }
    
    return (
        <section className='section-courses'>
            <section className='section-courses__filters-buttons'>
                <div className='section-courses__filters-buttons__seeker-container'>
                    <input type="text" name="seeker" id="seeker" placeholder='Buscador'/>
                    <BsSearch/>
                </div>
                <div className='section-courses__filters-buttons__container-order'>
                    <p>Ordenar por</p>
                    <BsListUl />
                </div>
                <div className='section-courses__filters-buttons__container-filter'>
                    <p>Filtros</p>
                    <BsFilter />
                </div>
            </section>
            <section className='section-courses__courses-cards'>
                <CourseCard dataCourses={dataCourses} descripcion={false} moreDetails={true} goWebsite={false} />
            </section>
            <section className='section-courses__pagination'>
                <div> &lt; Anterior</div>
                <div>Siguiente &gt; </div>
            </section>
        </section>
  )
}

export default Courses;