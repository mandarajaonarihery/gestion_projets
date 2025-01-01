const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DATABASE_USER || 'postgres', // Valeur par défaut
  host: process.env.DATABASE_HOST || 'localhost', // Localhost pour tests hors Docker
  database: process.env.DATABASE_NAME || 'gestion_projets',
  password: process.env.DATABASE_PASSWORD || 'kali', // Valeur par défaut
  port: process.env.DATABASE_PORT || 5432, // Port par défaut de PostgreSQL
});

module.exports = pool;
