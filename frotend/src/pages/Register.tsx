import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  TextField,
  Button,
  Box,
  Typography,
  Container,
  InputAdornment,

  IconButton,
  Alert
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import logoImage from '../assets/logo.png';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface RegisterValues {
  username: string;
  email: string;
  password: string;
}

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);
  
  // Define validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  });


  const handleRegister = async (
    values: RegisterValues, 
    { setSubmitting, setStatus, setErrors }: FormikHelpers<RegisterValues>
  ) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
        credentials: 'include',
      });

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Handle text response
        const textData = await response.text();
        data = { message: textData };
      }

      if (response.ok) {
        console.log('Registration successful:', data);
        // Store the token if provided
        if (data.token) {
          localStorage.setItem('token', data.token);
        }




        setStatus({
          type: 'success',
          message: 'Registration successful! Redirecting to login...'
        });
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {


        console.error('Registration failed:', data);
        
        // Handle specific validation errors from backend
        if (response.status === 400 && data.errors) {
          // Map backend validation errors to form fields
          const formikErrors: { [key: string]: string } = {};
          
          // Check for field-specific errors
          if (data.errors.username) {
            formikErrors.username = data.errors.username;
          }
          if (data.errors.email) {
            formikErrors.email = data.errors.email;
          }
          if (data.errors.password) {
            formikErrors.password = data.errors.password;
          }
          
          if (Object.keys(formikErrors).length > 0) {
            setErrors(formikErrors);
          } else {
            // Generic error message
            setStatus({
              type: 'error',
              message: data.message || 'Validation failed. Please check your inputs.'
            });
          }
        } else if (response.status === 409) {
          // Handle conflict (duplicate username/email)
          if (data.message.includes('username')) {
            setErrors({ username: 'Username already exists' });
          } else if (data.message.includes('email')) {
            setErrors({ email: 'Email already exists' });
          } else {
            setStatus({
              type: 'error',
              message: data.message || 'Username or email already exists'
            });
          }
        } else {
          // Generic error
          setStatus({
            type: 'error',
            message: data.message || 'Registration failed. Please try again.'
          });
        }
      }
    } catch (error) {
      console.error('Error during registration:', error);

      setStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };  return (
    <Box
      className="register-page"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url(${logoImage}) left center/contain no-repeat, #e8eef1`,
        backgroundSize: "30% auto",
        py: 3,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "40%",
          height: "100%",
          backdropFilter: "blur(8px)",
          backgroundColor: "",
          zIndex: 0
        }
      }}
    >
      <Header />
      
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, maxWidth: "450px" }}>
        <Card 
          sx={{ 
            borderRadius: 1,
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
            mb: 2,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography 
                variant="h5" 
                component="h1"
                sx={{ 
                  fontWeight: 600,
                }}
              >
                Register
              </Typography>
              <Typography variant="body2" color="primary">
                <RouterLink 
                  to="/login" 
                  style={{ 
                    color: "#057dcd",
                    textDecoration: "none",
                  }}
                >
                  Already have an account?
                </RouterLink>
              </Typography>
            </Box>
            
            <Formik
              initialValues={{ username: '', email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleRegister}
            >

              {({ errors, touched, handleSubmit, isSubmitting, status }) => (
                <Form onSubmit={handleSubmit}>
                  {status && (



                    <Alert 
                      severity={status.type || "error"} 
                      sx={{ mb: 2 }}
                    >
                      {status.message}
                    </Alert>
                  )}
                  
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Username
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      placeholder="Enter username"
                      name="username"
                      variant="outlined"
                      size="small"
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1
                        },
                        '& .MuiFormHelperText-root': {
                          color: '#f44336',
                          marginLeft: 0,
                          paddingRight: '0px',
                          paddingLeft: '0px',
                          paddingBottom: '0px',
                          paddingTop: '5px',
                          marginTop: '0px',
                          marginRight: '0px',
                          background: 'white'
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Email Address
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      placeholder="Enter email address"
                      type="email"
                      name="email"
                      variant="outlined"
                      size="small"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1
                        },
                        '& .MuiFormHelperText-root': {
                          color: '#f44336',
                          marginLeft: 0,
                          paddingRight: '0px',
                          paddingLeft: '0px',
                          paddingBottom: '0px',
                          paddingTop: '5px',
                          marginTop: '0px',
                          marginRight: '0px',
                          background: 'white'
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Password
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      placeholder="Enter password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      variant="outlined"
                      size="small"
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1
                        },
                        '& .MuiFormHelperText-root': {
                          color: '#f44336',
                          marginLeft: 0,
                          paddingRight: '0px',
                          paddingLeft: '0px',
                          paddingBottom: '0px',
                          paddingTop: '5px',
                          marginTop: '0px',
                          marginRight: '0px',
                          background: 'white'
                        }
                      }}
                    />
                  </Box>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={isSubmitting}
                    sx={{ 
                      py: 1.5,
                      bgcolor: "#057dcd",
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: 600
                    }}
                  >

                    {isSubmitting ? 'Registering...' : 'Register'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Card>
        
        {/* Other registration options */}
        <Card 
          className="transparent-card"
          sx={{ borderRadius: 1, p: 1, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)" }}
        >
          {/* <Box sx={{ textAlign: "center" }}>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              mb: 1.5 
            }}>
              <Box sx={{ 
                flex: 1, 
                height: "1px", 
                bgcolor: "#e0e0e0", 
                mr: 1 
              }} />
              <Typography variant="caption" sx={{ color: "#666" }}>
                Register with
              </Typography>
              <Box sx={{ 
                flex: 1, 
                height: "1px", 
                bgcolor: "#e0e0e0", 
                ml: 1 
              }} />
            </Box>
            
            <Box sx={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: 1,
              justifyContent: { xs: "center", sm: "space-between" }
            }}>
              <Button 
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  py: 0.75,
                  px: { xs: 1, sm: 1.5 },
                  borderColor: "#f0f0f0",
                  color: "#FF8C00",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: { xs: "45%", sm: 0 },
                  flex: { xs: "0 0 auto", sm: 1 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  "&:hover": {
                    borderColor: "#FF8C00",
                    bgcolor: "rgba(255, 140, 0, 0.04)"
                  }
                }}
              >
                <Box 
                  component="img" 
                  src="src/assets/Firebase.svg" 
                  alt="Firebase" 
                  sx={{ height: 20, width: 20, mr: 0.5 }} 
                />Firebase
              </Button>
              
              <Button 
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  py: 0.75,
                  px: { xs: 1, sm: 1.5 },
                  borderColor: "#f0f0f0",
                  color: "#EB5424",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: { xs: "45%", sm: 0 },
                  flex: { xs: "0 0 auto", sm: 1 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  "&:hover": {
                    borderColor: "#EB5424",
                    bgcolor: "rgba(235, 84, 36, 0.04)"
                  }
                }}
              >
                <Box 
                  component="img" 
                  src="src/assets/auth0.svg" 
                  alt="Auth0" 
                  sx={{ height: 20, width: 20, mr: 0.5 }} 
                />Auth0
              </Button>
              
              <Button 
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  py: 0.75,
                  px: { xs: 1, sm: 1.5 },
                  borderColor: "#f0f0f0",
                  color: "#FF9900",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: { xs: "45%", sm: 0 },
                  flex: { xs: "0 0 auto", sm: 1 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  "&:hover": {
                    borderColor: "#FF9900",
                    bgcolor: "rgba(255, 153, 0, 0.04)"
                  }
                }}
              >
                <Box 
                  component="img" 
                  src="src/assets/AWS.svg" 
                  alt="AWS" 
                  sx={{ height: 20, width: 20, mr: 0.5 }} 
                />AWS
              </Button>
              
              <Button 
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  py: 0.75,
                  px: { xs: 1, sm: 1.5 },
                  borderColor: "#f0f0f0",
                  color: "#3ECF8E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: { xs: "45%", sm: 0 },
                  flex: { xs: "0 0 auto", sm: 1 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  "&:hover": {
                    borderColor: "#3ECF8E",
                    bgcolor: "rgba(62, 207, 142, 0.04)"
                  }
                }}
              >
                <Box 
                  component="img" 
                  src="src/assets/supabase.svg" 
                  alt="Supabase" 
                  sx={{ height: 20, width: 20, mr: 0.5 }} 
                />Supabase
              </Button>
            </Box>
          </Box> */}
        </Card>
      </Container>
      
      <Footer />
    </Box>
  );
}
export default Register;
