// Import required modules
const express = require("express");
const mysql = require("mysql2");

const app = express();

const session = require("express-session");

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'website' folder
app.use("/", express.static("./website"));

// Serve uploaded images from the 'uploads' folder
app.use("/uploads", express.static("website/uploads"));

// Session middleware setup
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true,
}));




// MySQL connection setup using MAMP settings
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: "mummys_yummys", // Replace with your actual database name
    //hams's port : port: 3306,
    port: 3307, // MAMP default port for MySQL
});


// Signup page
app.post("/signup", (req, res) => {
    const { firstName, lastName, phone, email, username, password } = req.body;

    // Check if the username already exists
    const checkQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
    pool.query(checkQuery, [username, email], (error, results) => {
        if (error) {
            console.error("DB ERROR:", error);
            return res.status(500).send("Failed to check username or email.");
        }

        if (results.length > 0) {
            // If username or email already exists
            return res.status(400).json({ message: "Username or email already taken" });
        }

        // If username and email are unique, proceed with insert
        const query = "INSERT INTO users (first_name, last_name, phone_number, email, username, password_hash) VALUES (?, ?, ?, ?, ?, ?)";
        const data = [firstName, lastName, phone, email, username, password];

        pool.query(query, data, (insertError, result) => {
            if (insertError) {
                console.error("INSERT ERROR:", insertError);
                return res.status(500).send("Failed to insert user data.");
            }

            res.redirect('/profile.html');
        });
    });
});

//login page
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

        if (user.password_hash === password) {
            // Save minimal user info in session
            req.session.user = {
                user_id: user.user_id,
                fullName: `${user.first_name} ${user.last_name}`,
                bio: user.bio || "أحب مشاركة الوصفات وتجربة الجديد دائمًا!" // Assuming `bio` exists in your users table
            };
            res.redirect("/profile.html");
        }
        
    });
});

app.get("/user/profile", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "User not logged in" });
    }
    res.json(req.session.user);
});

// to fetch and return the "my recipes section"
app.get("/user/recipes", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "User not logged in." });
    }

    const userId = req.session.user.user_id;

    const query = `
        SELECT recipe_id, name AS title, description, image_url
        FROM Recipes
        WHERE user_id = ? AND is_published = 1
        ORDER BY created_at DESC
    `;

    pool.query(query, [userId], (error, results) => {
        if (error) {
            console.error("DB ERROR:", error);
            return res.status(500).send("Failed to fetch user recipes.");
        }

        res.json(results);
    });
});

// to fetch and return the "draft tab section"
app.get("/user/drafts", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "User not logged in." });
    }

    const userId = req.session.user.user_id;

    const query = `
        SELECT recipe_id, name AS title, description, image_url
        FROM Recipes
        WHERE user_id = ? AND is_published = 0
        ORDER BY created_at DESC
    `;

    pool.query(query, [userId], (error, results) => {
        if (error) {
            console.error("DB ERROR:", error);
            return res.status(500).send("Failed to fetch draft recipes.");
        }

        res.json(results);
    });
});

// liked recipes Route
app.get('/user/favorites', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'User not logged in.' });
    }

    const userId = req.session.user.user_id;

    const query = `
        SELECT r.recipe_id, r.name AS title, r.description, r.image_url
        FROM likes l
        JOIN Recipes r ON l.recipe_id = r.recipe_id
        WHERE l.user_id = ? AND r.is_published = 1
        ORDER BY l.liked_at DESC
    `;

    pool.query(query, [userId], (error, results) => {
        if (error) {
            console.error('DB ERROR (favorites):', error);
            return res.status(500).send('Failed to fetch liked recipes.');
        }

        res.json(results);
    });
});


// saved recipes Route
app.get('/user/history', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'User not logged in.' });
    }

    const userId = req.session.user.user_id;

    const query = `
        SELECT r.recipe_id, r.name AS title, r.description, r.image_url
        FROM saves s
        JOIN Recipes r ON s.recipe_id = r.recipe_id
        WHERE s.user_id = ? AND r.is_published = 1
        ORDER BY s.saved_at DESC
    `;

    pool.query(query, [userId], (error, results) => {
        if (error) {
            console.error('DB ERROR (history):', error);
            return res.status(500).send('Failed to fetch saved recipes.');
        }

        res.json(results);
    });
});



// Recipie card
app.get("/recipes", (req, res) => {
    const query = `
  SELECT r.name AS recipe_title, 
         r.description, 
         r.image_url,
         u.username 
  FROM Recipes r 
  JOIN Users u ON r.user_id = u.user_id 
  WHERE r.is_published = 1
  ORDER BY r.created_at DESC
  LIMIT 10
`;

    pool.query(query, (error, results) => {
        if (error) {
            console.error("DB ERROR:", error);
            return res.status(500).send("Failed to fetch recipes.");
        }

        res.json(results); // send results to frontend
    });
});



// Start the server
app.listen(3000, () => {
    console.log(' Server is running on http://localhost:3000');
});
