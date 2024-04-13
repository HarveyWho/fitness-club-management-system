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
            //console.log("Recorded memberId:", result.rows[0].member_id) //debug

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
    // console.log("req.session.memberId:", req.session.memberId); //debug
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

// Route to update the member's profile
app.post('/api/updateProfile', async (req, res) => {
    const { firstName, lastName, email, password, address, phoneNumber, dateOfBirth, gender, exerciseRoutines } = req.body;
    // Make sure to verify that the member ID matches the session member ID (for security)
    const query = `
      UPDATE Members
      SET first_name = $1,
          last_name = $2,
          email = $3,
          password = $4,
          address = $5,
          phone_number = $6,
          date_of_birth = $7,
          gender = $8,
          exercise_routines = $9
      WHERE member_id = $10
      RETURNING *;
    `;
  
    try {
      const result = await client.query(query, [firstName, lastName, email, password, address, phoneNumber, dateOfBirth, gender, exerciseRoutines, memberIdGlobal]);
      if (result.rows.length > 0) {
        res.json({ message: 'Profile updated successfully.' });
      } else {
        res.status(404).json({ message: 'Member not found.' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Error updating profile.' });
    }
  });

// Route to update the member's health statistics
app.post('/api/updateHealthStats', async (req, res) => {
    const { height, weight, heartRate, bloodPressure, bodyMassIndex } = req.body;
    const memberId = memberIdGlobal; // Replace with req.session.memberId once session management is fixed
  
    const updateHealthStatsQuery = `
      UPDATE Health_Statistics
      SET height = $1,
          weight = $2,
          heart_rate = $3,
          blood_pressure = $4,
          body_mass_index = $5
      WHERE member_id = $6
      RETURNING *;
    `;
  
    try {
      const result = await client.query(updateHealthStatsQuery, [height, weight, heartRate, bloodPressure, bodyMassIndex, memberId]);
      if (result.rows.length > 0) {
        res.json({ message: 'Health statistics updated successfully.' });
      } else {
        res.status(404).json({ message: 'Health statistics not found for member.' });
      }
    } catch (error) {
      console.error('Error updating health statistics:', error);
      res.status(500).json({ message: 'Error updating health statistics.' });
    }
  });
  
  // Route to update the member's fitness goals
  app.post('/api/updateFitnessGoals', async (req, res) => {
    const { weightGoal, heartRateGoal, bloodPressureGoal, bmiGoal, durationDays } = req.body;
    const memberId = memberIdGlobal; // Replace with req.session.memberId once session management is fixed
  
    const updateFitnessGoalsQuery = `
      UPDATE Fitness_Goals
      SET weight_goal = $1,
          heart_rate_goal = $2,
          blood_pressure_goal = $3,
          bmi_goal = $4,
          duration_days = $5
      WHERE member_id = $6
      RETURNING *;
    `;
  
    try {
      const result = await client.query(updateFitnessGoalsQuery, [weightGoal, heartRateGoal, bloodPressureGoal, bmiGoal, durationDays, memberId]);
      if (result.rows.length > 0) {
        res.json({ message: 'Fitness goals updated successfully.' });
      } else {
        res.status(404).json({ message: 'Fitness goals not found for member.' });
      }
    } catch (error) {
      console.error('Error updating fitness goals:', error);
      res.status(500).json({ message: 'Error updating fitness goals.' });
    }
  });
  


// Route to schedule a new training session
app.post('/api/scheduleSession', async (req, res) => {
    // Implement logic for scheduling a new session
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
