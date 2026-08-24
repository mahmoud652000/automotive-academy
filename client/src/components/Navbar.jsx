import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navLinks, siteInfo } from '../data/content'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import Icons from './Icons'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { isLoggedIn, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { lang, toggleLang, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const ThemeToggle = ({ className = '' }) => (
    <button
      onClick={toggleTheme}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-overlay/10 ${className}`}
      title={theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}
    >
      {theme === 'dark' ? (
        <Icons.Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Icons.Moon className="w-4 h-4 text-slate-600" />
      )}
    </button>
  )

  const LangToggle = ({ className = '' }) => (
    <button
      onClick={toggleLang}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-overlay/10 text-xs font-bold text-heading ${className}`}
      title={t('nav.langSwitch')}
    >
      {lang === 'ar' ? 'EN' : 'ع'}
    </button>
  )

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface border-b border-overlay/10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Logo className="relative h-10 w-auto flex-shrink-0" showText={false} />
            </div>
            <div>
              <h1 className="text-heading font-bold text-base leading-tight whitespace-nowrap">{lang === 'ar' ? siteInfo.name : siteInfo.nameEn}</h1>
              <p className="text-primary text-[10px] font-medium whitespace-nowrap">{lang === 'ar' ? siteInfo.slogan : siteInfo.sloganEn}</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-medium text-sm whitespace-nowrap transition-all relative py-2 px-2.5 rounded-lg ${
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
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <LangToggle />
            <ThemeToggle />

            <Link to="/booking" className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 flex items-center gap-1 whitespace-nowrap">
              {t('nav.bookNow')}
              <Icons.ArrowLeft className="w-3 h-3" />
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <Link to="/dashboard" className="flex items-center gap-1 text-body hover:text-primary transition-colors text-xs border border-overlay/10 px-2.5 py-2 rounded-lg hover:border-primary/30 whitespace-nowrap">
                  <Icons.Computer className="w-3.5 h-3.5" />
                  {t('nav.dashboard')}
                </Link>
                <button onClick={logout} className="text-red-400 hover:text-red-300 text-xs w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center transition-colors" title={t('nav.logout')}>
                  <Icons.Shield className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1 text-body hover:text-primary transition-colors text-xs border border-overlay/10 px-2.5 py-2 rounded-lg hover:border-primary/30 whitespace-nowrap">
                <Icons.User className="w-3.5 h-3.5" />
                {t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-1">
            <LangToggle />
            <ThemeToggle />
            <button
              className="text-heading text-2xl w-10 h-10 flex items-center justify-center"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-1 bg-surface rounded-b-xl border border-overlay/10 -mx-4 px-4 mt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${
                    isActive ? 'text-primary bg-primary/10' : 'text-body hover:text-heading hover:bg-overlay/5'
                  }`
                }
              >
                {lang === 'ar' ? link.name : link.nameEn}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-overlay/5 space-y-2">
              <Link
                to="/booking"
                onClick={() => setIsOpen(false)}
                className="block btn-primary text-center text-sm"
              >
                {t('nav.bookNow')}
              </Link>
              {isLoggedIn ? (
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-primary font-medium text-sm">
                  {t('nav.dashboard')}
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-body font-medium text-sm">
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
