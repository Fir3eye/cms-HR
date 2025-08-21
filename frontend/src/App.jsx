import React, { useEffect, useMemo, useState } from 'react'
import Employees from './pages/Employees.jsx'
import Attendance from './pages/Attendance.jsx'
import LeaveApply from './pages/LeaveApply.jsx'
import Approvals from './pages/Approvals.jsx'
import CalendarPage from './pages/CalendarPage.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function App() {
  const [employees, setEmployees] = useState([])
  const [employeeId, setEmployeeId] = useState('')

  async function loadEmployees() {
    const res = await fetch(`${API}/api/employees`)
    const data = await res.json()
    setEmployees(data)
    if (!employeeId && data.length) setEmployeeId(String(data[0].id))
  }

  useEffect(() => { loadEmployees() }, [])

  return (
    <div style={{fontFamily:'system-ui, Arial', padding:'16px'}}>
      <nav style={{display:'flex', gap:12, alignItems:'center', marginBottom:16}}>
        <strong>HR‑CMS</strong>
        <a href="#employees">Employees</a>
        <a href="#attendance">Attendance</a>
        <a href="#leave">Apply Leave/WFH</a>
        <a href="#approvals">Approvals</a>
        <a href="#calendar">Calendar</a>
        <span style={{marginLeft:'auto'}}>
          <select value={employeeId} onChange={e=>setEmployeeId(e.target.value)}>
            <option value="">-- Select Employee --</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </span>
      </nav>

      {location.hash === '#employees' && <Employees API={API} onChanged={loadEmployees} />}
      {location.hash === '#attendance' && <Attendance API={API} employeeId={employeeId} />}
      {location.hash === '#leave' && <LeaveApply API={API} employeeId={employeeId} />}
      {location.hash === '#approvals' && <Approvals API={API} />}
      {(location.hash === '' || location.hash === '#calendar') && <CalendarPage API={API} employeeId={employeeId} employees={employees} />}
    </div>
  )
}
