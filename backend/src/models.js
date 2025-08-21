import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'hrcms',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: 'mysql',
    logging: false
  }
);

export const Employee = sequelize.define('employee', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Employee' }
});

export const Attendance = sequelize.define('attendance', {
  date: { type: DataTypes.DATEONLY, allowNull: false },
  check_in: { type: DataTypes.DATE, allowNull: true },
  check_out: { type: DataTypes.DATE, allowNull: true },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Present' }
});

export const LeaveRequest = sequelize.define('leave_request', {
  leave_type: { type: DataTypes.STRING, allowNull: false }, // Leave or WFH
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY, allowNull: false },
  reason: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Pending' } // Pending/Approved/Rejected
});

export const Holiday = sequelize.define('holiday', {
  name: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false, unique: true }
});

// Associations
Employee.hasMany(Attendance, { foreignKey: { allowNull: false } });
Attendance.belongsTo(Employee);

Employee.hasMany(LeaveRequest, { foreignKey: { allowNull: false } });
LeaveRequest.belongsTo(Employee);
