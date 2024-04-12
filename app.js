const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the public directory
app.use(express.static('public'));

// Redirect the base URL to the login page
app.get('/', (req, res) => {
    res.redirect('/login.html');  // Ensure that 'login.html' is correctly placed in the 'public' directory
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
