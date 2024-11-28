
// Function to show edit user details form
function showEditUserDetails() {

    document.getElementById("editUserName").value = document.getElementById("userNameDisplay").textContent;
    document.getElementById("editUserEmail").value = document.getElementById("userEmailDisplay").textContent;
    document.getElementById("editUserPhone").value = document.getElementById("userPhoneDisplay").textContent;
    document.getElementById("editUserAddress").value = document.getElementById("userAddressDisplay").textContent;

    document.getElementById("editUserForm").style.display = "block";
}

// Function to handle editing user details
async function handleEditUserDetails(event) {
    event.preventDefault();

    const name = document.getElementById("editUserName").value;
    const email = document.getElementById("editUserEmail").value;
    const phone = document.getElementById("editUserPhone").value;
    const address = document.getElementById("editUserAddress").value;

    try {
        const response = await fetch(`http://localhost:3000/users/${userID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, address }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("User details updated successfully!");
            displayUserDetails(data.user);
            hideEditForm();
        } else {
            alert(data.error || "Failed to update user details. Please try again.");
        }
    } catch (error) {
        console.error("Error updating user details:", error);
        alert("An error occurred. Please try again later.");
    }
}

// Function to hide the edit form
function hideEditForm() {
    document.getElementById("editUserForm").style.display = "none";
}

// Function to handle user logout
function logoutUser() {
    userID = null;

    document.getElementById("loginUserEmail").value = '';
    document.getElementById("loginUserPassword").value = '';

    document.getElementById("userDetails").style.display = "none";
    document.getElementById("userRequests").style.display = "none";
    document.getElementById("completedServices").style.display = "none";
    document.getElementById("userLogin").style.display = "block";
    alert("You have been logged out.");
    window.location.href = 'profile.html';
}

// Fetch and display user requests
async function fetchUserRequests(userID) {
    if (!userID) {
        return;
    }
    const requestsList = document.getElementById("requestsList");
    requestsList.innerHTML = "Loading requests...";

    try {
        const response = await fetch(`http://localhost:3000/users/${userID}/requests`);
        const data = await response.json();
        // console.log("Fetching requests for user ID:", userID);

        if (response.ok && data.requests.length > 0) {
            const requestsHTML = data.requests.map(request => `
                <div class="request-item">
                    <h4>${request.service_name}</h4>
                    <img src="${request.profile_picture}" alt="${request.provider_name}">
                    <p><strong>Provider:</strong> ${request.provider_name}</p>
                    <p><strong>Contact:</strong> ${request.phone_number}</p>
                    <p><strong>Status:</strong> ${request.request_status}</p>
                    <p><strong>Requested date:</strong> ${new Date(request.request_date).toLocaleString()}</p>
                    <p><strong>Available timings:</strong> ${request.available_timings}</p>
                    ${request.additional_notes ? `<p><strong>Notes:</strong> ${request.additional_notes}</p>` : ""}
                    <button onclick="cancelRequest(${request.request_id})">Cancel Request</button>
                </div>

            `).join("");
            requestsList.innerHTML = requestsHTML;
        } else {
            requestsList.innerHTML = "<p>No service requests found.</p>";
        }
    } catch (error) {
        console.error("Error fetching requests:", error);
        requestsList.innerHTML = "<p>Failed to load service requests. Please try again later.</p>";
    }
}
// Function to fetch and display completed service history
async function fetchCompletedServices(userID) {
    if (!userID) {
        return;
    }
    const completedServicesList = document.getElementById("completedServicesList");
    completedServicesList.innerHTML = "Loading history...";

    try {
        const response = await fetch(`http://localhost:3000/users/${userID}/requests?status=Completed`);
        const data = await response.json();

        if (response.ok && data.requests.length > 0) {
            // Create the table header
            let completedServicesHTML = `
                <table class="services-table">
                    <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Provider</th>
                            <th>Contact</th>
                            <th>Requested date</th>
                            <th>Availability</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            // Add rows for each completed service
            completedServicesHTML += data.requests.map(request => `
                <tr>
                    <td>${request.service_name}</td>
                    <td>${request.provider_name}</td>
                    <td>${request.phone_number}</td>
                    <td>${new Date(request.request_date).toLocaleString()}</td>
                    <td>${request.available_timings}</td>
                    <td>${request.additional_notes || "N/A"}</td>
                </tr>
            `).join("");

            // Close the table
            completedServicesHTML += `
                    </tbody>
                </table>
            `;

            completedServicesList.innerHTML = completedServicesHTML;
        } else {
            completedServicesList.innerHTML = "<p>No completed services found.</p>";
        }
    } catch (error) {
        console.error("Error fetching completed services:", error);
        completedServicesList.innerHTML = "<p>Failed to load service history. Please try again later.</p>";
    }
}

// Cancel a request
async function cancelRequest(requestId) {
    if (!confirm("Are you sure you want to cancel this request?")) return;

    try {
        const response = await fetch(`http://localhost:3000/requests/${requestId}`, { method: "DELETE" });

        if (response.ok) {
            alert("Request canceled successfully.");
            fetchUserRequests(userID);
            fetchCompletedServices(userID); // Refresh the requests list
        } else {
            const data = await response.json();
            alert(data.error || "Failed to cancel the request.");
        }
    } catch (error) {
        console.error("Error canceling request:", error);
        alert("An error occurred. Please try again later.");
    }
}

async function handleProviderLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginProviderEmail").value;
    const password = document.getElementById("loginProviderPassword").value;

    try {
        const response = await fetch("http://localhost:3000/providers/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Display provider details
            document.getElementById("providerDetails").style.display = "block";
            document.getElementById("providerSection").style.display = "none";
            document.getElementById("providerNameDisplay").textContent = data.provider.provider_name;
            document.getElementById("providerEmailDisplay").textContent = data.provider.email;
            document.getElementById("providerPhoneDisplay").textContent = data.provider.phone_number;
            document.getElementById("providerServiceDisplay").textContent = data.provider.service_id; // Map service_id to service name if necessary
        } else {
            alert(data.error || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Error during provider login:", error);
        alert("An error occurred. Please try again later.");
    }
}

async function handleProviderRegister(event) {
    event.preventDefault();

    const providerData = {
        provider_name: document.getElementById("providerName").value,
        email: document.getElementById("providerEmail").value,
        phone_number: document.getElementById("providerPhone").value,
        address: document.getElementById("providerAddress").value,
        service_id: document.getElementById("providerCategory").value,
        new_category: document.getElementById("newCategory").value || null, // Optional new category
        service_name: document.getElementById("providerService").value,
        password: document.getElementById("providerPassword").value,
    };

    try {
        const response = await fetch("http://localhost:3000/providers/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(providerData),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful. You can now log in.");
            showProviderLogin(); // Switch to login view
        } else {
            alert(data.error || "Registration failed. Please try again.");
        }
    } catch (error) {
        console.error("Error registering provider:", error);
        alert("An error occurred. Please try again later.");
    }
}
async function fetchCategories() {
    try {
        const response = await fetch("http://localhost:3000/services/categories");
        const categories = await response.json();

        const providerCategory = document.getElementById("providerCategory");
        providerCategory.innerHTML = ""; // Clear previous options

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.service_id;
            option.textContent = category.service_name;
            providerCategory.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

function handleProviderLogout() {
    // Clear provider-related data
    document.getElementById("providerDetails").style.display = "none";
    document.getElementById("providerSection").style.display = "block";
    document.getElementById("providerLogin").style.display = "block";
    document.getElementById("providerRegister").style.display = "none";

    // Clear session storage or other variables if used
    sessionStorage.removeItem("providerID"); // Example, if you store provider ID in session storage
    alert("You have been logged out.");
}


function displayProviderDetails(provider) {
    document.getElementById("providerNameDisplay").textContent = provider.provider_name;
    document.getElementById("providerEmailDisplay").textContent = provider.email;
    document.getElementById("providerPhoneDisplay").textContent = provider.phone_number;
    document.getElementById("providerServiceDisplay").textContent = provider.service_id; // Map ID to name if needed
    document.getElementById("providerDetails").style.display = "block";
    document.getElementById("providerSection").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    fetchCategories(); // Load categories into dropdown
    document.getElementById("providerDetails").style.display = "none";
});

