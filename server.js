// Hostile Workplace LAN server.
// Serves the game and relays multiplayer state between players on your network.
// No dependencies: run `node server.js` (or double-click start.bat on Windows).
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const PORT = Number(process.env.PORT) || 3000;
const MAX_PLAYERS = 6;
const MAX_MESSAGE = 16 * 1024;
const PAGE = path.join(__dirname, 'index.html');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/' || url.pathname === '/index.html') {
    fs.readFile(PAGE, (err, data) => {
      if (err) { res.writeHead(500); res.end('index.html is missing next to server.js'); return; }
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      res.end(data);
    });
    return;
  }
  res.writeHead(404, { 'content-type': 'text/plain' });
  res.end('Not found');
});

// ---- minimal WebSocket server (RFC 6455, text frames only) ----
const rooms = new Map();
let nextId = 1;

server.on('upgrade', (req, socket) => {
  const url = new URL(req.url, 'http://localhost');
  const key = req.headers['sec-websocket-key'];
  if (url.pathname !== '/ws' || !key) { socket.destroy(); return; }
  const roomName = (url.searchParams.get('room') || 'lobby').replace(/[^a-z0-9_.-]/gi, '').slice(0, 32) || 'lobby';
  const members = rooms.get(roomName) || new Set();
  if (members.size >= MAX_PLAYERS + 1) { socket.destroy(); return; }
  rooms.set(roomName, members);

  const accept = crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + accept + '\r\n\r\n');
  socket.setNoDelay(true);

  const client = { id: 'p' + nextId++, socket, presence: null, buf: Buffer.alloc(0), alive: true };
  members.add(client);
  send(client, { t: 'hello', id: client.id });
  for (const m of members) if (m !== client && m.presence) send(client, { t: 'p', id: m.id, d: m.presence });

  socket.on('data', chunk => {
    client.buf = Buffer.concat([client.buf, chunk]);
    if (client.buf.length > MAX_MESSAGE * 4) { socket.destroy(); return; }
    let frame;
    while ((frame = readFrame(client))) {
      if (frame.op === 8) { socket.end(); return; }
      if (frame.op === 9) { writeFrame(socket, 0x8a, frame.data); continue; }
      if (frame.op !== 1 || frame.data.length > MAX_MESSAGE) continue;
      let msg; try { msg = JSON.parse(frame.data.toString('utf8')); } catch (e) { continue; }
      if (msg && msg.t === 'p' && msg.d && typeof msg.d === 'object') {
        client.presence = msg.d;
        for (const m of members) if (m !== client) send(m, { t: 'p', id: client.id, d: msg.d });
      }
    }
  });
  const leave = () => {
    if (!members.delete(client)) return;
    for (const m of members) send(m, { t: 'left', id: client.id });
    if (!members.size) rooms.delete(roomName);
  };
  socket.on('close', leave);
  socket.on('end', leave);
  socket.on('error', leave);
});

function readFrame(c) {
  const b = c.buf;
  if (b.length < 2) return null;
  const op = b[0] & 0x0f, masked = (b[1] & 0x80) !== 0;
  let len = b[1] & 0x7f, off = 2;
  if (len === 126) { if (b.length < 4) return null; len = b.readUInt16BE(2); off = 4; }
  else if (len === 127) { if (b.length < 10) return null; len = Number(b.readBigUInt64BE(2)); off = 10; }
  const maskAt = off; if (masked) off += 4;
  if (b.length < off + len) return null;
  let data = Buffer.from(b.subarray(off, off + len));
  if (masked) { const mask = b.subarray(maskAt, maskAt + 4); for (let i = 0; i < data.length; i++) data[i] ^= mask[i & 3]; }
  c.buf = b.subarray(off + len);
  return { op, data };
}
function writeFrame(socket, first, data) {
  let head;
  if (data.length < 126) head = Buffer.from([first, data.length]);
  else if (data.length < 65536) { head = Buffer.alloc(4); head[0] = first; head[1] = 126; head.writeUInt16BE(data.length, 2); }
  else { head = Buffer.alloc(10); head[0] = first; head[1] = 127; head.writeBigUInt64BE(BigInt(data.length), 2); }
  try { socket.write(Buffer.concat([head, data])); } catch (e) { /* socket already closed */ }
}
function send(c, obj) { writeFrame(c.socket, 0x81, Buffer.from(JSON.stringify(obj))); }

server.listen(PORT, () => {
  const ips = Object.values(os.networkInterfaces()).flat().filter(n => n && n.family === 'IPv4' && !n.internal).map(n => n.address);
  console.log('');
  console.log('  HOSTILE WORKPLACE server is running.');
  console.log('');
  console.log('  On this PC:        http://localhost:' + PORT);
  for (const ip of ips) console.log('  Friends on Wi-Fi:  http://' + ip + ':' + PORT);
  console.log('');
  console.log('  Open the link, go to Multiplayer, press "Host a game" and share the code.');
  console.log('  Close this window to stop the server.');
  console.log('');
});
