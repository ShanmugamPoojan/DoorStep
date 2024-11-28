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
    available_timings ENUM('9-12', '12-15', '15-18', '18-21') NOT NULL,
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
	
INSERT INTO services_provided (service_name, service_description, service_category) 
VALUES 
('Coock', 'Veg and non veg', 'Home Maintenance');

INSERT INTO service_providers (provider_name, email, password, phone_number, address, service_id, profile_picture, rating) 
VALUES 
('John Doe', 'john.doe@example.com', '1234', '9876543210', '123 Main Street, Cityville', 1, 'images/img.jpg', 4.5),
('Alice Smith', 'alice.smith@example.com','1234', '8765432109', '45 Market Road, Townsville', 2, 'images/img.jpg', 4.8),
('Robert Brown', 'robert.brown@example.com', '1234','7654321098', '67 Baker Street, Cityville', 3, 'images/img.jpg', 4.3),
('Emily Davis', 'emily.davis@example.com','1234', '6543210987', '89 King Avenue, Suburbia', 4, 'images/img.jpg', 4.9),
('Michael Clark', 'michael.clark@example.com','1234', '5432109876', '23 Greenway Blvd, Uptown', 5, 'images/img.jpg', 4.7),
('John Doe', 'john.do@example.com', '1234', '9876543210', '123 Main Street, Cityville', 1, 'images/img.jpg', 4.5),
('Alice Smith', 'alie.smith@example.com','1234', '8765432109', '45 Market Road, Townsville', 2, 'images/img.jpg', 4.8),
('Robert Brown', 'rbert.brown@example.com', '1234','7654321098', '67 Baker Street, Cityville', 3, 'images/img.jpg', 4.3),
('Emily Davis', 'eily.davis@example.com','1234', '6543210987', '89 King Avenue, Suburbia', 4, 'images/img.jpg', 4.9),
('Michael Clark', 'ichael.clark@example.com','1234', '5432109876', '23 Greenway Blvd, Uptown', 5, 'images/img.jpg', 4.7),
('John Doe', 'johdoe@example.com', '1234', '9876543210', '123 Main Street, Cityville', 1, 'images/img.jpg', 4.5),
('Alice Smith', 'alce.smith@example.com','1234', '8765432109', '45 Market Road, Townsville', 2, 'images/img.jpg', 4.8),
('Robert Brown', 'obert.brown@example.com', '1234','7654321098', '67 Baker Street, Cityville', 3, 'images/img.jpg', 4.3),
('Emily Davis', 'ely.davis@example.com','1234', '6543210987', '89 King Avenue, Suburbia', 4, 'images/img.jpg', 4.9),
('Michael Clark', 'mihael.clark@example.com','1234', '5432109876', '23 Greenway Blvd, Uptown', 5, 'images/img.jpg', 4.7),
('John Doe', 'johe@example.com', '1234', '9876543210', '123 Main Street, Cityville', 1, 'images/img.jpg', 4.5),
('Alice Smith', 'alicmith@example.com','1234', '8765432109', '45 Market Road, Townsville', 2, 'images/img.jpg', 4.8),
('Robert Brown', 'ro.brown@example.com', '1234','7654321098', '67 Baker Street, Cityville', 3, 'images/img.jpg', 4.3),
('Emily Davis', 'ey.davis@example.com','1234', '6543210987', '89 King Avenue, Suburbia', 4, 'images/img.jpg', 4.9),
('Michael Clark', 'hael.clark@example.com','1234', '5432109876', '23 Greenway Blvd, Uptown', 5, 'images/img.jpg', 4.7),
('John Doe', 'joe@example.com', '1234', '9876543210', '123 Main Street, Cityville', 1, 'images/img.jpg', 4.5),
('Alice Smith', 'alice@example.com','1234', '8765432109', '45 Market Road, Townsville', 2, 'images/img.jpg', 4.8),
('Robert Brown', 'rort.brwn@example.com', '1234','7654321098', '67 Baker Street, Cityville', 3, 'images/img.jpg', 4.3),
('Emily Davis', 'emi.davis@example.com','1234', '6543210987', '89 King Avenue, Suburbia', 4, 'images/img.jpg', 4.9),
('Michael Clark', 'ml.clark@example.com','1234', '5432109876', '23 Greenway Blvd, Uptown', 5, 'images/img.jpg', 4.7);

