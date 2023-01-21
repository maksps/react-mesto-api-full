import React, { useRef, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatarRef = useRef();

  useEffect(() => {                                    //очистка формы при открытии
    avatarRef.current.value = '';
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      title={'Обновить аватар'}
      name={'avatar'}
      isOpen={isOpen}
      onClose={onClose}
      textButton={'Сохранить'}
      onSubmit={handleSubmit}
    >
      <div className="input">
        <input type="url" ref={avatarRef} placeholder="Ссылка на картинку" name="avatar" className="input__text input__text_type_avatar"
          required />
        <span className="popup__input-error avatar-error"></span>
      </div>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;