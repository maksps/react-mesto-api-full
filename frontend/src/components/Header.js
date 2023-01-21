import React from "react";
import '../index.css';

function Header({ logo, nameButton, userEmail, onClick }) {
    return (
        <header className="header">
            <img className="header__logo"
                src={logo}
                alt="логотип" />
            <div className="header__nav">
                <p className="header__user-email">{userEmail}</p>
                <button onClick={onClick} className="header__link">{nameButton}</button>
            </div>
        </header>
    )
}

export default Header;