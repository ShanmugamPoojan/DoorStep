// Fetch services from the backend and populate the services section
document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:3000/services')
        .then(response => response.json())
        .then(services => {
            const serviceCards = document.getElementById("serviceCards");
            const providerServiceDropdown = document.getElementById("providerService");
            
            services.forEach(service => {
                // Add service cards
                const card = document.createElement("div");
                card.className = "service-card";
                card.textContent = service.service_name;
                // Dynamically link to a service-specific page
                card.onclick = () => {
                    const serviceUrl = `services.html?id=${service.service_id}`;
                    window.location.href = serviceUrl;
                };
                serviceCards.appendChild(card);

                // Populate service dropdown
                const option = document.createElement("option");
                option.value = service.service_id;
                option.textContent = service.service_name;
                providerServiceDropdown.appendChild(option);
            });
        })
        .catch(err => console.error("Error fetching services:", err));
});

// Submit user form
document.getElementById("userForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch('/users', { method: 'POST', body: JSON.stringify(Object.fromEntries(formData)), headers: { 'Content-Type': 'application/json' }})
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(err => console.error("Error:", err));
});

// Submit provider form
document.getElementById("providerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch('/providers', { method: 'POST', body: JSON.stringify(Object.fromEntries(formData)), headers: { 'Content-Type': 'application/json' }})
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(err => console.error("Error:", err));
});
