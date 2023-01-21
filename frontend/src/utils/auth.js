class Auth {
    constructor(url) {
        this._url = url;
    }

    _getResponseData(res) {
        if (!res.ok) {
            Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json()
    }

    signUp({ password, email }) {
        return fetch(`${this._url}signup`, {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ password, email })
        }).then((res) => {
            return this._getResponseData(res);
        });
    };

    signIn({ password, email }) {
        return fetch(`${this._url}signin`, {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ password, email })
        }).then((res) => {
            return this._getResponseData(res);
        });
    };

    checkToken(token) {
        return fetch(`${this._url}users/me`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        }).then((res) => {
            return this._getResponseData(res);
        });
    };

}

const auth = new Auth(
    'http://api.maksps.nomoredomains.rocks/',
    //  'http://localhost:3000/',
);

export default auth;