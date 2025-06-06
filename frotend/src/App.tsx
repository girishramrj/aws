import { useState, useMemo, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline, Box, Toolbar, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load all page components
const EmployeeListPage = lazy(() => import('./pages/EmployeeListPage'));
const EmployeeFormPage = lazy(() => import('./pages/EmployeeFormPage'));
const EmployeeDetailsPage = lazy(() => import('./pages/EmployeeDetailsPage'));
const HomePage = lazy(() => import('./pages/HomePage'));

// Loading component to show while pages are loading
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

// Main app content separated to use context
const AppContent = () => {
  const { darkMode } = useThemeContext();
  // No need for these variables in this component as they're used in AppRoutes
  // We'll keep the theme creation here though
 
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        // Keep primary colors for buttons
        main: darkMode ? '#4C3BCF' : '#2196f3', // Keep original primary color for buttons
        light: darkMode ? '#4B70F5' : '#64b5f6',
        dark: darkMode ? '#402E7A' : '#1976d2',
        contrastText: '#ffffff',
      },
      secondary: {
        // Keep secondary colors for buttons
        main: darkMode ? '#3DC2EC' : '#ff9800', // Keep original secondary color for buttons
        light: darkMode ? '#4B70F5' : '#ffb74d',
        dark: darkMode ? '#402E7A' : '#f57c00',
        contrastText: '#ffffff',
      },
      error: {
        main: '#f44336', // Red for errors
      },
      warning: {
        main: '#ff9800', // Orange for warnings
      },
      info: {
        main: '#2196f3', // Blue for info
      },
      success: {
        main: '#4caf50', // Green for success
      },
      background: {
        default: darkMode ? '#000000' : '#f5f5f5', // Black background in dark mode
        paper: darkMode ? '#121212' : '#ffffff', // Dark gray paper in dark mode
      },
      text: {
        primary: darkMode ? '#FFFFFF' : '#212121', // White text in dark mode
        secondary: darkMode ? '#DCDCDC' : '#757575', // Light gray secondary text in dark mode
      },
      divider: darkMode ? '#808080' : 'rgba(0, 0, 0, 0.12)', // Medium gray dividers in dark mode
      action: {
        active: darkMode ? '#FFFFFF' : 'rgba(0, 0, 0, 0.54)',
        hover: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        selected: darkMode ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
        disabled: darkMode ? '#A9A9A9' : 'rgba(0, 0, 0, 0.26)',
        disabledBackground: darkMode ? '#808080' : 'rgba(0, 0, 0, 0.12)',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      // Set text color for all typography variants in dark mode
      allVariants: {
        color: darkMode ? '#FFFFFF' : undefined,
      },
      h1: {
        fontSize: '2.2rem',
        fontWeight: 500,
        marginBottom: '1rem',
        color: darkMode ? '#FFFFFF' : undefined,
      },
      h2: {
        color: darkMode ? '#FFFFFF' : undefined,
      },
      h3: {
        color: darkMode ? '#FFFFFF' : undefined,
      },
      h4: {
        color: darkMode ? '#FFFFFF' : undefined,
      },
      h5: {
        color: darkMode ? '#FFFFFF' : undefined,
      },
      h6: {
        color: darkMode ? '#FFFFFF' : undefined,
      },
      subtitle1: {
        color: darkMode ? '#DCDCDC' : undefined,
      },
      subtitle2: {
        color: darkMode ? '#DCDCDC' : undefined,
      },
      body1: {
        color: darkMode ? '#FFFFFF' : undefined,
      },
      body2: {
        color: darkMode ? '#DCDCDC' : undefined,
      },
      caption: {
        color: darkMode ? '#A9A9A9' : undefined,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1E1E1E !important' : undefined,
            '@media (max-width: 600px)': {
              backgroundColor: darkMode ? '#1E1E1E !important' : undefined,
            },
            '@media (min-width: 601px) and (max-width: 960px)': {
              backgroundColor: darkMode ? '#1E1E1E !important' : undefined,
            },
            '@media (min-width: 961px)': {
              backgroundColor: darkMode ? '#1E1E1E !important' : undefined,
            }
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: darkMode ? '#121212' : undefined,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#000000' : undefined,
            color: darkMode ? '#FFFFFF' : undefined,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: darkMode ? '#121212' : undefined,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#808080' : undefined,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: darkMode ? '#FFFFFF' : undefined,
            borderBottomColor: darkMode ? '#808080' : undefined,
          },
          head: {
            color: darkMode ? '#FFFFFF' : undefined,
            fontWeight: 700,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:nth-of-type(odd)': {
              backgroundColor: darkMode ? 'rgba(220, 220, 220, 0.05)' : undefined,
            },
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(220, 220, 220, 0.1)' : undefined,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#808080' : undefined,
            color: darkMode ? '#FFFFFF' : undefined,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: darkMode ? '#000000' : undefined,
            color: darkMode ? '#FFFFFF' : undefined,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: darkMode ? '#FFFFFF' : undefined,
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: darkMode ? '#FFFFFF' : undefined,
          },
          secondary: {
            color: darkMode ? '#DCDCDC' : undefined,
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#252525' : '#FFFFFF',
            margin: 0,
            padding: '2px 4px',
            borderRadius: '2px',
            minHeight: '1.25rem', // Ensure consistent height
            lineHeight: '1.25rem',
            position: 'absolute', // Position absolutely to prevent layout shifts
            bottom: '-1.5rem',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            marginBottom: '1.5rem', // Add margin to accommodate the helper text
            '& .MuiInputBase-root': {
              height: '56px', // Fixed height for input fields
            },
            '& .MuiFormControl-root': {
              position: 'relative', // For absolute positioning of helper text
            },
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#262626' : '#FFFFFF',
            color: darkMode ? '#FFFFFF' : '#000000',
            padding: '16px 24px',
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#262626' : '#FFFFFF',
            color: darkMode ? '#FFFFFF' : '#000000',
            padding: '16px 24px',
          },
        },
      },
    },
  }), [darkMode]);
 
  // No need for sidebar state management in this component as it's moved to AppRoutes

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
    </MuiThemeProvider>
  );
};

// Separate component for routes to use location hook
const AppRoutes = () => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useThemeContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const drawerWidth = 240;
  
  // Check if current route is login or register page
  const isAuthPage = location.pathname === '/' || location.pathname === '/register';
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };
  
  // If on auth page, render without navbar and sidebar
  if (isAuthPage) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Box>
    );
  }
  
  // Otherwise render with navbar and sidebar
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar
        toggleSidebar={toggleSidebar}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <Sidebar
        open={sidebarOpen}
        drawerWidth={drawerWidth}
        darkMode={darkMode}
        handleDrawerClose={handleDrawerClose}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: { sm: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* This creates space below the app bar */}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Main routes - All protected with JWT authentication */}
            <Route path="/employees" element={<ProtectedRoute><EmployeeListPage /></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><EmployeeFormPage /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><EmployeeFormPage /></ProtectedRoute>} />
            <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetailsPage /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  );
};

// Main App component that wraps everything with our context provider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
export default App;