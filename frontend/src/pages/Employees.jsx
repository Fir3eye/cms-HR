import React, { useEffect, useState } from 'react'

export default function Employees({ API, onChanged }) {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name:'', email:'', role:'Employee' })

  async function load() {
    const res = await fetch(`${API}/api/employees`)
    setList(await res.json())
  }
  useEffect(()=>{ load() }, [])

  async function submit(e) {
    e.preventDefault()
    await fetch(`${API}/api/employees`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    })
    setForm({ name:'', email:'', role:'Employee' })
    await load()
    onChanged && onChanged()
  }

  return (
    <div>
      <h3>Employees</h3>
      <form onSubmit={submit} style={{display:'grid', gap:8, maxWidth:480}}>
        <input placeholder="Name" required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="Email" type="email" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option>Employee</option>
          <option>Admin</option>
        </select>
        <button>Add Employee</button>
      </form>

      <table border="1" cellPadding="6" style={{marginTop:16, borderCollapse:'collapse'}}>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr></thead>
        <tbody>
          {list.map(e => <tr key={e.id}><td>{e.id}</td><td>{e.name}</td><td>{e.email}</td><td>{e.role}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
