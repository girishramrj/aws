import { Employee, Address } from '../models/index.js';

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      attributes: ['id', 'name', 'email', 'position', 'phone', 'created_at', 'updated_at']
    });
    
    return res.status(200).json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message
    });
  }
};

// Get employee by ID with addresses
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.findByPk(id, {
      include: [{
        model: Address,
        as: 'addresses'
      }]
    });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found`
      });
    }
    
    return res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch employee details',
      error: error.message
    });
  }
};

// Create new employee
export const createEmployee = async (req, res) => {
  try {
    
    const { name, email, position, phone } = req.body;
    
    // Check if email already exists
    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
    
    const employee = await Employee.create({
      name,
      email,
      position,
      phone
    });
    
    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message
    });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { name, email, position, phone } = req.body;
    
    const employee = await Employee.findByPk(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found`
      });
    }
    
    // Check if email is being changed and if it's already in use
    if (email !== employee.email) {
      const existingEmployee = await Employee.findOne({ where: { email } });
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }
    
    await employee.update({
      name,
      email,
      position,
      phone
    });
    
    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message
    });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.findByPk(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found`
      });
    }
    
    // This will also delete associated addresses due to CASCADE constraint
    await employee.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Employee and associated addresses deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message
    });
  }
};
