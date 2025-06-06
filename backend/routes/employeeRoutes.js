import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validation.js';
import { employeeValidationRules } from '../middleware/employeeValidation.js';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(verifyToken);



// Get all employees
router.get('/', getAllEmployees);

// Get employee by ID with addresses
router.get('/:id', getEmployeeById);

// Create new employee
router.post('/', employeeValidationRules, validate, createEmployee);

// Update employee
router.put('/:id', employeeValidationRules, validate, updateEmployee);

// Delete employee
router.delete('/:id', deleteEmployee);

export default router;
