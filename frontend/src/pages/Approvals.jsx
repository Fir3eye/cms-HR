import React, { useEffect, useState } from 'react'

export default function Approvals({ API }) {
  const [pending, setPending] = useState([])

  async function load() {
    const res = await fetch(`${API}/api/leaves/pending`)
    setPending(await res.json())
  }
  useEffect(()=>{ load() }, [])

  async function act(id, action) {
    await fetch(`${API}/api/leaves/${id}/${action}`, { method:'POST' })
    load()
  }

  return (
    <div>
      <h3>Approvals (Admin)</h3>
      <table border="1" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead><tr><th>ID</th><th>Emp</th><th>Type</th><th>From</th><th>To</th><th>Action</th></tr></thead>
        <tbody>
          {pending.map(r => <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.employeeId}</td>
            <td>{r.leave_type}</td>
            <td>{r.start_date}</td>
            <td>{r.end_date}</td>
            <td>
              <button onClick={()=>act(r.id,'approve')}>Approve</button>{' '}
              <button onClick={()=>act(r.id,'reject')}>Reject</button>
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}
