import { Router } from 'express';
import { Op } from 'sequelize';
import { Employee, Attendance, LeaveRequest, Holiday } from './models.js';

const router = Router();

// Employees
router.get('/employees', async (req, res) => {
  const rows = await Employee.findAll({ order: [['name','ASC']] });
  res.json(rows);
});

router.post('/employees', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const row = await Employee.create({ name, email, role: role || 'Employee' });
    res.json(row);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Attendance
router.get('/attendance/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const rows = await Attendance.findAll({
    where: { employeeId },
    order: [['date', 'DESC']],
    limit: 30
  });
  res.json(rows);
});

router.post('/attendance/check-in', async (req, res) => {
  const { employeeId } = req.body;
  const today = new Date();
  const dateStr = today.toISOString().slice(0,10);
  let rec = await Attendance.findOne({ where: { employeeId, date: dateStr } });
  if (!rec) rec = await Attendance.create({ employeeId, date: dateStr, status: 'Present' });
  if (!rec.check_in) {
    rec.check_in = new Date();
    await rec.save();
  }
  res.json(rec);
});

router.post('/attendance/check-out', async (req, res) => {
  const { employeeId } = req.body;
  const today = new Date();
  const dateStr = today.toISOString().slice(0,10);
  let rec = await Attendance.findOne({ where: { employeeId, date: dateStr } });
  if (!rec) rec = await Attendance.create({ employeeId, date: dateStr, status: 'Present' });
  if (!rec.check_out) {
    rec.check_out = new Date();
    await rec.save();
  }
  res.json(rec);
});

// Leaves
router.get('/leaves', async (req, res) => {
  const { employeeId } = req.query;
  const where = employeeId ? { employeeId } : {};
  const rows = await LeaveRequest.findAll({
    where,
    order: [['createdAt','DESC']],
    limit: 100
  });
  res.json(rows);
});

router.post('/leaves', async (req, res) => {
  const { employeeId, leave_type, start_date, end_date, reason } = req.body;
  const row = await LeaveRequest.create({ employeeId, leave_type, start_date, end_date, reason });
  res.json(row);
});

router.get('/leaves/pending', async (req, res) => {
  const rows = await LeaveRequest.findAll({ where: { status: 'Pending' }, order: [['createdAt','ASC']] });
  res.json(rows);
});

router.post('/leaves/:id/approve', async (req, res) => {
  const row = await LeaveRequest.findByPk(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  row.status = 'Approved';
  await row.save();
  res.json(row);
});

router.post('/leaves/:id/reject', async (req, res) => {
  const row = await LeaveRequest.findByPk(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  row.status = 'Rejected';
  await row.save();
  res.json(row);
});

// Holidays
router.get('/holidays', async (_req, res) => {
  const rows = await Holiday.findAll({ order: [['date','ASC']] });
  res.json(rows);
});

// Calendar events
router.get('/events', async (req, res) => {
  const { employeeId } = req.query;
  const events = [];

  // Approved Leaves/WFH
  const leaveWhere = { status: 'Approved' };
  if (employeeId) leaveWhere.employeeId = employeeId;
  const leaves = await LeaveRequest.findAll({ where: leaveWhere });
  for (const lr of leaves) {
    const start = new Date(lr.start_date);
    const end = new Date(lr.end_date);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
      events.push({
        title: lr.leave_type,
        start: d.toISOString().slice(0,10),
        allDay: true,
        extendedProps: { employeeId: lr.employeeId, type: 'leave' }
      });
    }
  }

  // Attendance Present
  const attWhere = employeeId ? { employeeId } : {};
  const atts = await Attendance.findAll({ where: attWhere });
  for (const a of atts) {
    if (a.status === 'Present') {
      events.push({
        title: 'Present',
        start: a.date,
        allDay: true,
        extendedProps: { employeeId: a.employeeId, type: 'attendance' }
      });
    }
  }

  // Holidays
  const hols = await Holiday.findAll();
  for (const h of hols) {
    events.push({
      title: `Holiday: ${h.name}`,
      start: h.date,
      allDay: true,
      display: 'background',
      extendedProps: { type: 'holiday' }
    });
  }

  res.json(events);
});

export default router;
