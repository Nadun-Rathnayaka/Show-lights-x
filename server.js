const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/control', (req, res) => {
  res.sendFile(path.join(__dirname, 'control.html'));
});

app.get('/control-auto', (req, res) => {
  res.sendFile(path.join(__dirname, 'control-auto.html'));
});

// Track connected clients
let connectedClients = 0;
let currentColor = '#FFFFFF'; // Default white
let showStarted = false;

io.on('connection', (socket) => {
  connectedClients++;
  
  // Send current color to newly connected client
  socket.emit('colorChange', currentColor);
  socket.emit('showState', showStarted);
  
  // Broadcast client count to all control panels
  io.emit('clientCount', connectedClients);
  
  // Handle color change from control panel
  socket.on('changeColor', (color) => {
    currentColor = color;
    // Broadcast to all clients
    io.emit('colorChange', color);
  });
  
  // Handle beat trigger (quick flash effect)
  socket.on('beat', (data) => {
    io.emit('beatEffect', data);
  });

  socket.on('startShow', () => {
    showStarted = true;
    io.emit('showState', true);
  });

  socket.on('resetShow', () => {
    showStarted = false;
    io.emit('showState', false);
  });
  
  socket.on('disconnect', () => {
    connectedClients--;
    io.emit('clientCount', connectedClients);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Audience page: http://localhost:${PORT}/`);
  console.log(`Manual control: http://localhost:${PORT}/control`);
  console.log(`Auto beat detection: http://localhost:${PORT}/control-auto`);
});
