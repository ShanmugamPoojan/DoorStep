
// Show User Login
function showUserLogin() {
    // document.getElementById("userSection").style.display = "block";
    document.getElementById("userLogin").style.display = "block";
    document.getElementById("userRegister").style.display = "none";
}

// Show User Register
function showUserRegister() {
    // document.getElementById("userSection").style.display = "block";
    document.getElementById("userRegister").style.display = "block";
    document.getElementById("userLogin").style.display = "none";
}

function hideUserSection() {
    event.preventDefault();
    document.getElementById("userSection").style.display = "none";
}

// Function to show the login popup
function showLoginPopup() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("userLoginPopup").style.display = "block";
    document.getElementById("userLogin").style.display = "block";
    document.getElementById("userRegister").style.display = "none";
}

// Function to close the login popup
function closeLoginPopup() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("userLoginPopup").style.display = "none";
}

// Function to get query parameters from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// document.addEventListener("DOMContentLoaded", () => {
    
    // fetchUserRequests(1);
    // const userID = getQueryParam("userId"); // Note: Query parameter is case-sensitive
    // console.log("Extracted userID from URL:", userID);

    //     if (userID) {
    //         // Call displayUserDetails if userID exists
    //         console.log("aaa");
    //         displayUserDetails(userID);
    //         document.getElementById("loginAlert").style.display = "none";
    //     } else {
    //         // Show alert if userID is not found in URL
    //         document.getElementById("loginAlert").style.display = "block";
    //         console.warn("No userID found in URL. Prompting user to log in.");
    //     }
// });


// Function to check user authentication
// function checkUserAuthentication() {
//     let userID = getQueryParam("userID");

//     if (!userID) {
//         // Fall back to localStorage if not in URL
//         userID = localStorage.getItem("userID");
//     }

//     if (!userID) {
//         // Redirect to login or show a message
//         alert("Please log in to continue.");
//         showLoginPopup(); // Trigger the login popup
//     } else {
//         console.log("Authenticated User ID:", userID);
//         // Proceed with fetching user details or other operations
//         fetchUserDetails(userID);
//     }
// }


// Function to handle user login
async function handleUserLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginUserEmail").value;
    const password = document.getElementById("loginUserPassword").value;

    try {
        const response = await fetch("http://localhost:3000/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store userID in localStorage
            const userID = data.user.user_id;
            // localStorage.setItem("userID", userID);
            console.log("Logged-in User ID:", userID);

            // window.location.href = `profile.html?&userId=${userID}`;

            const newUrl = `${window.location.origin}${window.location.pathname}?userId=${userID}`;
            window.history.pushState({ path: newUrl }, "", newUrl);

            // alert("Login successful");
            document.getElementById("loginAlert").style.display = "none";

            closeLoginPopup();
            // Call displayUserDetails with user data
            displayUserDetails(userID);
            displayUserDetails(data.user);
        } else {
            alert(data.error || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
    }
}

function displayUserDetails(user) { 
    document.getElementById("userLogin").style.display = "none";
    document.getElementById("userRegister").style.display = "none";
    document.getElementById("userDetails").style.display = "block";
    document.getElementById("userRequests").style.display = "block";
    document.getElementById("completedServices").style.display = "block";

    document.getElementById("userNameDisplay").textContent = user.name;
    document.getElementById("userEmailDisplay").textContent = user.email;
    document.getElementById("userPhoneDisplay").textContent = user.phone_number;
    document.getElementById("userAddressDisplay").textContent = user.address;

    const userId = localStorage.getItem('userID');
    fetchUserRequests(userId);
    fetchCompletedServices(userId); // Fetch user requests when details are displayed
}
// Function to display user details
// async function displayUserDetails(userID) {
//     console.log("Fetching details for User ID:", userID);

//     try {
//         // Fetch user details from the server
//         const response = await fetch(`http://localhost:3000/user-details/${userID}`);
//         const data = await response.json();

//         if (response.ok) {
//             const user = data.user;

//             // Hide login and registration sections
//             document.getElementById("userLogin").style.display = "none";
//             document.getElementById("userRegister").style.display = "none";

//             // Display user details section
//             document.getElementById("userDetails").style.display = "block";
//             document.getElementById("userRequests").style.display = "block";
//             document.getElementById("completedServices").style.display = "block";

//             // Populate user details in the UI
//             document.getElementById("userNameDisplay").textContent = user.name;
//             document.getElementById("userEmailDisplay").textContent = user.email;
//             document.getElementById("userPhoneDisplay").textContent = user.phone_number;
//             document.getElementById("userAddressDisplay").textContent = user.address;

//             // Fetch user requests and completed services
//             fetchUserRequests(userID);
//             fetchCompletedServices(userID);
//         } else {
//             alert(data.message || "Failed to fetch user details.");
//         }
//     } catch (error) {
//         console.error("Error fetching user details:", error);
//         alert("An error occurred while fetching user details.");
//     }
// }



// Function to hide the edit form
function hideEditForm() {
    document.getElementById("editUserForm").style.display = "none";
}


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
    const userID = localStorage.getItem('userID');

    // const userID = getQueryParam("userID");

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
                    <img src="${request.profile_picture}" alt="${request.user_name}">
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
                    <td>${request.user_name}</td>
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

// Function to handle user registration
async function handleUserRegister(event) {
    event.preventDefault();

    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const phone = document.getElementById("userPhone").value;
    const address = document.getElementById("userAddress").value;
    const password = document.getElementById("userPassword").value;

    try {
        const response = await fetch("http://localhost:3000/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, address, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful! Please log in.");
            showUserLogin();
        } else {
            alert(data.error || "Registration failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again later.");
    }
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
