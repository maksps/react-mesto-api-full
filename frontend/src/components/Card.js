import React, { useContext } from "react";
import '../index.css';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
    const currentUser = useContext(CurrentUserContext);
    const isOwn = card.owner._id === currentUser.userId;  // Определяем, являемся ли мы владельцем текущей карточки

    const cardDeleteButtonClassName = (
        `element__btn-delete ${isOwn ? 'element__btn-delete_seted' : ''}`  // Создаём переменную, которую после зададим в `className` для кнопки удаления
    );

    const isLiked = card.likes.some(i => i._id === currentUser.userId); // Определяем, есть ли у карточки лайк, поставленный текущим пользователем

    const cardLikeButtonClassName = (
        `element__like ${isLiked ? 'element__like_checked' : 'element__like_unchecked'}` // Создаём переменную, которую после зададим в `className` для кнопки лайка
    );

    function handleClick() {
        onCardClick(card.name, card.link);
    };

    function handleLikeClick() {
        onCardLike(card);
    };

    function handleDeleteClick() {
        onCardDelete(card);
    }

    return (
        <div className="element">
            <img className="element__image" onClick={handleClick} src={card.link} alt={card.name} />
            <div className="element__figcaption">
                <h2 className="element__text">{card.name}</h2>
                <div className="element__like-container">
                    <button type="button" onClick={handleLikeClick} className={cardLikeButtonClassName} aria-label="Нравится"></button>
                    <span className="element__like-count">{card.likes.length}</span>
                </div>
            </div>
            <button type="button" onClick={handleDeleteClick} className={cardDeleteButtonClassName} aria-label="Удалить"></button>
        </div>
    )
}

export default Card;