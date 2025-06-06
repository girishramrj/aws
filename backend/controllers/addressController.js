import { Address, Employee } from '../models/index.js';
import { Op } from 'sequelize';

// Get all addresses for an employee
export const getEmployeeAddresses = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // Check if employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${employeeId} not found`
      });
    }
    
    const addresses = await Address.findAll({
      where: { employee_id: employeeId }
    });
    
    return res.status(200).json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
      error: error.message
    });
  }
};

// Get address by ID
export const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const address = await Address.findByPk(id, {
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: `Address with ID ${id} not found`
      });
    }
    
    return res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch address details',
      error: error.message
    });
  }
};

// Create new address for an employee
export const createAddress = async (req, res) => {
  try {
    
    const { employeeId } = req.params;
    const { street, city, state, zip_code, is_default } = req.body;
    
    // Check if employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${employeeId} not found`
      });
    }
    
    // If this address is set as default, update all other addresses to non-default
    if (is_default) {
      await Address.update(
        { is_default: false },
        { where: { employee_id: employeeId } }
      );
    } else {
      // Check if this is the first address for the employee
      const addressCount = await Address.count({ where: { employee_id: employeeId } });
      
      // If it's the first address, make it default automatically
      if (addressCount === 0) {
        is_default = true;
      }
    }
    
    const address = await Address.create({
      employee_id: employeeId,
      street,
      city,
      state,
      zip_code,
      is_default: is_default || false
    });
    
    return res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: address
    });
  } catch (error) {
    console.error('Error creating address:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create address',
      error: error.message
    });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { street, city, state, zip_code, is_default } = req.body;
    
    const address = await Address.findByPk(id);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: `Address with ID ${id} not found`
      });
    }
    
    // If this address is being set as default, update all other addresses of this employee to non-default
    if (is_default && !address.is_default) {
      await Address.update(
        { is_default: false },
        { where: { employee_id: address.employee_id, id: { [Op.ne]: id } } }
      );
    }
    
    await address.update({
      street,
      city,
      state,
      zip_code,
      is_default: is_default !== undefined ? is_default : address.is_default
    });
    
    return res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message
    });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    
    const address = await Address.findByPk(id);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: `Address with ID ${id} not found`
      });
    }
    
    // Check if the deleted address was the default one
    const wasDefault = address.is_default;
    const employeeId = address.employee_id;
    
    // Delete the address
    await address.destroy();
    
    // If the deleted address was the default one, set another address as default if available
    if (wasDefault) {
      const remainingAddresses = await Address.findAll({ where: { employee_id: employeeId } });
      
      if (remainingAddresses.length > 0) {
        // Set the first remaining address as default
        await remainingAddresses[0].update({ is_default: true });
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message
    });
  }
};
