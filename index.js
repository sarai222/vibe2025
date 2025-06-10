const http = require('http');
const mysql = require('mysql2/promise');

const PORT = 3002; // Уникальный порт
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ggnoobbob1',
  database: 'todolist'
});

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.writeHead(204).end();

  // Удаление
  if (req.method === 'DELETE' && req.url.startsWith('/delete/')) {
    const id = req.url.split('/delete/')[1];
    
    try {
      const [result] = await pool.execute(
        'DELETE FROM items WHERE id = ?',
        [id]
      );
      
      if (result.affectedRows === 0) {
        return res.writeHead(404).end('Task not found');
      }
      
      res.writeHead(200).end('Deleted');
    } catch (e) {
      res.writeHead(500).end('Server error');
    }
    return;
  }

  res.writeHead(405).end('Only DELETE /delete allowed');
});

server.listen(PORT, () => console.log(`Delete API running on port ${PORT}`));