// Room booking management
document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const room = document.getElementById('room').value;
    const bookingTime = document.getElementById('bookingTime').value;
    console.log(`Booking room ${room} at ${bookingTime}`);
    // Handle room booking in backend
});

// Equipment maintenance reporting
document.getElementById('maintenanceForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const equipmentId = document.getElementById('equipmentId').value;
    console.log(`Reporting maintenance for equipment ID ${equipmentId}`);
    // Log maintenance in backend
});

// Class schedule updating
document.getElementById('scheduleUpdateForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const newSchedule = document.getElementById('newSchedule').value;
    console.log(`Updating class schedule to ${newSchedule}`);
    // Update schedule in backend
});

// Billing and payment processing
document.getElementById('billingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const memberId = document.getElementById('memberId').value;
    const amountDue = document.getElementById('amountDue').value;
    console.log(`Processing payment of $${amountDue} for member ID ${memberId}`);
    // Process payment in backend
});

function logout() {
    // Clear user session storage or any other cleanup needed
    sessionStorage.clear(); // or localStorage.clear();
    window.location.href = 'login.html'; // Redirect to login page
}
