import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, Employee, Attendance, LeaveRequest, Holiday } from './src/models.js';
import routes from './src/routes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, name: 'HR-CMS API' }));

app.use('/api', routes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // auto create tables if missing
    console.log('DB connected & synced');
    app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
  } catch (e) {
    console.error('Failed to start:', e);
    process.exit(1);
  }
}

start();
