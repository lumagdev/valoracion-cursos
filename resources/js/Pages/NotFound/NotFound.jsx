import React from 'react';
import "./NotFound.scss";
 
const NotFound = () => 
{
    return (
    <div className='section-notFound'>
        <div className='section-notFound__container-notFound'>
            <p className='section-notFound__container-notFound__text'>Página no encontrada</p>
            <div class="section-notFound__container-notFound__number-container">
                <span>4</span>
                <span>0</span>
                <span>4</span>
            </div>
        </div>
    </div>
    );
}
 
export default NotFound;