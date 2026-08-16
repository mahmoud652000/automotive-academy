import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('auth')
    if (saved === 'true') {
      setIsLoggedIn(true)
      setUsername(localStorage.getItem('username') || 'admin')
    }
  }, [])

  const login = (user, pass) => {
    if (user === 'admin' && pass === 'admin123') {
      setIsLoggedIn(true)
      setUsername(user)
      localStorage.setItem('auth', 'true')
      localStorage.setItem('username', user)
      return true
    }
    return false
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUsername('')
    localStorage.removeItem('auth')
    localStorage.removeItem('username')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
