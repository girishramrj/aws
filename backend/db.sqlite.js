// db.sqlite.js - SQLite alternative to MySQL
import dotenv from "dotenv";
import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create SQLite database file path
const dbPath = path.join(__dirname, 'database.sqlite');

// Create Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the SQLite database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the SQLite database:', err);
  });

export default sequelize; 