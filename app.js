const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const session = require('express-session');

const app = express();

var memberIdGlobal = 0;
// Configure session middleware
app.use(session({
  secret: 'your-secret-key', // You should use a real secret key here
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } // Set to true if using https
}));

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
            // Set the memberId in the session
            req.session.memberId = result.rows[0].member_id;
            memberIdGlobal = result.rows[0].member_id
            console.log("Recorded memberId:", result.rows[0].member_id) //debug

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

app.get('/api/getMemberData', async (req, res) => {
    // Ensure that the session middleware is configured correctly
    // console.log("req.session", req.session); //debug
    console.log("req.session.memberId:", req.session.memberId); //debug
    if (req.session && memberIdGlobal) {
        const memberId = memberIdGlobal;
        const query = `
            SELECT 
                m.*,
                f.weight_goal, f.heart_rate_goal, f.blood_pressure_goal, f.bmi_goal, f.duration_days,
                h.height, h.weight, h.heart_rate, h.blood_pressure, h.body_mass_index
            FROM 
                Members m
            LEFT JOIN 
                Fitness_Goals f ON m.member_id = f.member_id
            LEFT JOIN 
                Health_Statistics h ON m.member_id = h.member_id
            WHERE 
                m.member_id = $1;
        `;

        try {
            const result = await client.query(query, [memberId]);
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).send('Member data not found');
            }
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(401).send('Session data not found');
    }
});

// ... (other routes and middleware)

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
