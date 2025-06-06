import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { z } from 'zod';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  Alert,
  Divider,
  Container,
  alpha,
  Autocomplete,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import api, { Employee } from '../services/api';
import AddressTable from './AddressTable';

// Custom styled TextField to normalize autofill styles
const StyledTextField = styled(TextField)(({ theme }) => {
  // Check if we're in dark mode based on the theme's palette mode
  const isDarkMode = theme.palette.mode === 'dark';
  
  return {
    '& .MuiInputBase-input': {
      '&:-webkit-autofill': {
        // Set white background for autofill
        WebkitBoxShadow: '0 0 0 100px #ffffff inset',
        // Use black text in dark mode, otherwise use theme's text color
        WebkitTextFillColor: isDarkMode ? '#000000' : theme.palette.text.primary,
        caretColor: isDarkMode ? '#000000' : theme.palette.text.primary,
        borderRadius: 'inherit',
        transition: theme.transitions.create(['box-shadow', 'background-color'], {
          duration: theme.transitions.duration.standard,
        }),
      },
      // Set text color to black in dark mode for all input states
      color: isDarkMode ? '#000000' : theme.palette.text.primary,
    },
    '& .MuiInputBase-input:focus': {
      backgroundColor: '#ffffff',
    },
    // Override label color in dark mode
    '& .MuiInputLabel-root': {
      color: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : undefined,
    },
    // Override focused label color in dark mode
    '& .MuiInputLabel-root.Mui-focused': {
      color: isDarkMode ? theme.palette.primary.main : undefined,
    },
  };
});

// Define address interface
interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface EmployeeFormProps {
  id?: string;
  onSubmitSuccess?: () => void;
}

// List of available positions
const positionOptions = [
  'Software Engineer',
  'Senior Software Engineer',
  'Product Manager',
  'Project Manager',
  'UI/UX Designer',
  'Graphic Designer',
  'Data Scientist',
  'Data Analyst',
  'DevOps Engineer',
  'QA Engineer',
  'Technical Writer',
  'Marketing Specialist',
  'HR Manager',
  'Finance Manager',
  'CEO',
  'CTO',
  'CFO',
  'COO',
  'Sales Representative',
  'Customer Support Specialist'
];

// Address validation schema
const addressSchema = Yup.object().shape({
  street: Yup.string().required('Required'),
  city: Yup.string().required('Required').matches(/^[A-Za-z\s]+$/, 'City must contain only alphabets'),
  state: Yup.string().required('Required').matches(/^[A-Za-z\s]+$/, 'Enter only alphabets'),
  zipCode: Yup.string().required('Required').matches(/^[0-9]{6}$/, 'Only 6 Digits'),          //make sure only numbers are entered with 6 digits
  isDefault: Yup.boolean()
});

// Define Zod schema for personal information validation (kept for compatibility)
const personalInfoSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .regex(/^[A-Za-z\s]+$/, "Name must contain only alphabets"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .refine(email => email.includes('@'), {
      message: "Email must contain @ symbol"
    }),
  phone: z.string()
    .min(1, "Phone number is required")
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  position: z.string().min(1, "Position is required")
});

// Yup validation schema for personal information
const personalInfoValidationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .matches(/^[A-Za-z\s]+$/, 'Name must contain only alphabets'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  phone: Yup.string()
    .required('Phone number is required')
    .length(10, 'Phone number must be exactly 10 digits')
    .matches(/^\d+$/, 'Phone number must contain only digits'),
  position: Yup.string()
    .required('Position is required')
});

