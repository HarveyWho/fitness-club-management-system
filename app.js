const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const session = require('express-session');

const app = express();

var memberIdGlobal = 0;
var trainerIdGlobal = 0;
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
            req.session.trainerId = result.rows[0].trainer_id;
            memberIdGlobal = result.rows[0].member_id;
            trainerIdGlobal = result.rows[0].trainer_id;
            //console.log("Recorded trainerId:", result.rows[0].trainer_id) //debug

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
            // After successful login
            res.json({ 
                success: true, 
                redirect: redirectUrl, 
                memberId: result.rows[0].member_id // Add memberId to the response
            });
  
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

app.get('/api/getTrainerData', async (req, res) => {
    //const { trainerId } = req.query; // Assuming you pass the trainerId as a query parameter

    // Ensure the trainer is logged in and the session contains their trainerId
    if (req.session && trainerIdGlobal) {
        const trainerId = trainerIdGlobal;
        const query = `
            SELECT * FROM Trainer
            WHERE trainer_id = $1;
        `;

        try {
            const result = await client.query(query, [trainerId]);
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).send('Trainer data not found');
            }
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(401).send('Unauthorized access or session data not found');
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
  

  app.get('/api/getAvailableClasses', async (req, res) => {
    const query = 'SELECT * FROM Classes WHERE space_left > 0  ORDER BY day_of_the_week, start_time;;';
    try {
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching available classes:', error);
        res.status(500).json({ message: 'Internal server error while fetching classes.' });
    }
});


app.post('/api/joinClass', async (req, res) => {
    const { classId, memberId } = req.body;

    // Start transaction
    await client.query('BEGIN');

    try {
        // Check if the member is already enrolled in the class
        const checkEnrollmentQuery = 'SELECT 1 FROM Class_members WHERE class_id = $1 AND member_id = $2;';
        const checkEnrollmentResult = await client.query(checkEnrollmentQuery, [classId, memberId]);
        
        if (checkEnrollmentResult.rows.length > 0) {
            throw new Error('You are already enrolled in this class.');
        }

        // Get member details
        const memberQuery = 'SELECT first_name, last_name FROM Members WHERE member_id = $1;';
        const memberResult = await client.query(memberQuery, [memberId]);
        if (memberResult.rows.length === 0) {
            throw new Error('Member not found.');
        }

        const { first_name, last_name } = memberResult.rows[0];

        // Insert into Class_members table
        const insertQuery = `
            INSERT INTO Class_members (class_id, member_id, first_name, last_name)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        await client.query(insertQuery, [classId, memberId, first_name, last_name]);

         // Update space_left in the Classes table
         const updateSpaceQuery = `
         UPDATE Classes
         SET space_left = space_left - 1
         WHERE class_id = $1 AND space_left > 0
         RETURNING space_left;
        `;

        const updateSpaceResult = await client.query(updateSpaceQuery, [classId]);
            if (updateSpaceResult.rows.length === 0) {
                throw new Error('No space left in the class, or class does not exist.');
            }

        // Commit transaction
        await client.query('COMMIT');
        res.json({ message: 'Successfully joined class and updated space left.' });
        } catch (error) {
            await client.query('ROLLBACK');
        console.error('Error joining class:', error);
     res.status(500).json({ message: error.message });
 }
});

app.post('/api/cancelJoin', async (req, res) => {
    const { classId, memberId } = req.body;
    // Start transaction
    await client.query('BEGIN');
    try {
        // Check if the member is currently enrolled
        const checkEnrollmentQuery = `
            SELECT 1 FROM Class_members
            WHERE class_id = $1 AND member_id = $2;
        `;
        const checkResult = await client.query(checkEnrollmentQuery, [classId, memberId]);
        if (checkResult.rows.length === 0) {
            throw new Error('Member not enrolled in the class.');
        }

        // Remove the member from the class
        const deleteMemberQuery = `
            DELETE FROM Class_members
            WHERE class_id = $1 AND member_id = $2;
        `;
        await client.query(deleteMemberQuery, [classId, memberId]);

        // Increase space_left in the class
        const increaseSpaceQuery = `
            UPDATE Classes
            SET space_left = space_left + 1
            WHERE class_id = $1;
        `;
        await client.query(increaseSpaceQuery, [classId]);

        // Commit transaction
        await client.query('COMMIT');
        res.json({ message: 'Successfully cancelled class join and updated space left.' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error cancelling class join:', error);
        res.status(500).json({ message: error.message });
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



app.post('/api/updateTrainerAvailability', async (req, res) => {
    const { startHour, endHour } = req.body;
    const trainerId = trainerIdGlobal;
    // Ensure the trainer is logged in and the session contains their trainerId

    // Debugging: Log the received values
    // console.log("Received startHour:", startHour);
    // console.log("Received endHour:", endHour);
    
    const query = `
        UPDATE Trainer
        SET start_hour = $1, end_hour = $2
        WHERE trainer_id = $3
        RETURNING *;
    `;

    try {
        const result = await client.query(query, [startHour, endHour, trainerId]);
        if (result.rows.length > 0) {
            res.json({ 
                message: 'Trainer availability updated successfully.'  });
        } else {
            res.status(404).json({ message: 'Trainer not found.' });
        }
    } catch (error) {
        console.error('Error updating trainer availability:', error);
        res.status(500).json({ message: 'Error updating trainer availability.' });
    }
});



app.get('/api/getAllMembers', async (req, res) => {
    const trainerId = trainerIdGlobal; // Ensure this is set after the trainer logs in
    
    const query = `
        SELECT DISTINCT m.member_id, m.first_name, m.last_name, m.date_of_birth, c.description AS class_name
        FROM Members m
        INNER JOIN Class_members cm ON m.member_id = cm.member_id
        INNER JOIN Classes c ON cm.class_id = c.class_id
        WHERE c.trainer_id = $1
        ORDER BY c.description, m.last_name, m.first_name;
    `;

    try {
        const result = await client.query(query, [trainerId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching members and classes:', error);
        res.status(500).json({ message: 'Internal server error while fetching members and classes.' });
    }
});



app.get('/api/getMemberFitnessGoals', async (req, res) => {
    const { memberId } = req.query;
    
    const query = `
        SELECT * FROM Fitness_Goals
        WHERE member_id = $1;
    `;

    try {
        const result = await client.query(query, [memberId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Fitness goals not found for member.' });
        }
    } catch (error) {
        console.error('Error fetching member fitness goals:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/getMemberHealthStatistics', async (req, res) => {
    const { memberId } = req.query;
    
    const query = `
        SELECT * FROM Health_Statistics
        WHERE member_id = $1;
    `;

    try {
        const result = await client.query(query, [memberId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Health statistics not found for member.' });
        }
    } catch (error) {
        console.error('Error fetching member health statistics:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Route for admin to make a new class
app.post('/api/makeClass', async (req, res) => {
    const {
        description, space_left, start_time, end_time, trainer_id, room_id, day_of_the_week
    } = req.body;

    // Check trainer availability
    const checkAvailabilityQuery = `
        SELECT * FROM Trainer
        WHERE trainer_id = $1 AND start_hour <= $2 AND end_hour >= $3;
    `;

    try {
        // Ensure the trainer is available at the specified time
        const availabilityResult = await client.query(checkAvailabilityQuery, [trainer_id, start_time, end_time]);
        if (availabilityResult.rows.length === 0) {
            return res.status(400).json({ message: 'Trainer not available at the specified time.' });
        }

        // Ensure the trainer doesn't have another class at the same time
        const checkClassConflictQuery = `
            SELECT * FROM Classes
            WHERE trainer_id = $1 AND NOT (end_time <= $2 OR start_time >= $3);
        `;
        const classConflictResult = await client.query(checkClassConflictQuery, [trainer_id, start_time, end_time]);
        if (classConflictResult.rows.length > 0) {
            return res.status(400).json({ message: 'Trainer already has a class during the specified time.' });
        }

        // Insert new class into the database
        const insertClassQuery = `
            INSERT INTO Classes (description, space_left, start_time, end_time, trainer_id, room_id, day_of_the_week)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const result = await client.query(insertClassQuery, [description, space_left, start_time, end_time, trainer_id, room_id, day_of_the_week]);
        res.json({ message: 'Class created successfully.', class: result.rows[0] });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ message: 'Error creating class.' });
    }
});

