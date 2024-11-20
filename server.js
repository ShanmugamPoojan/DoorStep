const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'doorstep'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});


db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// Fetch services
app.get('/services', (req, res) => {
    db.query('SELECT * FROM services_provided', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
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

app.get('/services/:id', (req, res) => {
    const serviceId = req.params.id;
    const query = 'SELECT * FROM services_provided WHERE service_id = ?';
    db.query(query, [serviceId], (err, results) => {
        if (err) {
            res.status(500).json({ error: "Database error" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "Service not found" });
        } else {
            res.json(results[0]);
        }
    });
});

app.post('/login/user', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error.' });
        } else if (results.length === 0) {
            res.status(401).json({ error: 'Invalid email or password.' });
        } else {
            const user = results[0];
            res.status(200).json({
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                phone: user.phone_number,
                address: user.address
            });
        }
    });
});

app.post('/login/provider', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM service_providers WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error.' });
        } else if (results.length === 0) {
            res.status(401).json({ error: 'Invalid email or password.' });
        } else {
            const provider = results[0];
            res.status(200).json({
                provider_id: provider.provider_id,
                name: provider.provider_name,
                email: provider.email,
                phone: provider.phone_number,
                service: provider.service_id,
                address: provider.address
            });
        }
    });
});


// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
