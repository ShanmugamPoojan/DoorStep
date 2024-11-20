// Fetch services from the backend and populate the services section
document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:3000/services')
        .then(response => response.json())
        .then(services => {
            const serviceGroups = document.getElementById("serviceGroups");
            const providerServiceDropdown = document.getElementById("providerService");

            // Group services by category
            const groupedServices = services.reduce((groups, service) => {
                const category = service.service_category || "Other";
                if (!groups[category]) groups[category] = [];
                groups[category].push(service);
                return groups;
            }, {});

            // Create category sections
            for (const [category, services] of Object.entries(groupedServices)) {
                const categoryDiv = document.createElement("div");
                categoryDiv.className = "service-category";
                categoryDiv.innerHTML = `<h3>${category}</h3>`;
                const serviceCards = document.createElement("div");
                serviceCards.className = "service-cards";

                // Create service cards
                services.forEach(service => {
                    const card = document.createElement("div");
                    card.className = "service-card";
                    card.textContent = service.service_name;

                    // Navigate to service-specific page
                    card.onclick = () => {
                        const serviceUrl = `services.html?id=${service.service_id}`;
                        window.location.href = serviceUrl;
                    };

                    serviceCards.appendChild(card);

                    // Add to provider dropdown
                    const option = document.createElement("option");
                    option.value = service.service_id;
                    option.textContent = service.service_name;
                    providerServiceDropdown.appendChild(option);
                });

                categoryDiv.appendChild(serviceCards);
                serviceGroups.appendChild(categoryDiv);
            }
        })
        .catch(err => console.error("Error fetching services:", err));
});

// Filter services based on search input
function filterServices() {
    const searchValue = document.getElementById("serviceSearch").value.toLowerCase();
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach(card => {
        const serviceName = card.textContent.toLowerCase();
        card.style.display = serviceName.includes(searchValue) ? "block" : "none";
    });
}

// Submit user form
function handleUserLogin(event) {
    event.preventDefault(); // Prevent form submission

    // Get user credentials
    const email = document.getElementById('loginUserEmail').value;
    const password = document.getElementById('loginUserPassword').value;

    // Send a login request
    fetch('http://localhost:3000/login/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })    
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert(data.error);
            } else {
                // Display user details
                document.getElementById('userNameDisplay').innerText = data.name;
                document.getElementById('userEmailDisplay').innerText = data.email;
                document.getElementById('userPhoneDisplay').innerText = data.phone_number;
                document.getElementById('userAddressDisplay').innerText = data.address;

                hideUserSection(); // Hide the login form
                document.getElementById('userDetails').style.display = 'block'; // Show user details
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred during login. Please try again.');
        });
}


// // Submit provider form
// document.getElementById("providerForm").addEventListener("submit", (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     fetch('/providers', { method: 'POST', body: JSON.stringify(Object.fromEntries(formData)), headers: { 'Content-Type': 'application/json' } })
//         .then(response => response.json())
//         .then(data => alert(data.message))
//         .catch(err => console.error("Error:", err));
// });

// Show User Login
function showUserLogin() {
    document.getElementById("userSection").style.display = "block";
    document.getElementById("userLogin").style.display = "block";
    document.getElementById("userRegister").style.display = "none";
}

// Show User Register
function showUserRegister() {
    document.getElementById("userSection").style.display = "block";
    document.getElementById("userLogin").style.display = "none";
    document.getElementById("userRegister").style.display = "block";
}

// Show Provider Prompt
function showProviderPrompt() {
    document.getElementById("providerPrompt").style.display = "block";
}

// Show Provider Login
function showProviderLogin() {
    document.getElementById("providerSection").style.display = "block";
    document.getElementById("providerRegister").style.display = "none";
    document.getElementById("providerLogin").style.display = "block";
}

// Show Provider Register
function showProviderRegister() {
    document.getElementById("providerSection").style.display = "block";
    document.getElementById("providerLogin").style.display = "none";
    document.getElementById("providerRegister").style.display = "block";
}

function hideUserSection(){
    // event.preventDefault();
    document.getElementById("providerPrompt").style.display = "block";
    document.getElementById("userSection").style.display = "none";
}
function hideProviderSection(){
    // event.preventDefault();
    document.getElementById("providerPrompt").style.display = "block";
    document.getElementById("providerSection").style.display = "none";
}
document.getElementById('userLoginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('loginUserEmail').value;
    const password = document.getElementById('loginUserPassword').value;

    fetch('/login/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.getElementById('userNameDisplay').innerText = data.name;
                document.getElementById('userEmailDisplay').innerText = data.email;
                document.getElementById('userPhoneDisplay').innerText = data.phone;
                document.getElementById('userAddressDisplay').innerText = data.address;

                hideUserSection();
                document.getElementById('userDetails').style.display = 'block';
            }
        });
});

document.getElementById('providerLoginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('loginProviderEmail').value;
    const password = document.getElementById('loginProviderPassword').value;

    fetch('/login/provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.getElementById('providerNameDisplay').innerText = data.name;
                document.getElementById('providerEmailDisplay').innerText = data.email;
                document.getElementById('providerPhoneDisplay').innerText = data.phone;
                document.getElementById('providerServiceDisplay').innerText = data.service;

                hideProviderSection();
                document.getElementById('providerDetails').style.display = 'block';
            }
        });
});

// Show Logged-In User Details
function displayUserDetails(user) {
    document.getElementById("userSection").style.display = "none";
    document.getElementById("userDetails").style.display = "block";
    document.getElementById("userNameDisplay").textContent = user.name;
    document.getElementById("userEmailDisplay").textContent = user.email;
    document.getElementById("userPhoneDisplay").textContent = user.phone;
    document.getElementById("userAddressDisplay").textContent = user.address;
}

// Show Logged-In Provider Details
function displayProviderDetails(provider) {
    document.getElementById("providerSection").style.display = "none";
    document.getElementById("providerDetails").style.display = "block";
    document.getElementById("providerNameDisplay").textContent = provider.name;
    document.getElementById("providerEmailDisplay").textContent = provider.email;
    document.getElementById("providerPhoneDisplay").textContent = provider.phone;
    document.getElementById("providerServiceDisplay").textContent = provider.service;
}
