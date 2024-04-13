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
        alert('Class cancelled successfully!');
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
    // Bind the 'makeClass' function to the class creation form
    document.getElementById('classCreationForm').addEventListener('submit', makeClass);
    // ... other onload code
};
