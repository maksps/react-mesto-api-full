class Api {
    constructor(config) {
        this._url = config.url;
        this._headers = config.headers;
    }

    _getResponseData(res) {
        if (!res.ok) {
            Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json()
    }

    getAllCards() {
        return fetch(`${this._url}cards`, {
            headers: {
                authorization:  `Bearer ${localStorage.getItem('jwt')}`,
                'content-type': 'application/json',
            }
        })
            .then((res) => {
                return this._getResponseData(res);
            });
    }

    getUserInfo() {
        return fetch(`${this._url}users/me`, {
            headers: {
                authorization:  `Bearer ${localStorage.getItem('jwt')}`,
                'content-type': 'application/json',
            },
        }).then((res) => {
            return this._getResponseData(res);
        });
    }

    editProfile(data) {
        return fetch(`${this._url}users/me`, {
            method: "PATCH",
            headers: {
                authorization:  `Bearer ${localStorage.getItem('jwt')}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then((res) => {
            return this._getResponseData(res);
        });
    }

    addCard(data) {
        return fetch(`${this._url}cards`, {
            method: "POST",
            headers: {
                authorization:  `Bearer ${localStorage.getItem('jwt')}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then((res) => {
            return this._getResponseData(res);
        });
    }

    deleteCard(id) {
        return fetch(`${this._url}${'cards/'}${id}`, {
            method: "DELETE",
            headers: {
                authorization:  `Bearer ${localStorage.getItem('jwt')}`,
                'content-type': 'application/json',
            },
        }).then((res) => {
            return this._getResponseData(res);
        });
    }

    changeLikeCardStatus(id, isLiked) {
        return fetch(`${this._url}${'cards/'}${id}/likes`, {
            method: isLiked ? "DELETE" : "PUT",
            headers: {
                authorization:  `Bearer ${localStorage.getItem('jwt')}`,
                'content-type': 'application/json',
            },
        }).then((res) => {
            return this._getResponseData(res);
        });
    }

    changeAvatar(data) {
        return fetch(`${this._url}users/me/avatar`, {
            method: "PATCH",
            headers: {
                authorization:  `Bearer ${localStorage.getItem('jwt')}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then((res) => {
            return this._getResponseData(res);
        });
    }
}

const api = new Api(
    {
        // url: 'api.maksps.nomoredomains.rocks',
        url: 'http://localhost:3000/',
        // headers: {
        //     authorization:  `Bearer ${localStorage.getItem('jwt')}`,
        //     'content-type': 'application/json',
        // },
    }
);

export default api;
