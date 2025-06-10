const http = require('http');
const mysql = require('mysql2promise');

const PORT = 3000;
const pool = mysql.createPool({
  host 'localhost',
  user 'root',
  password 'ggnoobbob1',
  database 'todolist',
  waitForConnections true,
  connectionLimit 10
});

const server = http.createServer(async (req, res) = {
   CORS
  res.setHeader('Access-Control-Allow-Origin', '');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.writeHead(204).end();

   Добавление
  if (req.method === 'POST' && req.url === 'add') {
    let body = '';
    req.on('data', chunk = body += chunk);
    req.on('end', async () = {
      try {
        const {text} = JSON.parse(body);
        if (!text.trim()) return res.writeHead(400).end('Text required');
        
        const [result] = await pool.execute(
          'INSERT INTO items (text) VALUES ()',
          [text.trim()]
        );
        
        res.writeHead(201, {'Content-Type' 'applicationjson'})
           .end(JSON.stringify({id result.insertId}));
      } catch (e) {
        res.writeHead(500).end('Server error');
      }
    });
    return;
  }

  res.writeHead(405).end('Only POST add allowed');
});

server.listen(PORT, () = console.log(`Add API running on port ${PORT}`));