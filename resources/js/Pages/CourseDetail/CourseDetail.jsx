import {Fragment, React, useState, useEffect} from 'react'
import "./CourseDetail.scss"
import { BsFilter } from "react-icons/bs";
import { MdPlaylistAdd, MdDelete, MdModeEditOutline} from "react-icons/md";
import CourseCard from '../../Components/CourseCard/CourseCard';
import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '../../Services/Course/getCourseById';
import { getReviewsByCourse } from '../../Services/Review/getReviewsByCourse';
import { useParams } from 'react-router-dom';
import StarsRating from '../../Components/StarsRating';
import { NavLink } from 'react-router-dom';
import Modal from '../../Components/Modal/Modal';
import { useMediaQuery } from '../../Hooks/useMediaQuery';
import useUserStore from '../../Store/useUserStore';


const CourseDetail = () => 
{
    const [currentQuestionnaire, setCurrentQuestionnaire] = useState(null);
    const [isOpenModalQuestionnaire, setIsOpenModalQuestionnaire] = useState(false);
    const [editActivated, setEditActivated] = useState(false);
    // Variable para comprobar si estamos en movil 
    const isMobile = useMediaQuery('(min-width: 370px) and (max-width: 600px)');
    // Sacamos el ID del curso de la ruta
    const {id} = useParams();
    // Sacamos el ID de usuario
    const {user} = useUserStore();

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
    //console.log(dataReviewsByCourse);
    if (isErrorReviewsByCourse) {
        console.error(errorReviewsByCourse.message);
    }

    useEffect(() => {
        if (dataReviewsByCourse) {
            dataReviewsByCourse.data.forEach(review => {
                if (review.user.id === user.id) setEditActivated(true);
            });
        }
    }, [dataReviewsByCourse])
    

    const currentQuestionnaireHTML = (
        <>
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
                        {currentQuestionnaire?.answers?.map(itemAnswer => (
                            <div key={itemAnswer.id} className='course-detail__reviews__review-detail__questionnaire__question-answer-container'>
                                <p className='course-detail__reviews__review-detail__questionnaire__question-answer-container__question'>- {itemAnswer.question.content} </p>
                                <p className='course-detail__reviews__review-detail__questionnaire__question-answer-container__answer'> {itemAnswer.content} </p>
                            </div>
                        ))
                        }
                    </div>
                </div>
            : <></> }
        </>
    )

    return (
        <section className='course-detail'>
            <section className='course-detail__course-card'>
                <CourseCard dataCourses={dataCourse} descripcion={true} moreDetails={false} goWebsite={true}/>
            </section>
            <section className='course-detail__reviews'>
                <div className='course-detail__reviews__allReviews'>
                    <div className='course-detail__reviews__allReviews__buttons'>
                        <button className='course-detail__reviews__allReviews__buttons__filter'>Filtros <BsFilter/> </button>
                        <NavLink className='course-detail__reviews__allReviews__buttons__add' to={`/create-update-review/${id}`} >
                            {editActivated ? <>Editar reseña <MdModeEditOutline/></> : <>Añadir reseña <MdPlaylistAdd/></> }
                        </NavLink>
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
                                        onClick={() => {
                                            setCurrentQuestionnaire(itemReview);
                                            if(isMobile){
                                                setIsOpenModalQuestionnaire(true);
                                            }
                                        }}
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
                {!isMobile 
                ?   <>{currentQuestionnaireHTML}</>
                :   <></>
                }
            </section>
            {isOpenModalQuestionnaire && isMobile
            ?   <Modal isOpen={isOpenModalQuestionnaire} title={'Cuestionario'} onClose={() => setIsOpenModalQuestionnaire(false)}>
                    {currentQuestionnaireHTML}
                </Modal>
            :   <></>}
        </section> 
    )
}

export default CourseDetail