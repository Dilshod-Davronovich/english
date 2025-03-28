require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
   ssl: {
      rejectUnauthorized: false, // Render kabi xizmatlarda SSL kerak bo‘lishi mumkin
   },
});

async function insertWord(data) {
   try {
      const query = 'INSERT INTO words_storage (words) VALUES ($1) RETURNING *';
      const values = [data];
      const res = await pool.query(query, values);
      console.log('✅ Ma’lumot qo‘shildi:', res.rows[0]);
   } catch (err) {
      console.error('❌ Xatolik:', err.message);
   }
}

async function getAllWordsOnly() {
   try {
      const query = 'SELECT words FROM words_storage'; // Faqat words ustunini olish
      const res = await pool.query(query);

      return res.rows.map((row) => row.words); // Faqat words obyektlari massivini qaytarish
   } catch (err) {
      console.error('❌ Xatolik:', err.message);
      return [];
   }
}

console.log(getAllWordsOnly());

async function addUser(newUser) {
   try {
      const client = await pool.connect();

      // 1️⃣ Jadval bo‘sh yoki yo‘qligini tekshiramiz
      const checkQuery = 'SELECT users FROM users_storage';
      const checkRes = await client.query(checkQuery);

      if (checkRes.rowCount === 0) {
         // 2️⃣ Agar jadval bo‘sh bo‘lsa, yangi qator qo‘shamiz
         const insertQuery =
            'INSERT INTO users_storage (users) VALUES ($1) RETURNING *';
         const values = [JSON.stringify([newUser])]; // Yangi user massiv ichida bo‘lishi kerak
         const insertRes = await client.query(insertQuery, values);
         console.log(
            '🆕 Yangi foydalanuvchi bazaga qo‘shildi:',
            insertRes.rows[0]
         );
      } else {
         // 3️⃣ Agar userlar bor bo‘lsa, yangi userni massivga qo‘shamiz
         const updateQuery = `
            UPDATE users_storage 
            SET users = users || $1::jsonb 
            RETURNING *`;

         const values = [JSON.stringify([newUser])];
         const updateRes = await client.query(updateQuery, values);
         console.log('✅ Yangi foydalanuvchi qo‘shildi:', updateRes.rows[0]);
      }

      client.release();
   } catch (err) {
      console.error('❌ Xatolik:', err.message);
   }
}

async function getUsers() {
   try {
      const query = 'SELECT users FROM users_storage';
      const res = await pool.query(query);

      if (res.rowCount === 0) {
         console.log('ℹ️ Jadval bo‘sh.');
         return [];
      }

      return res.rows[0].users;
   } catch (err) {
      console.error('❌ Xatolik:', err.message);
      return [];
   }
}

getUsers().then((users) => console.log(users));

// addUser({
//    name: 'Tohir Baratov',
//    city: 'Guliston',
//    amount: 3000,
//    basket: [],
//    image: 'https://english-i0qb.onrender.com/images/users/tohir.jpg',
//    userName: 'tohir',
//    password: 123,
// });

// insertWord({
//    eng: 'apple',
//    uz: 'olma',
//    image: 'https://english-i0qb.onrender.com/images/banana.png',
// });
pool
   .connect()
   .then(() => console.log('PostgreSQL serveriga muvaffaqiyatli ulandi'))
   .catch((err) => console.error('Ulanishda xatolik:', err));

module.exports = { pool, insertWord, getAllWordsOnly };
