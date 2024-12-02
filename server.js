const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'doorstep'
});

(async () => {
    try {
        await db.getConnection(); // Test connection
        console.log('Connected to database');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // Exit process on failure
    }
})();

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// Fetch providers
app.get('/providers', async (req, res) => {
    try {
        const [providers] = await db.query('SELECT * FROM service_providers');
        res.json(providers);
    } catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).json({ error: 'Failed to fetch providers' });
    }
});

// Fetch requests
app.get('/requests', async (req, res) => {
    try {
        const [requests] = await db.query('SELECT * FROM service_requests');
        res.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Fetch all services
app.get('/services', async (req, res) => {
    try {
        const [services] = await db.query('SELECT * FROM services_provided');
        res.json(services); // Send services data to the frontend
    } catch (error) {
        console.error('Error fetching services:', error.message);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});


// Add user
app.post('/users', (req, res) => {
    const { name, email, phone, address } = req.body;
    db.query('INSERT INTO users (name, email, phone_number, address) VALUES (?, ?, ?, ?)',
        [name, email, phone, address], 
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'User registered successfully!' });
        });
});

// Add provider
app.post('/providers', (req, res) => {
    const { name, email, phone, address, service } = req.body;
    db.query('INSERT INTO service_providers (provider_name, email, phone_number, address, service_id) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone, address, service], 
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Service provider registered successfully!' });
        });
});

app.get('/services/:id', async (req, res) => {
    const serviceId = req.params.id;

    try {
        const [result] = await db.query('SELECT * FROM services_provided WHERE service_id = ?', [serviceId]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(result[0]); // Return the service details
    } catch (error) {
        console.error('Error fetching service details:', error);
        res.status(500).json({ error: 'Failed to fetch service details' });
    }
});


// Main route handler to handle the /services/:id request
app.get('/services/:id', async (req, res) => {
    const serviceId = req.params.id;

    try {
        // Fetch service details

        const [serviceResult] = await db.query('SELECT * FROM services_provided WHERE service_id = ?', [serviceId]);

        if (serviceResult.length === 0) {
            throw new Error('Service not found');
        }
        const service = serviceResult[0];

        // Return both service and provider data
        res.json(service);
    } catch (error) {
        console.error('Error in /services/:id route:', error);
        res.status(500).json({ error: 'Failed to fetch service or provider data' });
    }
});
app.get('/providers/:id', async (req, res) => {
    const serviceId = req.params.id;

    try {
        // Fetch service details
        const [providers] = await db.query(
            'SELECT provider_id, provider_name, email, phone_number, address, profile_picture, rating FROM service_providers WHERE service_id = ?',
            [serviceId]
        );

        // providerResults = providerResults.length > 0 ? providerResults : [];

        // Return both service and provider data
        res.json(providers);
    } catch (error) {
        console.error('Error in /services/:id route:', error);
        res.status(500).json({ error: 'Failed to fetch service or provider data' });
    }
});

// Fetch available service categories
app.get('/service-categories', async (req, res) => {
    try {
        const query = 'SELECT DISTINCT service_category FROM services_provided';
        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No categories found' });
        }

        const categories = results.map(row => row.service_category);
        res.status(200).json({ success: true, categories });
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ success: false, message: 'Database query failed' });
    }
});


// Register a service provider
app.post('/providers/register', async (req, res) => {
    const { provider_name, email, phone_number, address, category, newCategory, service_name, password } = req.body;

    try {
        // Resolve category ID: fetch existing or insert new
        let categoryId;

        // Check if a new category is provided
        if (newCategory) {
            // Insert new category into the services_provided table
            const insertCategoryQuery = `INSERT INTO services_provided (service_name, service_category) VALUES (?, ?)`;
            const [categoryResult] = await db.query(insertCategoryQuery, [service_name, newCategory]);
            categoryId = categoryResult.insertId; // Use the newly created category ID
        } else {
            // Fetch the existing category ID
            const fetchCategoryQuery = `SELECT service_id FROM services_provided WHERE service_category = ? LIMIT 1`;
            const [categoryRows] = await db.query(fetchCategoryQuery, [category]);

            if (categoryRows.length === 0) {
                return res.status(400).json({ success: false, message: "Invalid category provided." });
            }
            categoryId = categoryRows[0].service_id; // Use the existing category ID
        }

        // Insert provider details into the service_providers table
        const providerQuery = `
            INSERT INTO service_providers (provider_name, email, phone_number, address, service_id, password)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [providerResult] = await db.query(providerQuery, [
            provider_name,
            email,
            phone_number,
            address,
            categoryId,
            password,
        ]);

        res.status(201).json({
            success: true,
            message: "Service provider registered successfully.",
            provider_id: providerResult.insertId,
        });
    } catch (error) {
        console.error("Error during provider registration:", error);
        res.status(500).json({ success: false, message: "Failed to register service provider." });
    }
});
// Route to fetch provider details by provider ID
app.get('/providers-details/:providerId', async (req, res) => {
    const { providerId } = req.params;

    try {
        const query = `
            SELECT provider_name, email, phone_number, address, service_id
            FROM service_providers
            WHERE provider_id = ?
        `;
        const [rows] = await db.query(query, [providerId]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Provider not found." });
        }

        res.json({ success: true, provider: rows[0] });
    } catch (error) {
        console.error("Error fetching provider details:", error);
        res.status(500).json({ success: false, message: "Failed to fetch provider details." });
    }
});
// Route to fetch service history for a provider
app.get('/providers/:providerId/service-history', async (req, res) => {
    const { providerId } = req.params;

    try {
        const query = `
            SELECT 
                sr.request_id,
                u.name AS user_name,
                u.email AS user_email,
                u.phone_number AS user_phone,
                sp.service_name,
                sr.request_status,
                sr.request_date,
                sr.available_timings,
                sr.additional_notes
            FROM service_requests sr
            JOIN users u ON sr.user_id = u.user_id
            JOIN services_provided sp ON sr.service_id = sp.service_id
            WHERE sr.provider_id = ?
            ORDER BY sr.request_date DESC
        `;

        const [rows] = await db.query(query, [providerId]);

        res.json({ success: true, serviceHistory: rows });
    } catch (error) {
        console.error("Error fetching service history:", error);
        res.status(500).json({ success: false, message: "Failed to fetch service history." });
    }
});




// User Registration
app.post("/users/register", async (req, res) => {
    const { name, email, password, phone, address } = req.body;

    try {
        const query = `
            INSERT INTO users (name, email, password, phone_number, address)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.query(query, [name, email, password, phone, address]);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Failed to register user." });
    }
});

