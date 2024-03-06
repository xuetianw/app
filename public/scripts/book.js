
export class Book {
    // Methods
    constructor(_book_name, _author, _recommending_user, _recommending_user_country, _publish_year, _description) {
        this._book_name = _book_name;
        this._author = _author;
        this._recommending_user = _recommending_user;
        this._recommending_user_country = _recommending_user_country;
        this._publish_year = _publish_year;
        this._description = _description;
    }

    get bookName() {
        return this._book_name;
    }

    get author() {
        return this._author;
    }

    get recommendingUser() {
        return this._recommending_user;
    }

    get recommendingUserCountry() {
        return this._recommending_user_country;
    }

    get releaseYear() {
        return this._publish_year;
    }

    get description() {
        return this._description;
    }
}