document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        fitnessGoals: document.getElementById('fitnessGoals').value,
        healthMetrics: document.getElementById('healthMetrics').value
    };

    registerUser(userData);
});

function registerUser(userData) {
    // Placeholder for user registration logic to store data in a database
    console.log('Registering user:', userData);
    // Simulate successful registration
    alert('Registration successful!');
    window.location.href = 'login.html'; // Redirect to login after registration
}
