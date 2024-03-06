
export class BookController {
    // Attributes
    books = [];

    // Methods
    constructor() {
        this.books = JSON.parse(localStorage.booksArray || '[]');
    }

    addBook(book) {
        this.books.push(book);
        localStorage.booksArray = JSON.stringify(this.books);
    }

    getAllBooks() {
        return JSON.parse(localStorage.booksArray);
    }
}