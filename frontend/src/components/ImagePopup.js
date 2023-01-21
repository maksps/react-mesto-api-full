import React from "react";
import '../index.css';

function ImagePopup({ selectedCard, onClose }) {
    return (
        <div className={selectedCard.isOpen ? "popup popup_place popup_opened" : "popup popup_place"}
        >
            <div className="popup__container popup__container_place">
                <figure className="popup__figure">
                    <img className="popup__image" src={selectedCard.link} alt={selectedCard.name} />
                    <figcaption className="popup__figcaption">{selectedCard.name}</figcaption>
                </figure>
                <button className="popup__btn-exit" onClick={onClose} type="button" aria-label="выход"></button>
            </div>
        </div>
    )

}

export default ImagePopup;