// Set availability
document.getElementById('availabilityForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    console.log(`Setting availability from ${startTime} to ${endTime}`);
    // Update availability in backend
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
    // Clear user session storage or any other cleanup needed
    sessionStorage.clear(); // or localStorage.clear();
    window.location.href = 'login.html'; // Redirect to login page
}
