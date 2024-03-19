import {React, useEffect, useState } from 'react'
import "./Profile.scss";
import { NavLink, redirect, useNavigate } from "react-router-dom";
import useUserStore from '../../Store/useUserStore';
import { RiLogoutBoxRLine, RiDeleteBin2Line, RiEdit2Fill} from "react-icons/ri";
import { deleteUser } from '../../Services/User/deleteUser';
import { putUser } from '../../Services/User/putUser';
import { getUserById } from '../../Services/User/getUserById';
import { getReviewsByUser } from '../../Services/Review/getReviewsByUser';
import { Popconfirm } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAlertMessage } from '../../Hooks/alertMessage';
import Modal from '../../Components/Modal/Modal';
import StarsRating from '../../Components/StarsRating';

const Profile = () => 
{
    let navigate = useNavigate();
    const logout = useUserStore((state) => state.logout);
    //const user = useUserStore((state) => state.user);
    const {user} = useUserStore();
    const queryClient = useQueryClient();
    const {handleAlertMessage: successUpdateUserMessage, contextHolder: contextHolderUpdateUserSuccess} = useAlertMessage('success','El usuario ha sido actualizado con exito');
    const {handleAlertMessage: errorUpdateUserMessage, contextHolder: contextHolderUpdateUserError} = useAlertMessage('error','No se ha podido actualizar la tecnología');
    const {handleAlertMessage: successDeleteUserMessage, contextHolder: contextHolderDeleteUserSuccess} = useAlertMessage('success','El usuario ha sido borrado con exito');
    const {handleAlertMessage: errorDeleteUserMessage, contextHolder: contextHolderDeleteUserError} = useAlertMessage('error','No se ha podido borrar la tecnología');
    const [isOpenModalUpdateUser, setIsOpenModalUpdateUser] = useState(false);
    const [dataUserToChange, setDataUserToChange] = useState(null)

    const handleLogout = () => 
    {
        logout();
        navigate("/login");
    };

    const handleGotoReview = (id) =>
    {
        navigate(`/create-update-review/${id}`);
    }

    //--------------------------------------GET USER--------------------------------------------
    const {isError: isErrorUser, data: dataUser, error:errorUser} = useQuery({
        queryKey: ['userById'],
        queryFn: () => getUserById(user.id),
    });
    //console.log(dataUser);
    if (isErrorUser) {
        console.error(errorUser.message);
    }

    //--------------------------------------GET REVIEW BY USER--------------------------------------------
    const {isError: isErrorReviewsByUser, data: dataReviewsByUser, error:errorReviewsByUser} = useQuery({
        queryKey: ['reviewsByUser'],
        queryFn: () => getReviewsByUser(user.id),
    });
    console.log(dataReviewsByUser);
    if (isErrorReviewsByUser) {
        console.error(errorReviewsByUser.message);
    }

    // -----------------------------------------------DELETE USER---------------------------------
    const {mutate: mutateDeleteUser, error: errorDeleteUser} = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            successDeleteUserMessage();
            handleLogout();
        },
        onError: (e) => {
            console.log(e);
            errorDeleteUserMessage();
        }
    });

    const onSubmitDeleteUser = (id) => 
    {
        mutateDeleteUser({
            id: id,
        })
    };
    
    //-------------------------------------------UPDATE USER--------------------------------------------
    const saveDataUserToChange = () =>
    {
        console.log(dataUser?.data);
        setDataUserToChange(dataUser?.data);
        setIsOpenModalUpdateUser(true);
    }

    const schemaUser = yup.object({
        password: yup.string().required('El password es obligatorio.').min(6, 'Debe tener un minimo de 6 caracteres'),
    });

    const {register: registerUpdateUser, handleSubmit: handleSubmitUpdateUser, formState: { errors: errorsUpdateUser }, setValue: setValueUpdateUser} = useForm({
        resolver: yupResolver(schemaUser)
    });

    useEffect(() => {
        setValueUpdateUser('name', dataUserToChange?.name || '');
        setValueUpdateUser('username', dataUserToChange?.username || '');
        setValueUpdateUser('email', dataUserToChange?.email || '');
        //setValueUpdateUser('password', dataUserToChange?.password || '');
    }, [dataUserToChange])

    const {mutate: mutatePutUser, error: errorPutUser} = useMutation({
        mutationFn: putUser,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['userbyId']});
            setIsOpenModalUpdateUser(false);
            successUpdateUserMessage();
        },
        onError: (e) => {
            console.log(e);
            errorUpdateUserMessage();
        }
    });

    const onSubmitUpdateUser = (dataForm) => 
    {
        mutatePutUser({
            id: user.id,
            userData : {
                name: dataForm.name,
                username: dataForm.username,
                email: dataForm.email,
                password: dataForm.password
            }
        })
    };
    return (
        <section className='section-profile'>
            {contextHolderDeleteUserSuccess}
            {contextHolderDeleteUserError}
            {contextHolderUpdateUserSuccess}
            {contextHolderUpdateUserError}
            <div className='section-profile__profile-container'>
                <h1 className='section-profile__profile-container__welcome-text'>Bienvenido a tu perfil {user?.name}! </h1>
                <p className='section-profile__profile-container__paragraph'>Aquí podras editar tu usuario, ver o actualizar las reseñas de los cursos que has realizado.</p>
                <div className='section-profile__profile-container__options-buttons'>
                    <button className='section-profile__profile-container__options-buttons__edit-button' onClick={() => saveDataUserToChange()}>Editar <RiEdit2Fill /> </button>
                    <Popconfirm
                        title={'Borrado de usuario'}
                        description={'¿Esta segur@ de eliminar tu usuario?'}
                        onConfirm={() => onSubmitDeleteUser(user.id)}
                        okText="Si"
                        cancelText="No"
                    >
                        <button className='section-profile__profile-container__options-buttons__delete-button'>Borrar <RiDeleteBin2Line /> </button>
                    </Popconfirm>
                    <button className='section-profile__profile-container__options-buttons__logout-button' onClick={handleLogout}>Cerrar sesión <RiLogoutBoxRLine /> </button>
                </div>
                {user?.role[0]==='common' ?
                <div className='section-profile__profile-container__reviews-list'>
                    <h2 className='section-profile__profile-container__reviews-list__title'>Cursos valorados</h2>
                    {dataReviewsByUser?.data.lenght > 0 ? 
                        dataReviewsByUser.data.map(itemData => {
                        let stars = StarsRating(itemData.user_rating);
                        return (
                        <div key={itemData.id} className='section-profile__profile-container__reviews-list__review-card'>
                            <div className='section-profile__profile-container__reviews-list__review-card__name-rating-container'>
                                <div className='section-profile__profile-container__reviews-list__review-card__name-rating-container__name-author'>
                                    <p> {itemData.course.name} </p>
                                    <p> {itemData.course.authors.name} </p>
                                </div>
                                <div className='section-profile__profile-container__reviews-list__review-card__name-rating-container__rating'> {stars} <p> {itemData.course.rating} </p> </div>
                            </div>
                            <p className='section-profile__profile-container__reviews-list__review-card__user-rating'>Tu puntuacion: <strong> {itemData.user_rating} </strong> </p>
                            <button className='section-profile__profile-container__reviews-list__review-card__allReview-button' onClick={() => handleGotoReview(itemData.course_id)} >Ir a mi reseña</button>
                        </div>
                        )
                    })
                    : <p className='section-profile__profile-container__reviews-list__withoutReview'>Aun no tienes ninguna reseña</p>}
                </div>
                :
                <div className='section-profile__profile-container__link-admin-container'> <NavLink to={"/admin"}>Ir a administración</NavLink> </div> 
                }
            </div>
            <Modal isOpen={isOpenModalUpdateUser} title={'Editar usuario'} onClose={() => setIsOpenModalUpdateUser(false)} buttonNameSuccess={'Actualizar'} onSubmit={handleSubmitUpdateUser(onSubmitUpdateUser)}>
                <form className='section-form'>
                    <div>
                        <label htmlFor="name">Nombre:</label>
                        <input
                            type="text" 
                            name='name'
                            {...registerUpdateUser('name')}
                        />
                        {errorPutUser?.response.data.errors && errorPutUser.response.data.errors.name && errorPutUser.response.data.errors.name[0] && <span> {errorPutUser.response.data.errors.name[0]} </span> }
                    </div>
                    <div>
                        <label htmlFor="username">Nombre de usuario:</label>
                        <input 
                            type="text" 
                            name='username'
                            {...registerUpdateUser('username')}
                        />
                        {errorPutUser?.response.data.errors && errorPutUser.response.data.errors.username && errorPutUser.response.data.errors.username[0] && <span> {errorPutUser.response.data.errors.username[0]} </span> }
                    </div>
                    <div>
                        <label htmlFor="email">Correo:</label>
                        <input 
                            type="email"
                            name='email'
                            {...registerUpdateUser('email')}
                        />
                        {errorPutUser?.response.data.errors && errorPutUser.response.data.errors.email && errorPutUser.response.data.errors.email[0] && <span> {errorPutUser.response.data.errors.email[0]} </span> }
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password"
                            id='password'
                            name='password'
                            {...registerUpdateUser('password')}
                        />
                        <span>{errorsUpdateUser.password?.message}</span>
                        {errorPutUser?.response.data.errors && errorPutUser.response.data.errors.password && errorPutUser.response.data.errors.password[0] && <span> {errorPutUser.response.data.errors.password[0]} </span> }
                    </div>
                </form>
            </Modal>
        </section>
        
    );
}

export default Profile