// Route for admin to get a list of all classes
app.get('/api/getAllClasses', async (req, res) => {
    const query = 'SELECT * FROM Classes;';
    try {
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all classes:', error);
        res.status(500).json({ message: 'Internal server error while fetching all classes.' });
    }
});

// Route for admin to cancel a class
app.post('/api/cancelClass', async (req, res) => {
    const { class_id } = req.body;

    // Begin transaction
    await client.query('BEGIN');
    try {
        // First, delete any references to the class in the Class_members table
        const deleteMembersQuery = 'DELETE FROM Class_members WHERE class_id = $1;';
        await client.query(deleteMembersQuery, [class_id]);

        // Then, delete the class itself
        const deleteClassQuery = 'DELETE FROM Classes WHERE class_id = $1 RETURNING *;';
        const deleteResult = await client.query(deleteClassQuery, [class_id]);
        
        if (deleteResult.rowCount === 0) {
            throw new Error('Class not found or already cancelled.');
        }

        // Commit transaction
        await client.query('COMMIT');
        res.json({ message: 'Class cancelled successfully.', class: deleteResult.rows[0] });
    } catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        console.error('Error cancelling class:', error);
        res.status(500).json({ message: 'Error cancelling class.' });
    }
});




// Route to get all equipment
app.get('/api/getAllEquipment', async (req, res) => {
    try {
        const query = 'SELECT * FROM Equipment;';
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ message: 'Error fetching equipment data.' });
    }
});

