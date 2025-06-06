import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Card,
  Link,
  TextField,
  Button,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Alert} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import logoImage from '../assets/logo.png'; // Add this import at the top
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api'; // Import the API service

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);
  
  // Define validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  });


  const handleLogin = async (values: { email: string; password: string }, { setSubmitting, setStatus, setFieldError }: { setSubmitting: (isSubmitting: boolean) => void, setStatus: (status: any) => void, setFieldError: (field: string, message: string) => void }) => {
    try {
      // Use the API service which handles the correct URL based on hostname
      const data = await api.login(values.email, values.password);
      
      console.log('Login successful:', data);
      // Token is already stored in localStorage by the api.login method
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error during login:', error);
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          // Invalid credentials error
          setFieldError('email', 'Invalid email or password');
          setFieldError('password', 'Invalid email or password');
          setStatus({
            type: 'error',
            message: 'Invalid credentials. Please check your email and password.'
          });
        } else if (error.response.status === 404) {
          // User not found
          setFieldError('email', 'No account found with this email');
          setStatus({
            type: 'error',
            message: 'No account found with this email address.'
          });
        } else {
          // Other server errors
          setStatus({
            type: 'error',
            message: error.response.data?.message || 'Login failed. Please try again.'
          });
        }
      } else if (error.request) {
        // The request was made but no response was received
        setStatus({
          type: 'error',
          message: 'No response from server. Please try again later.'
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        setStatus({
          type: 'error',
          message: 'Network error. Please check your connection and try again.'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };  return (
    <Box
      className="login-page"
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
                Login
              </Typography>
              <Typography variant="body2" color="primary">
                <Link 
                  component={RouterLink}
                  to="/register" 
                  sx={{ 
                    color: "#057dcd",
                    textDecoration: "none",
                  }}
                >
                  Don't have an account?
                </Link>
              </Typography>
            </Box>
            
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ errors, touched, handleSubmit, status }) => (
                <Form onSubmit={handleSubmit}>
                  {status && status.type === 'error' && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {status.message}
                    </Alert>
                  )}
                  
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
                  
                  <Box sx={{ mb: 1.5 }}>
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
                  
                  <Box sx={{ mb: 3 }}>
                    <Link 
                      component={RouterLink}
                      to="/forgot-password"
                      sx={{ 
                        fontSize: "0.875rem",
                        textDecoration: "none",
                        color: "#1976d2",
                        float: "right"
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    sx={{ 
                      py: 1.5,
                      bgcolor: "#057dcd",
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: 600
                    }}
                  >
                    Login
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Card>
        
        {/* Other login options */}
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
                Check other login views
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
export default Login;