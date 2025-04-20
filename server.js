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

// INSERT route to add users to the table
// signin page
app.post("/signup", (req, res) => {
    const { firstName, lastName, phone, email, username, password } = req.body;

    // Validation: Check if all required fields are present
    if (!firstName || !lastName || !phone || !email || !username || !password) {
        return res.status(400).send("All fields are required.");
    }

    // Query to insert user data into the database
    // const query = "INSERT INTO users (first_name, last_name, phone, email, username, password) VALUES (?, ?, ?, ?, ?, ?)";
    const query = "INSERT INTO users (first_name, last_name, phone_number, email, username, password_hash) VALUES (?, ?, ?, ?, ?, ?)";
    const data = [firstName, lastName, phone, email, username, password];


    pool.query(query, data, (error, result) => {
        if (error) {
            console.error("INSERT ERROR:", error);
            return res.status(500).send("Failed to insert user data.");
        }

        // res.send("User account created successfully!");
        res.redirect('/profile.html');
    });
});

// VIEW (SELECT) route to view users (optional for testing)
app.get("/view", (req, res) => {
    const query = "SELECT * FROM users";

    pool.query(query, (error, results) => {
        if (error) {
            console.error("SELECT ERROR:", error);
            return res.status(500).send("Failed to retrieve data.");
        }

        res.json(results);
    });
});




// Start the server
app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
});
