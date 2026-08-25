import { createContext, useContext, useState, useEffect } from 'react'
import { useSettings } from './SettingsContext'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { settings } = useSettings()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [authLoaded, setAuthLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('auth')
    if (saved === 'true') {
      setIsLoggedIn(true)
      setUsername(localStorage.getItem('username') || '')
    }
    setAuthLoaded(true)
  }, [])

  const login = (user, pass) => {
    const validUser = settings.dashboard_user || 'automotive'
    const validPass = settings.dashboard_pass || 'automotive2000'
    if (user === validUser && pass === validPass) {
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
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout, authLoaded }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
