
export class User {
    // Methods
    constructor(_name, _last_name, _email, _country, _username, _password) {
        this._name = _name;
        this._last_name = _last_name;
        this._email = _email;
        this._country = _country;
        this._username = _username;
        this._password = _password;
    }
    get name() {
        return this._name;
    }

    get last_name() {
        return this._last_name;
    }

    get email() {
        return this._email;
    }

    get country() {
        return this._country;
    }

    get username() {
        return this._username;
    }

    get password() {
        return this._password;
    }
}