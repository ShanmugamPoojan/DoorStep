
// Show User Login
function showUserLogin() {
    document.getElementById("userSection").style.display = "block";
    // document.getElementById("providerSection").style.display = "none";
    document.getElementById("userLogin").style.display = "block";
    document.getElementById("userRegister").style.display = "none";
}

// Show User Register
function showUserRegister() {
    document.getElementById("userSection").style.display = "block";
    // document.getElementById("providerSection").style.display = "none";
    document.getElementById("userRegister").style.display = "block";
    document.getElementById("userLogin").style.display = "none";
}

// Show Provider Login
function showProviderLogin() {
    document.getElementById("userSection").style.display = "none";
    document.getElementById("providerSection").style.display = "block";
    document.getElementById("providerLogin").style.display = "block";
    document.getElementById("providerRegister").style.display = "none";
}

// Show Provider Register
function showProviderRegister() {
    document.getElementById("userSection").style.display = "none";
    document.getElementById("providerSection").style.display = "block";
    document.getElementById("providerRegister").style.display = "block";
    document.getElementById("providerLogin").style.display = "none";
}

function hideUserSection() {
    event.preventDefault();
    // document.getElementById("providerPrompt").style.display = "block";
    document.getElementById("userSection").style.display = "none";
}
function hideProviderSection() {
    event.preventDefault();
    // document.getElementById("providerPrompt").style.display = "block";
    document.getElementById("providerSection").style.display = "none";
}
// console.log("2");


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

// Retrieve userID from URL or localStorage
let userID = getQueryParam("userID") || localStorage.getItem("userID");

// Function to get query parameters from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to check user authentication
function checkUserAuthentication() {
    let userID = getQueryParam("userID");

    if (!userID) {
        // Fall back to localStorage if not in URL
        userID = localStorage.getItem("userID");
    }

    if (!userID) {
        // Redirect to login or show a message
        alert("Please log in to continue.");
        showLoginPopup(); // Trigger the login popup
    } else {
        console.log("Authenticated User ID:", userID);
        // Proceed with fetching user details or other operations
        fetchUserDetails(userID);
    }
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

            // Append userID to the URL
            const urlParams = new URLSearchParams(window.location.search);
            const serviceId = urlParams.get("serviceId");

            if (!serviceId) {
                // document.getElementById("detailsContainer").innerHTML = "<p>Service ID not provided.</p>";
                console.log("Service ID not provided.");
                return;
            }
            window.location.href = `services.html?serviceId=${serviceId}&userId=${userID}`;

            // const newUrl = `${window.location.origin}${window.location.pathname}?userID=${userID}`;
            // window.history.pushState({ path: newUrl }, "", newUrl);

            alert("Login successful");
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


// Function to display user details
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

    fetchUserRequests(userID);
    fetchCompletedServices(userID); // Fetch user requests when details are displayed
}


// Check if a user is already logged in when the page loads
// document.addEventListener("DOMContentLoaded", () => {
//     if (userID) {
//         // Fetch user details using the stored user ID
//         fetch(`http://localhost:3000/users/${userID}`)
//             .then(response => response.json())
//             .then(data => {
//                 if (data.user) {
//                     displayUserDetails(data.user);
//                 } else {
//                     console.error("User data not found.");
//                     localStorage.removeItem("userID"); // Clear invalid user ID
//                 }
//             })
//             .catch(err => {
//                 console.error("Error fetching user data:", err);
//                 localStorage.removeItem("userID"); // Clear invalid user ID
//             });
//     }
// });

