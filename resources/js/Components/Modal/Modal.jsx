import React from 'react'
import "./Modal.scss";

const Modal = ({isOpen, title, children, onClose, buttonNameSuccess, onSubmit}) => {
    return (
        <>
        {isOpen ? 
            <section className='section-modal'>
                <div className='section-modal__container-modal'>
                    <div className='section-modal__container-modal__header'>
                        <h3 className='section-modal__container-modal__header__title'>
                            {title}
                        </h3>
                    </div>
                    <div className='section-modal__container-modal__body'>
                        {children}
                    </div>
                    <div className='section-modal__container-modal__footer'>
                        <button onClick={onClose}>Cancelar</button>
                        {buttonNameSuccess 
                        ?   <button onClick={onSubmit}> {buttonNameSuccess} </button>
                        :   <></>}
                    </div>
                </div>
            </section>
        : null }
        </>
    )
}

export default Modal