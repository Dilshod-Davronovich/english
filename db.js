require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
   ssl: {
      rejectUnauthorized: false, // Render kabi xizmatlarda SSL kerak bo‘lishi mumkin
   },
});

pool
   .connect()
   .then(() => console.log('PostgreSQL serveriga muvaffaqiyatli ulandi'))
   .catch((err) => console.error('Ulanishda xatolik:', err));

module.exports = pool;
