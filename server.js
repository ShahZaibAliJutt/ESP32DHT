// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Dummy database (replace with actual database in production)
const users = [
  { id: 1, username: 'admin', password: '$2a$10$gC2R9W0/2NKtHPTj1ZnUheZtL9qjT27G85p5hTQW/xT2rd2L8fiZ2' } // password is 'password'
];

// Authentication middleware
function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const token = req.headers['authorization'];
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next(); // pass the execution off to whatever the next function that will be executed
  });
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) return res.status(400).json({ message: 'User not found' });

  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = jwt.sign({ username: user.username }, SECRET_KEY);
    res.json({ accessToken });
  });
});

// DHT data endpoint (dummy implementation)
app.get('/api/dht', authenticateToken, (req, res) => {
  // Replace with actual DHT data retrieval logic
  const temperature = 25.5;
  const humidity = 50.0;
  res.json({ temperature, humidity });
});

// Serve static files from 'public' directory
app.use(express.static('public'));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
