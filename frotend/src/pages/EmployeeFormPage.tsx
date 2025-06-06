import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import EmployeeForm from '../components/EmployeeForm';
import FloatingNavButtons from '../components/FloatingNavButtons';

const EmployeeFormPage = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ mb: 4, marginTop: '32px', marginBottom:'0px' }}>
        {id ? 'Edit Employee' : 'Add New Employee'}
      </Typography>
      <EmployeeForm id={id} />
      <FloatingNavButtons />
    </Box>
  );
};

export default EmployeeFormPage;