document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Placeholder function to check credentials
    if (checkCredentials(email, password)) {
        const userType = email.split('@')[1]; // Assuming format like joe@member
        if (userType === 'member') {
            window.location.href = 'member.html';
        } else if (userType === 'trainer') {
            window.location.href = 'trainer.html';
        } else if (userType === 'admin') {
            window.location.href = 'admin.html';
        }
    } else {
        alert('Email or password does not match.');
    }
});

function checkCredentials(email, password) {
    // Placeholder for actual credential checking against a database
    return true; // For now, assume credentials are correct
}
