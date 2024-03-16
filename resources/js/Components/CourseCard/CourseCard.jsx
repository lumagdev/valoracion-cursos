import React from 'react'
import { NavLink } from "react-router-dom";
import "./CourseCard.scss";
import StarsRating from '../StarsRating';

const CourseCard = ({dataCourses, description, moreDetails, goWebsite}) => 
{
    if(dataCourses) {
        return ( 
        <>
            {dataCourses?.data?.map(itemCourse =>
            {
                let stars = StarsRating(itemCourse.rating);
                return (
                    <div key={itemCourse.id} className='card-container'>
                        <div className='card-container__title-autor-score-row'>
                            <div className='card-container__title-autor-score-row__title-autor-container'>
                                <p className='card-container__title-autor-score-row__title-autor-container__title'> {itemCourse.name} </p>
                                <div className='card-container__title-autor-score-row__title-autor-container__autor-date-container'>
                                    <p>{itemCourse.authors.name}</p>
                                    <p> {itemCourse.created_at? itemCourse.created_at.split('-')[0] : ''} </p>
                                </div>
                            </div>
                            <div className='card-container__title-autor-score-row__score-container'>
                                <div className='card-container__title-autor-score-row__score-container__stars-container'>
                                    {stars}
                                </div>
                                <div className='card-container__title-autor-score-row__score-container__opinions-score-container'>
                                    <p> {itemCourse.rating} </p>
                                    <p>(10 opiniones)</p>
                                </div>
                            </div>
                        </div>
                        <div className='card-container__coverImage-tags-row'>
                            <figure className='card-container__coverImage-tags-row__coverImage-container'>
                                <img src={`http://127.0.0.1:8000/storage/${itemCourse.cover_image}`} alt="cover_image" />
                            </figure>
                            <div className='card-container__coverImage-tags-row__tags-container'>
                                {itemCourse.technologies?.map(itemTechnology => (
                                    <figure key={itemTechnology.id} className='card-container__coverImage-tags-row__tags-container__tagImage-container'>
                                        <img src={`http://127.0.0.1:8000/storage/${itemTechnology.image}`} alt="tag-image" />
                                    </figure>
                                ))}
                            </div>
                        </div>
                        <div className='card-container__category-description-price-row'>
                            <div className='card-container__category-description-price-row__location-container'>
                                <p> {itemCourse.location} </p>
                                {/* <FaYoutube /> */}
                            </div>
                            <p className={`card-container__category-description-price-row__description --${!description ? 'oculto' : 'muestra'}`}>Description</p>
                            <div className='card-container__category-description-price-row__link-price-container'>
                                <NavLink className={`--${!moreDetails ? 'oculto' : 'muestra'}`} to={`/course-detail/${itemCourse.id}`}>Mas detalles</NavLink>
                                <NavLink className={`--${!goWebsite ? 'oculto' : 'muestra'}`} to={itemCourse.website} target='_blank' >Ir al curso</NavLink>
                                <p> { itemCourse.price ? itemCourse.price==='Gratis' ? itemCourse.price : itemCourse.price +'€' : ''} </p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
        )
    }else
    {
        return ( <div>NO SE ENCONTRARON CURSOS DISPONIBLES</div> )
    }
}

export default CourseCard