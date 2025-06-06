import { Box, Typography } from "@mui/material";
import logoImage from '../assets/logo.png';

const Header = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      <Box 
        component="img" 
        src={logoImage} 
        alt="Logo" 
        sx={{ 
          height: 40,
          marginRight: 2
        }} 
      />
      <Typography 
        variant="h6" 
        component="div"
        sx={{ 
          fontWeight: 600,
          color: "#1976d2"
        }}
      >
        EmpMan
      </Typography>
    </Box>
  );
};

export default Header;
