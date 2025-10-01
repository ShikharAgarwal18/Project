import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../state/AuthContext'

export default function Register(){
  const navigate = useNavigate()
  const { handleLogin } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e){
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/register', form)
      handleLogin(data.token, data.user)
      navigate('/dashboard')
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.errors?.[0]?.msg
      setError(msg || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input className="input" placeholder="Password (min 6)" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        <button className="btn w-full" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
      </form>
      <p className="mt-3 text-sm">Have an account? <Link className="link" to="/login">Login</Link></p>
    </div>
  )
}
