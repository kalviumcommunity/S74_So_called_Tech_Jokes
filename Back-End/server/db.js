// db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost', // or your DB host
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
