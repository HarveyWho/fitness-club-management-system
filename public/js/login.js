// Example: login.js for browser
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store the memberId in sessionStorage
            sessionStorage.setItem('memberId', data.memberId);
            window.location.href = data.redirect;
        } else {
            alert(data.message);
        }
    })
    
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to authenticate. Please try again later.');
    });
});
