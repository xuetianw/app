const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'))

// Define a route to serve the "index.html" file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/pages/index.html');
});

// Redirect requests for "/index.html" to the root path "/"
app.get('/index.html', (req, res) => {
    res.redirect('/');
});

// Define a route to serve the "sign_up.html" file
app.get('/sign_up.html', (req, res) => {
    res.sendFile(__dirname + '/public/pages/sign_up.html');
});

// Define a route to serve the "log_in.html" file
app.get('/log_in.html', (req, res) => {
    res.sendFile(__dirname + '/public/pages/log_in.html');
});

// Define a route to serve the "decision_page.html" file
app.get('/decision_page.html', (req, res) => {
    res.sendFile(__dirname + '/public/pages/decision_page.html');
});

// Define a route to serve the "book_recommendation.html" file
app.get('/book_recommendation.html', (req, res) => {
    res.sendFile(__dirname + '/public/pages/book_recommendation.html');
});

// Define a route to serve the "song_recommendation.html" file
app.get('/song_recommendation.html', (req, res) => {
    res.sendFile(__dirname + '/public/pages/song_recommendation.html');
});

// Define a route to serve the "book_display.html" file
app.get('/book_display.html', (req, res) => {
    res.sendFile(__dirname + '/public/pages/book_display.html');
});

// Define a route to serve the "song_display.html" file
app.get('/song_display.html', (req, res) => {
    res.sendFile(__dirname + '/public/pages/song_display.html');
});

// app.get('scripts/book_song_display.js', (req, res) => {
//     res.set('Content-Type', 'application/javascript');
//     res.sendFile(__dirname + '/public/scripts/book_song_display.js');
// });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});