INSERT INTO users (name, email, password, phone_number, address, profile_picture) 
VALUES 
('Charlie White', 'charlie.white@example.com', '1234','9123456789', '10 Sunset Drive, Cityville', 'images/img.jpg'),
('Sophia Taylor', 'sophia.taylor@example.com','1234', '8234567890', '5 Elm Street, Townsville', 'images/img.jpg'),
('Liam Wilson', 'liam.wilson@example.com','1234', '7345678901', '18 Maple Road, Uptown', 'images/img.jpg'),
('Emma Martin', 'emma.martin@example.com', '1234','6456789012', '22 River Lane, Suburbia', 'images/img.jpg');

INSERT INTO service_requests (user_id, provider_id, service_id, request_status, available_timings, additional_notes) 
VALUES 
(1, 1, 1, 'Pending', '12-15', 'Fix a leaking faucet in the kitchen'),
(2, 2, 2, 'In Progress', '12-15', 'Install new ceiling lights in the living room'),
(3, 3, 3, 'Completed', '12-15', 'Deep cleaning service for a 3-bedroom apartment'),
(4, 4, 4, 'Cancelled', '12-15', 'Pest control for a small garden area');
INSERT INTO service_requests (user_id, provider_id, service_id, request_status, available_timings, additional_notes) 
VALUES 
(1, 1, 1, 'Pending', '12-15', 'Fix a leaking faucet in the kitchen'),
(2, 2, 2, 'In Progress', '12-15', 'Install new ceiling lights in the living room'),
(3, 3, 3, 'Completed', '12-15', 'Deep cleaning service for a 3-bedroom apartment'),
(4, 4, 4, 'Cancelled', '12-15', 'Pest control for a small garden area');

INSERT INTO admin (admin_name, password_hash) 
VALUES 
('Admin1', 'hashedpassword1'),
('Admin2', 'hashedpassword2');

SELECT * FROM services_provided;
SELECT * FROM service_providers;
SELECT * FROM users;
SELECT * FROM service_requests;
SELECT * FROM admin;

SELECT provider_name, email, phone_number, address, profile_picture, rating FROM service_providers WHERE service_id = 1;

INSERT INTO service_providers (provider_name, email, password, phone_number, address, service_id, profile_picture, rating) 
VALUES 
('Suman', 'suman@example.com', '1234', '9876543210', '123 Main Street, Cityville', 1, 'images/serviceProvider.jpg', 4.5);

SELECT * FROM users WHERE email ='charlie.white@example.com' ;

SELECT sr.request_id, sr.request_status, sr.request_date, sr.additional_notes,
                    sp.provider_name, s.service_name
             FROM service_requests sr
             JOIN service_providers sp ON sr.provider_id = sp.provider_id
             JOIN services_provided s ON sr.service_id = s.service_id
             WHERE sr.user_id = 1;
             
