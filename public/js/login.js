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
            // Check if it's a member or a trainer by looking at the redirect URL or a specific property in the response
            if (data.redirect.includes('member')) {
                sessionStorage.setItem('memberId', data.memberId);
            } else if (data.redirect.includes('trainer')) {
                sessionStorage.setItem('trainerId', data.trainerId);
            }
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
