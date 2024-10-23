const apiUrl = 'http://localhost:3000/api/members';
let editingMemberId = null; // Global variable to track the current member being edited

// to fetch and display all members
function fetchMembers() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayMembers(data); // Call the new display function
        });
}

// to display members in the DOM style
function displayMembers(members) {
    let membersList = document.getElementById('membersList');
    membersList.innerHTML = ''; // Clear existing members

    members.forEach(member => {
        let memberItem = document.createElement('div');
        memberItem.innerHTML = `
            <p>
                <strong>Name:</strong> ${member.name}<br />
                <strong>Age:</strong> ${member.age}<br />
                <strong>Gender:</strong> ${member.gender}<br />
                <strong>Phone:</strong> ${member.phone}<br />
                <strong>Email:</strong> ${member.email}<br />
                <strong>Membership Type:</strong> ${member.membershipType}<br />
                <button onclick="editMember(${member.id})">Edit</button>
                <button onclick="deleteMember(${member.id})">Delete</button>
            </p>
            <hr />
        `;
        membersList.appendChild(memberItem);
    });
}

// to add or Update a member
function addOrUpdateMember() {
    let name = document.getElementById('name').value;
    let age = document.getElementById('age').value;
    let gender = document.getElementById('gender').value;
    let phone = document.getElementById('phone').value;
    let email = document.getElementById('email').value;
    let membershipType = document.getElementById('membershipType').value;

    let newMember = {
        name: name,
        age: age,
        gender: gender,
        phone: phone,
        email: email,
        membershipType: membershipType,
    };

    if (editingMemberId) {
        // If editing an existing member, send PUT request
        fetch(`${apiUrl}/${editingMemberId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMember),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Member updated:', data);
                editingMemberId = null; // Clear the editing ID
                clearForm(); // Clear the form after update
                fetchMembers(); // Refresh the member list
            });
    } else {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMember),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Member added:', data);
                clearForm(); // Clear the form after adding
                fetchMembers(); // Refresh the member list
            });
    }
}

// to clear the form inputs
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('membershipType').value = '';
}

// to edit a member (Prefill the form)
function editMember(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(member => {
            document.getElementById('name').value = member.name;
            document.getElementById('age').value = member.age;
            document.getElementById('gender').value = member.gender;
            document.getElementById('phone').value = member.phone;
            document.getElementById('email').value = member.email;
            document.getElementById('membershipType').value = member.membershipType;

            editingMemberId = id; // Set the ID of the member being edited
        });
}

// to delete a member
function deleteMember(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Member deleted:', data);
            fetchMembers(); // Refresh the member list
        });
}

// to search for members
function searchMembers() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const filteredMembers = data.filter(member => 
                member.name.toLowerCase().includes(searchInput) || 
                member.email.toLowerCase().includes(searchInput) ||
                member.phone.includes(searchInput)
            );
            displayMembers(filteredMembers); // Display filtered members
        });
}

// to attach functions to the window object for global access
window.fetchMembers = fetchMembers;
window.addOrUpdateMember = addOrUpdateMember;
window.editMember = editMember;
window.deleteMember = deleteMember;
window.searchMembers = searchMembers; // Make searchMembers globally accessible

// Initial load
window.onload = () => {
    fetchMembers(); // Load the members when the page is loaded
};
