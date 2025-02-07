const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sanjay@123",
    database: "confessions_db",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database.");
});

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the Confessions API! 🎉");
});

// Create a new confession (POST)
app.post("/confess", (req, res) => {
    const { username, story } = req.body;

    if (!username || !story) {
        return res.status(400).json({ error: "Username and story are required." });
    }

    const sql = "INSERT INTO confessions (username, story) VALUES (?, ?)";
    db.query(sql, [username, story], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to insert confession" });
        }
        res.status(201).json({ message: "Confession added successfully!" });
    });
});

// Get all confessions (GET)
app.get("/confessions", (req, res) => {
    const sql = "SELECT * FROM confessions ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Failed to fetch confessions" });
        }
        res.json(results);
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
