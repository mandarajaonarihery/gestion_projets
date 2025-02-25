const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres', 
  host: process.env.POSTGRES_HOST || 'db', // 'db' pour Docker, 'localhost' pour tests locaux
  database: process.env.POSTGRES_DB || 'gestion_projets',
  password: process.env.POSTGRES_PASSWORD || 'kali',
  port: process.env.POSTGRES_PORT || 5432,
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false, // Pour production avec SSL
});

module.exports = pool;
