import { body } from 'express-validator';

// Employee validation rules
export const employeeValidationRules = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required')
    .isLength({ max: 100 }).withMessage('Email must be at most 100 characters'),
  
  body('position')
    .notEmpty().withMessage('Position is required')
    .isLength({ max: 100 }).withMessage('Position must be at most 100 characters'),
  
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .isLength({ max: 20 }).withMessage('Phone number must be at most 20 characters')
];

// Address validation rules
export const addressValidationRules = [
  body('street')
    .notEmpty().withMessage('Street is required')
    .isLength({ max: 255 }).withMessage('Street must be at most 255 characters'),
  
  body('city')
    .notEmpty().withMessage('City is required')
    .isLength({ max: 100 }).withMessage('City must be at most 100 characters'),
  
  body('state')
    .notEmpty().withMessage('State is required')
    .isLength({ max: 100 }).withMessage('State must be at most 100 characters'),
  
  body('zip_code')
    .notEmpty().withMessage('Zip code is required')
    .isLength({ max: 20 }).withMessage('Zip code must be at most 20 characters'),
  
  body('is_default')
    .optional()
    .isBoolean().withMessage('Is default must be a boolean')
];
