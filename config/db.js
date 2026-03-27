const mysql = require('mysql2/promise');
require('dotenv').config();

function readBoolean(value, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }

  return String(value).toLowerCase() === 'true';
}

const useSsl = readBoolean(process.env.DB_SSL, false);
const sslRejectUnauthorized = readBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED, true);
const sslCa = process.env.DB_SSL_CA ? process.env.DB_SSL_CA.replace(/\\n/g, '\n') : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: useSsl
    ? {
        rejectUnauthorized: sslRejectUnauthorized,
        ...(sslCa ? { ca: sslCa } : {})
      }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
