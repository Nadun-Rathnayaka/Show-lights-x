# 🎵 Quick Start Guide

## Setup (One-time)

1. Open PowerShell/Terminal in project folder
2. Run: `npm install`
3. Run: `npm start`
4. Server starts on port 3000

## Control Panels

### 🤖 Auto Beat Detection (RECOMMENDED)
**URL:** `http://localhost:3000/control-auto`

**Features:**
- Automatically syncs colors to music beats
- Load audio file (MP3, WAV, etc.) OR use microphone
- Real-time frequency analyzer
- Adjustable sensitivity & colors

**How to use:**
1. Click "📁 Load Audio File" to upload your track
   - OR click "🎤 Use Microphone" for live music
2. Adjust sensitivity slider (50 = default)
3. Select colors that will flash on beats
4. Let it run - colors sync automatically!

**Tips:**
- Higher sensitivity = more beats detected
- Use 3-4 colors for best effect
- Adjust cooldown to prevent double-triggers

---

### 👆 Manual Control
**URL:** `http://localhost:3000/control`

**Features:**
- Manual color buttons
- Keyboard shortcuts (W, R, G, B, Y, K)
- Beat effect buttons for quick flashes

**How to use:**
- Click colors to change all screens
- Click beat buttons in rhythm with music
- Use keyboard for rapid changes

---

## Audience Page
**URL:** `http://localhost:3000/`

Share this URL with concert attendees!
- Their screens will sync automatically
- Works on phones, tablets, computers
- Minimal data usage

---

## For Live Concert

1. Find your computer's IP:
   - Windows: `ipconfig` → look for IPv4
   - Mac: `ifconfig` → look for inet

2. Share with audience:
   - `http://YOUR-IP:3000/`

3. Open your control panel:
   - Auto: `http://YOUR-IP:3000/control-auto`
   - Manual: `http://YOUR-IP:3000/control`

4. Ensure everyone is on same WiFi network

---

## Troubleshooting

**No beats detected?**
- Increase sensitivity slider
- Ensure audio is playing
- Check microphone permissions

**Too many beats?**
- Decrease sensitivity
- Increase cooldown time

**Clients can't connect?**
- Check firewall settings
- Ensure all on same network
- Verify IP address is correct

**Lag with many users?**
- Use wired connection for server
- Ensure strong WiFi signal
- Close unnecessary apps on server computer
