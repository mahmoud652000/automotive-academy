import { useState } from 'react'
import { Link } from 'react-router-dom'
import { navLinks, siteInfo, services } from '../data/content'
import Logo from './Logo'
import Icons from './Icons'

const socialLinks = [
  {
    href: 'https://www.facebook.com/AACarServiceCenter',
    label: 'Facebook',
    color: '#1877F2',
    path: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    href: '#',
    label: 'Instagram',
    color: '#E1306C',
    path: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=academyoa7@gmail.com',
    label: 'Gmail',
    color: '#EA4335',
    path: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m22 7-10 5L2 7" fill="none" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
  {
    href: `https://wa.me/${siteInfo.whatsapp}`,
    label: 'WhatsApp',
    color: '#25D366',
    path: (
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
      />
    ),
  },
]

const contactItems = [
  { icon: 'Phone', label: siteInfo.phone, href: `tel:${siteInfo.phone.replace(/\s/g, '')}` },
  { icon: 'Mail', label: siteInfo.email, href: `mailto:${siteInfo.email}` },
  { icon: 'MapPin', label: siteInfo.address, href: null },
  { icon: 'Clock', label: siteInfo.workingHours, href: null },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="relative bg-surface border-t border-overlay/10 overflow-hidden">
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-l from-primary/0 via-primary to-primary/0" />

      {/* Subtle glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom py-8 md:py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Column 1: Brand + Newsletter */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-3">
              <Logo className="h-10 w-auto flex-shrink-0" showText={false} />
              <div>
                <h3 className="text-heading font-bold text-sm">{siteInfo.name}</h3>
                <p className="text-primary text-[10px] font-medium">{siteInfo.slogan}</p>
              </div>
            </div>
            <p className="text-muted text-xs leading-relaxed mb-4 max-w-sm">
              تقدم أفضل خدمات صيانة وإصلاح السيارات بأعلى معايير الجودة وباستخدام أحدث الأجهزة وفريق من الفنيين المحترفين
            </p>

            {/* Newsletter */}
            <div className="bg-gradient-to-b from-white/[0.04] to-transparent rounded-xl p-4 border border-overlay/10">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <Icons.Mail className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-heading font-bold text-xs">النشرة البريدية</h4>
              </div>
              {subscribed ? (
                <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-xs">
                  <Icons.CheckCircle className="w-3.5 h-3.5" />
                  تم الاشتراك بنجاح!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                    className="flex-1 bg-overlay/5 border border-overlay/10 rounded-lg px-3 py-2 text-heading placeholder-faint text-xs focus:border-primary focus:bg-overlay/10 focus:outline-none transition-all duration-300"
                  />
                  <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 whitespace-nowrap">
                    اشترك
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-heading font-bold text-xs mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full" />
              روابط سريعة
            </h4>
            <ul className="space-y-1.5">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted hover:text-primary transition-colors text-xs flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-overlay/30 group-hover:bg-primary transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="lg:col-span-3">
            <h4 className="text-heading font-bold text-xs mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full" />
              خدماتنا
            </h4>
            <ul className="space-y-1.5">
              {services.map((service) => (
                <li key={service.id}>
                  <Link to="/services" className="text-muted hover:text-primary transition-colors text-xs flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-overlay/30 group-hover:bg-primary transition-all duration-300" />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact + Social */}
          <div className="lg:col-span-3">
            <h4 className="text-heading font-bold text-xs mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full" />
              معلومات التواصل
            </h4>
            <ul className="space-y-2">
              {contactItems.map((item, index) => {
                const Icon = Icons[item.icon]
                const content = (
                  <div className="flex items-start gap-2.5 group">
                    <div className="w-7 h-7 bg-overlay/5 rounded-lg flex items-center justify-center text-primary border border-overlay/5 group-hover:bg-primary/10 transition-all duration-300 flex-shrink-0">
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-muted group-hover:text-heading transition-colors text-xs leading-relaxed pt-1">
                      {item.label}
                    </span>
                  </div>
                )
                return (
                  <li key={index}>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                )
              })}
            </ul>

            {/* Social */}
            <div className="mt-4">
              <p className="text-faint text-[11px] mb-2">تابعنا على</p>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 border border-overlay/5"
                    style={{ color: social.color }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = social.color
                      e.currentTarget.style.borderColor = social.color
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = ''
                      e.currentTarget.style.borderColor = ''
                      e.currentTarget.style.color = social.color
                    }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {social.path}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-overlay/5 bg-overlay/[0.02]">
        <div className="container-custom py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-faint text-[11px] flex items-center gap-1.5 flex-wrap justify-center">
            <span>جميع الحقوق محفوظة © 2025</span>
            <span className="text-primary font-medium">{siteInfo.name}</span>
            <span className="text-overlay/20">|</span>
            <span>تصميم وتطوير</span>
            <span className="text-heading font-medium">المهندس محمود البنا</span>
          </p>
          <div className="flex gap-5 text-[11px] text-faint">
            <a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-primary transition-colors">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
