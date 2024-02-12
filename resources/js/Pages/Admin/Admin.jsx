import React, { useState, useEffect } from 'react';
import { MdPlaylistAdd, MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import "./Admin.scss";
import useUserStore from "../../Store/useUserStore";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses } from '../../Services/Course/getCourses';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Modal from '../../Components/Modal/Modal';
import { postCourse } from '../../Services/Course/postCourse';
import { getAuthors } from '../../Services/Author/getAuthor';
import { putCourse } from '../../Services/Course/putCourse';
import { useAlertMessage } from '../../Hooks/alertMessage';


const Admin = () => 
{
    const { isAuth } = useUserStore();
    const queryClient = useQueryClient();
    const [isOpenModalNewCourse, setIsOpenModalNewCourse] = useState(false);
    const [isOpenModalUpdateCourse, setIsOpenModalUpdateCourse] = useState(false);
    const [fileQuestionsContent, setFileQuestionsContent] = useState([]);
    const [fileCoverImage, setFileCoverImage] = useState(null);
    const {handleAlertMessage: successPostCourse, contextHolder: contextHolderPostCourseSuccess} = useAlertMessage('success','El curso ha sido creado con exito');
    const {handleAlertMessage: successUpdateCourse , contextHolder: contextHolderUpdateCourseSuccess} = useAlertMessage('success','El curso ha sido editado con exito');
    const {handleAlertMessage: errorPostCourse, contextHolder: contextHolderPostCourseError} = useAlertMessage('error','No se ha podido crear el curso');
    const {handleAlertMessage: errorUpdateCourse , contextHolder: contextHolderUpdateCourseError} = useAlertMessage('error','No se ha podido actualizar el curso');
    const [dataCourseToChange, setDataCourseToChange] = useState({});
    // TantstanckQuery para getcourses
    const {isError: isErrorCourses, data: dataCourses, error:errorCourses} = useQuery({
        queryKey: ['courses'],
        queryFn: getCourses,
        enabled: isAuth
    });
    //console.log(data);
    if (isErrorCourses) {
        console.error(errorCourses.message);
    }

    // TantstanckQuery para getauthors
    const {isPending: isPendingAuthors, isError: isErrorAuthors, data: dataAuthors, error:errorAuthors} = useQuery({
        queryKey: ['authors'],
        queryFn: getAuthors,
        enabled: isAuth
    });
    //console.log(dataAuthors);
    if (isErrorAuthors) {
        console.error(errorAuthors.message);
    }

    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.onerror = (event) => {
                reject(event.target.error);
            };
            reader.readAsText(file);
        });
    };

    const handleCoverImage = (event) =>
    {
        const file = event.target.files[0];
        setFileCoverImage(file);
    } 

    const handleQuestionFile = async (event) =>
    {
        let file = event.target.files[0];
        if (file) {
            try 
            {
                const content = await readFile(file);
                const lines = content.split(/\r?\n/);
                const nonEmptyLines = lines.filter(line => line.trim() !== '');
                setFileQuestionsContent(nonEmptyLines);
            } catch (error) 
            {
              console.error('Error al leer el archivo:', error);
            }
        }
    }

    //tantstackquery para postCourses
    const schema = yup.object({
        name: yup.string().required('El nombre es obligatorio.'),
        description: yup.string().required('El campo descripción es obligatorio.'),
        category: yup.string().required('El campo categoría es obligatorio.'),
        location: yup.string().required('El campo plataforma es obligatorio.'),
        website: yup.string().required('El campo sitio web es obligatorio.'),
        price: yup.string().required('El campo precio es obligatorio.'),
        cover_image: yup.mixed().required('El campo imagen portada es obligatorio.'),
        author: yup.number().required('El campo autor es obligatorio.'),
        questions: yup.mixed().required('El campo preguntas es obligatorio.')
    });

    const {register: registerPostCourse, handleSubmit: handleSubmitPostCourse, formState: { errors: errorsPostCourse }, setValue: setValuePostCourse, getValues: getValuesPostCourse} = useForm({
        resolver: yupResolver(schema)
    });

    const {mutate: mutatePostCourse, error: errorPost} = useMutation({
        mutationFn: postCourse,
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries({ queryKey: ['courses']});
            setIsOpenModalNewCourse(false);
            successPostCourse();
            // Limpiando los setters
            setFileCoverImage(null);
            setFileQuestionsContent(null);
        },
        onError: (e) => {
            console.log(e);
            errorPostCourse();
        }
    });

    const onSubmitPostCourse = (dataForm) => 
    {
        mutatePostCourse({
            name: dataForm.name,
            description: dataForm.description,
            category: dataForm.category,
            location: dataForm.location,
            website: dataForm.website,
            price: dataForm.price,
            cover_image: fileCoverImage,
            author_id: dataForm.author,
            questions: fileQuestionsContent
        })
    };

    // ------------------------------------------------------------Update Courses-----------------------------------------------------------
        
    const saveDataCourseToChange = (data) =>
    {
        setDataCourseToChange(data);
        setIsOpenModalUpdateCourse(true);
    }
    
    const {register: registerUpdateCourse, handleSubmit: handleSubmitUpdateCourse, formState: { errors: errorsUpdateCourse }, setValue: setValueUpdateCourse} = useForm({});

    useEffect(() => {
        setValueUpdateCourse('name', dataCourseToChange?.name || '');
        setValueUpdateCourse('description', dataCourseToChange?.description || '');
        setValueUpdateCourse('category', dataCourseToChange?.category || '');
        setValueUpdateCourse('location', dataCourseToChange?.location || '');
        setValueUpdateCourse('website', dataCourseToChange?.website || '');
        setValueUpdateCourse('price', dataCourseToChange?.price || '');
        setValueUpdateCourse('author', dataCourseToChange?.author_id || '');
    }, [dataCourseToChange])

    const {mutate: mutateUpdateCourse, error: errorPutCourse} = useMutation({
        mutationFn: putCourse,
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries({ queryKey: ['courses']});
            setIsOpenModalUpdateCourse(false);
            successUpdateCourse();
            // Limpiando los setters
            setFileCoverImage(null);
            setFileQuestionsContent(null);
        },
        onError: (e) => {
            console.log(e);
            errorUpdateCourse();
        }
    });

    const onSubmitUpdateCourse = (dataForm) => 
    {
        //console.log('PUT:',dataForm);
        mutateUpdateCourse({
            id: dataCourseToChange.id,
            courseData : {
                name: dataForm.name,
                description: dataForm.description,
                category: dataForm.category,
                location: dataForm.location,
                website: dataForm.website,
                price: dataForm.price,
                cover_image: fileCoverImage,
                author_id: dataForm.author,
                questions: fileQuestionsContent
            }
        })
    };
    
    return (
        <section className='section-admin'>
            <div className='section-admin__contenedorPrincipal'>
                {contextHolderPostCourseSuccess}
                {contextHolderUpdateCourseSuccess}
                {contextHolderPostCourseError}
                {contextHolderUpdateCourseError}
                <div className='section-admin__contenedorPrincipal__contenedor-title-nuevoCurso'>
                    <h3 className='section-admin__contenedorPrincipal__contenedor-title-nuevoCurso__title'>Listado de cursos</h3>
                    <div className='section-admin__contenedorPrincipal__contenedor-title-nuevoCurso__botonNuevoCurso'
                        onClick={() => setIsOpenModalNewCourse(true) }
                    >
                        Nuevo curso
                        <MdPlaylistAdd />
                    </div>
                </div>
                <div className='section-admin__contenedorPrincipal__contenedor-table-curso'>
                    <table className='section-admin__contenedorPrincipal__contenedor-table-curso__table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripcion</th>
                                <th>Autor</th>
                                <th>Categoría</th>
                                <th>Plataforma</th>
                                <th>Ubicación</th>
                                <th>Puntuación total</th>
                                <th>Precio</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataCourses?.data?.map(itemCourse =>(
                            <tr key={itemCourse.id}>
                                <td> {itemCourse.id} </td>
                                <td> {itemCourse.name} </td>
                                <td> {itemCourse.description} </td>
                                <td> {itemCourse.authors.name} </td>
                                <td> {itemCourse.category} </td>
                                <td> {itemCourse.location} </td>
                                <td><a href={itemCourse.website} target='_blank' >Enlace al curso</a></td>
                                <td> {itemCourse.rating} </td>
                                <td> {itemCourse.price} </td>
                                <td>
                                    <FaEdit onClick={() => saveDataCourseToChange(itemCourse)} />
                                    <MdDelete />
                                </td>
                            </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
            <br />
            <Modal isOpen={isOpenModalNewCourse} title={'Nuevo curso'} onClose={() => setIsOpenModalNewCourse(false)} buttonNameSuccess={'Guardar'} onSubmit={handleSubmitPostCourse(onSubmitPostCourse)}>
                <form className='section-form'>
                    <div>
                        <label htmlFor="name">Nombre:</label>
                        <input 
                            type="text"
                            id='name'
                            name='name'
                            {...registerPostCourse('name')}
                        />
                        <span> {errorsPostCourse.name?.message} </span>
                        {errorPost?.response.data.errors && errorPost.response.data.errors.name && errorPost.response.data.errors.name[0] && <span> {errorPost.response.data.errors.name[0]} </span> }
                    </div>
                    <div>
                        <label htmlFor="category">Categoría:</label>
                        <input 
                            type="text"
                            id='category'
                            name='category'
                            {...registerPostCourse('category')}
                        />
                        <span> {errorsPostCourse.category?.message} </span>
                        {errorPost?.response.data.errors && errorPost.response.data.errors.category && errorPost.response.data.errors.category[0] && <span> {errorPost.response.data.errors.category[0]} </span> }
                    </div>
                    <div>
                        <label htmlFor="website">Sitio web:</label>
                        <input 
                            type="text"
                            id='website'
                            name='website'
                            {...registerPostCourse('website')}
                        />
                        <span> {errorsPostCourse.website?.message} </span>
                        {errorPost?.response.data.errors && errorPost.response.data.errors.website && errorPost.response.data.errors.website[0] && <span> {errorPost.response.data.errors.website[0]} </span> }
                    </div>
                    <div>
                        <label htmlFor="location">Plataforma:</label>
                        <input 
                            type="text"
                            id='location'
                            name='location'
                            {...registerPostCourse('location')}
                        />
                        <span> {errorsPostCourse.location?.message} </span>
                        {errorPost?.response.data.errors && errorPost.response.data.errors.location && errorPost.response.data.errors.location[0] && <span> {errorPost.response.data.errors.location[0]} </span> }
                    </div>
                    <div>
                        <label htmlFor="description">Descripción:</label>
                        <textarea 
                            name="description" 
                            id="description" 
                            cols="20" 
                            rows="6"
                            {...registerPostCourse('description')}
                        ></textarea>
                        <span> {errorsPostCourse.description?.message} </span>
                        {errorPost?.response.data.errors && errorPost.response.data.errors.description && errorPost.response.data.errors.description[0] && <span> {errorPost.response.data.errors.description[0]} </span> }
                    </div>
                    <div className='div_double'>
                        <div>
                            <label htmlFor="author">Autor:</label>
                            <select name="author" id="author" {...registerPostCourse('author')}>
                                <option value="">--Seleccione autor--</option>
                                {dataAuthors?.data?.map(itemAuthor => (
                                    <option key={itemAuthor.id} value={itemAuthor.id}> {itemAuthor.name} </option>
                                ))}
                            </select>
                            <span> {errorsPostCourse.author_id?.message} </span>
                            {errorPost?.response.data.errors && errorPost.response.data.errors.author_id && errorPost.response.data.errors.author_id[0] && <span> {errorPost.response.data.errors.author_id[0]} </span> }
                        </div>
                        <div>
                            <label htmlFor="price">Precio:</label>
                            <input 
                                type="text"
                                id='price'
                                name='price'
                                {...registerPostCourse('price')}
                            />
                            <span> {errorsPostCourse.price?.message} </span>
                            {errorPost?.response.data.errors && errorPost.response.data.errors.price && errorPost.response.data.errors.price[0] && <span> {errorPost.response.data.errors.price[0]} </span> }
                        </div>
                    </div>
                    <div className='div_file'>
                        <label htmlFor="cover_image">Imagen portada:</label>
                        <input 
                            type="file"
                            id='cover_image'
                            name='cover_image'
                            accept=".jpeg, .jpg, .png, .gif"
                            onChange={handleCoverImage}
                            {...registerPostCourse('cover_image')}
                        />
                        <span> {errorsPostCourse.cover_image?.message} </span>
                        {errorPost?.response.data.errors && errorPost.response.data.errors.cover_image && errorPost.response.data.errors.cover_image[0] && <span> {errorPost.response.data.errors.cover_image[0]} </span> }
                    </div>
                    <div className='div_file'>
                        <label htmlFor="questions">Preguntas:</label>
                        <input 
                            type="file"
                            id='questions'
                            name='questions'
                            accept=".txt"
                            onChange={handleQuestionFile}
                            {...registerPostCourse('questions')}
                        />
                        <span> {errorsPostCourse.questions?.message} </span>
                        {errorPost?.response.data.errors && errorPost.response.data.errors.questions && errorPost.response.data.errors.questions[0] && <span> {errorPost.response.data.errors.questions[0]} </span> }
                    </div>
                </form>
            </Modal>
            <Modal isOpen={isOpenModalUpdateCourse} title={'Editar curso'} onClose={() => setIsOpenModalUpdateCourse(false)} buttonNameSuccess={'Actualizar'} onSubmit={handleSubmitUpdateCourse(onSubmitUpdateCourse)}>
                <form className='section-form'>
                    <div>
                        <label htmlFor="name">Nombre:</label>
                        <input 
                            type="text"
                            id='name'
                            name='name'
                            {...registerUpdateCourse('name')}
                        />
                        
                        {errorPutCourse?.response.data.errors && errorPutCourse.response.data.errors.name && errorPutCourse.response.data.errors.name[0] && <span> {errorPutCourse.response.data.errors.name[0]} </span> }
                    </div>
                    <div>
                        <label htmlFor="category">Categoría:</label>
                        <input 
                            type="text"
                            id='category'
                            name='category'
                            {...registerUpdateCourse('category')}
                        />
                        {errorPutCourse?.response.data.errors && errorPutCourse.response.data.errors.category && errorPutCourse.response.data.errors.category[0] && <span> {errorPutCourse.response.data.errors.category[0]} </span> }
                    </div>
                    <div>
                        <label htmlFor="website">Sitio web:</label>
                        <input 
                            type="text"
                            id='website'
                            name='website'
                            {...registerUpdateCourse('website')}
                        />
                        {errorPutCourse?.response.data.errors && errorPutCourse.response.data.errors.website && errorPutCourse.response.data.errors.website[0] && <span> {errorPutCourse.response.data.errors.website[0]} </span> }
                    </div>
                    <div>
                        <label htmlFor="location">Plataforma:</label>
                        <input 
                            type="text"
                            id='location'
                            name='location'
                            {...registerUpdateCourse('location')}
                        />
                        {errorPutCourse?.response.data.errors && errorPutCourse.response.data.errors.location && errorPutCourse.response.data.errors.location[0] && <span> {errorPutCourse.response.data.errors.location[0]} </span> }
                    </div>
                    <div>
                        <label htmlFor="description">Descripción:</label>
                        <textarea 
                            name="description" 
                            id="description" 
                            cols="20" 
                            rows="6"
                            {...registerUpdateCourse('description')}
                        ></textarea>
                        {errorPutCourse?.response.data.errors && errorPutCourse.response.data.errors.description && errorPutCourse.response.data.errors.description[0] && <span> {errorPutCourse.response.data.errors.description[0]} </span> }
                    </div>
                    <div className='div_double'>
                        <div>
                            <label htmlFor="author">Autor:</label>
                            <select name="author" id="author" {...registerUpdateCourse('author')}>
                                <option value="">--Seleccione autor--</option>
                                {dataAuthors?.data?.map(itemAuthor => (
                                    <option key={itemAuthor.id} value={itemAuthor.id}> {itemAuthor.name} </option>
                                ))}
                            </select>
                            {errorPutCourse?.response.data.errors && errorPutCourse.response.data.errors.author_id && errorPutCourse.response.data.errors.author_id[0] && <span> {errorPutCourse.response.data.errors.author_id[0]} </span> }
                        </div>
                        <div>
                            <label htmlFor="price">Precio:</label>
                            <input 
                                type="text"
                                id='price'
                                name='price'
                                {...registerUpdateCourse('price')}
                            />
                            {errorPutCourse?.response.data.errors && errorPutCourse.response.data.errors.price && errorPutCourse.response.data.errors.price[0] && <span> {errorPutCourse.response.data.errors.price[0]} </span> }
                        </div>
                    </div>
                    <div className='div_file'>
                        <label htmlFor="cover_image">Imagen portada:</label>
                        <input 
                            type="file"
                            id='cover_image'
                            name='cover_image'
                            accept=".jpeg, .jpg, .png, .gif"
                            onChange={handleCoverImage}
                        />
                        {errorPutCourse?.response.data.errors && errorPutCourse.response.data.errors.cover_image && errorPutCourse.response.data.errors.cover_image[0] && <span> {errorPutCourse.response.data.errors.cover_image[0]} </span> }
                        {dataCourseToChange && dataCourseToChange.cover_image ?
                            <img src={`http://127.0.0.1:8000/storage/${dataCourseToChange.cover_image}`} alt="cover_image" width={80} />
                        : null}
                    </div>
                    <div className='div_file'>
                        <label htmlFor="questions">Preguntas:</label>
                        <input 
                            type="file"
                            id='questions'
                            name='questions'
                            accept=".txt"
                            onChange={handleQuestionFile}
                        />
                        {errorPutCourse?.response.data.errors && errorPutCourse.response.data.errors.questions && errorPutCourse.response.data.errors.questions[0] && <span> {errorPutCourse.response.data.errors.questions[0]} </span> }
                    </div>
                </form>
            </Modal>
        </section>
    )
}

export default Admin;