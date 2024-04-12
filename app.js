const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();

// PostgreSQL client setup
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "micofat123",
    database: "FitnessDatabase"
});

client.connect();

// Serve static files from the public directory
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Redirect the base URL to the login page
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// API endpoint for handling login requests
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const domain = email.split('@')[1];

    if (!['member.com', 'trainer.com', 'staff.com'].includes(domain)) {
        return res.status(400).json({ message: 'Please use a valid email domain.' });
    }

    let tableName;
    switch (domain) {
        case 'member.com':
            tableName = 'Members';
            break;
        case 'trainer.com':
            tableName = 'Trainer';
            break;
        case 'staff.com':
            tableName = 'Administrative_Staff';
            break;
        default:
            return res.status(400).json({ message: 'Invalid email domain.' });
    }

    const query = `SELECT * FROM ${tableName} WHERE email = $1 AND password = $2`;

    try {
        const result = await client.query(query, [email, password]);
        if (result.rows.length > 0) {
            let redirectUrl;
            switch (domain) {
                case 'member.com':
                    redirectUrl = 'member.html';
                    break;
                case 'trainer.com':
                    redirectUrl = 'trainer.html';
                    break;
                case 'staff.com':
                    redirectUrl = 'admin.html';
                    break;
            }
            res.json({ success: true, redirect: redirectUrl });
        } else {
            res.status(401).json({ message: 'Invalid credentials.' });
        }
    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
