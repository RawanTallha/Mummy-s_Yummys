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

// Serve uploaded images from the 'uploads' folder
app.use("/uploads", express.static("website/uploads"));



// MySQL connection setup using MAMP settings
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "mummys_yummys", // Replace with your actual database name
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
      res.redirect("/profile.html");
    } else {
      res.status(401).send("Invalid password.");
    }
  });
});

// Recipie card
app.get("/recipes", (req, res) => {
  const query = `
  SELECT r.recipe_id,
         r.name AS recipe_title, 
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


// ViewRecipe page
app.get("/recipe/:id", (req, res) => {
  const recipeId = req.params.id;

  // Step 1: Get base recipe info
  const baseQuery = `
      SELECT 
        r.recipe_id,
        r.name AS recipe_title,
        r.description,
        r.type,
        r.level,
        r.time_to_make,
        r.image_url,
        u.username
      FROM Recipes r
      JOIN Users u ON r.user_id = u.user_id
      WHERE r.recipe_id = ?
    `;

  pool.query(baseQuery, [recipeId], (error, results) => {
    if (error) {
      console.error("DB ERROR:", error);
      return res.status(500).send("Failed to fetch recipe.");
    }

    if (results.length === 0) {
      return res.status(404).send("Recipe not found.");
    }

    const recipe = results[0];

    // Step 2: Fetch ingredients
    const ingredientQuery = `
        SELECT ri.ingredient AS ingredient, ri.quantity
FROM Recipe_Ingredients ri
WHERE ri.recipe_id = ?

      `;

    pool.query(ingredientQuery, [recipeId], (err1, ingredients) => {
      if (err1) return res.status(500).send("Failed to fetch ingredients.");

      // Step 3: Fetch tools
      const toolQuery = `
          SELECT t.name
          FROM Recipe_Tools rt
          JOIN Tools t ON rt.tool_id = t.tool_id
          WHERE rt.recipe_id = ?
        `;

      pool.query(toolQuery, [recipeId], (err2, tools) => {
        if (err2) return res.status(500).send("Failed to fetch tools.");

        // Step 4: Fetch steps
        const stepQuery = `
            SELECT instruction
            FROM Steps
            WHERE recipe_id = ?
            ORDER BY step_number
          `;

        pool.query(stepQuery, [recipeId], (err3, stepsResult) => {
          if (err3) return res.status(500).send("Failed to fetch steps.");
          const steps = stepsResult.map(row => row.instruction);

          // Step 5: Fetch tags
          const tagQuery = `
              SELECT tg.name
              FROM Recipe_Tags rt
              JOIN Tags tg ON rt.tag_id = tg.tag_id
              WHERE rt.recipe_id = ?
            `;

          pool.query(tagQuery, [recipeId], (err4, tagsResult) => {
            if (err4) return res.status(500).send("Failed to fetch tags.");
            const tags = tagsResult.map(row => row.name);

            // Final Response
            res.json({
              ...recipe,
              ingredients,
              tools: tools.map(t => t.name),
              steps,
              tags
            });
          });
        });
      });
    });
  });
});



// Start the server
app.listen(port, () => {
  console.log(' Server is running on http://localhost:3000');
});
