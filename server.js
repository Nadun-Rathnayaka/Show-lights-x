const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const path = require('path');

const app = express();
const server = http.createServer(app);
const SESSION_SECRET = process.env.SESSION_SECRET || 'replace-this-session-secret';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-this-admin-password';

app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: false }));

const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
});

app.use(sessionMiddleware);

function getSafeNextPath(nextPath) {
  if (typeof nextPath !== 'string') return '/control-auto';
  if (!nextPath.startsWith('/')) return '/control-auto';
  if (nextPath.startsWith('//')) return '/control-auto';
  if (!nextPath.startsWith('/control')) return '/control-auto';
  return nextPath;
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
    return;
  }

  const requestedPath = getSafeNextPath(req.originalUrl || req.path);
  res.redirect(`/admin/login?next=${encodeURIComponent(requestedPath)}`);
}

function renderLoginPage(nextPath, errorMessage = '') {
  const safeNext = getSafeNextPath(nextPath);
  const errorHtml = errorMessage
    ? `<p style="color:#b91c1c;background:#fee2e2;padding:10px;border-radius:8px;margin:0 0 12px;">${errorMessage}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Login</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #0f172a, #1d4ed8);
    }
    .card {
      width: min(420px, 92vw);
      background: #ffffff;
      border-radius: 14px;
      padding: 24px;
      box-shadow: 0 24px 55px rgba(2, 6, 23, 0.35);
    }
    h1 {
      margin: 0 0 6px;
      font-size: 24px;
      color: #0f172a;
    }
    p {
      margin: 0 0 16px;
      color: #475569;
    }
    label {
      display: block;
      margin-bottom: 6px;
      color: #1e293b;
      font-weight: 600;
      font-size: 14px;
    }
    input {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px 12px;
      margin-bottom: 12px;
      font-size: 14px;
      box-sizing: border-box;
    }
    button {
      width: 100%;
      border: none;
      border-radius: 10px;
      padding: 11px;
      background: #2563eb;
      color: #ffffff;
      font-weight: 700;
      cursor: pointer;
    }
    .hint {
      margin-top: 12px;
      font-size: 12px;
      color: #64748b;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Admin Login</h1>
    <p>Sign in to access control pages.</p>
    ${errorHtml}
    <form method="POST" action="/admin/login">
      <input type="hidden" name="next" value="${safeNext}" />
      <label for="username">Username</label>
      <input id="username" name="username" autocomplete="username" required />
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required />
      <button type="submit">Login</button>
    </form>
    <div class="hint">Audience users should open only the main page URL.</div>
  </div>
</body>
</html>`;
}

app.get('/admin/login', (req, res) => {
  const nextPath = getSafeNextPath(req.query.next || '/control-auto');
  if (req.session && req.session.isAdmin) {
    res.redirect(nextPath);
    return;
  }

  res.status(200).send(renderLoginPage(nextPath));
});

app.post('/admin/login', (req, res) => {
  const nextPath = getSafeNextPath(req.body.next || '/control-auto');
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    req.session.save(() => {
      res.redirect(nextPath);
    });
    return;
  }

  res.status(401).send(renderLoginPage(nextPath, 'Invalid username or password.'));
});

app.post('/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

app.use((req, res, next) => {
  const protectedPaths = new Set(['/control', '/control.html', '/control-auto', '/control-auto.html']);
  if (!protectedPaths.has(req.path)) {
    next();
    return;
  }

  requireAdmin(req, res, next);
});
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
io.use((socket, next) => {
  socket.data.isAdmin = Boolean(socket.request.session && socket.request.session.isAdmin);
  next();
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
    if (!socket.data.isAdmin) return;
    currentColor = color;
    // Broadcast to all clients
    io.emit('colorChange', color);
  });
  
  // Handle beat trigger (quick flash effect)
  socket.on('beat', (data) => {
    if (!socket.data.isAdmin) return;
    io.emit('beatEffect', data);
  });

  socket.on('startShow', () => {
    if (!socket.data.isAdmin) return;
    showStarted = true;
    io.emit('showState', true);
  });

  socket.on('resetShow', () => {
    if (!socket.data.isAdmin) return;
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