// Route to update equipment status to 'Maintained'
app.post('/api/maintainEquipment', async (req, res) => {
    const { equipment_id } = req.body;
    try {
        const updateQuery = `
            UPDATE Equipment
            SET status = 'Maintained'
            WHERE equipment_id = $1
            RETURNING *;
        `;
        const result = await client.query(updateQuery, [equipment_id]);
        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Equipment status updated successfully.', equipment: result.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Equipment not found.' });
        }
    } catch (error) {
        console.error('Error updating equipment status:', error);
        res.status(500).json({ success: false, message: 'Error updating equipment status.' });
    }
});

// Route to get all rooms
app.get('/api/getAllRooms', async (req, res) => {
    try {
        const query = 'SELECT * FROM Room;';
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Error fetching room data.' });
    }
});


// Route to update room availability times
app.post('/api/updateRoomTimes', async (req, res) => {
    const { roomId, startHour, endHour } = req.body;

    const query = `
        UPDATE Room
        SET start_hour = $2, end_hour = $3
        WHERE room_id = $1
        RETURNING *;
    `;

    try {
        const result = await client.query(query, [roomId, startHour, endHour]);
        if (result.rowCount > 0) {
            res.json({ success: true, room: result.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Room not found.' });
        }
    } catch (error) {
        console.error('Error updating room times:', error);
        res.status(500).json({ success: false, message: 'Error updating room times.' });
    }
});


// Route to get all payments
app.get('/api/getAllPayments', async (req, res) => {
    try {
        const query = 'SELECT * FROM Payments;';
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Internal server error while fetching payments.' });
    }
});

// Route to simulate sending a bill to a member and updating the amount
app.post('/api/sendBill/:memberId', async (req, res) => {
    const { memberId } = req.params;
    const { amount } = req.body; // Amount received from the client

    // Update payment amount in the database
    try {
        const updateQuery = `
            UPDATE Payments
            SET amount = $1
            WHERE member_id = $2
            RETURNING *;
        `;
        const result = await client.query(updateQuery, [amount, memberId]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Payment record not found.' });
        } else {
            console.log(`Bill updated and sent to member ${memberId}`); // Simulate sending the bill
            res.json({ message: `Payment alert and update sent to member ID: ${memberId}` });
        }
    } catch (error) {
        console.error('Error updating payment amount:', error);
        res.status(500).json({ message: 'Error updating payment amount.' });
    }
});


// Route to get member's bill
app.get('/api/getMemberBill', async (req, res) => {
    // Assuming the member's ID is stored in session or another mechanism
    const memberId = memberIdGlobal; 
    try {
        const query = 'SELECT amount, payment_date FROM Payments WHERE member_id = $1;';
        const result = await client.query(query, [memberId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching member bill:', error);
        res.status(500).json({ message: 'Error fetching bill data.' });
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


// Route to process a payment
app.post('/api/payBill', async (req, res) => {
    const { amount } = req.body;
    const memberId = memberIdGlobal; 
    try {
        const updateQuery = `
            UPDATE Payments
            SET amount = amount - $1
            WHERE member_id = $2
            RETURNING amount;
        `;
        const result = await client.query(updateQuery, [amount, memberId]);
        if (result.rows.length > 0) {
            res.json({ message: 'Payment updated successfully.', newAmount: result.rows[0].amount });
        } else {
            res.status(404).json({ message: 'No bill found for the member.' });
        }
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ message: 'Error processing payment.' });
    }
});



// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
