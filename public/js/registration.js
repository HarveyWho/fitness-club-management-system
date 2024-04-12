document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userData = {
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

    registerUser(userData);
});

function registerUser(userData) {
    fetch('/api/register', { // the URL to your server-side registration endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Registration successful!');
        window.location.href = 'login.html'; // Redirect to login after registration
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Registration failed: ' + error.message);
    });
}
