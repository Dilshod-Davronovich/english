const pool = require('./db');
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // CORS moduli

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

// "audios" papkasini yaratish
const uploadPath = path.join(__dirname, 'audios');

// Multer sozlamalari
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, uploadPath); // Yuklangan fayllarni "audios" papkasiga saqlash
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Unikal nom berish
   },
});

// Faylni faqat audio formatda yuklashni tekshirish
const fileFilter = (req, file, cb) => {
   if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
   } else {
      cb(new Error('Faqat audio fayllarni yuklash mumkin!'), false);
   }
};

const upload = multer({ storage, fileFilter });

// Audio fayl yuklash uchun endpoint
app.post('/upload', upload.single('audioFile'), (req, res) => {
   if (!req.file) {
      return res.status(400).json({ message: 'Hech qanday audio yuklanmadi!' });
   }
   res.json({
      message: 'Audio muvaffaqiyatli yuklandi!',
      file: req.file.filename,
   });
});

// Admin panelni ochish uchun asosiy sahifa
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// "audios" papkasidagi fayllarga to‘g‘ridan-to‘g‘ri kirish imkoniyati
app.use('/audios', express.static(uploadPath));

app.listen(PORT, () => {
   console.log(`Server http://localhost:${PORT} da ishga tushdi`);
});
