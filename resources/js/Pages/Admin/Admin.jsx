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
import { deleteCourse } from '../../Services/Course/deleteCourse';
import { getTechnologies } from '../../Services/Technology/getTechnologies';
import { postTechnology } from '../../Services/Technology/postTechnology';
import { putTechnology } from '../../Services/Technology/putTechnology';
import { deleteTechnology } from '../../Services/Technology/deleteTechnology';
import { useAlertMessage } from '../../Hooks/alertMessage';
import { Popconfirm } from 'antd';
//import PopConfirm from '../../Components/PopConfirm/PopConfirm';


const Admin = () => 
{
    const { isAuth } = useUserStore();
    const queryClient = useQueryClient();
    const [isOpenModalNewCourse, setIsOpenModalNewCourse] = useState(false);
    const [isOpenModalNewTechnology, setIsOpenModalNewTechnology] = useState(false);
    const [isOpenModalUpdateCourse, setIsOpenModalUpdateCourse] = useState(false);
    const [isOpenModalUpdateTechnology, setIsOpenModalUpdateTechnology] = useState(false);
    const [fileQuestionsContent, setFileQuestionsContent] = useState(null);
    const [fileCoverImage, setFileCoverImage] = useState(null);
    const [technologyImage, setTechnologyImage] = useState(null);
    const [selectedTechnologiesOptions, setSelectedTechnologiesOptions] = useState(null);
    const {handleAlertMessage: successPostCourse, contextHolder: contextHolderPostCourseSuccess} = useAlertMessage('success','El curso ha sido creado con exito');
    const {handleAlertMessage: successUpdateCourse , contextHolder: contextHolderUpdateCourseSuccess} = useAlertMessage('success','El curso ha sido editado con exito');
    const {handleAlertMessage: errorPostCourse, contextHolder: contextHolderPostCourseError} = useAlertMessage('error','No se ha podido crear el curso');
    const {handleAlertMessage: errorUpdateCourse , contextHolder: contextHolderUpdateCourseError} = useAlertMessage('error','No se ha podido actualizar el curso');
    const {handleAlertMessage: successDeleteCourseMessage, contextHolder: contextHolderDeleteCourseSuccess} = useAlertMessage('success','El curso ha sido borrado con exito');
    const {handleAlertMessage: errorDeleteCourseMessage, contextHolder: contextHolderDeleteCourseError} = useAlertMessage('error','No se ha podido borrar el curso');
    const {handleAlertMessage: errorPostTechnologyMessage, contextHolder: contextHolderPostTechnologyError} = useAlertMessage('error','No se ha podido crear la tecnología');
    const {handleAlertMessage: errorUpdateTechnology , contextHolder: contextHolderUpdateTechnologyError} = useAlertMessage('error','No se ha podido actualizar la tecnología');
    const {handleAlertMessage: successPostTechnology, contextHolder: contextHolderPostTechnologySuccess} = useAlertMessage('success','La tecnología ha sido creada con exito');
    const {handleAlertMessage: successUpdateTechnology, contextHolder: contextHolderUpdateTechnologySuccess} = useAlertMessage('success','La tecnología ha sido actualizada con exito');
    const {handleAlertMessage: successDeleteTechnologyMessage, contextHolder: contextHolderDeleteTechnologySuccess} = useAlertMessage('success','La tecnología ha sido borrada con exito');
    const {handleAlertMessage: errorDeleteTechnologyMessage, contextHolder: contextHolderDeleteTechnologyError} = useAlertMessage('error','No se ha podido borrar la tecnología');
    const [dataCourseToChange, setDataCourseToChange] = useState({});
    const [dataTechnologyToChange, setDataTechnologyToChange] = useState({});

    // TantstanckQuery para getcourses
    const {isError: isErrorCourses, data: dataCourses, error:errorCourses} = useQuery({
        queryKey: ['courses'],
        queryFn: getCourses,
        //enabled: isAuth
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

    const handleQuestionFile = async (event) =>
    {
        let file = event.target.files[0];
        if (file) {
            try 
            {
                const content = await readFile(file);
                const lines = content.split(/\r?\n/);
                const nonEmptyLines = lines.filter(line => line.trim() !== '');

                const questionsArray = nonEmptyLines.map(line => {
                    return {"content": line};
                });
                setFileQuestionsContent(questionsArray);

            } catch (error) 
            {
              console.error('Error al leer el archivo:', error);
            }
        }
    }

    const handleCoverImage = (event) =>
    {
        const file = event.target.files[0];
        setFileCoverImage(file);
        console.log(file);
    }

    const handleSelecTechnologies = (event) => {
        const selectedValues = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedTechnologiesOptions(selectedValues);

        //console.log(selectedValues);
    };

    const removeOption = (optionToRemove) => {
        const updatedOptions = selectedTechnologiesOptions.filter(option => option !== optionToRemove);
        setSelectedTechnologiesOptions(updatedOptions);
    };

    //tantstackquery para postCourses
    const schema = yup.object({
        name: yup.string().required('El nombre es obligatorio.'),
        description: yup.string().required('El campo descripción es obligatorio.'),
        category: yup.string().required('El campo categoría es obligatorio.'),
        location: yup.string().required('El campo plataforma es obligatorio.'),
        website: yup.string().required('El campo sitio web es obligatorio.'),
        price: yup.string().required('El campo precio es obligatorio.'),
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
            setTechnologyImage(null);
            setFileQuestionsContent(null);
            setSelectedTechnologiesOptions(null);
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
            questions: fileQuestionsContent,
            technologies: selectedTechnologiesOptions,
            rating: 0
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
            setTechnologyImage(null);
            setFileQuestionsContent(null);
            setSelectedTechnologiesOptions(null);
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
                questions: fileQuestionsContent,
                technologies: selectedTechnologiesOptions
            }
        })
    };

    //-----------------------------Delete courses--------------------------------------------
    const {mutate: mutateDeleteCourse, error: errorDeleteCourse} = useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses']});
            successDeleteCourseMessage();
        },
        onError: (e) => {
            console.log(e);
            //Mensaje alert
            errorDeleteCourseMessage();
        }
    });

    const onSubmitDeleteCourse = (id) => 
    {
        mutateDeleteCourse({
            id: id,
        })
    };

    // --------------------------------------Get technologies---------------------------------------------------
    // TantstanckQuery para gettechnologies
    const {isError: isErrorTechnologies, data: dataTechnologies, error:errorTechnologies} = useQuery({
        queryKey: ['technologies'],
        queryFn: getTechnologies,
    });
    if (isErrorTechnologies) {
        console.error(errorTechnologies.message);
    }

    const handleTechnologyImage = (event) =>
    {
        const file = event.target.files[0];
        setTechnologyImage(file);
        console.log(file);
    }
    // -------------------------------Query para post technologies-------------------------------------------
    const schemaTechnology = yup.object({
        name: yup.string().required('El nombre es obligatorio.'),
    });

    const {register: registerPostTechnology, handleSubmit: handleSubmitPostTechnology, formState: { errors: errorsPostTechnology }} = useForm({
        resolver: yupResolver(schemaTechnology)
    });

    const {mutate: mutatePostTechnology, error: errorPostTechnology} = useMutation({
        mutationFn: postTechnology,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['technologies']});
            setIsOpenModalNewTechnology(false);
            successPostTechnology();
            // Limpiando los setters
            setTechnologyImage(null);
        },
        onError: (e) => {
            console.log(e);
            //Mensaje alert
            errorPostTechnologyMessage();
        }
    });

    const onSubmitPostTechnology = (dataForm) => 
    {
        mutatePostTechnology({
            name: dataForm.name,
            image: technologyImage,
        })
    };

    // -------------------------------------------Update technologies---------------------------------------------------------
    const saveDataTechnologyToChange = (data) =>
    {
        setDataTechnologyToChange(data);
        setIsOpenModalUpdateTechnology(true);
    }
    
    const {register: registerUpdateTechnology, handleSubmit: handleSubmitUpdateTechnology, formState: { errors: errorsUpdateTechnology }, setValue: setValueUpdateTechnology} = useForm({});

    useEffect(() => {
        setValueUpdateTechnology('name', dataTechnologyToChange?.name || '');
    }, [dataTechnologyToChange])

    const {mutate: mutateUpdateTechnology, error: errorPutTechnology} = useMutation({
        mutationFn: putTechnology,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['technologies']});
            setIsOpenModalUpdateTechnology(false);
            successUpdateTechnology();
            // Limpiando los setters
            setTechnologyImage(null);
        },
        onError: (e) => {
            console.log(e);
            errorUpdateTechnology();
        }
    });

    const onSubmitUpdateTechnology = (dataForm) => 
    {
        mutateUpdateTechnology({
            id: dataTechnologyToChange.id,
            technologyData : {
                name: dataForm.name,
                image: technologyImage,
            }
        })
    };
    // -------------------------------------------Query Delete technology-----------------------------
    const {mutate: mutateDeleteTechnology, error: errorDeleteTechnology} = useMutation({
        mutationFn: deleteTechnology,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['technologies']});
            successDeleteTechnologyMessage();
        },
        onError: (e) => {
            console.log(e);
            //Mensaje alert
            errorDeleteTechnologyMessage();
        }
    });

    const onSubmitDeleteTechnology = (id) => 
    {
        mutateDeleteTechnology({
            id: id,
        })
    };

    return (
        <section className='section-admin'>
            <div className='section-admin__course-container'>
                {contextHolderPostCourseSuccess}
                {contextHolderUpdateCourseSuccess}
                {contextHolderPostCourseError}
                {contextHolderUpdateCourseError}
                {contextHolderPostTechnologySuccess}
                {contextHolderUpdateTechnologySuccess}
                {contextHolderPostTechnologyError}
                {contextHolderUpdateTechnologyError}
                {contextHolderDeleteCourseError}
                {contextHolderDeleteCourseSuccess}
                {contextHolderDeleteTechnologySuccess}
                {contextHolderDeleteTechnologyError}
                <div className='section-admin__course-container__title-newCourse-container'>
                    <h3 className='section-admin__course-container__title-newCourse-container__title'>Listado de cursos</h3>
                    <div className='section-admin__course-container__title-newCourse-container__newCourseButton'
                        onClick={() => setIsOpenModalNewCourse(true) }
                    >
                        Nuevo curso
                        <MdPlaylistAdd />
                    </div>
                </div>
                <div className='section-admin__course-container__course-table-container'>
                    <table className='section-admin__course-container__course-table-container__table'>
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
                                    <Popconfirm 
                                        title={'Borrado de curso'}
                                        description={'¿Esta segur@ de eliminar este curso?'}
                                        onConfirm={() => onSubmitDeleteCourse(itemCourse.id)}
                                        okText="Si"
                                        cancelText="No"
                                    >
                                        <MdDelete />
                                    </Popconfirm>
                                </td>
                            </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
            <div className='section-admin__technology-container'>
                <div className='section-admin__technology-container__title-newTechnology-container'>
                    <h3 className='section-admin__technology-container__title-newTechnology-container__title'>Listado de tecnologías</h3>
                    <div 
                        className='section-admin__technology-container__title-newTechnology-container__newTechnology-button'
                        onClick={() => setIsOpenModalNewTechnology(true) }
                    >
                        Nueva tecnología
                        <MdPlaylistAdd />
                    </div>
                </div>
                <div className='section-admin__technology-container__technology-table-container'>
                    <table className='section-admin__technology-container__technology-table-container__table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Imagen</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataTechnologies?.data?.map(itemTechnology =>(
                            <tr key={itemTechnology.id}>
                                <td> {itemTechnology.id} </td>
                                <td> {itemTechnology.name} </td>
                                <td> {itemTechnology.image} </td>
                                <td>
                                    <FaEdit onClick={() => saveDataTechnologyToChange(itemTechnology)} />
                                    <Popconfirm 
                                        title={'Borrado de tecnología'} 
                                        description={'¿Esta segur@ de eliminar esta tecnología?'} 
                                        confirm={() => onSubmitDeleteTechnology(itemTechnology.id)}
                                        okText="Si"
                                        cancelText="No"
                                    >
                                        <MdDelete/>
                                    </Popconfirm>
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
                            <span> {errorsPostCourse.author?.message} </span>
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
                        />
                        {!fileCoverImage && <span> El campo portada imagen es obligatorio </span> }
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
                        />
                        {!fileQuestionsContent || fileQuestionsContent.length === 0 && <span> El campo preguntas es obligatorio </span> }
                        {errorPost?.response.data.errors && errorPost.response.data.errors.questions && errorPost.response.data.errors.questions[0] && <span> {errorPost.response.data.errors.questions[0]} </span> }
                    </div>
                    <div>
                        <label htmlFor="technologies">Tecnologías:</label>
                        <select 
                            name="technologies" 
                            id="technologies"
                            multiple 
                            value={selectedTechnologiesOptions}
                            onChange={handleSelecTechnologies}
                        >
                            <option value="">--Seleccione tecnologías--</option>
                            {dataTechnologies?.data?.map(itemTechnology => (
                                <option key={itemTechnology.id} value={itemTechnology.id}> {itemTechnology.id} {itemTechnology.name} </option>
                            ))}
                        </select>
                        <div>
                            {selectedTechnologiesOptions ?
                                selectedTechnologiesOptions.map(itemOption => (
                                    <span key={itemOption}>
                                        {itemOption}
                                        <button onClick={() => removeOption(itemOption)}>X</button>
                                    </span>
                                ))
                            : <></>}
                        </div>
                        {/* {!filetechnologiesContent || filetechnologiesContent.length === 0 && <span> El campo preguntas es obligatorio </span> } */}
                        {errorPost?.response.data.errors && errorPost.response.data.errors.technologies && errorPost.response.data.errors.technologies[0] && <span> {errorPost.response.data.errors.technologies[0]} </span> }
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
                    <div>
                        <label htmlFor="technologies">Tecnologías:</label>
                        <select 
                            name="technologies" 
                            id="technologies"
                            multiple 
                            value={selectedTechnologiesOptions}
                            onChange={handleSelecTechnologies}
                        >
                            <option value="">--Seleccione tecnologías--</option>
                            {dataTechnologies?.data?.map(itemTechnology => (
                                <option key={itemTechnology.id} value={itemTechnology.id}> {itemTechnology.id} {itemTechnology.name} </option>
                            ))}
                        </select>
                        <div>
                            {selectedTechnologiesOptions ?
                                selectedTechnologiesOptions.map(itemOption => (
                                    <span key={itemOption}>
                                        {itemOption}
                                        <button onClick={() => removeOption(itemOption)}>X</button>
                                    </span>
                                ))
                            : <></>}
                        </div>
                        {/* {!filetechnologiesContent || filetechnologiesContent.length === 0 && <span> El campo preguntas es obligatorio </span> } */}
                        {errorPutCourse?.response.data.errors && errorPutCourse.response.data.errors.technologies && errorPutCourse.response.data.errors.technologies[0] && <span> {errorPutCourse.response.data.errors.technologies[0]} </span> }
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isOpenModalNewTechnology} title={'Nueva tecnología'} onClose={() => setIsOpenModalNewTechnology(false)} buttonNameSuccess={'Guardar tecnología'} onSubmit={handleSubmitPostTechnology(onSubmitPostTechnology)}>
                <form className='section-form'>
                    <div>
                        <label htmlFor="name">Nombre:</label>
                        <input 
                            type="text"
                            id='name'
                            name='name'
                            {...registerPostTechnology('name')}
                        />
                        <span> {errorsPostTechnology.name?.message} </span>
                        {errorPostTechnology?.response.data.errors && errorPostTechnology.response.data.errors.name && errorPostTechnology.response.data.errors.name[0] && <span> {errorPostTechnology.response.data.errors.name[0]} </span> }
                    </div>
                    <div className='div_file'>
                    <label htmlFor="image">Imagen:</label>
                        <input 
                            type="file"
                            id='image'
                            name='image'
                            accept=".jpeg, .jpg, .png, .gif"
                            onChange={handleTechnologyImage}
                        />
                        {!technologyImage && <span> El campo imagen es obligatorio </span> }
                        {errorPostTechnology?.response.data.errors && errorPostTechnology.response.data.errors.image && errorPostTechnology.response.data.errors.image[0] && <span> {errorPostTechnology.response.data.errors.image[0]} </span> }
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isOpenModalUpdateTechnology} title={'Editar tecnología'} onClose={() => setIsOpenModalUpdateTechnology(false)} buttonNameSuccess={'Actualizar tecnología'} onSubmit={handleSubmitUpdateTechnology(onSubmitUpdateTechnology)}>
                <form className='section-form'>
                    <div>
                        <label htmlFor="name">Nombre:</label>
                        <input 
                            type="text"
                            id='name'
                            name='name'
                            {...registerUpdateTechnology('name')}
                        />
                        <span> {errorsPostTechnology.name?.message} </span>
                        {errorPostTechnology?.response.data.errors && errorPostTechnology.response.data.errors.name && errorPostTechnology.response.data.errors.name[0] && <span> {errorPostTechnology.response.data.errors.name[0]} </span> }
                    </div>
                    <div className='div_file'>
                    <label htmlFor="image">Imagen:</label>
                        <input 
                            type="file"
                            id='image'
                            name='image'
                            accept=".jpeg, .jpg, .png, .svg"
                            onChange={handleTechnologyImage}
                        />
                        {errorPutTechnology?.response.data.errors && errorPutTechnology.response.data.errors.image && errorPutTechnology.response.data.errors.image[0] && <span> {errorPutTechnology.response.data.errors.image[0]} </span> }
                        {dataTechnologyToChange && dataTechnologyToChange.image ?
                            <img src={`http://127.0.0.1:8000/storage/${dataTechnologyToChange.image}`} alt="image" width={80} />
                        : null}
                    </div>
                </form>
            </Modal>
        </section>
    )
}

export default Admin;