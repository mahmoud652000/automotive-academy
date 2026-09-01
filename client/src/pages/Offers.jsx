import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icons from '../components/Icons'
import Toast, { useToast } from '../components/Toast'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'
import { offers as defaultOffers, offerCategories, offerCategoriesEn, offerTrustBadges, timeSlots } from '../data/content'

const renderIcon = (name, className = 'w-6 h-6') => {
  const Icon = Icons[name]
  return Icon ? <Icon className={className} /> : null
}

const cardThemes = [
  { from: 'from-red-600/15', glow: 'bg-primary/10', accent: 'text-primary' },
  { from: 'from-blue-600/15', glow: 'bg-blue-500/10', accent: 'text-blue-400' },
  { from: 'from-amber-600/15', glow: 'bg-amber-500/10', accent: 'text-amber-400' },
  { from: 'from-emerald-600/15', glow: 'bg-emerald-500/10', accent: 'text-emerald-400' },
  { from: 'from-purple-600/15', glow: 'bg-purple-500/10', accent: 'text-purple-400' },
  { from: 'from-cyan-600/15', glow: 'bg-cyan-500/10', accent: 'text-cyan-400' },
]

export default function Offers() {
  const { lang, t } = useLanguage()
  const { get } = useSettings()
  const { toast, showToast } = useToast()
  const [activeCategory, setActiveCategory] = useState(lang === 'ar' ? 'كل العروض' : 'All Offers')
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '' })
  const [submitted, setSubmitted] = useState(false)
  const [offers, setOffers] = useState(defaultOffers)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)

  useEffect(() => {
    fetch('/api/offers?active=true')
      .then(r => r.json())
      .then(d => { if (d.success) setOffers(d.data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setActiveCategory(lang === 'ar' ? 'كل العروض' : 'All Offers')
  }, [lang])

  const handleBook = (offer) => {
    setSelectedOffer(offer)
    setForm({ name: '', phone: '', date: '', time: '' })
    setSubmitted(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        type: 'offer',
        offer: lang === 'ar' ? selectedOffer.title : selectedOffer.titleEn,
      }),
    })
      .then((res) => res.json())
      .then(() => setSubmitted(true))
      .catch(() => showToast(lang === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى.' : 'An error occurred, please try again.'))
  }

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault()
    if (!newsletterEmail) return
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      const data = await res.json()
      if (data.success) {
        setNewsletterSubscribed(true)
        setNewsletterEmail('')
        setTimeout(() => setNewsletterSubscribed(false), 4000)
      } else {
        showToast(data.message || 'حدث خطأ')
      }
    } catch {
      showToast(lang === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى.' : 'An error occurred, please try again.')
    }
  }

  const categories = lang === 'ar' ? offerCategories : offerCategoriesEn
  const defaultCategory = lang === 'ar' ? 'كل العروض' : 'All Offers'

  const filteredOffers = activeCategory === defaultCategory
    ? offers
    : offers.filter((o) => (lang === 'ar' ? o.category : o.categoryEn) === activeCategory)

  return (
    <div className="pt-16 sm:pt-20 lg:pt-20">
      {/* ============ HERO ============ */}
      <section className="relative py-8 sm:py-12 md:py-20 overflow-hidden bg-dark">
        <div className="absolute inset-0 z-0">
          <img src="/offers-hero-bg.png" alt="" className="w-full h-full object-cover opacity-70" />
          <div className="hero-overlay-left" />
        </div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-2">
               <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-on-hero mb-3 sm:mb-4 leading-tight">
                 <span className="text-primary">{lang === 'ar' ? (get('hero_offers_title1') || t('offers.title1')) : t('offers.title1')}</span> {lang === 'ar' ? (get('hero_offers_title2') || t('offers.title2')) : t('offers.title2')}
               </h1>
               <p className="text-on-hero-secondary text-xs sm:text-sm md:text-lg max-w-2xl">
                {lang === 'ar' ? (get('hero_offers_desc') || t('offers.desc')) : t('offers.desc')}
              </p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-2 bg-primary/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-surface rounded-2xl p-4 sm:p-6 border-2 border-dashed border-primary/30 text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary text-xl sm:text-2xl font-bold">%</span>
                  </div>
                </div>
                <h3 className="text-heading font-bold text-base sm:text-lg mb-2">{t('offers.renewedTitle')}</h3>
                <p className="text-muted text-xs sm:text-sm mb-1">{t('offers.renewedSub1')}</p>
                <p className="text-primary text-xs sm:text-sm font-medium">{t('offers.renewedSub2')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORY FILTERS ============ */}
      <section className="py-5 border-y border-overlay/10 bg-surface relative">
        {/* Divider on top */}
        <div className="absolute top-0 left-0 right-0 flex justify-center -translate-y-1/2">
          <div className="flex items-center gap-3 px-4">
            <span className="w-12 h-px bg-gradient-to-l from-primary/40 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <span className="w-12 h-px bg-gradient-to-r from-primary/40 to-transparent" />
          </div>
        </div>
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                    : 'bg-overlay/5 text-muted hover:text-heading hover:bg-overlay/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OFFERS GRID ============ */}
      <section className="py-12 bg-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          {/* Simple instructions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-2 bg-overlay/5 border border-overlay/10 rounded-full px-4 py-2">
              <Icons.Tag className="w-4 h-4 text-primary" />
              <span className="text-muted text-xs">{t('offers.step1')}</span>
            </div>
            <span className="w-6 h-px bg-overlay/20" />
            <div className="flex items-center gap-2 bg-overlay/5 border border-overlay/10 rounded-full px-4 py-2">
              <Icons.Calendar className="w-4 h-4 text-primary" />
              <span className="text-muted text-xs">{t('offers.step2')}</span>
            </div>
            <span className="w-6 h-px bg-overlay/20" />
            <div className="flex items-center gap-2 bg-overlay/5 border border-overlay/10 rounded-full px-4 py-2">
              <Icons.CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-muted text-xs">{t('offers.step3')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredOffers.map((offer, index) => {
              const theme = cardThemes[index % cardThemes.length]
              return (
                <div
                  key={offer.id}
                  className="group relative rounded-2xl overflow-hidden border border-overlay/10 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 flex flex-col bg-surface"
                >
                  {/* Header with image */}
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={offer.image}
                      alt={lang === 'ar' ? offer.title : offer.titleEn}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="card-img-overlay" />
                    <div className={`absolute -top-8 -right-8 w-32 h-32 ${theme.glow} rounded-full blur-2xl`} />

                    {/* Big number watermark */}
                    <div className="absolute bottom-1 left-3 z-10">
                      <span className="text-5xl font-bold text-overlay/10">{offer.id}</span>
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-3 right-3 z-10">
                      <div className="w-11 h-11 bg-primary/90  rounded-xl flex items-center justify-center text-white border border-overlay/20 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                        {renderIcon(offer.icon, 'w-5 h-5')}
                      </div>
                    </div>

                    {/* Category label */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] text-white/60 font-medium uppercase tracking-wide bg-black/40  px-2 py-0.5 rounded">{lang === 'ar' ? offer.category : offer.categoryEn}</span>
                    </div>

                    {/* Discount badge */}
                    {offer.discount > 0 && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                          {offer.discount}% {t('offers.discount')}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-heading font-bold text-sm mb-1.5 group-hover:text-primary transition-colors">{lang === 'ar' ? offer.title : offer.titleEn}</h3>
                    <p className="text-muted text-[11px] leading-relaxed mb-4 flex-1 line-clamp-2">{lang === 'ar' ? offer.desc : offer.descEn}</p>

                    {/* Button */}
                    <button
                      onClick={() => handleBook(offer)}
                      className="w-full flex items-center justify-center gap-2 bg-overlay/5 hover:bg-primary text-heading hover:text-white font-bold py-2 rounded-lg transition-all duration-300 text-xs border border-overlay/10 hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/30"
                    >
                      {t('offers.bookNow')}
                      <Icons.ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ TRUST BADGES ============ */}
      <section className="py-12 bg-surface border-y border-overlay/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {offerTrustBadges.map((badge, index) => (
              <div key={index} className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-overlay/5 transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  {renderIcon(badge.icon, 'w-6 h-6')}
                </div>
                <div>
                  <h4 className="text-heading font-bold text-sm mb-1">{lang === 'ar' ? badge.title : badge.titleEn}</h4>
                  <p className="text-muted text-xs leading-relaxed">{lang === 'ar' ? badge.desc : badge.descEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="/offers-newsletter.webp" alt="" className="w-full h-full object-cover" />
          <div className="hero-overlay-left-fade" />
        </div>

        <div className="container-custom relative z-10 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                 <h2 className="text-3xl md:text-4xl font-bold text-on-hero mb-3 drop-shadow-lg">{t('offers.newsletterTitle')}</h2>
                <p className="text-on-hero-secondary text-sm md:text-base leading-relaxed drop-shadow">
                  {t('offers.newsletterDesc')}
                </p>
              </div>
              <div>
                {newsletterSubscribed ? (
                  <div className="flex items-center gap-2 text-green-400 bg-green-500/15 border border-green-500/30 rounded-lg px-4 py-3.5 text-sm backdrop-blur-sm">
                    <Icons.CheckCircle className="w-5 h-5" />
                    {lang === 'ar' ? 'تم تسجيل اشتراكك! تحقق من بريدك للتأكيد.' : 'Subscribed! Check your email to confirm.'}
                  </div>
                ) : (
                <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={t('offers.emailPlaceholder')}
                      required
                       className="w-full bg-overlay/10 border border-overlay/20 rounded-lg pr-4 pl-10 py-3.5 text-on-hero placeholder-on-hero-faint text-sm focus:outline-none focus:bg-overlay/15 focus:border-overlay/40 transition-all"
                     />
                     <span className="absolute top-1/2 -translate-y-1/2 left-3 text-on-hero-faint">
                      <Icons.Mail className="w-5 h-5" />
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white font-bold px-6 sm:px-8 py-3.5 rounded-lg transition-all duration-300 text-sm whitespace-nowrap hover:shadow-lg hover:shadow-primary/40"
                  >
                    {t('offers.subscribe')}
                  </button>
                </form>
                )}
              </div>
            </div>
        </div>
      </section>

      {/* Booking modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70" onClick={() => setSelectedOffer(null)}>
          <div className="bg-surface rounded-2xl p-6 md:p-8 border border-overlay/20 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {submitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-heading font-bold text-lg mb-2">{t('offers.bookSuccess')}</h3>
                <p className="text-muted text-sm mb-5">{t('offers.bookSuccessDesc')} {lang === 'ar' ? selectedOffer.title : selectedOffer.titleEn}</p>
                <button onClick={() => setSelectedOffer(null)} className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-lg transition-all duration-300 text-sm">
                  {t('offers.close')}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-heading font-bold text-lg">{t('offers.bookOffer')}</h3>
                  <button onClick={() => setSelectedOffer(null)} className="text-muted hover:text-heading transition-colors text-xl">✕</button>
                </div>
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-5">
                  <p className="text-heading font-bold text-sm">{lang === 'ar' ? selectedOffer.title : selectedOffer.titleEn}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder={t('offers.fullName')}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-overlay/10 border border-overlay/20 rounded-lg px-4 py-2.5 text-heading placeholder-overlay/50 focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm"
                  />
                  <input
                    type="tel"
                    placeholder={t('offers.phone')}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="w-full bg-overlay/10 border border-overlay/20 rounded-lg px-4 py-2.5 text-heading placeholder-overlay/50 focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      required
                      className="w-full bg-overlay/10 border border-overlay/20 rounded-lg px-4 py-2.5 text-heading placeholder-overlay/50 focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm"
                    />
                    <select
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      required
                      className="w-full bg-overlay/10 border border-overlay/20 rounded-lg px-4 py-2.5 text-heading focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm"
                    >
                      <option value="" className="bg-dark">{t('offers.selectTime')}</option>
                      {timeSlots.map((time) => <option key={time} value={time} className="bg-dark">{time}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-all duration-300 text-sm">
                    {t('offers.confirmBooking')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      <Toast toast={toast} />
    </div>
  )
}
