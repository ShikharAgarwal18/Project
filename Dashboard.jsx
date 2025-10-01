import { useEffect, useMemo, useState } from 'react'
import api from '../utils/api'

export default function Dashboard(){
  const [profile, setProfile] = useState(null)
  const [tasks, setTasks] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [form, setForm] = useState({ title: '', description: '', status: 'todo' })

  async function fetchProfile(){
    const { data } = await api.get('/users/me')
    setProfile(data.user)
  }

  async function fetchTasks(){
    const params = {}
    if (q) params.q = q
    if (status) params.status = status
    const { data } = await api.get('/tasks', { params })
    setTasks(data.tasks)
  }

  useEffect(() => { fetchProfile() }, [])
  useEffect(() => { fetchTasks() }, [q, status])

  async function createTask(e){
    e.preventDefault()
    const { data } = await api.post('/tasks', form)
    setTasks(prev => [data.task, ...prev])
    setForm({ title: '', description: '', status: 'todo' })
  }

  async function toggleStatus(task){
    const cycle = { 'todo':'in_progress', 'in_progress':'done', 'done':'todo' }
    const { data } = await api.put(`/tasks/${task._id}`, { status: cycle[task.status] })
    setTasks(prev => prev.map(t => t._id === task._id ? data.task : t))
  }

  async function removeTask(id){
    await api.delete(`/tasks/${id}`)
    setTasks(prev => prev.filter(t => t._id !== id))
  }

  const filtered = useMemo(() => tasks, [tasks])

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <section className="md:col-span-1 card">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        {profile && (
          <div>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        )}
      </section>

      <section className="md:col-span-2 space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Create Task</h2>
          <form onSubmit={createTask} className="grid gap-3 md:grid-cols-4">
            <input className="input md:col-span-1" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
            <input className="input md:col-span-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
            <select className="input" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button className="btn md:col-span-4">Add Task</button>
          </form>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <div className="flex gap-2">
              <input className="input" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
              <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
                <option value="">All</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <ul className="divide-y">
            {filtered.map(t => (
              <li key={t._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.title} <span className="text-xs text-gray-500">[{t.status}]</span></p>
                  {t.description && <p className="text-sm text-gray-600">{t.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button className="btn" onClick={()=>toggleStatus(t)}>Next Status</button>
                  <button className="btn bg-red-600 hover:bg-red-700" onClick={()=>removeTask(t._id)}>Delete</button>
                </div>
              </li>
            ))}
            {filtered.length === 0 && <li className="py-6 text-center text-gray-500">No tasks found</li>}
          </ul>
        </div>
      </section>
    </div>
  )
}
