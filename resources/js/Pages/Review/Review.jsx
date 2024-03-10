import { React, useEffect, useState } from 'react';
import "./Review.scss";
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCourseById } from '../../Services/Course/getCourseById';
import { postReview } from '../../Services/Review/postReview';
import useUserStore from '../../Store/useUserStore';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const Review = () => 
{
    const {id} = useParams();
    const {user} = useUserStore();
    let navigate = useNavigate();
    const [reviewOfAuthUser, setReviewOfAuthUser] = useState(null);

    const {isError: isErrorCourse, data: dataCourse, error:errorCourse} = useQuery({
        queryKey: ['course'],
        queryFn: () => getCourseById(id),
    });
    if (isErrorCourse) {
        console.error(errorCourse.message);
    }

    useEffect(() => {
        // Comprobamos si el usuario autenticado ya realizo una review, si es asi lo guardamos para editar.
        if (dataCourse) 
        {
            const reviewToEdit = dataCourse.data[0].reviews?.find(review => review.user_id === user.id);
            console.log(reviewToEdit);
            setReviewOfAuthUser(reviewToEdit);
        }
    }, [dataCourse])
    
    //tantstackquery para postCourses
    const schemaCreateReview = yup.object({
        user_rating: yup.number().required('El nombre es obligatorio.'),
        title: yup.string().required('El campo título es obligatorio.'),
        comment: yup.string().required('El campo comentario es obligatorio.'),
    });

    const {register: registerCreateReview, handleSubmit: handleSubmitCreateReview, formState: { errors: errorsCreateReview }} = useForm({
        resolver: yupResolver(schemaCreateReview)
    });

    const {mutate: mutatePostReview, error: errorPostReview} = useMutation({
        mutationFn: postReview,
        onSuccess: (data) => {
            console.log(data);
            //queryClient.invalidateQueries({ queryKey: ['Reviews']});
        },
        onError: (e) => {
            console.log(e);
        }
    });

    const onSubmitPostCourse = (dataForm) => 
    {
        mutatePostReview({
            user_rating: dataForm.user_rating,
            title: dataForm.title,
            comment: dataForm.description,
            answers: dataForm.category,
            questionnaire: dataForm.location,
            user_id: dataForm.user_id,
            course_id: dataForm.course_id
        })
    };
    
    const handleAnswers = (e) => 
    {
        console.log(e.target.value);
    }

    return (
        <section className='section-create-update-review'>
            <div className='section-create-update-review__div-container'>
                <h2 className='section-create-update-review__div-container__title'>Valoración de {dataCourse?.data[0]?.name} de {dataCourse?.data[0].authors.name} </h2>
                <p className='section-create-update-review__div-container__message'>Tu valoración detallada es muy importante para valorar el curso de una manera mas seria y relevante, así ayudarás a otros usuarios y profesores a encontrar y mejorar sus cursos.</p>
                <form className='section-create-update-review__div-container__form'>
                    <div className='section-create-update-review__div-container__form__title-container'>
                        <label htmlFor="title">Título:</label>
                        <input
                            type='text'
                            name="title"
                            id="title"
                            maxLength={50}
                            {...registerCreateReview('title')}
                        />
                    </div>
                    <div className='section-create-update-review__div-container__form__comment-container'>
                        <label htmlFor="comment">Comentario:</label>
                        <textarea 
                            name="comment" 
                            id="comment" 
                            cols="70" 
                            rows="3"
                            {...registerCreateReview('comment')}
                        ></textarea>
                    </div>
                    <p className='section-create-update-review__div-container__form__questionnaire-title'>Responde al siguiente cuestionario</p>
                    <div className='section-create-update-review__div-container__form__questions-list-container'>
                        {dataCourse?.data[0].questions.map((itemQuestion, index) => (
                        <div key={index} className='section-create-update-review__div-container__form__questions-list-container__question-answer'>
                            <label htmlFor="">{itemQuestion}</label>
                            <textarea 
                                name={`answer ${index}`} 
                                id={`answer ${index}`}
                                cols="70" 
                                rows="2"
                                onChange={handleAnswers}
                            ></textarea>
                        </div>
                        ))}
                    </div>
                    <div className='section-create-update-review__div-container__form__raiting-container'>
                        <label htmlFor="user_rating">Puntúa este curso</label>
                        <input 
                            type="text"
                            name="user_rating" 
                            id="user_rating" 
                            placeholder='/5'
                            maxLength={3}
                            {...registerCreateReview('user_rating')}
                        />
                    </div>
                </form>
                <div className='section-create-update-review__div-container__buttons'>
                    <button onClick={() => navigate(`/course-detail/${id}`)} >Salir</button>
                    <button onSubmit={handleSubmitCreateReview(onSubmitPostCourse)} >Guardar</button>
                </div>
            </div>
        </section>
    )
}

export default Review;