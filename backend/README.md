# HR-CMS Backend (Node.js + Express + Sequelize + MySQL)

## Setup
1. Create MySQL DB:
   ```sql
   CREATE DATABASE hrcms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Copy `.env.example` to `.env` and update credentials.
3. Install and run:
   ```bash
   npm install
   npm run seed   # creates tables + sample data
   npm run dev    # API at http://localhost:5000
   ```

## API (summary)
- `GET /api/employees`, `POST /api/employees`
- `GET /api/attendance/:employeeId`
- `POST /api/attendance/check-in`, `POST /api/attendance/check-out`
- `GET /api/leaves?employeeId=...`, `POST /api/leaves`
- `GET /api/leaves/pending`, `POST /api/leaves/:id/approve`, `POST /api/leaves/:id/reject`
- `GET /api/holidays`
- `GET /api/events?employeeId=...`