const EmployeeForm: React.FC<EmployeeFormProps> = ({ id, onSubmitSuccess }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  // const { darkMode } = useThemeContext();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Employee & { addresses: Address[] }>({
    name: '',
    email: '',
    position: '',
    phone: '',
    addresses: []
  });

  // Add these state variables for the address dialog
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [currentAddress, setCurrentAddress] = useState<Address>({
    id: 0,
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });
  
  // Add state for Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Add submission lock to prevent multiple rapid submissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!id;

  // Function to capitalize first letter of each word
  const capitalizeWords = (str: string): string => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.position
    },
    validationSchema: personalInfoValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      // Update formData with Formik values
      const updatedFormData = {
        ...formData,
        name: values.name,
        email: values.email,
        phone: values.phone,
        position: values.position
      };
      
      // Call the existing submit handler with updated data
      handleSubmit(undefined, updatedFormData);
    }
  });

  // Add the handleEditAddress function
  const handleEditAddress = (index: number) => {
    setEditingAddressIndex(index);
    setCurrentAddress({...formData.addresses[index]});
    setAddressDialogOpen(true);
  };

  // Add the handleAddNewAddress function properly inside the component
  const handleAddNewAddress = () => {
    // Generate a truly unique ID by using timestamp + random number
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    const newId = timestamp + random;
    
    setEditingAddressIndex(null);
    setCurrentAddress({
      id: newId,
      street: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: formData.addresses.length === 0 // Make it default if it's the first address
    });
    setAddressDialogOpen(true);
  };

  // Handle saving address from Formik form
  const handleSaveAddress = (values: Address) => {
    // Prevent multiple rapid submissions
    if (isSubmitting) {
      return;
    }
    
    // Set submission lock
    setIsSubmitting(true);
    
    // Validate that all required fields are filled
    if (!values.street || !values.city || !values.state || !values.zipCode) {
      // Don't proceed if validation fails
      setIsSubmitting(false);
      return;
    }
    
    let updatedAddresses: Address[];
    
    if (editingAddressIndex !== null) {
      // Update existing address
      updatedAddresses = formData.addresses.map((address, index) => {
        if (index === editingAddressIndex) {
          return values;
        }
        // If we're setting a new default, make sure others are not default
        if (values.isDefault && address.isDefault) {
          return { ...address, isDefault: false };
        }
        return address;
      });
    } else {
      // Add new address
      updatedAddresses = [...formData.addresses];
      
      // If the new address is default, update other addresses
      if (values.isDefault) {
        updatedAddresses = updatedAddresses.map(address => ({
          ...address,
          isDefault: false
        }));
      }
      
      updatedAddresses.push(values);
    }
    
    setFormData({
      ...formData,
      addresses: updatedAddresses
    });
    
    // Show success message
    setSnackbarMessage(editingAddressIndex !== null ? 'Address updated successfully' : 'New address added successfully');
    setSnackbarOpen(true);
    
    // Close the dialog
    setAddressDialogOpen(false);
    
    // Release submission lock after a short delay to prevent rapid reopening
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  useEffect(() => {
    if (!isEditMode || !id) {
      setLoading(false);
      return;
    }
    
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const startTime = Date.now();
        
        // Ensure ID is a valid number
        const employeeId = parseInt(id);
        if (isNaN(employeeId)) {
          setError('Invalid employee ID');
          return;
        }
        
        const employee = await api.getById(employeeId);
        // Initialize addresses array if it doesn't exist
        setFormData({
          ...employee,
          addresses: employee.addresses || []
        });
        
        // Ensure loader shows for at least 1 second
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 1000) {
          await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
        setError('Failed to load employee data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployee();
  }, [id, isEditMode]);

  const handleRemoveAddress = (index: number) => {
    // Allow removing any address since we can have an empty table
    if (formData.addresses?.length === 0) {
      return;
    }
    
    const updatedAddresses = formData.addresses?.filter((_, i) => i !== index);
    
    // If we're removing the default address, make the first one default
    if (formData.addresses?.[index].isDefault && updatedAddresses?.length) {
      updatedAddresses[0].isDefault = true;
    }
    
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const handleSetDefaultAddress = (index: number) => {
    const updatedAddresses = formData.addresses?.map((address, i) => ({
      ...address,
      isDefault: i === index
    }));
    
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const handleSubmit = async (e?: React.FormEvent, updatedData?: typeof formData) => {
    if (e) {
      e.preventDefault();
    }
    
    // Use the updated data if provided, otherwise use the current formData
    const dataToSubmit = updatedData || formData;
    
    console.log('Form submission started with data:', dataToSubmit);
    
    // Reset error state
    setError(null);
    
    // Validate with Zod
    try {
      const validationResult = personalInfoSchema.safeParse({
        name: dataToSubmit.name,
        email: dataToSubmit.email,
        phone: dataToSubmit.phone,
        position: dataToSubmit.position
      });
      
      if (!validationResult.success) {
        // Extract and display the first error message
        const formattedErrors = validationResult.error.format();
        const errorMessages = [];
        
        if (formattedErrors.name?._errors) {
          errorMessages.push(formattedErrors.name._errors[0]);
        }
        if (formattedErrors.email?._errors) {
          errorMessages.push(formattedErrors.email._errors[0]);
        }
        if (formattedErrors.phone?._errors) {
          errorMessages.push(formattedErrors.phone._errors[0]);
        }
        if (formattedErrors.position?._errors) {
          errorMessages.push(formattedErrors.position._errors[0]);
        }
        
        setError(errorMessages.join(', '));
        return;
      }
      
      // Clean up addresses data - remove empty addresses
      const cleanedAddresses = dataToSubmit.addresses.filter(addr => 
        addr.street.trim() !== '' || 
        addr.city.trim() !== '' || 
        addr.state.trim() !== '' || 
        addr.zipCode.trim() !== ''
      );
      
      // Ensure at least one address exists
      const addressesToSubmit = cleanedAddresses.length > 0 
        ? cleanedAddresses 
        : [{ id: 1, street: '', city: '', state: '', zipCode: '', isDefault: true }];
      
      // Prepare the data for submission
      const finalDataToSubmit = {
        ...dataToSubmit,
        addresses: addressesToSubmit
      };
      
      try {
        if (isEditMode && id) {
          // Ensure ID is a valid number
          const employeeId = parseInt(id);
          if (isNaN(employeeId)) {
            setError('Invalid employee ID');
            return;
          }
          
          await api.update({ ...finalDataToSubmit, id: employeeId });
          // Show success message
          setSnackbarMessage(`Employee ${finalDataToSubmit.name} updated successfully!`);
          setSnackbarOpen(true);
        } else {
          await api.add(finalDataToSubmit);
          // Show success message
          setSnackbarMessage(`Employee ${finalDataToSubmit.name} added successfully!`);
          setSnackbarOpen(true);
        }
        
        // Set a timeout to allow the snackbar to be visible before navigating away
        setTimeout(() => {
          if (onSubmitSuccess) {
            onSubmitSuccess();
          } else {
            navigate('/employees');
          }
        }, 1500);
      } catch (error: any) {
        console.error(`Error ${isEditMode ? 'updating' : 'adding'} employee:`, error);
        
        // More detailed error message
        let errorMessage = `Failed to ${isEditMode ? 'update' : 'add'} employee. `;
        if (error.response) {
          errorMessage += `Server responded with status ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`;
        } else if (error.request) {
          errorMessage += 'No response received from server. Please check your connection.';
        } else {
          errorMessage += error.message || 'Unknown error occurred.';
        }
        
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setError('An unexpected error occurred during validation.');
    }
  };

  // Add handler for closing the snackbar
  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '400px',
      backgroundColor: alpha(theme.palette.primary.light, 0.05),
      borderRadius: 2
    }}>
      <CircularProgress size={60} color="primary" />
      <Typography variant="body1" sx={{ mt: 2, fontWeight: 500 }}>Loading employee data...</Typography>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <PersonIcon fontSize="large" />
          <Typography variant="h4" component="h1" fontWeight="500">
            {isEditMode ? 'Edit' : 'Add'} Employee
          </Typography>
        </Box>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mx: 3, 
              mt: 3, 
              borderRadius: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            {error}
          </Alert>
        )}
        
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <PersonIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="h6" fontWeight="500">Personal Information</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <StyledTextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Full Name"
                    value={formik.values.name}
                    onChange={(e) => {
                      // Apply capitalization
                      const capitalizedValue = capitalizeWords(e.target.value);
                      formik.setFieldValue('name', capitalizedValue);
                    }}
                    onInput={(e) => {
                      // Handle autofill events
                      const target = e.target as HTMLInputElement;
                      const capitalizedValue = capitalizeWords(target.value);
                      if (capitalizedValue !== formik.values.name) {
                        formik.setFieldValue('name', capitalizedValue);
                      }
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    required
                    variant="outlined"
                    autoComplete="name"
                    InputProps={{
                      sx: { borderRadius: 1 }
                    }}
                  />
                  
                  <StyledTextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onInput={(e) => {
                      // Handle autofill events
                      const target = e.target as HTMLInputElement;
                      if (target.value !== formik.values.email) {
                        formik.setFieldValue('email', target.value);
                      }
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    required
                    type="email"
                    variant="outlined"
                    autoComplete="email"
                    InputProps={{
                      sx: { borderRadius: 1 }
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <Autocomplete
                    id="position"
                    options={positionOptions}
                    value={formik.values.position || null}
                    onChange={(_, newValue) => {
                      formik.setFieldValue('position', newValue || '');
                    }}
                    freeSolo
                    renderInput={(params) => (
                      <StyledTextField
                        {...params}
                        name="position"
                        label="Job Position"
                        required
                        variant="outlined"
                        error={formik.touched.position && Boolean(formik.errors.position)}
                        helperText={formik.touched.position && formik.errors.position}
                        onBlur={formik.handleBlur}
                        onInput={(e) => {
                          // Handle autofill events
                          const target = e.target as HTMLInputElement;
                          if (target.value !== formik.values.position) {
                            formik.setFieldValue('position', target.value);
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          sx: { borderRadius: 1 }
                        }}
                      />
                    )}
                    sx={{ width: '100%' }}
                  />
                  
                  <StyledTextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label="Phone Number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onInput={(e) => {
                      // Handle autofill events
                      const target = e.target as HTMLInputElement;
                      if (target.value !== formik.values.phone) {
                        formik.setFieldValue('phone', target.value);
                      }
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    required
                    variant="outlined"
                    autoComplete="tel"
                    InputProps={{
                      sx: { borderRadius: 1 }
                    }}
                  />
                </Box>
              </Stack>
            </Box>
            
            {/* Addresses section - modified to use AddressTable */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HomeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="500">
                    Addresses
                  </Typography>
                </Box>
                <Button 
                  aria-label="Add Address"
                  variant="contained" 
                  onClick={handleAddNewAddress}
                  size="small"
                  // disabled={(formData.addresses.length >0) ? true : false}
                  sx={{ 
                    borderRadius: 1,
                    boxShadow: 2,
                    minWidth: 'auto',
                    p: 1
                  }}
                >
                  <AddIcon />
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              {/* Address Table */}
              <AddressTable 
                addresses={formData.addresses}
                onEdit={handleEditAddress}
                onDelete={handleRemoveAddress}
                onSetDefault={handleSetDefaultAddress}
              />
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            {/* Form buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                aria-label="Cancel"
                onClick={() => navigate('/employees')}
                sx={{ 
                  borderRadius: 1,
                  minWidth: 'auto',
                  p: 1.5
                }}
              >
                <CancelIcon />
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                aria-label={isEditMode ? 'Update Employee' : 'Save Employee'}
                sx={{ 
                  borderRadius: 1,
                  minWidth: 'auto',
                  p: 1.5,
                  boxShadow: 2
                }}
              >
                <SaveIcon />
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
      
      {/* Address Edit Dialog with Formik */}
      <Dialog 
        open={addressDialogOpen} 
        onClose={() => setAddressDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        
      >
        <DialogTitle>
          {editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={currentAddress}
            validationSchema={addressSchema}
            onSubmit={(values, { setSubmitting }) => {
              if (!isSubmitting) {
                handleSaveAddress(values);
              }
              setSubmitting(false);
            }}
            validateOnBlur={true}
            validateOnChange={true}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
              <Form>
                <Box sx={{ pt: 1 }}>
                  <Stack spacing={3}>
                    <Box>
                      <StyledTextField
                        fullWidth
                        id="street"
                        name="street"
                        label="Street Address"
                        value={values.street}
                        onChange={handleChange}
                        onInput={(e) => {
                          // Handle autofill events
                          const target = e.target as HTMLInputElement;
                          if (target.value !== values.street) {
                            setFieldValue('street', target.value);
                          }
                        }}
                        onBlur={handleBlur}
                        error={touched.street && Boolean(errors.street)}
                        helperText={touched.street && errors.street}
                        required
                        variant="outlined"
                        autoFocus
                        InputProps={{
                          sx: { borderRadius: 1 }
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      <StyledTextField
                        fullWidth
                        id="city"
                        name="city"
                        label="City"
                        value={values.city}
                        onChange={handleChange}
                        onInput={(e) => {
                          // Handle autofill events
                          const target = e.target as HTMLInputElement;
                          if (target.value !== values.city) {
                            setFieldValue('city', target.value);
                          }
                        }}
                        onBlur={handleBlur}
                        error={touched.city && Boolean(errors.city)}
                        helperText={touched.city && errors.city}
                        required
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: 1 }
                        }}
                      />
                      
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <StyledTextField
                          id="state"
                          name="state"
                          label="State"
                          value={values.state}
                          onChange={handleChange}
                          onInput={(e) => {
                            // Handle autofill events
                            const target = e.target as HTMLInputElement;
                            if (target.value !== values.state) {
                              setFieldValue('state', target.value);
                            }
                          }}
                          onBlur={handleBlur}
                          error={touched.state && Boolean(errors.state)}
                          helperText={touched.state && errors.state}
                          required
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                          sx={{ width: { xs: '100%', sm: '120px' } }}
                        />
                        
                        <StyledTextField
                          id="zipCode"
                          name="zipCode"
                          label="Zip Code"
                          value={values.zipCode}
                          onChange={handleChange}
                          onInput={(e) => {
                            // Handle autofill events
                            const target = e.target as HTMLInputElement;
                            if (target.value !== values.zipCode) {
                              setFieldValue('zipCode', target.value);
                            }
                          }}
                          onBlur={handleBlur}
                          error={touched.zipCode && Boolean(errors.zipCode)}
                          helperText={touched.zipCode && errors.zipCode}
                          required
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1 }
                          }}
                          sx={{ width: { xs: '100%', sm: '120px' } }}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        type="button"
                        variant={values.isDefault ? "contained" : "outlined"}
                        color={values.isDefault ? "primary" : "inherit"}
                        onClick={() => setFieldValue('isDefault', !values.isDefault)}
                        sx={{ borderRadius: 1 }}
                        aria-label={values.isDefault ? "Default Address" : "Set as Default"}
                      >
                        {values.isDefault ? "Default Address" : "Set as Default"}
                      </Button>
                      {values.isDefault && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                          This address will be used as the primary contact address
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
                
                {/* Display validation errors summary if needed */}
                {Object.keys(errors).length > 0 && touched.street && (
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Alert severity="error" sx={{ borderRadius: 1 }}>
                      Please fix the errors before saving
                    </Alert>
                  </Box>
                )}
                
                <DialogActions sx={{ px: 3, pb: 3, mt: 3 }}>
                  <Button 
                    onClick={() => setAddressDialogOpen(false)} 
                    color="inherit"
                    variant="outlined"
                    aria-label="Cancel"
                    sx={{ 
                      borderRadius: 1,
                      minWidth: 'auto',
                      p: 1.5
                    }}
                  >
                    <CancelIcon />
                  </Button>
                  <Button 
                    type="submit"
                    color="primary"
                    variant="contained"
                    aria-label="Save Address"
                    disabled={(Object.keys(errors).length > 0 && Object.keys(touched).length > 0) || isSubmitting}
                    sx={{ 
                      borderRadius: 1,
                      minWidth: 'auto',
                      p: 1.5,
                      boxShadow: 2
                    }}
                  >
                    <SaveIcon />
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EmployeeForm;