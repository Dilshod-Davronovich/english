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
