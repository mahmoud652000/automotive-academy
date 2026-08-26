import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { navLinks } from '../data/content'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import Icons from './Icons'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isLoggedIn, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { lang, toggleLang, t } = useLanguage()
  const { get } = useSettings()

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isOpen])

  const ThemeToggle = ({ mobile = false }) => (
    <button
      onClick={toggleTheme}
      className={`rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-overlay/10 flex-shrink-0 ${
        mobile ? 'w-10 h-10' : 'w-9 h-9'
      } ${theme === 'light' ? 'bg-amber-50' : 'bg-white/5'}`}
      title={theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}
    >
      {theme === 'dark' ? (
        <Icons.Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Icons.Moon className="w-5 h-5 text-slate-700" />
      )}
    </button>
  )

  const LangToggle = ({ mobile = false }) => (
    <button
      onClick={toggleLang}
      className={`rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-overlay/10 font-bold text-heading flex-shrink-0 ${
        mobile ? 'w-10 h-10 text-sm' : 'w-9 h-9 text-xs'
      } bg-overlay/5`}
      title={t('nav.langSwitch')}
    >
      {lang === 'ar' ? 'EN' : 'ع'}
    </button>
  )

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface border-b border-overlay/10">
      <div className="container-custom">
        {/* ===== Desktop (lg+): organized header ===== */}
        <div className="hidden lg:flex items-center justify-between h-16">

          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Logo className="relative h-9 w-auto" showText={false} />
            </div>
            <div className="flex flex-col leading-tight">
              <h1 className="text-heading font-bold text-sm whitespace-nowrap">
                {lang === 'ar' ? get('site_name') : get('site_name_en')}
              </h1>
              <p className="text-primary text-[10px] font-medium whitespace-nowrap">
                {lang === 'ar' ? get('site_slogan') : get('site_slogan_en')}
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-medium text-[13px] whitespace-nowrap transition-all py-2 px-2.5 rounded-lg ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-body hover:text-heading hover:bg-overlay/5'
                  }`
                }
              >
                {lang === 'ar' ? link.name : link.nameEn}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <LangToggle />
            <ThemeToggle />

            {isLoggedIn ? (
              <div className="flex items-center gap-1">
                <Link to="/dashboard" className="flex items-center gap-1.5 text-heading hover:text-primary transition-colors text-xs border border-overlay/20 px-2.5 py-2 rounded-lg hover:border-primary/30 whitespace-nowrap">
                  <Icons.Computer className="w-3.5 h-3.5" />
                  {t('nav.dashboard')}
                </Link>
                <button onClick={logout} className="text-red-500 hover:text-red-400 w-9 h-9 rounded-lg hover:bg-red-500/10 flex items-center justify-center transition-colors" title={t('nav.logout')}>
                  <Icons.Shield className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 text-heading hover:text-primary transition-colors text-xs border border-overlay/20 px-2.5 py-2 rounded-lg hover:border-primary/30 whitespace-nowrap">
                <Icons.User className="w-3.5 h-3.5" />
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>

        {/* ===== Mobile: compact header ===== */}
        <div className="flex lg:hidden items-center justify-between h-14 sm:h-16">

          {/* Menu Button */}
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center text-heading hover:bg-overlay/10 transition-all duration-300 bg-overlay/5"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          {/* Centered Logo */}
          <Link to="/" className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <Logo className="relative h-8 w-auto" showText={false} />
            </div>
          </Link>

          {/* Lang + Theme */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <LangToggle mobile />
            <ThemeToggle mobile />
          </div>
        </div>
      </div>

      {/* ===== Mobile Fullscreen Menu ===== */}
      {isOpen && (
        <>
          <div className="lg:hidden fixed inset-0 top-14 sm:top-16 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
          <div className="lg:hidden fixed top-14 sm:top-16 right-0 left-0 bottom-0 overflow-y-auto bg-surface z-50 animate-fadeIn">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block py-3.5 px-4 rounded-xl font-medium text-sm transition-colors ${
                      isActive ? 'text-primary bg-primary/10' : 'text-body hover:text-heading hover:bg-overlay/5'
                    }`
                  }
                >
                  {lang === 'ar' ? link.name : link.nameEn}
                </NavLink>
              ))}
              <div className="pt-3 mt-2 border-t border-overlay/10 space-y-2">
                <Link
                  to="/booking"
                  onClick={() => setIsOpen(false)}
                  className="block btn-primary text-center text-sm"
                >
                  {t('nav.bookNow')}
                </Link>
                {isLoggedIn ? (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-3.5 px-4 text-primary font-medium text-sm">
                    {t('nav.dashboard')}
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block py-3.5 px-4 text-body font-medium text-sm">
                    {t('nav.login')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
