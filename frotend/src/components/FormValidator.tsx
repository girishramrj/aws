import { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';

export type ValidationRule = {
  test: (value: string) => boolean;
  message: string;
};

export type FieldValidation = {
  [key: string]: ValidationRule[];
};

type FormValidatorProps = {
  values: { [key: string]: string };
  validations: FieldValidation;
  showErrors?: boolean;
  onValidationChange?: (isValid: boolean) => void;
};

const FormValidator = ({ values, validations, showErrors = true, onValidationChange }: FormValidatorProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const newErrors: { [key: string]: string[] } = {};
    let formValid = true;

    // Check each field against its validation rules
    Object.keys(validations).forEach(fieldName => {
      const fieldValue = values[fieldName] || '';
      const fieldErrors: string[] = [];

      validations[fieldName].forEach(rule => {
        if (!rule.test(fieldValue)) {
          fieldErrors.push(rule.message);
          formValid = false;
        }
      });

      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors;
      }
    });

    setErrors(newErrors);
    setIsValid(formValid);
    
    // Notify parent component about validation state changes
    if (onValidationChange) {
      onValidationChange(formValid);
    }
  }, [values, validations, onValidationChange]);

  // Export isValid as a property on the component
  FormValidator.isValid = isValid;

  if (!showErrors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      {Object.keys(errors).map(fieldName => (
        <Box key={fieldName} sx={{ mb: 1 }}>
          {errors[fieldName].map((error, index) => (
            <Alert 
              key={index} 
              severity="error" 
              sx={{ 
                mb: 0.5, 
                py: 0, 
                bgcolor: 'rgba(211, 47, 47, 0.1)', 
                color: '#d32f2f',
                '& .MuiAlert-icon': {
                  color: '#d32f2f'
                }
              }}
            >
              <Typography variant="caption">
                {error}
              </Typography>
            </Alert>
          ))}
        </Box>
      ))}
    </Box>
  );
};

// Add isValid property to component
FormValidator.isValid = false;

// Common validation rules
// eslint-disable-next-line react-refresh/only-export-components
export const validationRules = {
  required: (fieldName: string): ValidationRule => ({
    test: (value) => value.trim() !== '',
    message: `${fieldName} is required`
  }),
  email: (): ValidationRule => ({
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  }),
  minLength: (length: number): ValidationRule => ({
    test: (value) => value.length >= length,
    message: `Must be at least ${length} characters`
  }),
  passwordMatch: (compareValue: string): ValidationRule => ({
    test: (value) => value === compareValue,
    message: 'Passwords do not match'
  }),
  
  // Add a new validation rule for password strength
  passwordStrength: (minStrength: number = 60): ValidationRule => ({
    test: (value) => {
      if (!value) return false;
      
      let score = 0;
      // Length check
      if (value.length >= 8) score += 20;
      // Character variety checks
      if (/[A-Z]/.test(value)) score += 20; // Uppercase
      if (/[a-z]/.test(value)) score += 20; // Lowercase
      if (/[0-9]/.test(value)) score += 20; // Numbers
      if (/[^A-Za-z0-9]/.test(value)) score += 20; // Special characters
      
      return score >= minStrength;
    },
    message: `Password should be stronger (use a mix of uppercase, lowercase, numbers, and special characters)`
  })
};

export default FormValidator;