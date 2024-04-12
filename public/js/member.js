document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    console.log(`Registering ${name} with email ${email}`);
});

document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const updatedData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        goals: document.getElementById('fitnessGoals').value,
        metrics: document.getElementById('healthMetrics').value
    };
    console.log('Updating profile:', updatedData);
});

document.getElementById('scheduleForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const sessionTime = document.getElementById('sessionTime').value;
    console.log(`Scheduling session at ${sessionTime}`);
    // Simulate trainer availability check and schedule
});

// Utility function to check trainer availability
function checkTrainerAvailability(time) {
    return true; // Placeholder for actual backend call
}

// Populate dashboard on page load
window.onload = function displayDashboard() {
    // Mock data - replace with actual data retrieval from backend
    document.getElementById('exerciseRoutines').textContent = 'Yoga, Cardio, Strength Training';
    document.getElementById('fitnessAchievements').textContent = 'Completed 100 Yoga Sessions';
    document.getElementById('healthStatistics').textContent = 'Heart Rate: 60 bpm, Calories: 500/day';
};

function logout() {
    // Clear user session storage or any other cleanup needed
    sessionStorage.clear(); // or localStorage.clear();
    window.location.href = 'login.html'; // Redirect to login page
}
