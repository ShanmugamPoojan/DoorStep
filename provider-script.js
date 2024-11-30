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
    // document.getElementById("providerLogin").style.display = "block";
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

        if (data.success) {
            const categorySelect = document.getElementById("providerCategory");
            
            // Clear existing options
            categorySelect.innerHTML = '';

            // Add a default option
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select a category";
            categorySelect.appendChild(defaultOption);

            // Populate the dropdown with categories
            data.categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        } else {
            alert("Failed to load categories.");
        }
    } catch (error) {
        console.error("Error loading service categories:", error);
        alert("An error occurred while loading categories.");
    }
}

// Call this function when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    loadServiceCategories();
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

            // Display provider details
            displayProviderDetails(data.provider)
        } else {
            alert(data.error || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Error during provider login:", error);
        alert("An error occurred. Please try again later.");
    }
}
function displayProviderDetails(provider) {
    document.getElementById("providerNameDisplay").textContent = provider.provider_name;
    document.getElementById("providerEmailDisplay").textContent = provider.email;
    document.getElementById("providerPhoneDisplay").textContent = provider.phone_number;
    document.getElementById("providerServiceDisplay").textContent = provider.service_id; // Map ID to name if needed
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

