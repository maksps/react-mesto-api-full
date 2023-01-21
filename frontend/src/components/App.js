import React, { useState, useEffect } from "react";
import logoHeader from '../images/logo-header.svg';
import logoRegistration from '../images/logo-registration.svg';
import logoError from '../images/logo-error.svg';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import auth from "../utils/auth";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { Route, Switch, useHistory } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";


function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [tooltipContent, setTooltipContent] = useState({});
  const history = useHistory();
  // localStorage.removeItem('jwt');

  //основной функционал приложения 

  useEffect(() => {
    if (loggedIn) {
      api.getAllCards()
        .then((data) => {
          setCards(data);
        })
        .catch((err) => console.log(err));

      api.getUserInfo()
        .then((info) => {
          setCurrentUser({
            userName: info.name,
            userDescription: info.about,
            userAvatar: info.avatar,
            userId: info._id
          });
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [loggedIn]);

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser.userId);  // проверяем, есть ли уже лайк на этой карточке
    api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c)); // Отправляем запрос в API и получаем обновлённые данные карточки
    }).catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id));
    }).catch((err) => console.log(err));
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(name, link) {
    setSelectedCard({ name: name, link: link, isOpen: true })
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setInfoTooltipPopupOpen(false);
    setSelectedCard({})
  }

  function handleUpdateUser(data) {
    api.editProfile({
      name: data.name,
      about: data.about
    }).then((item) => {
      setCurrentUser({
        userName: item.name,
        userDescription: item.about,
        userAvatar: item.avatar,
        userId: item._id
      });
      closeAllPopups()
    }).catch((err) => console.log(err))
  };

  function handleUpdateavatar(data) {
    api.changeAvatar(data).then((item) => {
      setCurrentUser({
        userName: item.name,
        userDescription: item.about,
        userAvatar: item.avatar,
        userId: item._id
      });
      closeAllPopups()
    }).catch((err) => console.log(err))
  };

  function handleAddPlaceSubmit(data) {
    api.addCard({
      name: data.name,
      link: data.link
    }).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups()
    }).catch((err) => console.log(err))
  };

  //функционал регистрации и  авторизации пользователя  


  function cbTokenCheck() {
    if (localStorage.getItem('jwt')) {
      const token = localStorage.getItem('jwt');
      auth.checkToken(token).then((res) => {
        setLoggedIn(true);
        setUserData({ email: res.email, id: res._id });
        history.push("/");
      }).catch((err) => console.log(err))
    }
    return
  };

  useEffect(() => {
    cbTokenCheck();
  }, []);

  function authorize({ password, email }) {
    auth.signIn({ password, email }).then((res) => {
      if (res.token) {
        localStorage.setItem('jwt', res.token);
        setLoggedIn(true);
        history.push("/");
        setUserData({ email: email })
      } else {
        setLoggedIn(false);
        setTooltipContent({ text: 'Что-то пошло не так! Попробуйте ещё раз.', logo: logoError });
        setInfoTooltipPopupOpen(true);
      }

    }).catch((err) => console.log(err))
  };

  function registrate({ password, email }) {
    auth.signUp({ password, email }).then((res) => {

      if (res.token) {
        setUserData({ id: res._id, email: res.email });
        localStorage.setItem('jwt', res.token);
        setLoggedIn(true);
        history.push("/");
        setTooltipContent({ text: 'Вы успешно зарегистрировались!', logo: logoRegistration });
        setInfoTooltipPopupOpen(true);
      }

    }).catch((err) => {
      console.log(err.message);
      setLoggedIn(false);
      setTooltipContent({ text: 'Что-то пошло не так! Попробуйте ещё раз.', logo: logoError });
      setInfoTooltipPopupOpen(true);
    })
  };

  function handleLogin({ password, email }) {
    authorize({ password, email });
  }

  function handleRegistration({ password, email }) {
    registrate({ password, email });
  };

  function handleExit() {
    localStorage.removeItem('jwt');
    history.push("/sign-in")
  }

  return (
    <div className="App">
      <CurrentUserContext.Provider value={currentUser}>

        <Switch>
          <ProtectedRoute exact path="/" loggedIn={loggedIn}>
            <>
              <Header
                logo={logoHeader}
                nameButton={'Выйти'}
                userEmail={userData.email}
                onClick={handleExit}
              />
              <Main
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            </>
          </ProtectedRoute>

          <Route path="/sign-up">
            <Header
              logo={logoHeader}
              nameButton={'Войти'}
              userEmail={''}
              onClick={() => history.push("/sign-in")}

            />
            <Register onRegister={handleRegistration} />
          </Route>

          <Route path="/sign-in">
            <Header
              logo={logoHeader}
              nameButton={'Регистрация'}
              userEmail={''}
              onClick={() => history.push("/sign-up")}
            />
            <Login onLogin={handleLogin} />
          </Route>
        </Switch>
        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <PopupWithForm
          title={'Вы уверены'}
          name={'confirm'}
          isOpen={false}
          onClose={closeAllPopups}
          textButton={'Да'} />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateavatar} />

        <ImagePopup
          selectedCard={selectedCard}
          onClose={closeAllPopups}
        />
        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          logo={tooltipContent.logo}
          text={tooltipContent.text}//{(loggedIn === true) ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}

        />

      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
