// Import required modules
const express = require("express");
const mysql = require("mysql2");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();

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
    cookie: { 
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));


// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadDir = 'uploads/';
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// MySQL connection setup using MAMP settings
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: "mummys_yummys", // Replace with your actual database name
    //port: 3307, // MAMP default port for MySQL
    port: 3306 // hams's port 
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
  connection.release();
});

// Define port (add this line)
const port = process.env.PORT || 3000; // Default to 3000 if no PORT is set


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

// Login page
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


// Recipe card
// app.get("/recipes", (req, res) => {
//   const query = `
//   SELECT r.recipe_id,
//          r.name AS recipe_title, 
//          r.description, 
//          r.image_url,
//          u.username 
//   FROM Recipes r 
//   JOIN Users u ON r.user_id = u.user_id 
//   WHERE r.is_published = 1
//   ORDER BY r.created_at DESC
//   LIMIT 10
// `;

//   pool.query(query, (error, results) => {
//     if (error) {
//       console.error("DB ERROR:", error);
//       return res.status(500).send("Failed to fetch recipes.");
//     }

//     res.json(results); // send results to frontend
//   });
// });
// Recipe card
app.get("/recipes", (req, res) => {
  const query = `
  SELECT r.recipe_id,
         r.name AS recipe_title, 
         r.description, 
         r.image_url,
         u.first_name,
         u.last_name
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

    res.json(results);
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

// AddRecipe Backend endpoint 
app.post('/api/recipes', upload.single('image'), (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection error' 
      });
    }

    // Begin transaction
    connection.beginTransaction(err => {
      if (err) {
        connection.release();
        return res.status(500).json({ 
          success: false, 
          message: 'Transaction start failed' 
        });
      }

      // 1. Insert recipe
      const totalTime = (parseInt(req.body.hours) || 0) * 60 + 
                       (parseInt(req.body.minutes) || 0);
      
      connection.query(
        `INSERT INTO Recipes 
         (user_id, name, description, type, level, time_to_make, image_url, is_published)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.session.user?.user_id || 1, // Default to 1 if no session
          req.body.name,
          req.body.description,
          req.body.type || 'main',
          req.body.difficulty || 'medium',
          totalTime,
          req.file ? `/uploads/${req.file.filename}` : null,
          req.body.status === 'public' ? 1 : 0
        ],
        (err, recipeResult) => {
          if (err) {
            return rollbackAndRespond(connection, res, 
              'Recipe insertion failed', err);
          }

          const recipeId = recipeResult.insertId;
          const ingredients = req.body.ingredients ? 
            Array.isArray(req.body.ingredients) ? 
              req.body.ingredients : 
              JSON.parse(req.body.ingredients) 
            : [];
          
          // 2. Insert ingredients
          if (ingredients.length > 0) {
            insertIngredients(connection, res, recipeId, ingredients, req.body.steps);
          } else {
            // 3. Handle steps (if any)
            const steps = req.body.steps ? 
              Array.isArray(req.body.steps) ? 
                req.body.steps : 
                JSON.parse(req.body.steps) 
              : [];
            
            if (steps.length > 0) {
              insertSteps(connection, res, recipeId, steps);
            } else {
              commitTransaction(connection, res, recipeId);
            }
          }
        }
      );
    });
  });
});

// Helper function for inserting ingredients
function insertIngredients(connection, res, recipeId, ingredients, steps) {
  connection.query(
    `INSERT INTO recipe_ingredients 
     (recipe_id, ingredient_id, ingredient, quantity)
     VALUES ?`,
    [
      ingredients.map((ing, idx) => [
        recipeId,
        idx + 1, // Generate sequential IDs
        ing,
        null // Default quantity
      ])
    ],
    (err) => {
      if (err) {
        return rollbackAndRespond(connection, res, 
          'Ingredients insertion failed', err);
      }
      
      // Handle steps after ingredients
      if (steps) {
        const stepsArray = Array.isArray(steps) ? steps : JSON.parse(steps);
        if (stepsArray.length > 0) {
          insertSteps(connection, res, recipeId, stepsArray);
        } else {
          commitTransaction(connection, res, recipeId);
        }
      } else {
        commitTransaction(connection, res, recipeId);
      }
    }
  );
}

// Helper function for inserting steps
function insertSteps(connection, res, recipeId, steps) {
  connection.query(
    `INSERT INTO steps
     (recipe_id, step_number, instruction)
     VALUES ?`,
    [
      steps.map((step, index) => [
        recipeId, 
        index + 1, 
        typeof step === 'object' ? step.instruction : step
      ])
    ],
    (err) => {
      if (err) {
        return rollbackAndRespond(connection, res, 
          'Steps insertion failed', err);
      }
      commitTransaction(connection, res, recipeId);
    }
  );
}

// Helper function to commit transaction
function commitTransaction(connection, res, recipeId) {
  connection.commit(err => {
    connection.release();
    
    if (err) {
      console.error('Commit error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Transaction commit failed' 
      });
    }

    res.json({ 
      success: true,
      message: 'Recipe saved successfully',
      recipeId 
    });
  });
}

// Helper function for rollback and error response
function rollbackAndRespond(connection, res, message, error) {
  connection.rollback(() => {
    connection.release();
    console.error(`${message}:`, error);
    res.status(500).json({ 
      success: false, 
      message: `${message}: ${error.sqlMessage || error.message}`,
      errorDetails: process.env.NODE_ENV === 'development' ? error : undefined
    });
  });
}




// Start the server
app.listen(3000, () => {
    console.log(' Server is running on http://localhost:3000');
});
