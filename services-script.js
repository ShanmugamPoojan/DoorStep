document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');

    if (serviceId) {
        fetch(`http://localhost:3000/services/${serviceId}`)
            .then(response => response.json())
            .then(service => {
                document.getElementById("serviceName").textContent = service.service_name;
                document.getElementById("serviceDescription").textContent = service.service_description;
            })
            .catch(err => console.error("Error fetching service details:", err));
    } else {
        document.body.innerHTML = "<h1>Invalid Service ID</h1>";
        // console.log()
    }
});