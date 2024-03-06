
export class UserController {
    // Attributes
    users = [];

    // Methods
    constructor() {
        this.users = JSON.parse(localStorage.userArray || '[]');
    }

    addUser(user) {
        this.users.push(user);
        localStorage.userArray = JSON.stringify(this.users);
    }

    getAllUsers() {
        const storedData = localStorage.getItem('userArray');

        if (storedData) {
            return JSON.parse(storedData);
        } else {
            console.error('No data found in localStorage.userArray');
            return null;
        }
    }
}