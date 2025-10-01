import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMe() {
      if (!token) { setLoading(false); return }
      try {
        const { data } = await api.get('/auth/me')
        setUser(data.user)
      } catch (e) {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }
    fetchMe()
  }, [token])

  function handleLogin(token, user) {
    setToken(token)
    setUser(user)
    localStorage.setItem('token', token)
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, handleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}
