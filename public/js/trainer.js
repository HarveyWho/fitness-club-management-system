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
        startHour: startHour, // Ensure time format HH:MM:SS
        endHour: endHour // Ensure time format HH:MM:SS
    };

    sendUpdateRequest('/api/updateTrainerAvailability', availabilityData)
        .then(response => response.json())
        .then(data => alert('Trainer Availability updated successfully!'))
        .catch(error => console.error('Error updating trainer availability:', error));
}

// Add event listeners to update trainer schedule
document.getElementById('availabilityForm').addEventListener('submit', updateTrainerAvailability);


// Function to load the list of members
function loadMemberList() {
    fetch('/api/getAllMembers', { method: 'GET' })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(members => {
        const memberListContainer = document.getElementById('memberListContainer');
        memberListContainer.innerHTML = ''; // Clear the list

        let currentClass = '';
        members.forEach(member => {
            
            if (currentClass !== member.class_name) {
                currentClass = member.class_name;
                const classHeader = document.createElement('h3');
                classHeader.textContent = currentClass;
                memberListContainer.appendChild(classHeader);
            }

            const memberElement = document.createElement('div');
            memberElement.className = 'member-item';
            memberElement.innerHTML = `
                <span>${member.first_name} ${member.last_name} - ${new Date(member.date_of_birth).toLocaleDateString()}</span>
                <button id="viewProfile-${member.member_id}" onclick="toggleMemberProfile(${member.member_id})">View Profile</button>
                <div id="profileDetails-${member.member_id}" class="profile-details" style="display: none;"></div>
            `;
            memberListContainer.appendChild(memberElement);
        });
    })
}


// Function to toggle a member's profile visibility
function toggleMemberProfile(memberId) {
    const profileDetails = document.getElementById(`profileDetails-${memberId}`);
    if (profileDetails.style.display === 'none') {
        viewMemberProfile(memberId, profileDetails);
    } else {
        profileDetails.style.display = 'none';
    }
}

// Function to view a member's profile and update the display
function viewMemberProfile(memberId, profileDetailsContainer) {
    Promise.all([
        fetch(`/api/getMemberFitnessGoals?memberId=${memberId}`).then(res => res.json()),
        fetch(`/api/getMemberHealthStatistics?memberId=${memberId}`).then(res => res.json())
    ])
    .then(([fitnessGoals, healthStatistics]) => {
        displayMemberDetails(fitnessGoals, healthStatistics, profileDetailsContainer);
        profileDetailsContainer.style.display = 'block';
    })
    .catch(error => {
        console.error('Error viewing member profile:', error);
    });
}

// Function to display member's fitness goals and health statistics within a specified container
function displayMemberDetails(fitnessGoals, healthStatistics, profileDetailsContainer) {
    profileDetailsContainer.innerHTML = `
        <h4>Fitness Goals</h4>
        <p>Weight Goal: ${fitnessGoals.weight_goal}</p>
        <p>Heart Rate Goal: ${fitnessGoals.heart_rate_goal}</p>
        <p>Blood Pressure Goal: ${fitnessGoals.blood_pressure_goal}</p>
        <p>BMI Goal: ${fitnessGoals.BMI_goal}</p>
        <p>Duration Days: ${fitnessGoals.duration_days}</p>

        <h4>Health Statistics</h4>
        <p>Height: ${healthStatistics.height}</p>
        <p>Weight: ${healthStatistics.weight}</p>
        <p>Heart Rate: ${healthStatistics.heart_rate}</p>
        <p>Blood Pressure: ${healthStatistics.blood_pressure}</p>
        <p>Body Mass Index: ${healthStatistics.body_mass_index}</p>
    `;
}

// Add the function to window.onload event to make sure it is executed when the page is loaded
window.onload = function() {
    loadTrainerData();
    loadMemberList();
};

function logout() {
    sessionStorage.removeItem('trainerId'); // Remove trainerId from sessionStorage
    sessionStorage.clear(); // Or clear the entire session if that's appropriate for your app
    window.location.href = 'login.html'; // Redirect to login page
}
