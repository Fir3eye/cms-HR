import React, { useEffect, useState } from 'react'

export default function Attendance({ API, employeeId }) {
  const [rows, setRows] = useState([])
  const [today, setToday] = useState(null)

  async function load() {
    if (!employeeId) return
    const res = await fetch(`${API}/api/attendance/${employeeId}`)
    const data = await res.json()
    setRows(data)
    const dstr = new Date().toISOString().slice(0,10)
    setToday(data.find(r => r.date === dstr))
  }

  useEffect(()=>{ load() }, [employeeId])

  async function action(endpoint) {
    if (!employeeId) return
    await fetch(`${API}/api/attendance/${endpoint}`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ employeeId: Number(employeeId) })
    })
    load()
  }

  return (
    <div>
      <h3>Attendance {employeeId ? `(Emp #${employeeId})` : ''}</h3>
      {!employeeId && <p>Select an employee first.</p>}
      {employeeId && (
        <div style={{display:'flex', gap:8, marginBottom:8}}>
          <button onClick={()=>action('check-in')} disabled={today?.check_in}>Check In</button>
          <button onClick={()=>action('check-out')} disabled={!today || !today.check_in || today.check_out}>Check Out</button>
        </div>
      )}

      <table border="1" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead><tr><th>Date</th><th>Check-in</th><th>Check-out</th><th>Status</th></tr></thead>
        <tbody>
          {rows.map(r => <tr key={r.id}>
            <td>{r.date}</td>
            <td>{r.check_in ? new Date(r.check_in).toLocaleString() : '-'}</td>
            <td>{r.check_out ? new Date(r.check_out).toLocaleString() : '-'}</td>
            <td>{r.status}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}
