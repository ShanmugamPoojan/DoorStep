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
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
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
	profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    provider_id INT NOT NULL,
    service_id INT NOT NULL,
    request_status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    available_timings ENUM('9-12', '12-15', '15-18', '18-21', 'anytime') NOT NULL,
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

INSERT INTO users (name, email, password, phone_number, address, profile_picture) VALUES
('Rajesh Kumar', 'rajesh.kumar@example.com', '1234', '9876543210', 'Bengaluru, Karnataka', NULL),
('Anita Singh', 'anita.singh@example.com', '1234', '9876543211', 'Delhi, Delhi', NULL),
('Vikram Iyer', 'vikram.iyer@example.com', '1234', '9876543212', 'Chennai, Tamil Nadu', NULL),
('Priya Sharma', 'priya.sharma@example.com', '1234', '9876543213', 'Mumbai, Maharashtra', NULL),
('Aman Gupta', 'aman.gupta@example.com', '1234', '9876543214', 'Kolkata, West Bengal', NULL);

INSERT INTO services_provided (service_name, service_description, service_category) VALUES
('Plumbing', 'Fixing water pipes, faucets, and other plumbing needs', 'Household'),
('Electrical', 'Electrical repairs, wiring, and appliance installation', 'Household'),
('Home Cleaning', 'Deep cleaning, dusting, and sanitization', 'Cleaning'),
('Cooking Services', 'Personal chefs for home-cooked meals', 'Catering'),
('Pest Control', 'Eliminating pests like rodents, insects, and termites', 'Sanitation');

INSERT INTO service_providers (provider_name, gender, email, password, phone_number, address, service_id, profile_picture, rating) VALUES
('Arun Mehta', 'Male', 'arun.mehta@example.com', '1234', '9898989890', 'Bengaluru, Karnataka', 1, NULL, 4.5),
('Ramesh Chawla', 'Male', 'ramesh.chawla@example.com', '1234', '9789789781', 'Mumbai, Maharashtra', 1, NULL, 4.2),
('Sushila Devi', 'Female', 'sushila.devi@example.com', '1234', '9679679672', 'Delhi, Delhi', 1, NULL, 4.7);

INSERT INTO service_providers (provider_name, gender, email, password, phone_number, address, service_id, profile_picture, rating) VALUES
('Vikas Yadav', 'Male', 'vikas.yadav@example.com', '1234', '9659659653', 'Chennai, Tamil Nadu', 2, NULL, 4.3),
('Neha Pandey', 'Female', 'neha.pandey@example.com', '1234', '9549549544', 'Kolkata, West Bengal', 2, NULL, 4.6),
('Kiran Reddy', 'Male', 'kiran.reddy@example.com', '1234', '9439439435', 'Hyderabad, Telangana', 2, NULL, 4.5);

INSERT INTO service_providers (provider_name, gender, email, password, phone_number, address, service_id, profile_picture, rating) VALUES
('Jyoti Verma', 'Female', 'jyoti.verma@example.com', '1234', '9329329326', 'Pune, Maharashtra', 3, NULL, 4.8),
('Ashok Mishra', 'Male', 'ashok.mishra@example.com', '1234', '9219219217', 'Lucknow, Uttar Pradesh', 3, NULL, 4.4),
('Meena Rathi', 'Female', 'meena.rathi@example.com', '1234', '9109109108', 'Jaipur, Rajasthan', 3, NULL, 4.6);

INSERT INTO service_providers (provider_name, gender, email, password, phone_number, address, service_id, profile_picture, rating) VALUES
('Priyanka Joshi', 'Female', 'priyanka.joshi@example.com', '1234', '9009009009', 'Ahmedabad, Gujarat', 4, NULL, 4.9),
('Rajiv Nair', 'Male', 'rajiv.nair@example.com', '1234', '8908908901', 'Kochi, Kerala', 4, NULL, 4.4),
('Smita Patil', 'Female', 'smita.patil@example.com', '1234', '8808808802', 'Mumbai, Maharashtra', 4, NULL, 4.7);

INSERT INTO service_providers (provider_name, gender, email, password, phone_number, address, service_id, profile_picture, rating) VALUES
('Manoj Kumar', 'Male', 'manoj.kumar@example.com', '1234', '8708708703', 'Delhi, Delhi', 5, NULL, 4.5),
('Rekha Singh', 'Female', 'rekha.singh@example.com', '1234', '8608608604', 'Bengaluru, Karnataka', 5, NULL, 4.8),
('Santosh Gupta', 'Male', 'santosh.gupta@example.com', '1234', '8508508505', 'Kolkata, West Bengal', 5, NULL, 4.2);

INSERT INTO service_requests (user_id, provider_id, service_id, request_status, available_timings, additional_notes) VALUES
(1, 1, 1, 'Pending', '9-12', 'Fixing a leaking pipe in the kitchen'),
(2, 2, 1, 'Completed', '12-15', 'Replace bathroom faucet'),
(3, 3, 2, 'In Progress', '15-18', 'Install a new ceiling fan'),
(4, 4, 3, 'Pending', 'anytime', 'Deep clean of the entire house'),
(5, 5, 4, 'Completed', '18-21', 'Prepare meals for a small family gathering'),
(1, 6, 5, 'Cancelled', '9-12', 'Pest control for ants in the kitchen'),
(2, 7, 3, 'In Progress', '15-18', 'Cleaning windows and carpets'),
(3, 8, 4, 'Pending', 'anytime', 'Daily cooking service for a week'),
(4, 9, 2, 'Completed', '12-15', 'Fixing electrical wiring issues');

INSERT INTO admin (admin_name, password_hash) 
VALUES 
('Admin1', 'hashedpassword1'),
('Admin2', 'hashedpassword2');

SELECT * FROM services_provided;
SELECT * FROM service_providers;
SELECT * FROM users;
SELECT * FROM service_requests;
SELECT * FROM admin;