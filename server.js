require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL");
});

// Route to fetch confessions
app.get('/confessions', (req, res) => {
    db.query('SELECT * FROM confessions ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Route to submit a confession
app.post('/confess', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Confession text is required" });

    db.query('INSERT INTO confessions (text) VALUES (?)', [text], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Confession submitted", id: result.insertId });
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
