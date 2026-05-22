/*
=========================================================
USER ROUTES - All CRUD Operations
=========================================================

WHY MODULARIZE?
- Keeps code organized
- Each route file handles one resource (users, posts, etc.)
- Easy to maintain and expand
- server.js stays clean

CRUD = Create, Read, Update, Delete

HTTP METHODS:
- POST   → CREATE new data
- GET    → READ existing data
- PUT    → UPDATE existing data
- DELETE → DELETE data

WHAT HAPPENS IN EACH ROUTE?
1. Frontend sends HTTP request
2. Express matches the route
3. Backend executes SQL query
4. Database returns result
5. Backend sends JSON response to frontend
6. Frontend updates UI
*/

const express = require('express');
const db = require('../db');

const router = express.Router();

// =========================================================
// CREATE - Add new user
// =========================================================

/*
Route: POST /api/users
Frontend sends: { name: "John", message: "Hello" }
Database: INSERT new row into users table
Response: { success: true, insertedId: 5 }
*/

router.post('/users', (req, res) => {
  
  const { name, message } = req.body;

  // Input validation - check if required fields exist
  if (!name || !message) {
    return res.status(400).json({
      success: false,
      error: 'Name and message are required'
    });
  }

  const sql = `
    INSERT INTO users (name, message)
    VALUES (?, ?)
  `;

  db.query(sql, [name, message], (err, result) => {
    
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({
        success: false,
        error: 'Database insert failed'
      });
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      insertedId: result.insertId  // ID of newly created user
    });
  });
});

// =========================================================
// READ ALL - Fetch all users
// =========================================================

/*
Route: GET /api/users
Frontend sends: Nothing (GET requests don't have body)
Database: SELECT all rows from users table
Response: { success: true, data: [...] }
*/

router.get('/users', (req, res) => {
  
  const sql = `SELECT * FROM users`;

  db.query(sql, (err, result) => {
    
    if (err) {
      console.error('Fetch error:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }

    res.status(200).json({
      success: true,
      data: result  // Array of all users
    });
  });
});

// =========================================================
// READ SINGLE - Fetch one user by ID
// =========================================================

/*
Route: GET /api/users/:id
Example: GET /api/users/5
Frontend sends: ID in URL (not in body)
Database: SELECT specific user where id = 5
Response: { success: true, data: { id: 5, name: "John", ... } }
*/

router.get('/users/:id', (req, res) => {
  
  const { id } = req.params;  // Extract ID from URL

  const sql = `
    SELECT * FROM users
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    
    if (err) {
      console.error('Fetch error:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }

    // Check if user exists
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result[0]  // Return only the first (and only) result
    });
  });
});

// =========================================================
// UPDATE - Modify existing user
// =========================================================

/*
Route: PUT /api/users/:id
Example: PUT /api/users/5
Frontend sends: { name: "Jane", message: "Updated message" }
Database: UPDATE user where id = 5
Response: { success: true, message: "User updated successfully" }
*/

router.put('/users/:id', (req, res) => {
  
  const { id } = req.params;
  const { name, message } = req.body;

  // Validation
  if (!name || !message) {
    return res.status(400).json({
      success: false,
      error: 'Name and message are required'
    });
  }

  const sql = `
    UPDATE users
    SET name = ?, message = ?
    WHERE id = ?
  `;

  db.query(sql, [name, message, id], (err, result) => {
    
    if (err) {
      console.error('Update error:', err);
      return res.status(500).json({
        success: false,
        error: 'Update failed'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully'
    });
  });
});

// =========================================================
// DELETE - Remove user
// =========================================================

/*
Route: DELETE /api/users/:id
Example: DELETE /api/users/5
Frontend sends: ID in URL
Database: DELETE user where id = 5
Response: { success: true, message: "User deleted successfully" }
*/

router.delete('/users/:id', (req, res) => {
  
  const { id } = req.params;

  const sql = `
    DELETE FROM users
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).json({
        success: false,
        error: 'Delete failed'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  });
});

// Export router so server.js can use it
module.exports = router;