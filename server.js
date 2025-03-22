const pool = require('./db');
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.get('/test-db', async (req, res) => {
   try {
      const result = await pool.query('SELECT NOW()'); // Hozirgi vaqtni qaytaradi
      res.json({ success: true, time: result.rows[0] });
   } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Database error' });
   }
});

// Statik fayllarni ulash (admin panel uchun)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
   console.log(`Server :${PORT} da ishga tushdi`);
});
