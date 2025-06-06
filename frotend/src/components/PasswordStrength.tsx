import { Box, Typography, LinearProgress } from "@mui/material";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  // Calculate password strength
  const calculateStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 20;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 20; // Uppercase
    if (/[a-z]/.test(password)) strength += 20; // Lowercase
    if (/[0-9]/.test(password)) strength += 20; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Special characters
    
    return strength;
  };
  
  const strength = calculateStrength(password);
  
  // Determine color and label based on strength
  const getColorAndLabel = (strength: number): { color: string; label: string } => {
    if (strength === 0) return { color: "#bcc5b4", label: "" };
    if (strength <= 20) return { color: "#ff4d4d", label: "Very Weak" };
    if (strength <= 40) return { color: "#ffa64d", label: "Weak" };
    if (strength <= 60) return { color: "#ffff4d", label: "Fair" };
    if (strength <= 80) return { color: "#4dff4d", label: "Good" };
    return { color: "#656f57", label: "Strong" };
  };
  
  const { color, label } = getColorAndLabel(strength);
  
  if (!password) return null;
  
  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: "#5c6852" }}>
          Password Strength
        </Typography>
        <Typography variant="caption" sx={{ color }}>
          {label}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={strength}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "#e6e0d6",
          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
            borderRadius: 4,
          },
        }}
      />
      {strength < 80 && (
        <Typography variant="caption" sx={{ color: "#5c6852", display: "block", mt: 1 }}>
          Tip: Use a mix of uppercase, lowercase, numbers, and special characters
        </Typography>
      )}
    </Box>
  );
};

export default PasswordStrength;