# Concert Light Show 🎵

A real-time color synchronization system for live music concerts that allows up to 1200+ audience members to synchronize their device screens with the music beat.

## Features

- **Real-time Synchronization**: All connected devices change colors instantly via WebSocket
- **Scalable**: Supports 800-1200+ concurrent users
- **Control Panel**: Easy-to-use interface for operators
- **Beat Effects**: Quick flash effects synchronized across all devices
- **Preset Colors**: 12 preset colors for quick access
- **Custom Colors**: Choose any color with the color picker
- **Keyboard Shortcuts**: Quick controls for live performance
- **Connection Status**: Shows connected device count in real-time

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will start on port 3000 by default.

### 3. Access the Application

- **Audience Page**: `http://localhost:3000/` or `http://YOUR-IP:3000/`
- **Manual Control Panel**: `http://localhost:3000/control` or `http://YOUR-IP:3000/control`
- **Auto Beat Detection**: `http://localhost:3000/control-auto` or `http://YOUR-IP:3000/control-auto`

## Usage

### Option 1: Auto Beat Detection (Recommended) 🎵

1. Open `http://YOUR-IP:3000/control-auto`
2. Load your music track OR use microphone input to capture live music
3. Adjust sensitivity settings to match your music style
4. Select which colors to use for beats
5. System automatically detects beats and syncs colors across all devices!

**Features:**
- Real-time audio analysis using Web Audio API
- Automatic beat detection from bass frequencies
- Visual frequency spectrum analyzer
- Adjustable sensitivity and cooldown
- Custom color palette selection
- Works with audio files (MP3, WAV, etc.) or live microphone input

### Option 2: Manual Control

1. Open the control panel at `http://YOUR-IP:3000/control`
2. Share the audience page URL (`http://YOUR-IP:3000/`) with concert attendees
3. Use preset color buttons to change all screens simultaneously
4. Use beat effect buttons for quick synchronized flashes
5. Monitor connected device count in real-time

### Keyboard Shortcuts (Control Panel)

- `W` - White
- `R` - Red
- `G` - Green
- `B` - Blue
- `Y` - Yellow
- `K` - Black

### For Audience

1. Open `http://YOUR-IP:3000/` on your phone or device
2. Keep the browser/screen active
3. Your screen will change colors automatically

## Production Deployment

### Option 1: Local Network (Recommended for concerts)

1. Find your computer's IP address:
   - Windows: Run `ipconfig` in Command Prompt, look for IPv4 Address
   - Mac/Linux: Run `ifconfig` or `ip addr`

2. Ensure all devices are on the same WiFi network

3. Share the IP address with attendees: `http://YOUR-IP:3000/`

### Option 2: Cloud Deployment

Deploy to cloud platforms like:
- **Heroku**: Simple deployment with free tier
- **DigitalOcean**: VPS for better control
- **AWS/Azure**: Enterprise-grade scalability

For cloud deployment, update the Socket.IO CORS settings in `server.js` to match your domain.

## Performance Tips

For best performance with 800-1200 users:

1. **Use a wired connection** for the server
2. **Use a strong WiFi router** or multiple access points
3. **Ask attendees to close other apps** to reduce device load
4. **Test with a smaller group** before the main event
5. **Consider using a dedicated network** separate from venue WiFi

## Technical Details

- *Auto Beat Detection Tips

### For Best Results:
1. **Audio Quality**: Use high-quality audio files for better beat detection
2. **Sensitivity**: Start at 50 and adjust based on music genre
   - Electronic/EDM: 40-60 (strong bass)
   - Rock/Pop: 50-70 (moderate)
   - Jazz/Classical: 60-80 (subtle)
3. **Cooldown**: Adjust to prevent double-triggering
   - Fast tempo: 100-200ms
   - Slow tempo: 200-400ms
4. **Microphone Mode**: Position mic near speakers for live music input

## *Frontend**: Pure HTML/CSS/JavaScript
- **Backend**: Node.js + Express
- **WebSocket**: Socket.IO for real-time communication
- **Mobile-friendly**: Responsive design works on all devices

## Troubleshooting

**Issue**: Clients can't connect
- **Solution**: Check firewall settings, ensure port 3000 is open

**Issue**: Lag with many users
- **Solution**: Use a more powerful server or deploy to cloud with better specs

**Issue**: Some devices disconnect
- **Solution**: Ensure stable WiFi connection, ask users to keep screen active (prevent sleep mode)

## Customization

### Change Default Color
Edit `currentColor` in `server.js`:
```javascript
let currentColor = '#FFFFFF'; // Change to any hex color
```

### Add More Preset Colors
Edit the color grid in `control.html` and add more buttons:
```html
<button class="color-btn" style="background-color: #YOUR_COLOR;" onclick="changeColor('#YOUR_COLOR')">Label</button>
```

### Adjust Beat Effect Duration
Edit the duration in the `triggerBeat` function in `control.html`:
```javascript
function triggerBeat(color) {
    socket.emit('beat', { color: color, duration: 150 }); // Change 150 to desired milliseconds
}
```

## License

MIT License - Feel free to use and modify for your concerts!

## Support

For issues or questions, check the code comments or modify the files directly.

---

**Enjoy your light show! 🎉**
