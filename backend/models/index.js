import Employee from './Employee.js';
import Address from './Address.js';

// Define associations
Employee.hasMany(Address, { foreignKey: 'employee_id', as: 'addresses', onDelete: 'CASCADE' });
Address.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

export { Employee, Address };
