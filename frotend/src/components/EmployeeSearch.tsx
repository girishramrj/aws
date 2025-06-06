import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Collapse,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface EmployeeSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  open: boolean;
  onClose: () => void;
}

const EmployeeSearch: React.FC<EmployeeSearchProps> = ({
  searchTerm,
  onSearchChange,
  open,
  onClose
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = event.target.value;
    setLocalSearchTerm(newTerm);
    onSearchChange(newTerm);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onSearchChange('');
  };

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Paper
        elevation={2}
        sx={{
          p: 1,
          mb: 1,
          mx: 2,
          borderRadius: 1,
          backgroundColor: isDarkMode ? '#FFFFFF' : alpha(theme.palette.background.paper, 0.95),
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search employees..."
            value={localSearchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: isDarkMode ? '#000000' : undefined }} />
                </InputAdornment>
              ),
              endAdornment: localSearchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={handleClearSearch}
                    sx={{ p: 0.5 }}
                  >
                    <CloseIcon fontSize="small" sx={{ color: isDarkMode ? '#000000' : undefined }} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 1,
                fontSize: '0.875rem',
                pr: localSearchTerm ? 0.5 : 1,
                color: isDarkMode ? '#000000' : undefined,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(0, 0, 0, 0.23)' : undefined,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(0, 0, 0, 0.87)' : undefined,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? '#1976d2' : undefined,
                }
              }
            }}
            sx={{ 
              flex: 1,
              '& .MuiInputLabel-root': {
                color: isDarkMode ? '#000000' : undefined,
              },
              '& .MuiInputBase-input': {
                color: isDarkMode ? '#000000' : undefined,
              },
              '&::placeholder': {
                color: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : undefined,
                opacity: 1,
              }
            }}
          />
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ ml: 1, color: isDarkMode ? '#000000' : 'text.secondary' }}
          >
            <CloseIcon fontSize="small" sx={{ color: isDarkMode ? '#000000' : undefined }} />
          </IconButton>
        </Box>
      </Paper>
    </Collapse>
  );
};

export default EmployeeSearch;