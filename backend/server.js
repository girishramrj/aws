//server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./db.js";
import authRoutes from "./auth.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
// Import models to ensure they're initialized
import { Employee, Address } from "./models/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://10.0.4.203:5173'], // Allow both localhost and specific IP
  credentials: true // If you're using cookies for authentication
}));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/addresses", addressRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Sync database models
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
    
    // Start the server after database sync
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`- Local: http://localhost:${PORT}`);
      console.log(`- Network: http://10.0.4.203:${PORT}`);
    });
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

// Initialize the application
syncDatabase();
