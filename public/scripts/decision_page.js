import {UserController} from "./user_controller.js"

/**
 This function dynamically inserts the name which corresponds
 to the account currently in use in the welcome element in the decision_page.html.
 **/
function insertDynamicName() {
    // Retrieve the welcome header element in decision_page.html.
    const welcome_element = document.querySelector("#decision_welcome_element");

    // Retrieve the username from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username').trim().replace(/\s+/g, ' ');

    const userController = new UserController();
    const users = userController.getAllUsers();
    let associatedName = "";

    // Find the associated name with the username.
    for (const user of users) {
        if (user._username === username) {
            associatedName = user._name;
        }
    }

    // Use the name to dynamically welcome the user.
    welcome_element.textContent = `Welcome ${associatedName}`;

    return username
}

/**
 This function only shows a message to the user that their recommended song or book
 has been successfully added to the storage, and that they can head to specified pages to see the lists
 of the recommended books and songs.
 **/
function addTheGeneralMessage() {
    const generalMessage = document.querySelector("#general-message");
    const urlParams = new URLSearchParams(window.location.search);

    // Check if songAdded and bookAdded parameters exist
    if (urlParams.has('songAdded') && urlParams.has('bookAdded')) {
        const songAdded = urlParams.get('songAdded').trim().replace(/\s+/g, ' ');
        const bookAdded = urlParams.get('bookAdded').trim().replace(/\s+/g, ' ');

        // The case where the user added a song.
        if (songAdded === "true") {
            generalMessage.innerHTML = "Your Recommended Song Has Been Successfully Added!<br>" +
                "Click On The See Recommended Songs Button For Display.";
        }

        // The case where the user added a book.
        else if (bookAdded === "true") {
            generalMessage.innerHTML = "Your Recommended Book Has Been Successfully Added!<br>" +
                "Click On The See Recommended Books Button For Display.";
        }

        // The case where the back button was hit.
        else {
            generalMessage.innerHTML = "";
        }
    }

    else {
        generalMessage.textContent = "";
    }
}

function addEventListenersForButtons(username) {
    const bookRecommendationButton = document.querySelector("#decision_book_recommendation");
    const songRecommendationButton = document.querySelector("#decision_song_recommendation");
    const bookDisplayButton = document.querySelector("#decision_book_display");
    const songDisplayButton = document.querySelector("#decision_song_display");
    let isSongRecommendation;
    let isSongDisplay;

    bookRecommendationButton.addEventListener("click", function() {
        isSongRecommendation = false;
        window.location.href = `book_recommendation.html?username=${encodeURIComponent(username)}
            &isSongRecommendation=${isSongRecommendation}`;
    });

    songRecommendationButton.addEventListener("click", function() {
        isSongRecommendation = true;
        window.location.href = `song_recommendation.html?username=${encodeURIComponent(username)}
            &isSongRecommendation=${isSongRecommendation}`;
    });

    bookDisplayButton.addEventListener("click", function() {
        isSongDisplay = false;
        window.location.href = `book_display.html?username=${encodeURIComponent(username)}
            &isSongDisplay=${isSongDisplay}`;
    });

    songDisplayButton.addEventListener("click", function() {
        isSongDisplay = true;
        window.location.href = `song_display.html?username=${encodeURIComponent(username)}
            &isSongDisplay=${isSongDisplay}`;
    });
}

window.onload = function() {
    const username = insertDynamicName();
    addTheGeneralMessage();
    addEventListenersForButtons(username);
}