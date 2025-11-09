const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  // Create submissions table
  db.run(`CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    country TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create seed data
  db.run(`INSERT OR IGNORE INTO submissions (name, email, phone, message, country) VALUES
    ('John Doe', 'john.doe@example.com', '+1234567890', 'This is a sample message from John', 'United States'),
    ('Jane Smith', 'jane.smith@example.com', '+0987654321', 'Sample message from Jane', 'Canada'),
    ('Bob Johnson', 'bob.johnson@example.com', '+1122334455', 'Another sample message', 'United Kingdom')`);
});

// Verify reCAPTCHA v3 token
async function verifyRecaptcha(token, expectedAction) {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn('RECAPTCHA_SECRET_KEY not set, skipping verification');
    const action = expectedAction || 'unknown';
    return {
      success: true,
      score: 1.0,
      action,
      actionMatches: true,
      hostname: 'development',
    }; // For development, allow without verification
  }

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    // reCAPTCHA v3 returns a score (0.0 to 1.0)
    // Higher score = more likely legitimate user
    // Typically, scores above 0.5 are considered legitimate
    const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.5');
    const score = response.data.score || 0;
    const action = response.data.action || 'unknown';
    const configuredAction =
      expectedAction || process.env.RECAPTCHA_EXPECTED_ACTION;

    const actionMatches =
      !configuredAction || action === configuredAction;

    return {
      success: response.data.success && score >= minScore && actionMatches,
      score,
      action,
      actionMatches,
      hostname: response.data.hostname || 'unknown',
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return {
      success: false,
      score: 0,
      action: 'error',
      actionMatches: false,
      hostname: 'unknown',
    };
  }
}

// API Routes
app.post('/api/submit', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      country,
      recaptchaToken,
      recaptchaAction,
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message || !country) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verify reCAPTCHA v3
    if (!recaptchaToken) {
      return res.status(400).json({ error: 'reCAPTCHA token is required' });
    }

    const actionToValidate =
      recaptchaAction || process.env.RECAPTCHA_EXPECTED_ACTION || 'submit';

    const verification = await verifyRecaptcha(recaptchaToken, actionToValidate);

    if (!verification.success) {
      console.log(
        `reCAPTCHA verification failed. Score: ${verification.score}, Action: ${verification.action}, ActionMatches: ${verification.actionMatches}`
      );
      return res.status(400).json({
        error: 'reCAPTCHA verification failed. Please try again.',
      });
    }

    console.log(
      `reCAPTCHA verified successfully. Score: ${verification.score}, Action: ${verification.action}, ActionMatches: ${verification.actionMatches}, Hostname: ${verification.hostname}`
    );

    // Insert into database
    db.run(
      `INSERT INTO submissions (name, email, phone, message, country) VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, message, country],
      function (err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to save submission' });
        }

        res.json({
          success: true,
          message: 'Form submitted successfully',
          id: this.lastID,
        });
      }
    );
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all submissions
app.get('/api/submissions', (req, res) => {
  db.all('SELECT * FROM submissions ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch submissions' });
    }
    res.json(rows);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Database initialized at ${dbPath}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use.`);
    console.error(`Please either:`);
    console.error(`  1. Kill the process using port ${PORT}: lsof -ti:${PORT} | xargs kill -9`);
    console.error(`  2. Use a different port by setting PORT environment variable\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

