import axios, { AxiosError } from 'axios';

// Determine the API URL based on the current hostname
const getApiUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  } else if (hostname === '10.0.4.203') {
    return 'http://10.0.4.203:3000/api';
  }
  // Default fallback
  return 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token in all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// First, define the Address interface
export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// Then update the Employee interface
export interface Employee {
  id?: number;
  name: string;
  email: string;
  position: string;
  phone: string;
  addresses: Address[];  // Changed from boolean to Address[]
}

const api = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/employees');
      
      // Transform the data from snake_case to camelCase
      const employeesData = response.data.data;
      
      // If we have employees with addresses, transform each address
      if (Array.isArray(employeesData)) {
        return employeesData.map(employee => {
          // Transform addresses if they exist
          if (employee.addresses && Array.isArray(employee.addresses)) {
            employee.addresses = employee.addresses.map((address: any) => ({
              id: address.id,
              street: address.street,
              city: address.city,
              state: address.state,
              zipCode: address.zip_code, // Convert from snake_case to camelCase
              isDefault: address.is_default, // Convert from snake_case to camelCase
              employeeId: address.employee_id
            }));
          }
          return employee;
        });
      }
      
      return employeesData;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token } = response.data;
      
      // Save token to localStorage
      if (token) {
        localStorage.setItem('token', token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getById: async (id: number) => {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error('Invalid ID: must be a number');
    }
    try {
      const response = await axiosInstance.get(`/employees/${id}`);
      
      // Transform the data from snake_case to camelCase
      const employeeData = response.data.data;
      
      // If addresses exist, transform each address
      if (employeeData.addresses && Array.isArray(employeeData.addresses)) {
        employeeData.addresses = employeeData.addresses.map((address: any) => ({
          id: address.id,
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zip_code, // Convert from snake_case to camelCase
          isDefault: address.is_default, // Convert from snake_case to camelCase
          employeeId: address.employee_id
        }));
      }
      
      return employeeData;
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      throw error;
    }
  },
  
  add: async (employee: Employee) => {
    // The backend will generate the ID, so we don't need to do it here
    // We need to send the employee data first, then add addresses
    const employeeData = {
      name: employee.name,
      email: employee.email,
      position: employee.position,
      phone: employee.phone
    };
    
    console.log('Sending employee data to server:', JSON.stringify(employeeData, null, 2));
    
    try {
      // Create the employee first
      const response = await axiosInstance.post('/employees', employeeData);
      const createdEmployee = response.data.data;
      
      // If we have addresses, add them to the employee
      if (employee.addresses && employee.addresses.length > 0) {
        console.log(`Adding ${employee.addresses.length} addresses for employee ID ${createdEmployee.id}`);
        
        // Add each address
        for (const address of employee.addresses) {
          // Convert from frontend camelCase to backend snake_case
          const addressData = {
            street: address.street,
            city: address.city,
            state: address.state,
            zip_code: address.zipCode, // Convert zipCode to zip_code for backend
            is_default: address.isDefault, // Convert isDefault to is_default for backend
            employee_id: createdEmployee.id
          };
          
          await axiosInstance.post(`/addresses/employee/${createdEmployee.id}`, addressData);
        }
        
        // Get the updated employee with addresses
        const updatedResponse = await axiosInstance.get(`/employees/${createdEmployee.id}`);
        return updatedResponse.data.data;
      }
      
      return createdEmployee;
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        console.error('Server response error:', (error as AxiosError).response?.data || error.message);
      } else {
        console.error('Server response error:', error);
      }
      throw error;
    }
  },
  
  update: async (employee: Employee) => {
    if (!employee.id || typeof employee.id !== 'number' || isNaN(employee.id)) {
      throw new Error('Invalid ID: must be a number');
    }
    
    // Only send the fields that the backend expects
    const employeeData = {
      name: employee.name,
      email: employee.email,
      position: employee.position,
      phone: employee.phone
    };
    
    try {
      // Update the employee basic info
      const response = await axiosInstance.put(`/employees/${employee.id}`, employeeData);
      const updatedEmployee = response.data.data;
      
      // Handle addresses if they exist
      if (employee.addresses && employee.addresses.length > 0) {
        console.log(`Updating addresses for employee ID ${employee.id}`);
        
        // Get existing addresses to determine which ones to update, delete, or create
        const existingAddressesResponse = await axiosInstance.get(`/addresses/employee/${employee.id}`);
        const existingAddresses = existingAddressesResponse.data.data || [];
        const existingAddressMap = new Map(existingAddresses.map((addr: Address) => [addr.id, addr]));
        
        // Process each address
        for (const address of employee.addresses) {
          // Convert from frontend camelCase to backend snake_case
          const addressData = {
            street: address.street,
            city: address.city,
            state: address.state,
            zip_code: address.zipCode, // Convert zipCode to zip_code for backend
            is_default: address.isDefault, // Convert isDefault to is_default for backend
            employee_id: employee.id
          };
          
          if (address.id && existingAddressMap.has(address.id)) {
            // Update existing address
            await axiosInstance.put(`/addresses/${address.id}`, addressData);
            existingAddressMap.delete(address.id); // Remove from map to track which ones to delete
          } else {
            // Create new address
            await axiosInstance.post(`/addresses/employee/${employee.id}`, addressData);
          }
        }
        
        // Delete addresses that weren't in the update
        for (const addressId of existingAddressMap.keys()) {
          await axiosInstance.delete(`/addresses/${addressId}`);
        }
        
        // Get the updated employee with addresses
        const updatedResponse = await axiosInstance.get(`/employees/${employee.id}`);
        return updatedResponse.data.data;
      }
      
      return updatedEmployee;
    } catch (error) {
      console.error(`Error updating employee with ID ${employee.id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: number) => {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error('Invalid ID: must be a number');
    }
    try {
      await axiosInstance.delete(`/employees/${id}`);
      return true; // Successfully deleted
    } catch (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
      throw error;
    }
  }
};

export default api;
