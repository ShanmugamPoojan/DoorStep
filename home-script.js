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
                            <p>${service.service_category || "Uncategorized"}</p>
                        </div>
                    `;

                    // Add click event to navigate to service details
                    card.addEventListener("click", () => {
                        window.location.href = `services.html?serviceId=${service.service_id}`;
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
                    window.location.href = `services.html?serviceId=${service.service_id}`;
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


// function filterServices() {
//     const searchTerm = document.getElementById("serviceSearch").value.toLowerCase();
//     const categories = document.querySelectorAll(".service-category");

//     categories.forEach(category => {
//         const categoryName = category.querySelector("h3").textContent.toLowerCase();
//         const services = category.querySelectorAll(".service-card");
//         let categoryVisible = false;

//         services.forEach(service => {
//             const serviceName = service.textContent.toLowerCase();
//             // Check if the service name or category name includes the search term
//             const isVisible = serviceName.includes(searchTerm) || categoryName.includes(searchTerm);
//             service.style.display = isVisible ? "block" : "none";
//             if (isVisible) categoryVisible = true; // If any service is visible, make the category visible
//         });

//         // Show or hide the category based on whether any of its services are visible
//         category.style.display = categoryVisible ? "block" : "none";
//     });
// }

// // Filter services by search input
// function filterServices() {
//     const searchTerm = document.getElementById("serviceSearch").value.toLowerCase();
//     const categories = document.querySelectorAll(".service-category");
    
//     categories.forEach(category => {
//         const categoryName = category.querySelector("h3").textContent.toLowerCase();
//         const services = category.querySelectorAll(".service-card");
//         let categoryVisible = false;
        
//         services.style
//         services.forEach(service => {
//             const serviceName = service.textContent.toLowerCase();
//             const isVisible = serviceName.includes(searchTerm) || categoryName.includes(searchTerm);
//             service.style.display = isVisible ? "block" : "none";
//             if (isVisible) categoryVisible = true;
//         });
        
//         category.style.display = categoryVisible ? "block" : "none";
//     });
// }


// Filter services based on search input
// function filterServices() {
//     const searchValue = document.getElementById("serviceSearch").value.toLowerCase();
//     const serviceCards = document.querySelectorAll(".service-card");

//     serviceCards.forEach(card => {
//         const serviceName = card.textContent.toLowerCase();
//         card.style.display = serviceName.includes(searchValue) ? "block" : "none";
//     });
// }

// // Submit user form
// function handleUserLogin(event) {
//     event.preventDefault(); // Prevent form submission

//     // Get user credentials
//     const email = document.getElementById('loginUserEmail').value;
//     const password = document.getElementById('loginUserPassword').value;

//     // Send a login request
//     fetch('http://localhost:3000/login/user', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//     })    
//         .then((response) => response.json())
//         .then((data) => {
//             if (data.error) {
//                 alert(data.error);
//             } else {
//                 // Display user details
//                 document.getElementById('userNameDisplay').innerText = data.name;
//                 document.getElementById('userEmailDisplay').innerText = data.email;
//                 document.getElementById('userPhoneDisplay').innerText = data.phone_number;
//                 document.getElementById('userAddressDisplay').innerText = data.address;

//                 hideUserSection(); // Hide the login form
//                 document.getElementById('userDetails').style.display = 'block'; // Show user details
//             }
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//             alert('An error occurred during login. Please try again.');
//         });
// }


// // Submit provider form
// document.getElementById("providerForm").addEventListener("submit", (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     fetch('/providers', { method: 'POST', body: JSON.stringify(Object.fromEntries(formData)), headers: { 'Content-Type': 'application/json' } })
//         .then(response => response.json())
//         .then(data => alert(data.message))
//         .catch(err => console.error("Error:", err));
// });
