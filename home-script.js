document.addEventListener("DOMContentLoaded", () => {
    // Fetch services from the API
    fetch('http://localhost:3000/services')
        .then(response => response.json())
        .then(services => {
            // Check if services are returned
            if (!Array.isArray(services) || services.length === 0) {
                document.getElementById("serviceCategories").innerHTML = "<p>No services available at the moment.</p>";
                return;
            }

            const serviceCategories = document.getElementById("serviceCategories");

            // Group services by category
            const groupedServices = services.reduce((groups, service) => {
                const category = service.service_category || "Other";
                if (!groups[category]) groups[category] = [];
                groups[category].push(service);
                return groups;
            }, {});

            // Display categories
            for (const [category, services] of Object.entries(groupedServices)) {
                // Create category card
                const categoryDiv = document.createElement("div");
                categoryDiv.className = "service-category";
                categoryDiv.innerHTML = `<h3>${category}</h3>`;

                const serviceCardsContainer = document.createElement("div");
                serviceCardsContainer.className = "service-cards-container";

                const serviceCards = document.createElement("div");
                serviceCards.className = "service-cards";

                // Add services under the category
                services.forEach(service => {
                    const card = document.createElement("div");
                    card.className = "service-card";

                    // Set the service ID as a dataset
                    card.dataset.serviceId = service.service_id;

                    // Create the card structure
                    card.innerHTML = `
                        <div class="card-image">
                            <img src="images/serviceProvider.jpg" alt="${service.service_name}">
                        </div>
                        <div class="card-content">
                            <h3>${service.service_name}</h3>
                        </div>
                    `;
                    
                    // Add click event to navigate to service details
                    card.addEventListener("click", () => {
                        const userID = getQueryParam("userId");
                        window.location.href = `services.html?serviceId=${service.service_id}&userId=${userID}`;
                    });

                    serviceCards.appendChild(card);
                });

                // Create scroll buttons
                const leftButton = document.createElement("button");
                leftButton.className = "scroll-button left";
                leftButton.textContent = "<";
                leftButton.addEventListener("click", () => {
                    serviceCards.scrollBy({ left: -300, behavior: "smooth" });
                });

                const rightButton = document.createElement("button");
                rightButton.className = "scroll-button right";
                rightButton.textContent = ">";
                rightButton.addEventListener("click", () => {
                    serviceCards.scrollBy({ left: 300, behavior: "smooth" });
                });

                serviceCardsContainer.appendChild(leftButton);
                serviceCardsContainer.appendChild(serviceCards);
                serviceCardsContainer.appendChild(rightButton);

                categoryDiv.appendChild(serviceCardsContainer);
                serviceCategories.appendChild(categoryDiv);
            }
        })
        .catch(err => {
            console.error("Error fetching services:", err);
            document.getElementById("serviceCategories").innerHTML = "<p>Error loading services. Please try again later.</p>";
        });
});
function filterServices() {
    const searchTerm = document.getElementById("serviceSearch").value.toLowerCase();
    const searchResultsSection = document.getElementById("searchResults");
    const searchResultCards = document.getElementById("searchResultCards");

    // Clear previous search results
    searchResultCards.innerHTML = "";

    // Check if the search term is empty
    if (!searchTerm.trim()) {
        searchResultsSection.style.display = "none";
        return;
    }

    // Fetch services directly from the API
    fetch('http://localhost:3000/services')
        .then(response => response.json())
        .then(services => {
            if (!Array.isArray(services) || services.length === 0) {
                searchResultsSection.style.display = "none";
                return;
            }

            let hasResults = false;

            // Filter services based on the search term
            const filteredServices = services.filter(service =>
                service.service_name.toLowerCase().includes(searchTerm)
            );

            // Display filtered services
            filteredServices.forEach(service => {
                const resultCard = document.createElement("div");
                resultCard.className = "service-card";

                // Populate card content
                resultCard.innerHTML = `<h3>${service.service_name}</h3>`;

                // Set the service ID as a dataset
                resultCard.dataset.serviceId = service.service_id;

                // Add click event to navigate to the service details page
                resultCard.addEventListener("click", () => {

                    const userID = getQueryParam("userId");
                    window.location.href = `services.html?serviceId=${service.service_id}&userId=${userID}`;
                    document.getElementById("serviceSearch").value = '';
                });

                searchResultCards.appendChild(resultCard);
                hasResults = true;
            });

            // Show or hide the search results section based on whether there are results
            searchResultsSection.style.display = hasResults ? "block" : "none";
        })
        .catch(err => {
            console.error("Error fetching or filtering services:", err);
            searchResultsSection.style.display = "none";
        });
}


// Function to get query parameters from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", () => {
    // fetchUserRequests(1);
    const userID = getQueryParam("userId");

    if (userID) {
        console.log(userID);
        document.getElementById("login-button").style.display = "none";
        document.getElementById("profile-button").style.display = "block";
        document.getElementById("logout-button").style.display = "block";
    }
});

// Function to show the login popup
function showLoginPopup() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("userLoginPopup").style.display = "block";
}

// Function to close the login popup
function closeLoginPopup() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("userLoginPopup").style.display = "none";
}

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
            localStorage.setItem("userID", userID);
            console.log("Logged-in User ID:", userID);

            const newUrl = `${window.location.origin}${window.location.pathname}?userId=${userID}`;
            window.history.pushState({ path: newUrl }, "", newUrl);
            
            // window.location.reload();

            document.getElementById("login-button").style.display = "none";
            document.getElementById("profile-button").style.display = "block";
            document.getElementById("logout-button").style.display = "block";
            // alert("Login successful");
            closeLoginPopup();
            // Call displayUserDetails with user data
            // displayUserDetails(data.user);
        } else {
            alert(data.error || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
    }
}

// Function to handle user logout
function logoutUser() {
    userID = null;

    document.getElementById("loginUserEmail").value = '';
    document.getElementById("loginUserPassword").value = '';

    const newUrl = `${window.location.origin}${window.location.pathname}`;
    // window.history.pushState({ path: newUrl }, "", newUrl);
    window.location.href = newUrl;
    
    alert("You have been logged out.");
}

function openProfilePage(){
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");

    window.location.href = `user-profile.html?userId=${userId}`;
}