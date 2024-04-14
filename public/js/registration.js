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
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            window.location.href = 'login.html'; // Redirect to login after successful registration
        } else {
            // If success is not true, or if success is undefined, stay on the page and alert the user
            alert(data.message || 'Registration failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Registration failed:', error);
        alert('Registration failed due to a server error. Please try again.');
        // Optionally, handle any cleanup or UI changes needed to indicate an error occurred
    });
    
}
