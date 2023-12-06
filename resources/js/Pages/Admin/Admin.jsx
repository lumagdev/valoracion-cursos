import React from 'react';
import { MdPlaylistAdd, MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import "./Admin.scss";

const Admin = () => {
    return (
        <section className='section-admin'>
            <div className='section-admin__contenedorPrincipal'>
                <div className='section-admin__contenedorPrincipal__contenedor-title-nuevoCurso'>
                    <h3 className='section-admin__contenedorPrincipal__contenedor-title-nuevoCurso__title'>Listado de cursos</h3>
                    <div className='section-admin__contenedorPrincipal__contenedor-title-nuevoCurso__botonNuevoCurso'>
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
                                <th>Autor</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Brais Moure</td>
                                <td>Autor</td>
                                <td>
                                    <FaEdit />
                                    <MdDelete />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default Admin;