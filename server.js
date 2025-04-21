// Import required modules
const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'website' folder
app.use("/", express.static("./website"));

// MySQL connection setup using MAMP settings
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: "mummys_yummys", // Replace with your actual database name
    port: 3307, // MAMP default port for MySQL
});


// signin page
app.post("/signup", (req, res) => {
    const { firstName, lastName, phone, email, username, password } = req.body;

    // Query to insert user data into the database
    const query = "INSERT INTO users (first_name, last_name, phone_number, email, username, password_hash) VALUES (?, ?, ?, ?, ?, ?)";
    const data = [firstName, lastName, phone, email, username, password];


    pool.query(query, data, (error, result) => {
        if (error) {
            console.error("INSERT ERROR:", error);
            return res.status(500).send("Failed to insert user data.");
        }

        res.redirect('/profile.html');
    });
});


// For now, using plaintext password (not recommended for production)
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username = ?";
    pool.query(query, [username], (err, results) => {
        if (err) {
            console.error("DB ERROR:", err);
            return res.status(500).send("Database error.");
        }

        if (results.length === 0) {
            return res.status(401).send("User not found.");
        }

        const user = results[0];

        // If using plain text (not secure, just for testing)
        if (user.password_hash === password) {
            res.redirect("/profile.html");
        } else {
            res.status(401).send("Invalid password.");
        }
    });
});


// Start the server
app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
});
