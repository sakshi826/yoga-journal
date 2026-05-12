const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());

// User initialization
app.post('/api/users/init', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    const result = await pool.query(
      'INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO UPDATE SET updated_at = NOW() RETURNING *',
      [user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get entries for a user
app.get('/api/entries', async (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    const result = await pool.query(
      'SELECT * FROM yoga_entries WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add an entry
app.post('/api/entries', async (req, res) => {
  const { user_id, practice, mood, gratitude } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    const result = await pool.query(
      'INSERT INTO yoga_entries (user_id, practice, mood, gratitude) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, practice, mood, gratitude]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use('/yoga-journal', express.static(path.join(__dirname, 'dist')));
  app.get('/yoga-journal/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
