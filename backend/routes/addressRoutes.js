import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validation.js';
import { addressValidationRules } from '../middleware/employeeValidation.js';
import {
  getEmployeeAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js';

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(verifyToken);



// Get all addresses for an employee
router.get('/employee/:employeeId', getEmployeeAddresses);

// Get address by ID
router.get('/:id', getAddressById);

// Create new address for an employee
router.post('/employee/:employeeId', addressValidationRules, validate, createAddress);

// Update address
router.put('/:id', addressValidationRules, validate, updateAddress);

// Delete address
router.delete('/:id', deleteAddress);

export default router;
