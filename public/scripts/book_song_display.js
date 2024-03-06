import {SongController} from "./song_controller.js";
import {BookController} from "./book_controller.js";

function setEventListenerBackButtons (username, buttonID) {

    buttonID.addEventListener('click', function() {
        window.location.href = `decision_page.html?username=${encodeURIComponent(username)}`
    });
}

function deleteTableRows(tableToBeDeleted) {
    if (tableToBeDeleted.rows.length > 0) {
        while (tableToBeDeleted.rows.length > 0) {
            tableToBeDeleted.deleteRow(0);
        }
    }
}

export default function displaySongsBooks(clickedCountry) {
    // Determine if the user clicked on the book or song display button.
    const urlParams = new URLSearchParams(window.location.search);
    const isSongDisplayStr = urlParams.get('isSongDisplay');

    // Get the table ids.
    const bookTable = document.querySelector("#dynamic_table_books");
    const songTable = document.querySelector("#dynamic_table_songs");

    if (isSongDisplayStr === "true") {
        // First delete all the rows that were the result of previous right clicks on other countries.
        deleteTableRows(songTable);

        // Get all the songs.
        const songController = new SongController();
        const songList = songController.getAllSongs();

        // Populate the table with the songs corresponding to the country that was clicked.
        for (const song of songList) {
            if (song._recommending_user_country.toLowerCase() === clickedCountry.toLowerCase()) {
                // Create a new row in the table.
                const newRow = document.createElement("tr");

                const songNameCell = document.createElement("td");
                let cellContent = `Song Name: ${song._song_name} <br>
                      Artist Name: ${song._artist} <br>
                      Recommended By: ${song._recommending_user} <br>
                      Country Of The Recommending User: ${song._recommending_user_country}`;

                // Add the year of release and the description if the user provided them.
                if (song._release_year !== null) {
                    cellContent += `<br> Year Of Release: ${song._release_year}`;
                }

                if (song._description !== null) {
                    cellContent += `<br> Description: ${song._description}`;
                }

                songNameCell.innerHTML = cellContent;
                newRow.appendChild(songNameCell);
                songTable.appendChild(newRow);

                // Make the table visible.
                songTable.style.display = "table";
            }

            // The case where the country clicked was United States.
            if (song._recommending_user_country.toLowerCase() === "usa"
                && clickedCountry.toLowerCase() === "united states of america") {
                // Create a new row in the table.
                const newRow = document.createElement("tr");

                const songNameCell = document.createElement("td");
                let cellContent = `Song Name: ${song._song_name} <br>
                      Artist Name: ${song._artist} <br>
                      Recommended By: ${song._recommending_user} <br>
                      Country Of The Recommending User: ${song._recommending_user_country}`;

                // Add the year of release and the description if the user provided them.
                if (song._release_year !== null) {
                    cellContent += `<br> Year Of Release: ${song._release_year}`;
                }

                if (song._description !== null) {
                    cellContent += `<br> Description: ${song._description}`;
                }

                songNameCell.innerHTML = cellContent;
                newRow.appendChild(songNameCell);
                songTable.appendChild(newRow);

                songTable.style.display = "table";
            }
        }
    }

    else {
        deleteTableRows(bookTable);

        // Get all the books.
        const bookController = new BookController();
        const bookList = bookController.getAllBooks();

        // Populate the table with the books corresponding to the country that was clicked.
        for (const book of bookList) {
            if (book._recommending_user_country.toLowerCase() === clickedCountry.toLowerCase()) {
                // Create a new row in the table.
                const newRow = document.createElement("tr");

                const bookNameCell = document.createElement("td");
                let cellContent = `Book Name: ${book._book_name} <br>
                      Book Name: ${book._author} <br>
                      Recommended By: ${book._recommending_user} <br>
                      Country Of The Recommending User: ${book._recommending_user_country}`;

                // Add the year of release and the description if the user provided them.
                if (book._publish_year !== null) {
                    cellContent += `<br> Year Of Publish: ${book._publish_year}`;
                }

                if (book._description !== null) {
                    cellContent += `<br> Description: ${book._description}`;
                }

                bookNameCell.innerHTML = cellContent;
                newRow.appendChild(bookNameCell);
                bookTable.appendChild(newRow);

                bookTable.style.display = "table";
            }

            // The case of United of States.
            if (book._recommending_user_country.toLowerCase() === "usa"
                && clickedCountry.toLowerCase() === "united states of america") {
                // Create a new row in the table.
                const newRow = document.createElement("tr");

                const bookNameCell = document.createElement("td");
                let cellContent = `Book Name: ${book._book_name} <br>
                      Author Name: ${book._author} <br>
                      Recommended By: ${book._recommending_user} <br>
                      Country Of The Recommending User: ${book._recommending_user_country}`;

                // Add the year of release and the description if the user provided them.
                if (book._publish_year !== null) {
                    cellContent += `<br> Year Of Publish: ${book._publish_year}`;
                }

                if (book._description !== null) {
                    cellContent += `<br> Description: ${book._description}`;
                }

                bookNameCell.innerHTML = cellContent;
                newRow.appendChild(bookNameCell);
                bookTable.appendChild(newRow);

                songTable.style.display = "table";
            }
        }
    }
}

window.onload = function() {
    // Get the username of the user
    const urlParams = new URLSearchParams(window.location.search);
    const isSongDisplayStr = urlParams.get('isSongDisplay');
    const username = urlParams.get('username');

    // Set an event listener for the back buttons.
    if (isSongDisplayStr === "true") {
        const songBackButton = document.querySelector('#song_display_back');
        setEventListenerBackButtons(username, songBackButton);
    }

    else {
        const bookBackButton = document.querySelector('#book_display_back');
        setEventListenerBackButtons(username, bookBackButton);
    }
}

