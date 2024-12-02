// Function to fetch and display service details
function displayServiceDetails(serviceId) {
    fetch(`http://localhost:3000/services/${serviceId}`)
        .then(response => response.json())
        .then(data => {
            const service = data;
            if (!service) throw new Error("Service data is missing in the API response.");

            const detailsContainer = document.getElementById("detailsContainer");
            detailsContainer.innerHTML = `
                <h2>${service.service_name}</h2>
                <p><strong>Category:</strong> ${service.service_category || "Not categorized"}</p>
                <p><strong>Description:</strong> ${service.service_description || "No description available."}</p>
            `;
        })
        .catch(err => {
            console.error("Error fetching service details:", err);
            document.getElementById("detailsContainer").innerHTML = "<p>Error loading service details. Please try again later.</p>";
        });
}

// Function to fetch and display provider details
function displayProviderDetails(serviceId) {
    fetch(`http://localhost:3000/providers/${serviceId}`)
        .then(response => response.json())
        .then(data => {
            const providers = data;
            const providersContainer = document.getElementById("providersContainer");

            // if (!userId) {
            //     // document.getElementById("detailsContainer").innerHTML = "<p>Service ID not provided.</p>";
            //     alert("Please login");
            //     return;
            // }

            if (!providers || providers.length === 0) {
                providersContainer.innerHTML = "<p>No providers available for this service.</p>";
                return;
            }

            providersContainer.innerHTML = ""; // Clear existing provider data
            providers.forEach(provider => {
                const providerCard = document.createElement("div");
                providerCard.className = "provider-card";
                providerCard.innerHTML = `
                    <img src="${provider.profile_picture || "images/img.jpg"}" alt="${provider.provider_name}" />
                    <h3>${provider.provider_name}</h3>
                    <p><strong>Email:</strong> ${provider.email}</p>
                    <p><strong>Phone:</strong> ${provider.phone_number}</p>
                    <p><strong>Address:</strong> ${provider.address || "Not provided"}</p>
                    <p><strong>Rating:</strong> ${provider.rating || "No rating available"}</p>
                    <button class="book-button button" onclick="handleBooking(${provider.provider_id}, ${serviceId})">Book Now</button>
                `;
                // console.log(provider.provider_id);
                providersContainer.appendChild(providerCard);
            });
        })
        .catch(err => {
            console.error("Error fetching service providers:", err);
            document.getElementById("providersContainer").innerHTML = "<p>Error loading service providers. Please try again later.</p>";
        });
}

// Function to handle booking a service provider
function handleBooking(providerId, serviceId) {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    console.log(userId);

    if (userId === null || userId.trim() === "") {
        alert("You need to log-in to book this service provider.");
        // window.location.href = "login.html"; // Redirect to login page
        return;
    }
    document.getElementById("bookingModal").style.display = "block";

    document.getElementById("closeModal").onclick = function () {
        document.getElementById("bookingModal").style.display = "none";
    };
    window.onclick = function (event) {
        if (event.target === document.getElementById("bookingModal")) {
            document.getElementById("bookingModal").style.display = "none";
        }
    };

    document.getElementById("bookingForm").onsubmit = function (event) {
        event.preventDefault();

        const availableTimings = document.getElementById("availableTimings").value ;
        const additionalNotes = document.getElementById("additionalNotes").value || "N/A";

        if (!availableTimings) {
            alert("Preferred timing is required to proceed with booking.");
            return;
        }

        // Send booking request to the API
        fetch(`http://localhost:3000/service_requests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: userId,
                provider_id: providerId,
                service_id: serviceId,
                available_timings: availableTimings,
                additional_notes: additionalNotes,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Your service booking has been successfully submitted.");
                    document.getElementById("bookingModal").style.display = "none"; // Close the modal
                } else {
                    alert("Failed to book the service. Please try again.");
                }
            })
            .catch(err => {
                console.error("Error booking service:", err);
                alert("An error occurred while booking the service.");
            });
    };
}

function openHomePage(){
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");

    window.location.href = `index.html?userId=${userId}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get("serviceId");

    if (!serviceId) {
        document.getElementById("detailsContainer").innerHTML = "<p>Service ID not provided.</p>";
        return;
    }

    displayServiceDetails(serviceId);
    displayProviderDetails(serviceId);
});
