const { pool, getAllWordsOnly, insertWord, getUsers } = require('./db');
const express = require('express');
const path = require('path');
const cors = require('cors');
const { error } = require('console');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json()); // 💡 JSON ma'lumotlarni qabul qilish uchun qo‘shildi
app.use(express.urlencoded({ extended: true })); // 💡 URL-formatted ma'lumotlarni ham qabul qilish uchun

// Statik fayllarni ulash (admin panel uchun)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/writeword', async (req, res) => {
   try {
      const { eng, uz, image, yodlangan } = req.body;
      if (!eng || !uz || !image) {
         return res
            .status(400)
            .json({ error: 'Barcha maydonlarni to‘ldiring' });
      }

      await insertWord({ eng, uz, image, yodlangan }); // import qilingan funksiyani ishlatish

      res.status(201).json({ success: true, message: 'So‘z qo‘shildi' });
   } catch (err) {
      console.error('❌ Xatolik:', err.message);
      res.status(500).json({ error: 'Server xatosi' });
   }
});

app.get('/allwords', async (req, res) => {
   try {
      const words = await getAllWordsOnly(); // Bazadan barcha so‘zlarni olish
      res.json(words);
   } catch (err) {
      console.error('❌ Xatolik:', err.message);
      res.status(500).json({ error: 'Server xatosi' });
   }
});

app.get('/allusers', async (req, res) => {
   try {
      const users = await getUsers(); // Bazadan barcha foydalanuvchilarni olish
      res.json(users);
   } catch (err) {
      console.error('❌ Xatolik:', err.message);
      res.status(500).json({ error: 'Server xatosi' });
   }
});

app.listen(PORT, () => {
   console.log(`Server :${PORT} da ishga tushdi`);
});
