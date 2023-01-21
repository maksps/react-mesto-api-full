import { useState, useEffect, useContext } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const currentUser = useContext(CurrentUserContext); //подписка на контекст

    useEffect(() => {                                    //установка текущего имени пользователя в форму
        setName(currentUser.userName);
        setDescription(currentUser.userDescription);
    }, [currentUser, isOpen]);

    function handleChangeName(e) {
        setName(e.target.value);
    };

    function handleChangeDescription(e) {
        setDescription(e.target.value);
    };

    function handleSubmit(e) {
        e.preventDefault();
        // Передаём значения управляемых компонентов во внешний обработчик
        onUpdateUser({
            name: name,
            about: description,
        });
    }

    return (
        <PopupWithForm
            title={'Редактировать профиль'}
            name={'edit'}
            isOpen={isOpen}
            onClose={onClose}
            textButton={'Сохранить'}
            onSubmit={handleSubmit}>
            <div className="input">
                <input type="text" value={name || ''} onChange={handleChangeName} placeholder="Имя" name="nameInput" className="input__text input__text_type_name"
                    minLength="2" maxLength="40" required />
                <span className="popup__input-error nameInput-error"></span>
                <input type="text" value={description || ''} onChange={handleChangeDescription} placeholder="О себе" name="jobInput" className="input__text input__text_type_job"
                    minLength="2" maxLength="200" required />
                <span className="popup__input-error jobInput-error"></span>
            </div>
        </PopupWithForm>
    )
}

export default EditProfilePopup;