INSERT INTO services_provided (service_name, service_description, service_category) VALUES
('House Cleaning', 'Professional cleaning services for your home, including dusting, vacuuming, and mopping.', 'Cleaning'),
('Plumbing', 'Repair and maintenance services for leaking pipes, clogged drains, and more.', 'Maintenance'),
('Electrical Repairs', 'Fixing electrical issues, installing new appliances, and ensuring safety.', 'Maintenance'),
('Gardening', 'Lawn mowing, planting, and garden maintenance services.', 'Outdoor Services'),
('Pest Control', 'Eliminating pests like termites, rodents, and insects from your premises.', 'Sanitation'),
('Cooking Services', 'Personal chefs and home-cooking services for your daily needs.', 'Food Services'),
('Tutoring', 'Educational support for students in various subjects.', 'Education'),
('Babysitting', 'Childcare services provided by experienced and trained professionals.', 'Family Services'),
('Carpentry', 'Custom furniture building, repairs, and woodworking services.', 'Home Improvement'),
('Painting', 'Interior and exterior painting services for homes and offices.', 'Home Improvement'),
('AC Repair', 'Air conditioning repair, installation, and maintenance services.', 'Maintenance'),
('Laundry Service', 'Washing, drying, and ironing clothes with pickup and delivery options.', 'Cleaning'),
('Pet Grooming', 'Professional grooming services for pets, including baths, haircuts, and nail trimming.', 'Pet Services'),
('Home Security Installation', 'Setup and maintenance of security cameras and alarm systems.', 'Security'),
('Fitness Training', 'Personal fitness training sessions tailored to individual goals.', 'Wellness'),
('Event Planning', 'Organizing and managing personal and corporate events.', 'Event Management'),
('Photography', 'Professional photography services for events, portraits, and more.', 'Media Services'),
('Moving and Packing', 'Assistance with packing, moving, and unpacking household items.', 'Logistics'),
('IT Support', 'Troubleshooting computer and network issues for homes and businesses.', 'Technology Services'),
('Car Wash', 'On-site car washing and detailing services for your convenience.', 'Automobile Services'),
('Appliance Repair', 'Fixing household appliances like refrigerators, washing machines, and ovens.', 'Maintenance'),
('Yoga Classes', 'Yoga sessions for improving flexibility, strength, and relaxation.', 'Wellness'),
('Music Lessons', 'Teaching various musical instruments and vocal training.', 'Education'),
('Home Renovation', 'Complete home remodeling and renovation services.', 'Home Improvement'),
('Massage Therapy', 'Relaxation and therapeutic massages for stress relief and wellness.', 'Wellness'),
('Courier Service', 'Reliable pickup and delivery services for documents and packages.', 'Logistics'),
('Interior Design', 'Designing and decorating interiors to match your style and preferences.', 'Home Improvement'),
('Personal Shopping', 'Assistance with shopping for groceries, clothes, and other items.', 'Lifestyle Services'),
('Elderly Care', 'Compassionate caregiving services for elderly individuals.', 'Family Services'),
('Tailoring Services', 'Custom tailoring and alteration services for all types of clothing.', 'Fashion Services');

