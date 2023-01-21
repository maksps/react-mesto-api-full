import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../index.css';

function Register({ onRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleChangeEmail(e) {
        setEmail(e.target.value);
    };

    function handleChangePassword(e) {
        setPassword(e.target.value);
    };

    function handleSubmit(e) {
        e.preventDefault();
        // Передаём значения управляемых компонентов во внешний обработчик
        onRegister({
            password: password,
            email: email
        });
    }

    return (

        <div className="auth auth_register">
            <h3 className="auth__title">Регистрация</h3>
            <form className="form form_register" onSubmit={handleSubmit}>
                <div className="auth-input">

                    <input id="email" className="auth-input__text auth-input__text_type_email" name="email" type="email" placeholder="Email" value={email || ''} onChange={handleChangeEmail} required />

                    <input id="password" className="auth-input__text auth-input__text_type_password" name="password" type="password" placeholder="Пароль" value={password || ''} onChange={handleChangePassword} minLength="2" maxLength="30" required/>
                </div>
                <button className="auth__btn-save" type="submit">Зарегистрироваться</button>
            </form>
            <Link to="/sign-in" className="auth__login-link">Уже зарегистрированы? Войти</Link>

        </div>

    )
}

export default Register;