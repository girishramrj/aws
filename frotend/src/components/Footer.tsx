import { Box, Link, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 16px",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(5px)",
        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
        fontSize: "0.75rem",
        color: "#666",
      }}
    >
      <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
        © Made with love by Team
      </Typography>
      <Box>
        <Link 
          href="https://www.4iapps.com/privacy-policy/" 
          sx={{ 
            color: "#666", 
            textDecoration: "none", 
            marginRight: 2,
            "&:hover": {
              color: "#1976d2",
              textDecoration: "underline"
            }
          }}
        >
          Terms and Conditions
        </Link>
        <Link 
          href="https://www.4iapps.com/privacy-policy/" 
          sx={{ 
            color: "#666", 
            textDecoration: "none",
            "&:hover": {
              color: "#1976d2",
              textDecoration: "underline"
            }
          }}
        >
          Privacy Policy
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;