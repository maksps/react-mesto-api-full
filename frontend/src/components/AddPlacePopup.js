import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
    const [name, setName] = useState('');
    const [link, setLink] = useState('');

    useEffect(() => {                                    //очистка формы при открытии попапа
        setName('');
        setLink('');
    }, [isOpen]);

    function handleChangeName(e) {
        setName(e.target.value);
    };

    function handleChangeLink(e) {
        setLink(e.target.value);
    };

    function handleSubmit(e) {
        e.preventDefault();
        // Передаём значения управляемых компонентов во внешний обработчик
        onAddPlace({
            name: name,
            link: link,
        });
    }

    return (
        <PopupWithForm
            title={'Новое место'}
            name={'add'}
            isOpen={isOpen}
            onClose={onClose}
            textButton={'Создать'}
            onSubmit={handleSubmit}>
            <div className="input">
                <input type="text" value={name || ''} onChange={handleChangeName} placeholder="Название" name="name" minLength="2" maxLength="30" required
                    className="input__text input__text_type_placename" />
                <span className="popup__input-error name-error"></span>
                <input type="url" value={link || ''} onChange={handleChangeLink} placeholder="Ссылка на картинку" name="link" className="input__text input__text_type_link"
                    required />
                <span className="popup__input-error link-error"></span>
            </div>
        </PopupWithForm>
    )
}

export default AddPlacePopup;