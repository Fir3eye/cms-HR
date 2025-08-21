import dotenv from 'dotenv';
dotenv.config();
import { sequelize, Employee, Holiday } from './src/models.js';

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const empCount = await Employee.count();
    if (empCount === 0) {
      await Employee.bulkCreate([
        { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
        { name: 'Bob', email: 'bob@example.com', role: 'Employee' },
        { name: 'Charlie', email: 'charlie@example.com', role: 'Employee' },
      ]);
    }

    const holCount = await Holiday.count();
    const year = new Date().getFullYear();
    if (holCount === 0) {
      await Holiday.bulkCreate([
        { name: 'New Year', date: `${year}-01-01` },
        { name: 'Independence Day', date: `${year}-08-15` },
        { name: 'Gandhi Jayanti', date: `${year}-10-02` },
      ]);
    }

    console.log('Seeding done.');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

seed();
