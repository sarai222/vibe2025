const http = require('http');
const mysql = require('mysql2/promise');

const PORT = 3001; // Другой порт
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ggnoobbob1',
  database: 'todolist'
});

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.writeHead(204).end();

  // Редактирование
  if (req.method === 'PUT' && req.url.startsWith('/edit/')) {
    const id = req.url.split('/edit/')[1];
    let body = '';
    
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const {text} = JSON.parse(body);
        if (!text?.trim()) return res.writeHead(400).end('Text required');
        
        const [result] = await pool.execute(
          'UPDATE items SET text = ? WHERE id = ?',
          [text.trim(), id]
        );
        
        if (result.affectedRows === 0) {
          return res.writeHead(404).end('Task not found');
        }
        
        res.writeHead(200).end('Updated');
      } catch (e) {
        res.writeHead(500).end('Server error');
      }
    });
    return;
  }

  res.writeHead(405).end('Only PUT /edit allowed');
});

server.listen(PORT, () => console.log(`Edit API running on port ${PORT}`));