INSERT INTO services_provided (service_name, service_description, service_category) VALUES
('House Cleaning', 'Professional cleaning services for your home, including dusting, vacuuming, and mopping.', 'Cleaning'),
('Plumbing', 'Repair and maintenance services for leaking pipes, clogged drains, and more.', 'Maintenance'),
('Electrical Repairs', 'Fixing electrical issues, installing new appliances, and ensuring safety.', 'Maintenance'),
('Gardening', 'Lawn mowing, planting, and garden maintenance services.', 'Outdoor Services'),
('Pest Control', 'Eliminating pests like termites, rodents, and insects from your premises.', 'Sanitation'),
('Cooking Services', 'Personal chefs and home-cooking services for your daily needs.', 'Food Services'),
('Tutoring', 'Educational support for students in various subjects.', 'Education'),
('Babysitting', 'Childcare services provided by experienced and trained professionals.', 'Family Services'),
('Carpentry', 'Custom furniture building, repairs, and woodworking services.', 'Home Improvement'),
('Painting', 'Interior and exterior painting services for homes and offices.', 'Home Improvement'),
('AC Repair', 'Air conditioning repair, installation, and maintenance services.', 'Maintenance'),
('Laundry Service', 'Washing, drying, and ironing clothes with pickup and delivery options.', 'Cleaning'),
('Pet Grooming', 'Professional grooming services for pets, including baths, haircuts, and nail trimming.', 'Pet Services'),
('Home Security Installation', 'Setup and maintenance of security cameras and alarm systems.', 'Security'),
('Fitness Training', 'Personal fitness training sessions tailored to individual goals.', 'Wellness'),
('Event Planning', 'Organizing and managing personal and corporate events.', 'Event Management'),
('Photography', 'Professional photography services for events, portraits, and more.', 'Media Services'),
('Moving and Packing', 'Assistance with packing, moving, and unpacking household items.', 'Logistics'),
('IT Support', 'Troubleshooting computer and network issues for homes and businesses.', 'Technology Services'),
('Car Wash', 'On-site car washing and detailing services for your convenience.', 'Automobile Services'),
('Appliance Repair', 'Fixing household appliances like refrigerators, washing machines, and ovens.', 'Maintenance'),
('Yoga Classes', 'Yoga sessions for improving flexibility, strength, and relaxation.', 'Wellness'),
('Music Lessons', 'Teaching various musical instruments and vocal training.', 'Education'),
('Home Renovation', 'Complete home remodeling and renovation services.', 'Home Improvement'),
('Massage Therapy', 'Relaxation and therapeutic massages for stress relief and wellness.', 'Wellness'),
('Courier Service', 'Reliable pickup and delivery services for documents and packages.', 'Logistics'),
('Interior Design', 'Designing and decorating interiors to match your style and preferences.', 'Home Improvement'),
('Personal Shopping', 'Assistance with shopping for groceries, clothes, and other items.', 'Lifestyle Services'),
('Elderly Care', 'Compassionate caregiving services for elderly individuals.', 'Family Services'),
('Tailoring Services', 'Custom tailoring and alteration services for all types of clothing.', 'Fashion Services');
INSERT INTO services_provided (service_name, service_description, service_category) VALUES
('House Cleaning', 'Professional cleaning services for your home, including dusting, vacuuming, and mopping.', 'Cleaning'),
('Plumbing', 'Repair and maintenance services for leaking pipes, clogged drains, and more.', 'Maintenance'),
('Electrical Repairs', 'Fixing electrical issues, installing new appliances, and ensuring safety.', 'Maintenance'),
('Gardening', 'Lawn mowing, planting, and garden maintenance services.', 'Outdoor Services'),
('Pest Control', 'Eliminating pests like termites, rodents, and insects from your premises.', 'Sanitation'),
('Cooking Services', 'Personal chefs and home-cooking services for your daily needs.', 'Food Services'),
('Tutoring', 'Educational support for students in various subjects.', 'Education'),
('Babysitting', 'Childcare services provided by experienced and trained professionals.', 'Family Services'),
('Carpentry', 'Custom furniture building, repairs, and woodworking services.', 'Home Improvement'),
('Painting', 'Interior and exterior painting services for homes and offices.', 'Home Improvement'),
('AC Repair', 'Air conditioning repair, installation, and maintenance services.', 'Maintenance'),
('Laundry Service', 'Washing, drying, and ironing clothes with pickup and delivery options.', 'Cleaning'),
('Pet Grooming', 'Professional grooming services for pets, including baths, haircuts, and nail trimming.', 'Pet Services'),
('Home Security Installation', 'Setup and maintenance of security cameras and alarm systems.', 'Security'),
('Fitness Training', 'Personal fitness training sessions tailored to individual goals.', 'Wellness'),
('Event Planning', 'Organizing and managing personal and corporate events.', 'Event Management'),
('Photography', 'Professional photography services for events, portraits, and more.', 'Media Services'),
('Moving and Packing', 'Assistance with packing, moving, and unpacking household items.', 'Logistics'),
('IT Support', 'Troubleshooting computer and network issues for homes and businesses.', 'Technology Services'),
('Car Wash', 'On-site car washing and detailing services for your convenience.', 'Automobile Services'),
('Appliance Repair', 'Fixing household appliances like refrigerators, washing machines, and ovens.', 'Maintenance'),
('Yoga Classes', 'Yoga sessions for improving flexibility, strength, and relaxation.', 'Wellness'),
('Music Lessons', 'Teaching various musical instruments and vocal training.', 'Education'),
('Home Renovation', 'Complete home remodeling and renovation services.', 'Home Improvement'),
('Massage Therapy', 'Relaxation and therapeutic massages for stress relief and wellness.', 'Wellness'),
('Courier Service', 'Reliable pickup and delivery services for documents and packages.', 'Logistics'),
('Interior Design', 'Designing and decorating interiors to match your style and preferences.', 'Home Improvement'),
('Personal Shopping', 'Assistance with shopping for groceries, clothes, and other items.', 'Lifestyle Services'),
('Elderly Care', 'Compassionate caregiving services for elderly individuals.', 'Family Services'),
('Tailoring Services', 'Custom tailoring and alteration services for all types of clothing.', 'Fashion Services');
INSERT INTO services_provided (service_name, service_description, service_category) VALUES
('House Cleaning', 'Professional cleaning services for your home, including dusting, vacuuming, and mopping.', 'Cleaning'),
('Plumbing', 'Repair and maintenance services for leaking pipes, clogged drains, and more.', 'Maintenance'),
('Electrical Repairs', 'Fixing electrical issues, installing new appliances, and ensuring safety.', 'Maintenance'),
('Gardening', 'Lawn mowing, planting, and garden maintenance services.', 'Outdoor Services'),
('Pest Control', 'Eliminating pests like termites, rodents, and insects from your premises.', 'Sanitation'),
('Cooking Services', 'Personal chefs and home-cooking services for your daily needs.', 'Food Services'),
('Tutoring', 'Educational support for students in various subjects.', 'Education'),
('Babysitting', 'Childcare services provided by experienced and trained professionals.', 'Family Services'),
('Carpentry', 'Custom furniture building, repairs, and woodworking services.', 'Home Improvement'),
('Painting', 'Interior and exterior painting services for homes and offices.', 'Home Improvement'),
('AC Repair', 'Air conditioning repair, installation, and maintenance services.', 'Maintenance'),
('Laundry Service', 'Washing, drying, and ironing clothes with pickup and delivery options.', 'Cleaning'),
('Pet Grooming', 'Professional grooming services for pets, including baths, haircuts, and nail trimming.', 'Pet Services'),
('Home Security Installation', 'Setup and maintenance of security cameras and alarm systems.', 'Security'),
('Fitness Training', 'Personal fitness training sessions tailored to individual goals.', 'Wellness'),
('Event Planning', 'Organizing and managing personal and corporate events.', 'Event Management'),
('Photography', 'Professional photography services for events, portraits, and more.', 'Media Services'),
('Moving and Packing', 'Assistance with packing, moving, and unpacking household items.', 'Logistics'),
('IT Support', 'Troubleshooting computer and network issues for homes and businesses.', 'Technology Services'),
('Car Wash', 'On-site car washing and detailing services for your convenience.', 'Automobile Services'),
('Appliance Repair', 'Fixing household appliances like refrigerators, washing machines, and ovens.', 'Maintenance'),
('Yoga Classes', 'Yoga sessions for improving flexibility, strength, and relaxation.', 'Wellness'),
('Music Lessons', 'Teaching various musical instruments and vocal training.', 'Education'),
('Home Renovation', 'Complete home remodeling and renovation services.', 'Home Improvement'),
('Massage Therapy', 'Relaxation and therapeutic massages for stress relief and wellness.', 'Wellness'),
('Courier Service', 'Reliable pickup and delivery services for documents and packages.', 'Logistics'),
('Interior Design', 'Designing and decorating interiors to match your style and preferences.', 'Home Improvement'),
('Personal Shopping', 'Assistance with shopping for groceries, clothes, and other items.', 'Lifestyle Services'),
('Elderly Care', 'Compassionate caregiving services for elderly individuals.', 'Family Services'),
('Tailoring Services', 'Custom tailoring and alteration services for all types of clothing.', 'Fashion Services');
