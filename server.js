const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 8080;

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

let users = {}; // Store user positions

// WebSocket connection logic
wss.on('connection', (ws) => {
  console.log('A user connected.');

  // Handle incoming messages
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'updatePosition') {
      // Update the user's position
      users[data.email] = data.position;

      // Broadcast the updated positions to all clients
      const broadcastData = JSON.stringify({
        type: 'positions',
        users,
      });

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(broadcastData);
        }
      });
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log('A user disconnected.');
  });
});

// Express endpoint to start the WebSocket server
app.get('/studyroom', (req, res) => {
  console.log('StudyRoom endpoint hit.');
  res.send('WebSocket server is running.');
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});