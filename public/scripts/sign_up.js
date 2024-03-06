import {User} from "./user.js";
import {UserController} from "./user_controller.js"

// Event listener for the eye icon next to the password field.
function createEventListenersEye() {

    // Getting the element ids from the DOM.
    const passwordInput = document.querySelector("#password")
    const eye = document.querySelector("#eye")

    // While the user is inserting a password display the eye icon.
    passwordInput.addEventListener("focus", function() {
        eye.style.display = 'inline'
    })

    // When the user is no longer interacting with the user hide the eye icon.
    passwordInput.addEventListener("blur", function() {
        if (passwordInput.value === '') {
            eye.style.display = 'none'
        }
    })

    // https://medium.com/@miguelznunez/html-css-javascript-how-to-show-hide-password-using-the-eye-icon-27f033bf84ad
    eye.addEventListener("click", function(){
        this.classList.toggle("fa-eye-slash")
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
        passwordInput.setAttribute("type", type)
    })
}

function  createEventListenersSignupButton() {
    const signupForm = document.querySelector("#signup_form")
    const signupButton = document.querySelector("#signup_button")
    const name = document.querySelector("#name-signup")
    const lastName = document.querySelector('#lastname-signup')
    const email = document.querySelector('#email-signup')
    const country = document.querySelector('#country')
    const username = document.querySelector('#username')
    const password = document.querySelector('#password')
    const nameErrorMessage = document.querySelector('#name-error')
    const lastNameErrorMessage = document.querySelector('#lastname-error')
    const emailErrorMessage = document.querySelector('#email-error')
    const usernameErrorMessage = document.querySelector('#username-error')
    const passwordErrorMessage = document.querySelector('#password-error')
    const generalErrorMessage = document.querySelector('#general-error')

    // Create an instance of the userController to add and retrieve previously added users.
    const userController = new UserController()

    // Add event listeners for the back and sign up buttons.
    signupForm.addEventListener("submit", function(event){
        event.preventDefault()
    })

    signupButton.addEventListener("click", handleSignupClick)

    function handleSignupClick(event) {
        event.preventDefault();

        const fields = [
            { element: name, errorMessage: nameErrorMessage, label: "First Name" },
            { element: lastName, errorMessage: lastNameErrorMessage, label: "Last Name" },
            { element: email, errorMessage: emailErrorMessage, label: "Email" },
            { element: username, errorMessage: usernameErrorMessage, label: "Username" },
            { element: password, errorMessage: passwordErrorMessage, label: "Password" }
        ];

        let isInputsValid = true;

        // Check if the required fields are not empty.
        for (const field of fields) {
            if (field.element.value === '') {
                field.errorMessage.textContent = `${field.label} Is Required.`;
                isInputsValid = false;
            } else {
                field.errorMessage.textContent = '';
            }
        }

        // Retrieve the user list from the userController.
        const users = userController.getAllUsers()

        if (isInputsValid) {
            // To handle the first user that is signing up.
            if (users !== null) {
                // Check if the provided username is not already taken, or if the user already has an account.
                for (const user of users) {
                    if (user._email === email.value && email.value !== '') {
                        generalErrorMessage.textContent = "You already have an account!"
                        isInputsValid = false;
                        break;
                    } else {
                        generalErrorMessage.textContent = ''
                    }

                    if (user._username === username.value && username.value !== '') {
                        generalErrorMessage.textContent = "The username is in use! Please enter another one."
                        isInputsValid = false;
                        break;
                    } else {
                        generalErrorMessage.textContent = ''
                    }
                }
            }
        }

        // If the inputs pass the validation, add the user to the user list maintained by UserController.
        if (isInputsValid && users !== null) {
            const newUser =
                new User(name.value, lastName.value, email.value, country.value, username.value, password.value)

            // Add the user.
            userController.addUser(newUser);

            // Redirect the user to the decision_page.html with username as a query parameter.
            window.location.href = `decision_page.html?username=${encodeURIComponent(username.value)}`;
        }

        // The case of the first user signing up.
        if (isInputsValid && users === null) {
            const newUser =
                new User(name.value, lastName.value, email.value, country.value, username.value, password.value)

            // Add the user.
            userController.addUser(newUser);

            // Redirect the user to the decision_page.html with username as a query parameter.
            window.location.href = `decision_page.html?username=${encodeURIComponent(username.value)}`;
        }
    }
}

window.onload = function() {
    createEventListenersEye()
    createEventListenersSignupButton()
}