// User Login
app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const user = rows[0];

        if (password !== user.password) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        res.json({
            message: "Login successful!",
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                address: user.address,
            },
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Failed to log in user." });
    }
});

// Route to fetch user details by ID
// Route to fetch user details by user ID
app.get('/user-details/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const query = `
            SELECT name, email, phone_number, address
            FROM users
            WHERE user_id = ?
        `;
        const [rows] = await db.query(query, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.json({ success: true, user: rows[0] });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ success: false, message: "Failed to fetch user details." });
    }
});




// Update User Details
app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    try {
        const query = `
            UPDATE users
            SET
                name = COALESCE(?, name),
                email = COALESCE(?, email),
                phone_number = COALESCE(?, phone_number),
                address = COALESCE(?, address)
            WHERE user_id = ?
        `;
        const [result] = await db.query(query, [name, email, phone, address, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        // Return updated user details
        const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [id]);
        res.json({ message: "User updated successfully!", user: rows[0] });
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ error: "Failed to update user details." });
    }
});

app.get('/service-details/:id', async (req, res) => {
    const serviceId = req.params.id;

    try {
        // Fetch service details
        const [serviceDetails] = await db.query(
            'SELECT * FROM services_provided WHERE service_id = ?',
            [serviceId]
        );

        // Fetch providers for the service
        const [serviceProviders] = await db.query(
            'SELECT provider_id, provider_name, email, phone_number, address, rating, profile_picture FROM service_providers WHERE service_id = ?',
            [serviceId]
        );

        res.json({ service: serviceDetails[0], providers: serviceProviders });
    } catch (error) {
        console.error('Error fetching service details:', error);
        res.status(500).json({ error: 'Failed to fetch service details' });
    }
});

app.get("/users/:userId/requests", async (req, res) => {
    const userId = req.params.userId;
    const { status } = req.query; // Optional status filter

    try {
        let query = `
            SELECT sr.request_id, sr.request_status, sr.request_date, sr.available_timings, sr.additional_notes,
                   sp.profile_picture ,sp.provider_name, sp.phone_number,  s.service_name
            FROM service_requests sr
            JOIN service_providers sp ON sr.provider_id = sp.provider_id
            JOIN services_provided s ON sr.service_id = s.service_id
            WHERE sr.user_id = ?
        `;

        const queryParams = [userId];

        // Add status filter if provided
        if (status) {
            query += " AND sr.request_status = ?";
            queryParams.push(status);
        }

        const [requests] = await db.query(query, queryParams);
        res.json({ requests });
    } catch (error) {
        console.error("Error fetching service requests:", error);
        res.status(500).json({ error: "Failed to fetch service requests." });
    }
});

app.delete("/requests/:requestId", async (req, res) => {
    const requestId = req.params.requestId;

    try {
        const [result] = await db.query("DELETE FROM service_requests WHERE request_id = ?", [requestId]);

        if (result.affectedRows > 0) {
            res.json({ message: "Request successfully canceled." });
        } else {
            res.status(404).json({ error: "Request not found." });
        }
    } catch (error) {
        console.error("Error deleting request:", error);
        res.status(500).json({ error: "Failed to cancel the request." });
    }
});








// POST /service_requests - Handle service booking
app.post('/service_requests', async (req, res) => {
    const { user_id, provider_id, service_id, available_timings, additional_notes } = req.body;

    // Validate required fields
    if (!user_id || !provider_id || !service_id || !available_timings) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    try {
        // Validate user exists
        const [userRows] = await db.query(`SELECT user_id FROM users WHERE user_id = ?`, [user_id]);
        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Validate provider exists
        const [providerRows] = await db.query(`SELECT provider_id FROM service_providers WHERE provider_id = ?`, [provider_id]);
        if (providerRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Service provider not found.' });
        }

        // Validate service exists
        const [serviceRows] = await db.query(`SELECT service_id FROM services_provided WHERE service_id = ?`, [service_id]);
        if (serviceRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Service not found.' });
        }

        // Insert booking into service_requests table
        const query = `
            INSERT INTO service_requests (user_id, provider_id, service_id, available_timings, additional_notes)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [user_id, provider_id, service_id, available_timings, additional_notes || null]);

        res.status(201).json({
            success: true,
            message: 'Service booked successfully.',
            request_id: result.insertId,
        });
    } catch (error) {
        console.error('Error inserting service request:', error);
        res.status(500).json({ success: false, message: 'Failed to book the service.' });
    }
});










