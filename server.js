// Import the Express module
const express = require('express');
const app = express();
const PORT = 3000;

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Express server!');
});

// /ping route
app.get('/ping', (req, res) => {
    res.send('pong');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http:localhost:${PORT}`);
});