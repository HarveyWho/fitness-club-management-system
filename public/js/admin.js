// Add the new class creation function
function makeClass(event) {
    event.preventDefault();
    // Gather form data
    const formData = {
        description: document.getElementById('classDescription').value,
        space_left: parseInt(document.getElementById('classSpaceLeft').value, 10),
        start_time: document.getElementById('classStartTime').value + ":00",
        end_time: document.getElementById('classEndTime').value + ":00",
        trainer_id: parseInt(document.getElementById('classTrainerId').value, 10),
        room_id: parseInt(document.getElementById('classRoomId').value, 10),
        day_of_the_week: document.getElementById('classDayOfWeek').value
    };

    sendUpdateRequest('/api/makeClass', formData)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Class created successfully!');
            loadClassList(); // Reload the list of classes
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error making class:', error));
}

// Load the list of all classes
function loadClassList() {
    fetch('/api/getAllClasses', { method: 'GET' })
    .then(response => response.json())
    .then(classes => {
        const classListContainer = document.getElementById('classListContainer');
        classListContainer.innerHTML = ''; // Clear the list
        classes.forEach(classInfo => {
            const classElement = document.createElement('div');
            classElement.className = 'class-item';
            // Add class details here
            classElement.innerHTML = `
                <p>${classInfo.description} - ${classInfo.day_of_the_week}</p>
                <p>Start Time: ${classInfo.start_time}</p>
                <p>End Time: ${classInfo.end_time}</p>
                <p>Trainer ID: ${classInfo.trainer_id}</p>
                <p>Room ID: ${classInfo.room_id}</p>
                <p>Spaces Left: ${classInfo.space_left}</p>
                <button onclick="cancelClass(${classInfo.class_id})">Cancel Class</button>
            `;
            classListContainer.appendChild(classElement);
        });
    })
    .catch(error => console.error('Error loading classes:', error));
}

// Cancel a class
function cancelClass(classId) {
    sendUpdateRequest('/api/cancelClass', { class_id: classId })
    .then(response => response.json())
    .then(data => {
        if(data.message) {
            alert(data.message);
        } else {
            alert('Class cancelled successfully!');
        }
        loadClassList(); // Reload the list of classes
    })
    .catch(error => console.error('Error cancelling class:', error));
}


// Load the list of all classes
function loadClassList() {
    fetch('/api/getAllClasses', { method: 'GET' })
    .then(response => response.json())
    .then(classes => {
        const classListContainer = document.getElementById('classListContainer');
        classListContainer.innerHTML = ''; // Clear the list
        classes.forEach(classInfo => {
            const classElement = document.createElement('div');
            classElement.className = 'class-item';
            // Add class details here
            classElement.innerHTML = `
                <p>${classInfo.description} - ${classInfo.day_of_the_week}</p>
                <p>Start Time: ${classInfo.start_time}</p>
                <p>End Time: ${classInfo.end_time}</p>
                <p>Trainer ID: ${classInfo.trainer_id}</p>
                <p>Room ID: ${classInfo.room_id}</p>
                <p>Spaces Left: ${classInfo.space_left}</p>
                <button onclick="cancelClass(${classInfo.class_id})">Cancel Class</button>
            `;
            classListContainer.appendChild(classElement);
        });
    })
    .catch(error => console.error('Error loading classes:', error));
}





// Function to load the list of all equipment
function loadEquipmentList() {
    fetch('/api/getAllEquipment', { method: 'GET' })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(equipments => {
        const equipmentListContainer = document.getElementById('equipmentListContainer');
        equipmentListContainer.innerHTML = ''; // Clear the list

        equipments.forEach(equipment => {
            // Create a new div for each piece of equipment
            const equipmentElement = document.createElement('div');
            equipmentElement.className = 'equipment-item';
            equipmentElement.innerHTML = `
                <span>ID: ${equipment.equipment_id} - Name: ${equipment.name} - Status: ${equipment.status}</span>
                <button onclick="maintainEquipment(${equipment.equipment_id})">Maintain</button>
            `;
            equipmentListContainer.appendChild(equipmentElement);
        });
    })
    .catch(error => {
        console.error('Error loading equipment list:', error);
    });
}

// Function to update an equipment's status to 'Maintained'
function maintainEquipment(equipmentId) {
    sendUpdateRequest('/api/maintainEquipment', { equipment_id: equipmentId })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Equipment maintained successfully!');
            loadEquipmentList(); // Reload the list of equipment
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error maintaining equipment:', error));
}

// Function to load the list of all rooms
function loadRoomList() {
    fetch('/api/getAllRooms', { method: 'GET' })
    .then(response => response.json())
    .then(rooms => {
        const roomListContainer = document.getElementById('roomListContainer');
        roomListContainer.innerHTML = ''; // Clear the list

        rooms.forEach(room => {
            const roomElement = document.createElement('div');
            roomElement.className = 'room-item';
            roomElement.innerHTML = `
                <span>Room ID: ${room.room_id} - Name: ${room.room_name} - Max Space: ${room.max_space}</span>
                <input type="time" id="roomStart-${room.room_id}" value="${room.start_hour.slice(0,5)}">
                <input type="time" id="roomEnd-${room.room_id}" value="${room.end_hour.slice(0,5)}">
                <button onclick="updateRoomTimes(${room.room_id})">Update Times</button>
            `;
            roomListContainer.appendChild(roomElement);
        });
    })
    .catch(error => {
        console.error('Error loading room list:', error);
    });
}

// Function to update room times
function updateRoomTimes(roomId) {
    const startHour = document.getElementById(`roomStart-${roomId}`).value;
    const endHour = document.getElementById(`roomEnd-${roomId}`).value;

    const roomData = {
        roomId,
        startHour: startHour + ":00", // Ensure time format HH:MM:SS
        endHour: endHour + ":00"  // Ensure time format HH:MM:SS
    };

    sendUpdateRequest('/api/updateRoomTimes', roomData)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Room times updated successfully!');
            loadRoomList(); // Reload the list of rooms to reflect changes
        } else {
            alert('Error updating room times: ' + data.message);
        }
    })
    .catch(error => console.error('Error updating room times:', error));
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



// Call the loadClassList when the page loads
window.onload = function() {
    loadClassList();
    loadEquipmentList();
    loadRoomList();
    
    document.getElementById('classCreationForm').addEventListener('submit', makeClass);
    // ... other onload code
};

// Function to handle logout
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}