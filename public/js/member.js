// Function to load existing member data
function loadMemberData() {
    fetch('/api/getMemberData', { method: 'GET' })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Set the values of the input fields with the member's current data
        document.getElementById('firstName').value = data.first_name || '';
        document.getElementById('lastName').value = data.last_name || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('address').value = data.address || '';
        document.getElementById('phoneNumber').value = data.phone_number || '';
        document.getElementById('dateOfBirth').value = data.date_of_birth || '';
        document.getElementById('gender').value = data.gender || 'Select Gender';
        document.getElementById('exerciseRoutines').value = data.exercise_routines || '';

        // Populate health statistics
        document.getElementById('height').value = data.height || '';
        document.getElementById('weight').value = data.weight || '';
        document.getElementById('heartRate').value = data.heart_rate || '';
        document.getElementById('bloodPressure').value = data.blood_pressure || '';
        document.getElementById('bodyMassIndex').value = data.body_mass_index || '';

        // Populate fitness goals
        document.getElementById('weightGoal').value = data.weight_goal || '';
        document.getElementById('heartRateGoal').value = data.heart_rate_goal || '';
        document.getElementById('bloodPressureGoal').value = data.blood_pressure_goal || '';
        document.getElementById('bmiGoal').value = data.bmi_goal || '';
        document.getElementById('durationDays').value = data.duration_days || '';
    })
    .catch(error => {
        console.error('Error fetching member data:', error);
    });
}


// Existing functions...

// Function to load available classes and create the list with join/cancel buttons
function loadAvailableClasses() {
    fetch('/api/getAvailableClasses', { method: 'GET' })
    .then(response => response.json())
    .then(classes => {
        const classesContainer = document.getElementById('classesContainer');
        classesContainer.innerHTML = ''; // Clear the list

        classes.forEach(classItem => {
            const classElement = document.createElement('div');
            classElement.className = 'class-item';
            classElement.innerHTML = `
                <h3>${classItem.description} (${classItem.day_of_the_week})</h3>
                <p>Start Time: ${classItem.start_time}</p>
                <p>End Time: ${classItem.end_time}</p>
                <p>Trainer ID: ${classItem.trainer_id}</p>
                <p>Room ID: ${classItem.room_id}</p>
                <p>Spaces Left: ${classItem.space_left}</p>
                <button onclick="joinClass(${classItem.class_id})">Join Class</button>
                <button id="cancel-${classItem.class_id}" class="cancel-btn">Cancel Join</button>
            `;
            classesContainer.appendChild(classElement);

            // Event listener for the cancel join button
            let cancelBtn = document.getElementById(`cancel-${classItem.class_id}`);
            cancelBtn.addEventListener('click', function() {
                cancelJoin(classItem.class_id);
            });
        });
    })
    .catch(error => console.error('Error loading classes:', error));
}


// Function to handle joining a class
function joinClass(classId) {
    const memberId = sessionStorage.getItem('memberId'); // Retrieve from sessionStorage
    fetch('/api/joinClass', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId, memberId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Member already enrolled.');
        }
        return response.json();
    })
    .then(data => {
        alert('Successfully joined class!');
        loadAvailableClasses(); // Refresh the class list
    })
    .catch(error => {
        console.error('Error joining class:', error);
        alert(error.message);
    });
}

// Function to handle canceling a class join
function cancelJoin(classId) {
    const memberId = sessionStorage.getItem('memberId'); // Retrieve from sessionStorage
    if (!memberId) {
        alert('You are not logged in.');
        return;
    }

    fetch('/api/cancelJoin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId, memberId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Member did not join in the first place, failed to cancel.');
        }
        return response.json();
    })
    .then(data => {
        alert('Successfully canceled class join!');
        loadAvailableClasses(); // Refresh the class list
    })
    .catch(error => {
        console.error('Error canceling class join:', error);
        alert(error.message);
    });
}


// Existing window.onload function...



// Helper function to send update requests
function sendUpdateRequest(url, data) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}



// Function to update the member profile
function updateProfile(event) {
    event.preventDefault();
    const profileData = {
        // Gather the input values here
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        address: document.getElementById('address').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        exerciseRoutines: document.getElementById('exerciseRoutines').value
    };
    sendUpdateRequest('/api/updateProfile', profileData)
        .then(response => response.json())
        .then(data => alert('Profile updated successfully!'))
        .catch(error => console.error('Error updating profile:', error));
}



// Function to update health statistics
function updateHealthStats(event) {
    event.preventDefault();
    const healthData = {
        // Gather the input values here
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        heartRate: document.getElementById('heartRate').value,
        bloodPressure: document.getElementById('bloodPressure').value,
        bodyMassIndex: document.getElementById('bodyMassIndex').value
    };
    sendUpdateRequest('/api/updateHealthStats', healthData)
        .then(response => response.json())
        .then(data => alert('Health statistics updated successfully!'))
        .catch(error => console.error('Error updating health statistics:', error));
}



// Function to update fitness goals
function updateFitnessGoals(event) {
    event.preventDefault();
    const goalsData = {
        // Gather the input values here
        weightGoal: document.getElementById('weightGoal').value,
        heartRateGoal: document.getElementById('heartRateGoal').value,
        bloodPressureGoal: document.getElementById('bloodPressureGoal').value,
        bmiGoal: document.getElementById('bmiGoal').value,
        durationDays: document.getElementById('durationDays').value
    };
    sendUpdateRequest('/api/updateFitnessGoals', goalsData)
        .then(response => response.json())
        .then(data => alert('Fitness goals updated successfully!'))
        .catch(error => console.error('Error updating fitness goals:', error));
}



// Function to handle logout
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}



// Add event listeners to forms
document.getElementById('profileForm').addEventListener('submit', updateProfile);
document.getElementById('healthStatsForm').addEventListener('submit', updateHealthStats);
document.getElementById('fitnessGoalsForm').addEventListener('submit', updateFitnessGoals);

window.onload = function() {
    loadMemberData();
    loadAvailableClasses(); // Also load available classes
};
