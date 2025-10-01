import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './views/Login.jsx'
import Register from './views/Register.jsx'
import Dashboard from './views/Dashboard.jsx'
import { useAuth } from './state/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  const { user, logout } = useAuth()
  return (
    <div>
      <nav className="bg-white border-b">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="font-semibold">Scalable App</Link>
          <div className="space-x-4">
            {user ? (
              <>
                <Link className="link" to="/dashboard">Dashboard</Link>
                <button className="btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="link" to="/login">Login</Link>
                <Link className="link" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container py-6">
        <Routes>
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}> 
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </main>
    </div>
  )
}
