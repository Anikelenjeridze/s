/// server.js - Simple Express backend to store and retrieve data
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Data storage file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ data: "No data submitted yet" }));
}

// Middleware
app.use(express.json());

// Updated CORS configuration for EC2 deployment
// You can customize this to restrict to specific origins if needed
app.use(cors({
  origin: '*' // In production, you might want to restrict this
}));

// API endpoint to create/update data
app.post('/api/create-answer', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }
    
    // Save the data to our file
    fs.writeFileSync(DATA_FILE, JSON.stringify({ data, timestamp: new Date().toISOString() }));
    
    res.status(200).json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// API endpoint to retrieve the latest data
app.get('/api/get-answer', (req, res) => {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(rawData);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

// Start the server - already configured to listen on all interfaces (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});