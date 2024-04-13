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



// Function to schedule a training session
function scheduleSession(event) {
    event.preventDefault();
    const sessionData = {
        // Gather the input values here
    };
    sendUpdateRequest('/api/scheduleSession', sessionData)
        .then(response => response.json())
        .then(data => alert('Session scheduled successfully!'))
        .catch(error => console.error('Error scheduling session:', error));
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
document.getElementById('scheduleForm').addEventListener('submit', scheduleSession);

// Load existing member data when the page loads
window.onload = loadMemberData;
