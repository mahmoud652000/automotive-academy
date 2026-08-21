import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icons from '../components/Icons'
import CTABanner from '../components/CTABanner'
import { contactMethods, branches, siteInfo } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

const renderIcon = (name, className = 'w-6 h-6') => {
  const Icon = Icons[name]
  return Icon ? <Icon className={className} /> : null
}

export default function Contact() {
  const { lang, t } = useLanguage()
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        alert(t('contact.success'))
        setForm({ name: '', phone: '', email: '', subject: '', message: '' })
      })
      .catch(() => alert(t('contact.error')))
  }

  return (
    <div>
      {/* Hero banner */}
      <section className="relative w-full overflow-hidden">
        <img src="/contact-bg.webp" alt={t('contact.title')} className="w-full h-auto block" />
      </section>

      {/* Contact methods */}
      <section className="relative z-20 py-10 md:py-14">
        <div className="container-custom">
          {/* Title */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-12 md:w-20 h-px bg-primary" />
            <h2 className="text-heading font-bold text-lg md:text-2xl whitespace-nowrap">{t('contact.title')}</h2>
            <span className="w-12 md:w-20 h-px bg-primary" />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                className="group bg-overlay/[0.03] border border-overlay/10 rounded-2xl p-5 flex flex-col items-center text-center hover:border-primary/30 hover:bg-overlay/[0.05] transition-all duration-500 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center text-primary group-hover:border-primary group-hover:bg-primary/10 transition-all duration-500 mb-4">
                  {renderIcon(method.icon, 'w-5 h-5')}
                </div>

                {/* Title */}
                <h3 className="text-heading font-bold text-sm mb-2">{lang === 'ar' ? method.title : method.titleEn}</h3>

                {/* Value */}
                <p className="text-muted text-xs leading-relaxed mb-3 flex-1">{lang === 'ar' ? method.value : (method.valueEn || method.value)}</p>

                {/* Footer */}
                <p className="text-faint text-[10px] pt-3 border-t border-overlay/5 w-full group-hover:text-primary transition-colors duration-500">
                  {lang === 'ar' ? method.footer : (method.footerEn || method.footer)}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="relative">
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl opacity-50" />

              <div className="relative bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl p-6 md:p-8 border border-overlay/10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                    <Icons.Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-heading">{t('contact.sendMsg')}</h2>
                    <p className="text-faint text-xs mt-0.5">{t('contact.sendMsgSub')}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="relative group">
                      <input type="text" placeholder={t('contact.fullName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                        className="w-full bg-overlay/5 border border-overlay/10 rounded-xl pr-4 pl-11 py-3 text-heading placeholder-faint focus:border-primary focus:bg-overlay/10 focus:outline-none transition-all duration-300 text-sm" />
                      <span className="absolute top-1/2 -translate-y-1/2 left-4 text-faint group-hover:text-primary group-focus-within:text-primary transition-colors duration-300">
                        <Icons.User className="w-4 h-4" />
                      </span>
                    </div>
                    {/* Phone */}
                    <div className="relative group">
                      <input type="tel" placeholder={t('contact.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required
                        className="w-full bg-overlay/5 border border-overlay/10 rounded-xl pr-4 pl-11 py-3 text-heading placeholder-faint focus:border-primary focus:bg-overlay/10 focus:outline-none transition-all duration-300 text-sm" />
                      <span className="absolute top-1/2 -translate-y-1/2 left-4 text-faint group-hover:text-primary group-focus-within:text-primary transition-colors duration-300">
                        <Icons.Phone className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="relative group">
                      <input type="email" placeholder={t('contact.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-overlay/5 border border-overlay/10 rounded-xl pr-4 pl-11 py-3 text-heading placeholder-faint focus:border-primary focus:bg-overlay/10 focus:outline-none transition-all duration-300 text-sm" />
                      <span className="absolute top-1/2 -translate-y-1/2 left-4 text-faint group-hover:text-primary group-focus-within:text-primary transition-colors duration-300">
                        <Icons.Mail className="w-4 h-4" />
                      </span>
                    </div>
                    {/* Subject */}
                    <div className="relative group">
                      <input type="text" placeholder={t('contact.subject')} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required
                        className="w-full bg-overlay/5 border border-overlay/10 rounded-xl pr-4 pl-11 py-3 text-heading placeholder-faint focus:border-primary focus:bg-overlay/10 focus:outline-none transition-all duration-300 text-sm" />
                      <span className="absolute top-1/2 -translate-y-1/2 left-4 text-faint group-hover:text-primary group-focus-within:text-primary transition-colors duration-300">
                        <Icons.Tag className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  {/* Message */}
                  <div className="relative group">
                    <textarea placeholder={t('contact.message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5}
                      className="w-full bg-overlay/5 border border-overlay/10 rounded-xl pr-4 pl-11 py-3 text-heading placeholder-faint focus:border-primary focus:bg-overlay/10 focus:outline-none resize-none transition-all duration-300 text-sm" />
                    <span className="absolute top-4 left-4 text-faint group-hover:text-primary group-focus-within:text-primary transition-colors duration-300">
                      <Icons.Search className="w-4 h-4" />
                    </span>
                  </div>
                  {/* Submit */}
                  <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2">
                    {t('contact.send')}
                    <Icons.ArrowLeft className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-heading mb-6">{t('contact.location')}</h2>
              <div className="rounded-xl overflow-hidden h-96 border border-overlay/10">
                <iframe src="https://maps.google.com/maps?q=31.0252126,31.3926808&z=17&hl=ar&output=embed" className="w-full h-full" style={{ border: 0 }} title={t('contact.mapTitle')} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-surface relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <div className="text-center mb-8">
            <span className="text-primary font-bold text-sm flex items-center justify-center gap-2 mb-2">
              <span className="w-8 h-px bg-primary" />
              {t('contact.branchesLabel')}
              <span className="w-8 h-px bg-primary" />
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-heading">{t('contact.branchesTitle')}</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {branches.map((branch, index) => (
              <div key={index} className="group relative bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl overflow-hidden border border-overlay/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                <div className="relative h-56 md:h-72 overflow-hidden">
                  <img src={branch.image} alt={lang === 'ar' ? branch.name : branch.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                  <div className="absolute bottom-4 right-4">
                    <span className="inline-flex items-center gap-2 bg-surface/80 backdrop-blur-md text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-overlay/20 shadow-lg">
                      <Icons.MapPin className="w-4 h-4" />
                      {lang === 'ar' ? branch.name : branch.nameEn}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted text-sm leading-relaxed mb-3 flex items-start gap-2">
                    <Icons.MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {lang === 'ar' ? branch.address : branch.addressEn}
                  </p>
                  <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="text-muted text-sm flex items-center gap-2 hover:text-primary transition-colors">
                    <Icons.Phone className="w-4 h-4 text-primary" />
                    {branch.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  )
}
