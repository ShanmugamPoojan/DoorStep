CREATE DATABASE doorstep;
USE doorstep;

CREATE TABLE services_provided (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    service_description TEXT,
    service_category VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_providers (
    provider_id INT AUTO_INCREMENT PRIMARY KEY,
    provider_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(25) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    address TEXT,
    service_id INT NOT NULL,
    profile_picture VARCHAR(255),
    rating DECIMAL(2,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services_provided(service_id) ON DELETE CASCADE
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(25) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    provider_id INT NOT NULL,
    service_id INT NOT NULL,
    request_status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    additional_notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES service_providers(provider_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services_provided(service_id) ON DELETE CASCADE
);

CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

INSERT INTO services_provided (service_name, service_description, service_category) 
VALUES 
('Plumbing', 'Fixing leaks, pipe installation, and repairs', 'Home Maintenance'),
('Electrician', 'Wiring, installations, and electrical repairs', 'Home Maintenance'),
('House Cleaning', 'Regular and deep cleaning services', 'Cleaning'),
('Pest Control', 'Eliminating pests and insects from your home', 'Home Maintenance'),
('Babysitting', 'Professional care for your children', 'Personal Services');

INSERT INTO service_providers (provider_name, email, password, phone_number, address, service_id, profile_picture, rating) 
VALUES 
('John Doe', 'john.doe@example.com', '1234', '9876543210', '123 Main Street, Cityville', 1, '/images/john_doe.jpg', 4.5),
('Alice Smith', 'alice.smith@example.com','1234', '8765432109', '45 Market Road, Townsville', 2, '/images/alice_smith.jpg', 4.8),
('Robert Brown', 'robert.brown@example.com', '1234','7654321098', '67 Baker Street, Cityville', 3, '/images/robert_brown.jpg', 4.3),
('Emily Davis', 'emily.davis@example.com','1234', '6543210987', '89 King Avenue, Suburbia', 4, '/images/emily_davis.jpg', 4.9),
('Michael Clark', 'michael.clark@example.com','1234', '5432109876', '23 Greenway Blvd, Uptown', 5, '/images/michael_clark.jpg', 4.7);

INSERT INTO users (name, email, password, phone_number, address) 
VALUES 
('Charlie White', 'charlie.white@example.com', '1234','9123456789', '10 Sunset Drive, Cityville'),
('Sophia Taylor', 'sophia.taylor@example.com','1234', '8234567890', '5 Elm Street, Townsville'),
('Liam Wilson', 'liam.wilson@example.com','1234', '7345678901', '18 Maple Road, Uptown'),
('Emma Martin', 'emma.martin@example.com', '1234','6456789012', '22 River Lane, Suburbia');

INSERT INTO service_requests (user_id, provider_id, service_id, request_status, additional_notes) 
VALUES 
(1, 1, 1, 'Pending', 'Fix a leaking faucet in the kitchen'),
(2, 2, 2, 'In Progress', 'Install new ceiling lights in the living room'),
(3, 3, 3, 'Completed', 'Deep cleaning service for a 3-bedroom apartment'),
(4, 4, 4, 'Cancelled', 'Pest control for a small garden area');

INSERT INTO admin (admin_name, password_hash) 
VALUES 
('Admin1', 'hashedpassword1'),
('Admin2', 'hashedpassword2');

SELECT * FROM services_provided;
SELECT * FROM service_providers;
SELECT * FROM users;
SELECT * FROM service_requests;
SELECT * FROM admin;