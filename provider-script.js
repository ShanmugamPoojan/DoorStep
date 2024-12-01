// Show Provider Login
function showProviderLogin() {
    // document.getElementById("providerSection").style.display = "block";
    document.getElementById("providerLogin").style.display = "block";
    document.getElementById("providerRegister").style.display = "none";
}

// Show Provider Register
function showProviderRegister() {
    // document.getElementById("providerSection").style.display = "block";
    document.getElementById("providerRegister").style.display = "block";
    document.getElementById("providerLogin").style.display = "none";
}

function hideProviderSection() {
    event.preventDefault();
    document.getElementById("providerSection").style.display = "none";
}

// Function to show the login popup
function showLoginPopup() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("providerLoginPopup").style.display = "block";
    document.getElementById("providerLogin").style.display = "block";
    document.getElementById("providerRegister").style.display = "none";
}

// Function to close the login popup
function closeLoginPopup() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("providerLoginPopup").style.display = "none";
}

// Function to load the service categories dynamically
async function loadServiceCategories() {
    try {
        const response = await fetch("http://localhost:3000/service-categories");
        const data = await response.json();

        if (response.ok && data.success) {
            const categorySelect = document.getElementById("providerCategory");

            // Clear existing options
            categorySelect.innerHTML = '';

            // Add a default option
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select a category";
            categorySelect.appendChild(defaultOption);

            const newOption = document.createElement("option");
            newOption.value = "new";
            newOption.textContent = "New category";
            categorySelect.appendChild(newOption);

            // Populate the dropdown with categories
            data.categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        } else {
            alert(data.message || "Failed to load categories.");
        }
    } catch (error) {
        console.error("Error loading service categories:", error);
        alert("An error occurred while loading categories.");
    }
}


// Call this function when the page is loaded
// Function to get query parameters from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", () => {
    loadServiceCategories();
    // fetchproviderRequests(1);
    const providerId = getQueryParam("providerId");

    if (providerId) {
        console.log(providerId);
        document.getElementById("login-button").style.display = "none";
        document.getElementById("logout-button").style.display = "block";

        document.getElementById("loginAlert").style.display = "none";
        fetchProviderDetails(providerId);
        fetchServiceRequests(providerId);
        // displayproviderDetails(providerID);
    } else {
        // alert("login");
        console.log(providerId);

    }
});


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

            const providerID = data.provider.provider_id;

            const newUrl = `${window.location.origin}${window.location.pathname}?providerId=${providerID}`;
            window.history.pushState({ path: newUrl }, "", newUrl);

            document.getElementById("loginAlert").style.display = "none";

            // Display provider details
            displayProviderDetails(data.provider);
            fetchServiceRequests(data.provider.provider_id);


        } else {
            alert(data.error || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Error during provider login:", error);
        alert("An error occurred. Please try again later.");
    }
}

async function fetchProviderDetails(providerId) {
    try {
        const response = await fetch(`http://localhost:3000/providers-details/${providerId}`);
        const data = await response.json();

        if (response.ok && data.success) {
            displayProviderDetails(data.provider);

        } else {
            console.error("Error fetching provider details:", data.message || "Unknown error");
            alert(data.message || "Failed to fetch provider details.");
        }
    } catch (error) {
        console.error("Error fetching provider details:", error);
        alert("An error occurred while fetching provider details.");
    }
}
function displayProviderDetails(provider) {
    if (!provider) {
        alert("Provider details are missing.");
        return;
    }

    document.getElementById("providerNameDisplay").textContent = provider.provider_name || "N/A";
    document.getElementById("providerEmailDisplay").textContent = provider.email || "N/A";
    document.getElementById("providerPhoneDisplay").textContent = provider.phone_number || "N/A";
    document.getElementById("providerServiceDisplay").textContent = provider.service_id || "N/A"; // Map ID to name if needed
    document.getElementById("providerDetails").style.display = "block";
    document.getElementById("providerSection").style.display = "none";
}

async function handleProviderRegister(event) {
    event.preventDefault();
    fetchCategories();
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

async function fetchServiceRequests(providerId) {
    try {
        const response = await fetch(`http://localhost:3000/providers/${providerId}/requests`);
        const data = await response.json();

        if (response.ok && data.success) {
            displayServiceRequests(data.requests);
        } else {
            alert(data.message || "Failed to load service requests.");
        }
    } catch (error) {
        console.error("Error fetching service requests:", error);
        alert("An error occurred while fetching service requests.");
    }
}

function displayServiceRequests(requests) {
    const requestsList = document.getElementById("requestsList");
    requestsList.innerHTML = ""; // Clear existing requests

    requests.forEach(request => {
        const requestItem = document.createElement("div");
        requestItem.className = "request-item";
        requestItem.innerHTML = `
            <h4>${request.service_name} (${request.service_category})</h4>
            <p><strong>User:</strong> ${request.user_name} (${request.user_email})</p>
            <p><strong>Status:</strong> ${request.request_status}</p>
            <p><strong>Requested on:</strong> ${new Date(request.request_date).toLocaleString()}</p>
            <p><strong>Available Timings:</strong> ${request.available_timings}</p>
            <p><strong>Notes:</strong> ${request.additional_notes || "N/A"}</p>
            <br>
            <select onchange="changeStatus(${request.request_id}, this.value)">
                <option value="Pending" ${request.request_status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="In Progress" ${request.request_status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Completed" ${request.request_status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Cancelled" ${request.request_status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
        `;
        requestsList.appendChild(requestItem);
    });
}

// Function to change the status of a service request
async function changeStatus(requestId, newStatus) {
    try {
        const response = await fetch(`http://localhost:3000/requests/${requestId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newStatus })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Service request status updated.");
            window.location.reload(); // Reload to fetch the updated status
        } else {
            alert(data.message || "Failed to update status.");
        }
    } catch (error) {
        console.error("Error updating status:", error);
        alert("An error occurred while updating the status.");
    }
}

// function handleProviderLogout() {
//     // Clear provider-related data
//     document.getElementById("providerDetails").style.display = "none";
//     document.getElementById("providerSection").style.display = "block";
//     document.getElementById("providerLogin").style.display = "block";
//     document.getElementById("providerRegister").style.display = "none";

//     // Clear session storage or other variables if used
//     // sessionStorage.removeItem("providerID"); 
//     alert("You have been logged out.");
// }
function logoutProvider() {
    document.getElementById("loginProviderEmail").value = '';
    document.getElementById("loginProviderPassword").value = '';

    document.getElementById("providerDetails").style.display = "none";
    // document.getElementById("userLogin").style.display = "block";
    document.getElementById("loginAlert").style.display = "none";
    document.getElementById("login-button").style.display = "block";
    document.getElementById("logout-button").style.display = "block";

    const newUrl = `${window.location.origin}${window.location.pathname}`;
    window.location.href = newUrl;
    alert("You have been logged out.");
}

