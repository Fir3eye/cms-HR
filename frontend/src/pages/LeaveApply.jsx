import React, { useEffect, useState } from 'react'

export default function LeaveApply({ API, employeeId }) {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ leave_type:'Leave', start_date:'', end_date:'', reason:'' })

  async function load() {
    if (!employeeId) return
    const res = await fetch(`${API}/api/leaves?employeeId=${employeeId}`)
    setRows(await res.json())
  }
  useEffect(()=>{ load() }, [employeeId])

  async function submit(e) {
    e.preventDefault()
    if (!employeeId) return
    await fetch(`${API}/api/leaves`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ employeeId: Number(employeeId), ...form })
    })
    setForm({ leave_type:'Leave', start_date:'', end_date:'', reason:'' })
    load()
  }

  return (
    <div>
      <h3>Apply Leave / WFH</h3>
      {!employeeId && <p>Select an employee first.</p>}
      {employeeId && (
        <form onSubmit={submit} style={{display:'grid', gap:8, maxWidth:520}}>
          <select value={form.leave_type} onChange={e=>setForm({...form, leave_type:e.target.value})}>
            <option value="Leave">Leave</option>
            <option value="WFH">WFH</option>
          </select>
          <input type="date" value={form.start_date} onChange={e=>setForm({...form, start_date:e.target.value})} required />
          <input type="date" value={form.end_date} onChange={e=>setForm({...form, end_date:e.target.value})} required />
          <textarea placeholder="Reason (optional)" value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})} />
          <button>Submit</button>
        </form>
      )}

      <h4 style={{marginTop:16}}>My Requests</h4>
      <table border="1" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead><tr><th>ID</th><th>Type</th><th>From</th><th>To</th><th>Status</th><th>Reason</th><th>Applied</th></tr></thead>
        <tbody>
          {rows.map(r => <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.leave_type}</td>
            <td>{r.start_date}</td>
            <td>{r.end_date}</td>
            <td>{r.status}</td>
            <td>{r.reason || '-'}</td>
            <td>{new Date(r.createdAt).toLocaleString()}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}
