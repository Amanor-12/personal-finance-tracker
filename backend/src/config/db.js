const { Pool } = require('pg');

const { databaseUrl, isProduction } = require('./env');

const parsedDatabaseUrl = new URL(databaseUrl);

const pool = new Pool({
  database: parsedDatabaseUrl.pathname.replace(/^\//, ''),
  host: parsedDatabaseUrl.hostname,
  password: decodeURIComponent(parsedDatabaseUrl.password),
  port: parsedDatabaseUrl.port ? Number(parsedDatabaseUrl.port) : 5432,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  user: decodeURIComponent(parsedDatabaseUrl.username),
});

pool.checkDatabase = async () => {
  await pool.query('SELECT 1');

  return { configured: true, status: 'connected' };
};

module.exports = pool;
