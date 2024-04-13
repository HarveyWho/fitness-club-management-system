// Function to load existing trainer data
function loadTrainerData(trainerId) {
    fetch('/api/getTrainerData', { method: 'GET' })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Set the values of the input fields with the trainer's current data
        document.getElementById('startTime').value = data.start_hour || '';
        document.getElementById('endTime').value = data.end_hour || '';
        // Set other trainer fields if necessary
        // ...
    })
    .catch(error => {
        console.error('Error fetching trainer data:', error);
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



// Function to update trainer availability
function updateTrainerAvailability(event) {
    event.preventDefault();
    const startHour = document.getElementById('startTime').value;
    const endHour = document.getElementById('endTime').value;

    // Debugging: Log the values being sent
    // console.log("Sending startHour:", startHour);
    // console.log("Sending endHour:", endHour);

    const availabilityData = {
        startHour: startHour + ":00", // Ensure time format HH:MM:SS
        endHour: endHour + ":00" // Ensure time format HH:MM:SS
    };

    sendUpdateRequest('/api/updateTrainerAvailability', availabilityData)
        .then(response => response.json())
        .then(data => alert('Trainer Availability updated successfully!'))
        .catch(error => console.error('Error updating trainer availability:', error));
}


// Add the function to window.onload event to make sure it is executed when the page is loaded
window.onload = function() {
    loadTrainerData();
};

// Add event listeners to update trainer schedule
document.getElementById('availabilityForm').addEventListener('submit', updateTrainerAvailability);

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
