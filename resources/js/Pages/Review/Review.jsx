import { React, useEffect, useState } from 'react';
import "./Review.scss";
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCourseById } from '../../Services/Course/getCourseById';
import { getQuestionsByCourse } from '../../Services/Question/getQuestionsByCourse';
import { postReview } from '../../Services/Review/postReview';
import { getQuestionsAndAnswersByCourseForUserReview } from '../../Services/Review/getQuestionsAndAnswersByCourseForUserReview';
import useUserStore from '../../Store/useUserStore';
import { useAlertMessage } from '../../Hooks/alertMessage';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { set, useForm } from "react-hook-form";

const Review = () => 
{
    const {id} = useParams();
    const {user} = useUserStore();
    let navigate = useNavigate();
    const {handleAlertMessage: successCreateReviewMessage, contextHolder: contextHolderCreateReviewSuccess} = useAlertMessage('success','La reseña ha sido creada con exito');
    const {handleAlertMessage: errorCreateReviewMessage, contextHolder: contextHolderCreateReviewError} = useAlertMessage('error','No se ha podido crear la reseña');
    const [reviewOfAuthUser, setReviewOfAuthUser] = useState(null);
    const [answersWithQuestions, setAnswersWithQuestions] = useState([]); // [{"question_id":"", "content":""},{}]
    const [isQuestionnaireComplete, setIsQuestionnaireComplete] = useState(false);

    const {isError: isErrorCourse, data: dataCourse, error:errorCourse} = useQuery({
        queryKey: ['course'],
        queryFn: () => getCourseById(id),
    });
    if (isErrorCourse) {
        console.error(errorCourse.message);
    }

    // const {isError: isErrorReviewQuestionnaire, data: dataReviewQuestionnaire, error:errorReviewQuestionnaire} = useQuery({
    //     queryKey: ['reviewQuestionnaire'],
    //     queryFn: () => getQuestionsAndAnswersByCourseForUserReview(id, user.id),
    // });
    // if (isErrorReviewQuestionnaire) {
    //     console.error(errorReviewQuestionnaire.message);
    // }
    // console.log(dataReviewQuestionnaire);

    const {isError: isErrorQuestionsByCourse, data: dataQuestionsByCourse, error:errorQuestionsByCourse} = useQuery({
        queryKey: ['questionsByCourse'],
        queryFn: () => getQuestionsByCourse(id),
    });
    if (isErrorQuestionsByCourse) {
        console.error(errorQuestionsByCourse.message);
    }

    useEffect(() => {
        // Comprobamos si el usuario autenticado ya realizo una review, si es asi lo guardamos para editar.
        if (dataQuestionsByCourse) 
        {
            const questions = dataQuestionsByCourse.data.map(itemQuestion => {
                return {"question_id": itemQuestion.id, "content":""}
            })
            setAnswersWithQuestions(questions);
        }
    }, [dataQuestionsByCourse])

    // useEffect(() => {
    //     // Comprobamos si el usuario autenticado ya realizo una review, si es asi lo guardamos para editar.
    //     if (dataCourse) 
    //     {
    //         const reviewAuthUser = dataCourse.data.flatMap(course => course.reviews.find(review => review.user_id === user.id));
    //         console.log(reviewAuthUser);
    //         setReviewOfAuthUser(reviewAuthUser);
    //     }
    // }, [dataCourse])
    //--------------------------------------------------CREATE REVIEW------------------------------------------------------------
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
            successCreateReviewMessage();
            navigate(`/course-detail/${id}`);
        },
        onError: (e) => {
            console.log(e);
            errorCreateReviewMessage();
        }
    });

    const onSubmitPostReview = (dataForm) => 
    {
        const completeAnswer = answersWithQuestions.some(answer => answer.content === "");
        setIsQuestionnaireComplete(completeAnswer);
        if (!completeAnswer) 
        {
            mutatePostReview({
                user_rating: dataForm.user_rating,
                title: dataForm.title,
                comment: dataForm.comment,
                user_id: user.id,
                course_id: id,
                answers: answersWithQuestions
            }) 
        }
    };
    
    const handleAnswers = (question, e) => 
    {
        console.log(answersWithQuestions);
        const answers = [...answersWithQuestions];
        answers.forEach(itemAnswer => {
            if (question.id === itemAnswer.question_id) {
                itemAnswer.content = e.target.value;
            }
        });
        setAnswersWithQuestions(answers);
    }

    // ---------------------------------------------------------UPDATE REVIEW------------------------------------------------



    // useEffect(() => {
    //     console.log(reviewOfAuthUser);
    //     // Con la review del usuario guardada usamos sus datos para guardarla en answerswithquestions una variable de estado del onchange del input answer
    //     if (reviewOfAuthUser)
    //     {
    //         const reviewsWithAnswers = reviewOfAuthUser.answers.map(itemAnswer => {
    //             return {"question_id": itemAnswer.question_id, "content": itemAnswer.content}
    //         })
    //         console.log(reviewsWithAnswers);
    //         setAnswersWithQuestions(reviewsWithAnswers);
    //     }
    // },[reviewOfAuthUser])

    return (
        <section className='section-create-update-review'>
            {contextHolderCreateReviewSuccess}
            {contextHolderCreateReviewError}
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
                        <span>{errorsCreateReview.title?.message}</span>
                        {errorPostReview?.response.data.errors && errorPostReview.response.data.errors.title && errorPostReview.response.data.errors.title[0] && <span> {errorPostReview.response.data.errors.title[0]} </span> }
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
                        <span>{errorsCreateReview.comment?.message}</span>
                        {errorPostReview?.response.data.errors && errorPostReview.response.data.errors.comment && errorPostReview.response.data.errors.comment[0] && <span> {errorPostReview.response.data.errors.comment[0]} </span> }
                    </div>
                    <p className='section-create-update-review__div-container__form__questionnaire-title'>Responde al siguiente cuestionario</p>
                    <div className='section-create-update-review__div-container__form__questions-list-container'>
                        {dataQuestionsByCourse?.data?.map(itemQuestion => (
                            <div key={itemQuestion.id} className='section-create-update-review__div-container__form__questions-list-container__question-answer'>
                                <label htmlFor="answer"> {itemQuestion.content} </label>
                                <textarea 
                                    name="answer"
                                    id="answer"
                                    cols="70" 
                                    rows="2"
                                    //value={answersWithQuestions.answer}
                                    onChange={(e) => handleAnswers(itemQuestion, e)}
                                ></textarea>
                            </div>
                        ))
                        }
                    </div>
                    <div className='section-create-update-review__div-container__form__raiting-container'>
                        <label htmlFor="user_rating">Puntúa este curso</label>
                        <input 
                            type="number"
                            name="user_rating" 
                            id="user_rating" 
                            placeholder='/5'
                            min="0"
                            max="5"
                            step="0.1"
                            {...registerCreateReview('user_rating')}
                        />
                        {errorsCreateReview?.user_rating ? <span>{errorsCreateReview.user_rating.message}</span> : <></> }
                        {errorPostReview?.response.data.errors && errorPostReview.response.data.errors.user_rating && errorPostReview.response.data.errors.user_rating[0] && <span> {errorPostReview.response.data.errors.user_rating[0]} </span> }
                    </div>
                </form>
                {isQuestionnaireComplete ? <p>TODOS LOS CAMPOS SON OBLIGATORIOS</p> : ""}
                <div className='section-create-update-review__div-container__buttons'>
                    <button onClick={() => navigate(`/course-detail/${id}`)} >Salir</button>
                    <button onClick={handleSubmitCreateReview(onSubmitPostReview)} >Guardar</button>
                </div>
            </div>
        </section>
    )
}

export default Review;