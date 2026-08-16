import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navLinks, siteInfo } from '../data/content'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Icons from './Icons'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { isLoggedIn, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const ThemeToggle = ({ className = '' }) => (
    <button
      onClick={toggleTheme}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-overlay/10 ${className}`}
      title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
    >
      {theme === 'dark' ? (
        <Icons.Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Icons.Moon className="w-4 h-4 text-slate-600" />
      )}
    </button>
  )

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled || theme === 'light'
        ? 'bg-surface/95 backdrop-blur-xl'
        : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Logo className="relative h-10 w-auto flex-shrink-0" showText={false} />
            </div>
            <div>
              <h1 className="text-heading font-bold text-base leading-tight">{siteInfo.name}</h1>
              <p className="text-primary text-[10px] font-medium">{siteInfo.slogan}</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-medium text-sm transition-all relative py-2 px-3.5 rounded-lg ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-body hover:text-heading hover:bg-overlay/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            <Link to="/booking" className="bg-primary hover:bg-primary-dark text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 flex items-center gap-1.5">
              احجز الآن
              <Icons.ArrowLeft className="w-3.5 h-3.5" />
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="flex items-center gap-1.5 text-body hover:text-primary transition-colors text-sm border border-overlay/10 px-3 py-2 rounded-lg hover:border-primary/30">
                  <Icons.Computer className="w-4 h-4" />
                  لوحة التحكم
                </Link>
                <button onClick={logout} className="text-red-400 hover:text-red-300 text-sm w-9 h-9 rounded-lg hover:bg-red-500/10 flex items-center justify-center transition-colors" title="خروج">
                  <Icons.Shield className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 text-body hover:text-primary transition-colors text-sm border border-overlay/10 px-3 py-2 rounded-lg hover:border-primary/30">
                <Icons.User className="w-4 h-4" />
                دخول
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-1">
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
          <div className="lg:hidden pb-4 space-y-1 bg-surface/95 backdrop-blur-xl rounded-b-xl border border-overlay/10 -mx-4 px-4 mt-2">
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
                {link.name}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-overlay/5 space-y-2">
              <Link
                to="/booking"
                onClick={() => setIsOpen(false)}
                className="block btn-primary text-center text-sm"
              >
                احجز الآن
              </Link>
              {isLoggedIn ? (
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-primary font-medium text-sm">
                  لوحة التحكم
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-body font-medium text-sm">
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
