// Function to update trainer availability
document.getElementById('availabilityForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    // Retrieve the trainerId from sessionStorage
    const trainerId = sessionStorage.getItem('trainerId');
    if (!trainerId) {
        alert('Not logged in or session has expired');
        // Redirect to login page or handle accordingly
        window.location.href = 'login.html';
        return;
    }

// Now you can use trainerId in your fetch request or any other logic

    // Send the updated availability to the server
    fetch('/api/updateTrainerAvailability', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainerId, startTime, endTime })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update availability.');
        }
        return response.json();
    })
    .then(data => {
        alert('Availability updated successfully!');
        // Optionally, you might want to update the UI or perform other actions here
    })
    .catch(error => {
        console.error('Error updating availability:', error);
        alert(error.message);
    });
});

// View member profile
document.getElementById('profileSearchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const memberName = document.getElementById('memberName').value;
    // Fetch member data from backend
    console.log(`Searching for member profile: ${memberName}`);
    // Displaying fetched data
    document.getElementById('memberProfileResult').textContent = `Profile data for ${memberName}`;
});

function logout() {
    sessionStorage.removeItem('trainerId'); // Remove trainerId from sessionStorage
    sessionStorage.clear(); // Or clear the entire session if that's appropriate for your app
    window.location.href = 'login.html'; // Redirect to login page
}
