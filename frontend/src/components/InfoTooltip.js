import React from "react";


function InfoTooltip({isOpen, onClose, logo, text }) {


    return (
        <div className={isOpen ? `popup popup_infoTooltip popup_opened` : `popup popup_infoTooltip`}>
            <div className={`popup__container popup__container_infoTooltip`}>
                <img className="popup__logo"
                    src={logo}
                    alt="логотип" />
                <h3 className="popup__text-info">{text}</h3>

                <button className="popup__btn-exit" onClick={onClose} type="button" aria-label="выход"></button>
            </div>
        </div>
    )
}

export default InfoTooltip;