// Login Service Provider
app.post('/providers/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [rows] = await db.query(
            `SELECT provider_id, provider_name, email, phone_number, address, service_id, profile_picture
             FROM service_providers
             WHERE email = ? AND password = ?`,
            [email, password]
        );
        
        if (rows.length > 0) {
            res.json({ message: "Login successful.", provider: rows[0] });
        } else {
            res.status(401).json({ error: "Invalid email or password." });
        }
    } catch (error) {
        console.error("Error during provider login:", error);
        res.status(500).json({ error: "Failed to login service provider." });
    }
});

// Route to fetch service requests based on provider_id
app.get('/providers/:providerId/requests', async (req, res) => {
    const { providerId } = req.params;

    try {
        const query = `
            SELECT r.request_id, r.user_id, r.service_id, r.request_status, r.request_date, r.available_timings, r.additional_notes, 
                   s.service_name, s.service_category, u.name AS user_name, u.email AS user_email, u.phone_number AS user_phone
            FROM service_requests r
            JOIN services_provided s ON r.service_id = s.service_id
            JOIN users u ON r.user_id = u.user_id
            WHERE r.provider_id = ?
        `;

        const [rows] = await db.query(query, [providerId]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "No service requests found for this provider." });
        }

        res.json({ success: true, requests: rows });
    } catch (error) {
        console.error("Error fetching service requests:", error);
        res.status(500).json({ success: false, message: "Failed to fetch service requests." });
    }
});

// Route to update the status of a service request
app.put('/requests/:requestId/status', async (req, res) => {
    const { requestId } = req.params;
    const { newStatus } = req.body; // 'Pending', 'In Progress', 'Completed', 'Cancelled'

    try {
        const query = `
            UPDATE service_requests
            SET request_status = ?
            WHERE request_id = ?
        `;

        const [result] = await db.query(query, [newStatus, requestId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Service request not found." });
        }

        res.json({ success: true, message: "Service request status updated." });
    } catch (error) {
        console.error("Error updating service request status:", error);
        res.status(500).json({ success: false, message: "Failed to update service request status." });
    }
});





// Fetch all services
app.get('/admin/services', (req, res) => {
    const query = 'SELECT * FROM services_provided';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching services:', err); // Logs detailed error
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, services: results });
    });
});


// Fetch all service providers
app.get('/admin/service-providers', (req, res) => {
    const query = 'SELECT * FROM service_providers';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching service providers:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, providers: results });
    });
});

// Fetch all users
app.get('/admin/users', (req, res) => {
    const query = 'SELECT * FROM users';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, users: results });
    });
});

// Fetch all service requests
app.get('/admin/service-requests', (req, res) => {
    const query = 'SELECT * FROM service_requests';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching service requests:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, requests: results });
    });
});

// Delete service
app.delete('/admin/services/:serviceId', (req, res) => {
    const { serviceId } = req.params;

    const query = 'DELETE FROM services_provided WHERE service_id = ?';
    db.query(query, [serviceId], (err, result) => {
        if (err) {
            console.error('Error deleting service:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, message: 'Service deleted successfully' });
    });
});

// Delete service provider
app.delete('/admin/service-providers/:providerId', (req, res) => {
    const { providerId } = req.params;

    const query = 'DELETE FROM service_providers WHERE provider_id = ?';
    db.query(query, [providerId], (err, result) => {
        if (err) {
            console.error('Error deleting service provider:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, message: 'Service provider deleted successfully' });
    });
});

// Delete user
app.delete('/admin/users/:userId', (req, res) => {
    const { userId } = req.params;

    const query = 'DELETE FROM users WHERE user_id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    });
});

// Delete service request
app.delete('/admin/service-requests/:requestId', (req, res) => {
    const { requestId } = req.params;

    const query = 'DELETE FROM service_requests WHERE request_id = ?';
    db.query(query, [requestId], (err, result) => {
        if (err) {
            console.error('Error deleting service request:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, message: 'Service request deleted successfully' });
    });
});