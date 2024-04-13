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

// Event listener for updating profile
document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Implement form submission logic to update the profile
});

// Event listener for updating health statistics
document.getElementById('healthStatsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Implement form submission logic to update health statistics
});

// Event listener for updating fitness goals
document.getElementById('fitnessGoalsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Implement form submission logic to update fitness goals
});

// Event listener for scheduling a session
document.getElementById('scheduleForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Implement form submission logic to schedule a session
});

// Logout function
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// Load existing member data when the page loads
window.onload = function() {
    loadMemberData();
};
