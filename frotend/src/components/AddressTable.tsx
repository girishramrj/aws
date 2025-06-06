import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Button,
  Typography,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

// Define address interface (same as in EmployeeForm)
interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface AddressTableProps {
  addresses: Address[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onSetDefault: (index: number) => void;
  readOnly?: boolean;
}

const AddressTable: React.FC<AddressTableProps> = ({
  addresses,
  onEdit,
  onDelete,
  onSetDefault,
  readOnly = false
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

  const handleDeleteClick = (index: number) => {
    setAddressToDelete(index);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (addressToDelete !== null) {
      onDelete(addressToDelete);
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setAddressToDelete(null);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ 
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        mb: 3,
        // Completely disable hover effects for all table rows in this component
        ...(isDarkMode && {
          '& .MuiTableRow-root': {
            '&:hover': {
              backgroundColor: 'transparent !important'
            }
          },
          // Ensure default rows maintain their styling
          '& .MuiTableRow-root.default-row': {
            backgroundColor: `${alpha(theme.palette.primary.main, 0.05)} !important`,
            '&:hover': {
              backgroundColor: `${alpha(theme.palette.primary.main, 0.05)} !important`
            }
          },
          // Ensure alternating row colors are maintained
          '& .MuiTableRow-root:nth-of-type(odd):not(.default-row)': {
            backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05) !important'
            }
          },
          '& .MuiTableRow-root:nth-of-type(even):not(.default-row)': {
            backgroundColor: 'transparent !important',
            '&:hover': {
              backgroundColor: 'transparent !important'
            }
          }
        })
      }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: isDarkMode 
                ? theme.palette.secondary.dark 
                : alpha(theme.palette.primary.main, 0.05) 
            }}>
              <TableCell sx={{ 
                fontWeight: 'bold',
                color: isDarkMode ? '#000000' : 'inherit'
              }}>Street</TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                color: isDarkMode ? '#000000' : 'inherit'
              }}>City</TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                color: isDarkMode ? '#000000' : 'inherit'
              }}>State</TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                color: isDarkMode ? '#000000' : 'inherit'
              }}>Zip Code</TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                color: isDarkMode ? '#000000' : 'inherit'
              }}>Default</TableCell>
              {!readOnly && <TableCell align="right" sx={{ 
                fontWeight: 'bold',
                color: isDarkMode ? '#000000' : 'inherit'
              }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses.length > 0 ? (
              addresses.map((address, index) => (
                <TableRow 
                  key={address.id}
                  className={address.isDefault ? 'default-row' : ''}
                  sx={{ 
                    backgroundColor: address.isDefault 
                      ? alpha(theme.palette.primary.main, 0.05) 
                      : (index % 2 === 1 && isDarkMode) 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'inherit',
                    // Individual row hover effect is handled at the TableContainer level

                    // Apply black text color to even rows in dark mode
                    ...(index % 2 === 1 && isDarkMode && {
                      '& .MuiTableCell-root': {
                        color: '#000000'
                      }
                    })
                  }}
                >
                  <TableCell>{address.street}</TableCell>
                  <TableCell>{address.city}</TableCell>
                  <TableCell>{address.state}</TableCell>
                  <TableCell>{address.zipCode}</TableCell>
                  <TableCell>
                    {address.isDefault ? (
                      <Chip 
                        size="small" 
                        color="primary" 
                        label="Default" 
                        icon={<CheckCircleIcon />}
                      />
                    ) : !readOnly && (
                      <Button 
                        size="small" 
                        variant="text" 
                        color="primary"
                        onClick={() => onSetDefault(index)}
                      >
                        Set Default
                      </Button>
                    )}
                  </TableCell>
                  {!readOnly && (
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => onEdit(index)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleDeleteClick(index)}
                          disabled={false}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={readOnly ? 5 : 6} sx={{ textAlign: 'center', py: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="disabled" sx={{ fontSize: 40, opacity: 0.6 }} />
                    <Typography variant="body1" color="text.secondary">
                      No Address added
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-address-dialog-title"
      >
        <DialogTitle id="delete-address-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this address? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddressTable;