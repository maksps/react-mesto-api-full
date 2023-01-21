import React from "react";
import '../index.css';

function PopupWithForm({ title, name, isOpen, onClose, children, textButton, onSubmit }) {
    return (
        <div className={isOpen ? `popup popup_${name} popup_opened` : `popup popup_${name}`}>
            <div className={`popup__container popup__container_${name}`}>
                <h3 className="popup__title">{title}</h3>
                <form className="popup__form" onSubmit={onSubmit} name={name} autoComplete="off">
                    {children}
                    <button className="popup__btn-save" type="submit">{textButton}</button>
                </form>
                <button className="popup__btn-exit" onClick={onClose} type="button" aria-label="выход"></button>
            </div>
        </div>
    )
}

export default PopupWithForm;