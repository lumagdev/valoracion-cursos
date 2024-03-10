import {Fragment, React, useState} from 'react'
import "./CourseDetail.scss"
import { BsFilter } from "react-icons/bs";
import { MdPlaylistAdd, MdDelete } from "react-icons/md";
import CourseCard from '../../Components/CourseCard/CourseCard';
import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '../../Services/Course/getCourseById';
import { getReviewsByCourse } from '../../Services/Review/getReviewsByCourse';
import { useParams } from 'react-router-dom';
import StarsRating from '../../Components/StarsRating';
import { NavLink } from 'react-router-dom';

const CourseDetail = () => 
{
    const [currentQuestionnaire, setCurrentQuestionnaire] = useState(null);
    // Sacamos el ID de la ruta
    const {id} = useParams();
    //console.log(id);
    const {isError: isErrorCourse, data: dataCourse, error:errorCourse} = useQuery({
        queryKey: ['course'],
        queryFn: () => getCourseById(id),
    });
    //console.log(dataCourse);
    if (isErrorCourse) {
        console.error(errorCourse.message);
    }

    const {isError: isErrorReviewsByCourse, data: dataReviewsByCourse, error:errorReviewsByCourse} = useQuery({
        queryKey: ['reviewsByCourse'],
        queryFn: () => getReviewsByCourse(id),
    });
    console.log(dataReviewsByCourse);
    if (isErrorReviewsByCourse) {
        console.error(errorReviewsByCourse.message);
    }

    return (
        <section className='course-detail'>
            <section className='course-detail__course-card'>
                <CourseCard dataCourses={dataCourse} descripcion={true} moreDetails={false} goWebsite={true}/>
            </section>
            <section className='course-detail__reviews'>
                <div className='course-detail__reviews__allReviews'>
                    <div className='course-detail__reviews__allReviews__buttons'>
                        <button className='course-detail__reviews__allReviews__buttons__filter'>Filtros <BsFilter/> </button>
                        <NavLink className='course-detail__reviews__allReviews__buttons__add' to={`/create-update-review/${id}`} >Añadir opinión <MdPlaylistAdd/> </NavLink>
                    </div>
                    {dataReviewsByCourse ?
                        <div className='course-detail__reviews__allReviews__reviews-container'>
                            {dataReviewsByCourse?.data?.map(itemReview => {
                                let stars = StarsRating(itemReview.user_rating);
                                return (
                                <div key={itemReview.id} className='course-detail__reviews__allReviews__reviews-container__review-card'>
                                    <div className='course-detail__reviews__allReviews__reviews-container__review-card__title-rating'>
                                        <p> {itemReview.user.name} </p>
                                        <div> {stars} <p> {itemReview.user_rating} </p> </div>
                                    </div>
                                    <p className='course-detail__reviews__allReviews__reviews-container__review-card__comment'> {itemReview.comment} </p>
                                    <button 
                                        className='course-detail__reviews__allReviews__reviews-container__review-card__view-allReview-button'
                                        onClick={() => setCurrentQuestionnaire(itemReview)}
                                    >
                                        Ver cuestionario
                                    </button>
                                </div>
                                )
                            })
                            }
                        </div>
                    : <div>Todavía no hay opiniones acerca de este curso</div> 
                    }
                </div>
                {currentQuestionnaire ?
                <div className='course-detail__reviews__review-detail'>
                    <div className='course-detail__reviews__review-detail__user-allComment'>
                        <div className='course-detail__reviews__review-detail__user-allComment__user-stars'>
                            <p> {currentQuestionnaire.user.name} </p>
                            <div> {StarsRating(currentQuestionnaire.user_rating)} <p> {currentQuestionnaire.user_rating} </p> </div>
                        </div>
                        <p className='course-detail__reviews__review-detail__user-allComment__allComment'> {currentQuestionnaire.comment} </p>
                    </div>
                    <div className='course-detail__reviews__review-detail__questionnaire'>
                        {currentQuestionnaire?.questionnaire?.map((itemQuestionnaire, index) => (
                        <div key={index} className='course-detail__reviews__review-detail__questionnaire__question-answer-container'>
                            {Object.entries(itemQuestionnaire).map(([question, answer]) => (
                            <Fragment key={question}>
                                <p className='course-detail__reviews__review-detail__questionnaire__question-answer-container__question'>- {question} </p>
                                <p className='course-detail__reviews__review-detail__questionnaire__question-answer-container__answer'> {answer} </p>
                            </Fragment>
                            ))    
                            }
                        </div>
                        ))
                        }
                    </div>
                </div>
                : <></> }
            </section>
        </section>
    )
}

export default CourseDetail