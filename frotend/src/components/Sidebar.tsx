import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Toolbar,
  useTheme,
  alpha,
  Typography,
  // useMediaQuery,
  IconButton
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  // Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon 
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  drawerWidth: number;
  darkMode: boolean;
  handleDrawerClose: () => void;
}

const Sidebar = ({ open, drawerWidth, darkMode, handleDrawerClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/home' },
    { text: 'Employee List', icon: <PeopleIcon />, path: '/employees' },
    { text: 'Add Employee', icon: <PersonAddIcon />, path: '/add' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    // { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Logout', icon: <LogoutIcon />, path: '/logout' }
  ];

  // Handle menu item click - always close drawer
  const handleMenuItemClick = (path: string) => {
    // Handle logout separately
    if (path === '/logout') {
      // Clear the JWT token from localStorage
      localStorage.removeItem('token');
      // Redirect to login page
      navigate('/');
    }
    handleDrawerClose();
  };

  return (
    <Drawer
      anchor="left"
      variant="temporary"
      open={open}
      onClose={handleDrawerClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: darkMode ? alpha('#000000', 0.9) : theme.palette.background.paper,
          color: darkMode ? '#fff' : theme.palette.text.primary,
          borderRight: `1px solid ${darkMode ? alpha('#4B70F5', 0.2) : theme.palette.divider}`,
          borderRadius: 0,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 1 }}>
        <Toolbar sx={{ height: 64, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              fontWeight: 500,
              color: darkMode ? '#4B70F5' : theme.palette.primary.main
            }}
          >
            EMS
          </Typography>
          <IconButton onClick={handleDrawerClose} sx={{ 
            color: darkMode ? alpha('#fff', 0.7) : theme.palette.text.secondary,
            '&:hover': {
              bgcolor: darkMode ? alpha('#AD49E1', 0.15) : alpha(theme.palette.primary.main, 0.05),
            }
          }}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
      </Box>
      
      <Divider sx={{ bgcolor: darkMode ? alpha('#4B70F5', 0.2) : undefined }} />
      
      <Box sx={{ p: 2, mb: 1 }}>
        <Typography 
          variant="subtitle2" 
          color={darkMode ? alpha('#fff', 0.6) : 'text.secondary'}
          sx={{ 
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '0.75rem',
            fontWeight: 500
          }}
        >
          Main Navigation
        </Typography>
      </Box>
      
      <Box sx={{ overflow: 'auto' }}>
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              {item.path === '/logout' ? (
                <ListItemButton
                  onClick={() => handleMenuItemClick(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    height: 48,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: darkMode ? alpha('#AD49E1', 0.25) : alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: darkMode ? alpha('#AD49E1', 0.35) : alpha(theme.palette.primary.main, 0.2),
                      }
                    },
                    '&:hover': {
                      bgcolor: darkMode ? alpha('#AD49E1', 0.15) : alpha(theme.palette.primary.main, 0.05),
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: location.pathname === item.path 
                      ? (darkMode ? '#AD49E1' : theme.palette.primary.main) 
                      : (darkMode ? alpha('#fff', 0.7) : theme.palette.text.secondary),
                    minWidth: 40
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: location.pathname === item.path ? 500 : 400,
                      fontSize: '0.9rem',
                      color: darkMode ? '#ffffff' : 'inherit'
                    }}
                  />
                </ListItemButton>
              ) : (
                <Link to={item.path} style={{ textDecoration: 'none', width: '100%', color: 'inherit' }}>
                  <ListItemButton
                    onClick={() => handleMenuItemClick(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      height: 48,
                      borderRadius: 1,
                      '&.Mui-selected': {
                        bgcolor: darkMode ? alpha('#4B70F5', 0.25) : alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          bgcolor: darkMode ? alpha('#4B70F5', 0.35) : alpha(theme.palette.primary.main, 0.2),
                        }
                      },
                      '&:hover': {
                        bgcolor: darkMode ? alpha('#4B70F5', 0.15) : alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: location.pathname === item.path 
                        ? (darkMode ? '#4B70F5' : theme.palette.primary.main) 
                        : (darkMode ? alpha('#fff', 0.7) : theme.palette.text.secondary),
                      minWidth: 40
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontWeight: location.pathname === item.path ? 500 : 400,
                        fontSize: '0.9rem',
                        color: darkMode ? '#ffffff' : 'inherit'
                      }}
                    />
                  </ListItemButton>
                </Link>
              )}
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2, mx: 2, bgcolor: darkMode ? alpha('#4B70F5', 0.2) : undefined }} />
        <Box sx={{ p: 2, textAlign: 'center', color: darkMode ? alpha('#fff', 0.6) : theme.palette.text.secondary }}>
          <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
            Version 1.0.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;