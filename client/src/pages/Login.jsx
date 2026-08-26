import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import Icons from '../components/Icons'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { t } = useLanguage()
  const { get } = useSettings()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (login(username, password)) {
      navigate('/dashboard')
    } else {
      setError(t('login.error'))
    }
  }

  return (
    <div className="pt-16 sm:pt-20 lg:pt-20 min-h-screen flex items-center justify-center bg-dark relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={get('bg_login') || '/hero-bg.png'} alt="" className="w-full h-full object-cover opacity-20" style={{ objectPosition: `${get('bg_login_x') || 50}% ${get('bg_login_y') || 50}%` }} />
        <div className="hero-overlay-bottom" />
      </div>
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="bg-overlay/10 rounded-2xl p-6 sm:p-8 border border-overlay/20 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-6">
            <img src={get('site_logo') || '/logo.png'} alt={get('site_name') || 'Automotive Academy'} className="w-32 h-auto mx-auto mb-3" />
            <h1 className="text-heading font-bold text-xl">{t('login.title')}</h1>
            <p className="text-muted text-xs mt-1">{t('login.sub')}</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-xs px-4 py-2 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="text-body text-xs mb-1 block">{t('login.username')}</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder={t('login.usernamePlaceholder')}
                  className="w-full bg-overlay/10 border border-overlay/20 rounded-lg pr-4 pl-10 py-2.5 text-heading placeholder-overlay/40 focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm transition-all"
                />
                <span className="absolute top-1/2 -translate-y-1/2 left-3 text-muted">
                  <Icons.User className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="relative">
              <label className="text-body text-xs mb-1 block">{t('login.password')}</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-overlay/10 border border-overlay/20 rounded-lg pr-4 pl-10 py-2.5 text-heading placeholder-overlay/40 focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm transition-all"
                />
                <span className="absolute top-1/2 -translate-y-1/2 left-3 text-muted">
                  <Icons.Shield className="w-4 h-4" />
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-all duration-300 text-sm hover:shadow-lg hover:shadow-primary/30"
            >
              {t('login.submit')}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link to="/" className="text-muted hover:text-primary text-xs transition-colors">
              {t('login.back')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
