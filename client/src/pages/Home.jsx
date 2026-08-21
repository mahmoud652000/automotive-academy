import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import ServiceCard from '../components/ServiceCard'
import CTABanner from '../components/CTABanner'
import Icons from '../components/Icons'
import { services, features, stats, promoBadges, aboutBulletPoints, aboutText, bookingSteps, heroBadges, testimonials, siteInfo, carBrands } from '../data/content'

export default function Home() {
  const { lang, t } = useLanguage()
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', service: '', date: '', time: '' })
  const [reviewForm, setReviewForm] = useState({ name: '', role: '', text: '', rating: 5 })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [userReviews, setUserReviews] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [events, setEvents] = useState([])
  const allReviews = [...userReviews, ...testimonials]

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingForm),
    })
      .then((res) => res.json())
      .then(() => {
        alert(t('home.bookingSuccess'))
        setBookingForm({ name: '', phone: '', service: '', date: '', time: '' })
      })
      .catch(() => alert(t('home.bookingError')))
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    setUserReviews([...userReviews, { ...reviewForm, name: reviewForm.name }])
    setReviewSubmitted(true)
    setReviewForm({ name: '', role: '', text: '', rating: 5 })
    setTimeout(() => {
      setShowReviewForm(false)
      setReviewSubmitted(false)
    }, 2500)
  }

  const reviewsPerPage = 3
  const totalPages = Math.ceil(allReviews.length / reviewsPerPage)
  const visibleReviews = allReviews.slice(currentSlide * reviewsPerPage, currentSlide * reviewsPerPage + reviewsPerPage)

  const nextSlide = () => setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1))
  const prevSlide = () => setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1))

  useEffect(() => {
    fetch('/api/events?active=true')
      .then(r => r.json())
      .then(d => setEvents(d.data || []))
      .catch(() => {})
  }, [])

  // Auto-advance
  const carouselRef = useRef(null)
  const maxSlides = Math.max(0, allReviews.length - reviewsPerPage)
  useEffect(() => {
    if (allReviews.length <= reviewsPerPage) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1))
    }, 4000)
    return () => clearInterval(timer)
  }, [maxSlides, allReviews.length])

  const renderIcon = (name, className = 'w-6 h-6') => {
    const Icon = Icons[name]
    return Icon ? <Icon className={className} /> : null
  }

  const allCarBrands = carBrands.flatMap(g => g.brands)
  const marqueeRef = useRef(null)
  const marqueeOffset = useRef(0)

  useEffect(() => {
    let raf
    let lastTime = performance.now()
    const speed = 30 // px per second

    const animate = (time) => {
      const delta = time - lastTime
      lastTime = time
      marqueeOffset.current -= (speed * delta) / 1000

      if (marqueeRef.current) {
        const halfWidth = marqueeRef.current.scrollWidth / 2
        if (marqueeOffset.current <= -halfWidth) {
          marqueeOffset.current += halfWidth
        }
        marqueeRef.current.style.transform = `translateX(${marqueeOffset.current}px)`
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div>
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.png" alt={lang === 'ar' ? 'ورشة أكاديمية السيارات' : 'Automotive Academy Workshop'} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0f] via-[#0a0a0f]/85 to-[#0a0a0f]/30" />
        </div>

        <div className="container-custom relative z-10 py-12 pt-32">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
            {/* Right Side - Text */}
            <div className="flex-1 lg:pt-8 lg:pr-8">
              <span className="inline-block text-primary font-bold text-sm tracking-wide mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-primary" />
                {t('home.heroBadge')}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5">
                {t('home.heroTitle1')}<br /><span className="text-primary">{t('home.heroTitle2')}</span>
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed">
                {t('home.heroDesc')}
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3">
                {heroBadges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 hover:border-primary/30 transition-colors">
                    <span className="text-primary">{renderIcon(badge.icon, 'w-5 h-5')}</span>
                    <span className="text-white text-sm font-medium">{lang === 'ar' ? badge.text : badge.textEn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Left Side - Booking Form */}
            <div className="w-full max-w-sm bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-2xl shadow-primary/10 flex-shrink-0 lg:ml-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="mb-5 relative z-10">
                <h3 className="text-xl font-bold text-white mb-1">{t('home.bookNow')}</h3>
                <p className="text-white/70 text-xs">{t('home.bookSub')}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
                <div className="relative">
                  <select
                    value={bookingForm.service}
                    onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })}
                    required
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg pr-3 pl-9 py-2.5 text-white text-sm placeholder-white/50 focus:border-primary focus:bg-white/15 focus:outline-none transition-all appearance-none"
                  >
                    <option value="" className="bg-surface">{t('home.selectService')}</option>
                    {services.map((s) => (<option key={s.id} value={lang === 'ar' ? s.title : s.titleEn} className="bg-surface">{lang === 'ar' ? s.title : s.titleEn}</option>))}
                  </select>
                  <span className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 pointer-events-none">{renderIcon('Wrench', 'w-4 h-4')}</span>
                </div>
                <div className="relative">
                  <input type="text" placeholder={t('home.fullName')} value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} required
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg pr-3 pl-9 py-2.5 text-white text-sm placeholder-white/50 focus:border-primary focus:bg-white/15 focus:outline-none transition-all" />
                  <span className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 pointer-events-none">{renderIcon('User', 'w-4 h-4')}</span>
                </div>
                <div className="relative">
                  <input type="tel" placeholder={t('home.phone')} value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} required
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg pr-3 pl-9 py-2.5 text-white text-sm placeholder-white/50 focus:border-primary focus:bg-white/15 focus:outline-none transition-all" />
                  <span className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 pointer-events-none">{renderIcon('Phone', 'w-4 h-4')}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input type="date" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} required
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg pr-3 pl-8 py-2.5 text-white text-sm focus:border-primary focus:bg-white/15 focus:outline-none transition-all" />
                    <span className="absolute top-1/2 -translate-y-1/2 left-2.5 text-gray-400 pointer-events-none">{renderIcon('Calendar', 'w-4 h-4')}</span>
                  </div>
                  <div className="relative">
                    <select value={bookingForm.time} onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })} required
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg pr-3 pl-8 py-2.5 text-white text-sm focus:border-primary focus:bg-white/15 focus:outline-none transition-all appearance-none">
                      <option value="" className="bg-surface">{lang === 'ar' ? 'الوقت' : 'Time'}</option>
                      {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(time => <option key={time} className="bg-surface">{time}</option>)}
                    </select>
                    <span className="absolute top-1/2 -translate-y-1/2 left-2.5 text-gray-400 pointer-events-none">{renderIcon('Clock', 'w-4 h-4')}</span>
                  </div>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-all duration-300 text-sm hover:shadow-lg hover:shadow-primary/30">
                  {t('home.confirmBooking')}
                </button>
              </form>
              <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <p className="text-gray-400 text-xs mb-0.5">{t('home.orCall')}</p>
                <a href={`tel:${siteInfo.phone.replace(/\s/g, '')}`} className="text-primary font-bold text-base hover:text-primary-light transition-colors">{siteInfo.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-10 md:py-14 relative overflow-hidden bg-dark">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <span className="text-primary font-bold text-sm flex items-center justify-center gap-2 mb-2">
                <span className="w-8 h-px bg-primary" />
                {t('home.testimonialsLabel')}
                <span className="w-8 h-px bg-primary" />
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-heading">{t('home.testimonialsTitle')}</h2>
            </div>
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-xs px-4 py-2.5 rounded-lg border border-primary/30 transition-all duration-300 whitespace-nowrap"
            >
              <Icons.Star className="w-4 h-4" />
              {t('home.addReview')}
            </button>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(${currentSlide * (100 / reviewsPerPage)}%)` }}
              >
                {allReviews.map((testimonial, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2"
                  >
                    <div className="group relative bg-gradient-to-b from-white/[0.05] to-transparent rounded-2xl p-5 border border-overlay/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 h-full">
                      {/* Quote icon */}
                      <div className="absolute top-4 left-4 text-primary/10 text-5xl font-bold leading-none group-hover:text-primary/20 transition-colors">"</div>

                      {/* Stars */}
                      <div className="flex gap-1 mb-3 relative z-10">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Icons.Star key={i} className="w-4 h-4 text-yellow-400" />
                        ))}
                      </div>

                      {/* Text */}
                      <p className="text-body text-sm leading-relaxed mb-4 relative z-10">{lang === 'ar' ? testimonial.text : (testimonial.textEn || testimonial.text)}</p>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-3 border-t border-overlay/5">
                        <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                          {(lang === 'ar' ? testimonial.name : (testimonial.nameEn || testimonial.name)).charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-heading font-bold text-xs">{lang === 'ar' ? testimonial.name : (testimonial.nameEn || testimonial.name)}</h4>
                          <p className="text-faint text-[10px]">{lang === 'ar' ? testimonial.role : (testimonial.roleEn || testimonial.role)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            {maxSlides > 0 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={prevSlide}
                  className="w-9 h-9 rounded-lg bg-overlay/5 border border-overlay/10 text-white hover:bg-primary hover:border-primary flex items-center justify-center transition-all duration-300"
                >
                  <Icons.ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
                <div className="flex gap-1.5">
                  {Array.from({ length: maxSlides + 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-overlay/20'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="w-9 h-9 rounded-lg bg-overlay/5 border border-overlay/10 text-white hover:bg-primary hover:border-primary flex items-center justify-center transition-all duration-300"
                >
                  <Icons.ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Add Review Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowReviewForm(false)}>
          <div className="bg-overlay/10 backdrop-blur-2xl rounded-2xl p-6 border border-overlay/20 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {reviewSubmitted ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-heading font-bold text-lg mb-2">{t('home.reviewThanks')}</h3>
                <p className="text-muted text-sm">{t('home.reviewAdded')}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-heading font-bold text-lg">{t('home.addReview')}</h3>
                  <button onClick={() => setShowReviewForm(false)} className="text-muted hover:text-heading transition-colors text-xl">✕</button>
                </div>
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder={t('home.reviewName')}
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    required
                    className="w-full bg-overlay/10 backdrop-blur-md border border-overlay/20 rounded-lg px-4 py-2.5 text-heading placeholder-overlay/50 focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder={t('home.reviewRole')}
                    value={reviewForm.role}
                    onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                    required
                    className="w-full bg-overlay/10 backdrop-blur-md border border-overlay/20 rounded-lg px-4 py-2.5 text-heading placeholder-overlay/50 focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm"
                  />
                  <textarea
                    placeholder={t('home.reviewText')}
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                    required
                    rows={3}
                    className="w-full bg-overlay/10 backdrop-blur-md border border-overlay/20 rounded-lg px-4 py-2.5 text-heading placeholder-overlay/50 focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm resize-none"
                  />
                  <div>
                    <label className="text-muted text-xs mb-2 block">{t('home.reviewRating')}</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="transition-transform hover:scale-125"
                        >
                          <Icons.Star className={`w-6 h-6 ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-faint'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-all duration-300 text-sm">
                    {t('home.reviewPublish')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ============ WHY CHOOSE US + STATS ============ */}
      <section className="py-10 md:py-14 bg-surface relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <div className="text-center mb-8">
            <span className="text-primary font-bold text-xs mb-2 block">{t('home.whyLabel')}</span>
            <h2 className="text-xl md:text-3xl font-bold text-heading">
              {t('home.whyTitle1')} <span className="text-primary">{t('home.whyTitle2')}</span>{t('home.whyTitle3')}
            </h2>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {features.map((item, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-b from-white/[0.04] to-transparent rounded-xl p-4 border border-overlay/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 text-center overflow-hidden"
              >
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-10 h-10 mx-auto mb-2.5 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                  {renderIcon(item.icon, 'w-5 h-5')}
                </div>
                <h4 className="text-heading font-bold text-xs mb-0.5 group-hover:text-primary transition-colors">{lang === 'ar' ? item.title : item.titleEn}</h4>
                <p className="text-faint text-[10px] leading-snug">{lang === 'ar' ? item.desc : item.descEn}</p>
              </div>
            ))}
          </div>

          {/* Car Brands Marquee */}
          <div>
            <div className="text-center mb-6">
              <span className="text-primary font-bold text-xs mb-2 block">{t('home.carBrandsLabel')}</span>
              <h3 className="text-lg md:text-2xl font-bold text-heading">{t('home.carBrandsTitle')}</h3>
            </div>

            {/* Category labels */}
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 flex-wrap">
              {carBrands.map((group, i) => (
                <div key={i} className="flex items-center gap-2 md:gap-4">
                  {i > 0 && <span className="text-white/10 text-sm">|</span>}
                  <span className="text-faint hover:text-primary transition-colors text-xs md:text-sm font-medium cursor-default">{lang === 'ar' ? group.category : group.categoryEn}</span>
                </div>
              ))}
            </div>

            {/* Marquee */}
            <div className="relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
              <div ref={marqueeRef} className="flex" style={{ willChange: 'transform', direction: 'ltr' }}>
                {[...allCarBrands, ...allCarBrands].map((brand, index) => (
                  <div
                    key={index}
                    className="group flex flex-col items-center justify-center gap-1.5 bg-overlay/5 rounded-xl px-4 py-3 border border-overlay/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 flex-shrink-0 mx-2"
                  >
                    <div className="w-14 h-14 flex items-center justify-center">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <p className="text-muted text-[10px] group-hover:text-heading transition-colors whitespace-nowrap">{lang === 'ar' ? brand.nameAr : brand.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EVENTS (الأحداث) ============ */}
      {events.length > 0 && (
        <section className="py-10 md:py-14 bg-dark relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />

          <div className="container-custom relative z-10">
            {/* Section header */}
            <div className="text-center mb-8">
              <span className="text-primary font-bold text-sm flex items-center justify-center gap-2 mb-2">
                <span className="w-8 h-px bg-primary" />
                {t('home.eventsLabel')}
                <span className="w-8 h-px bg-primary" />
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-heading">{t('home.eventsTitle')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {events.map((event) => (
                <div
                  key={event._id}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-1 ${
                    event.type === 'offer'
                      ? 'border-primary/20 bg-gradient-to-br from-surface to-[#0a0a0f] hover:shadow-2xl hover:shadow-primary/10'
                      : 'border-overlay/10 bg-surface hover:border-primary/20 hover:shadow-2xl hover:shadow-black/30'
                  }`}
                >
                  {event.type === 'offer' ? (
                    /* ===== OFFER CARD ===== */
                    <>
                      {event.image && (
                        <div className="absolute inset-0">
                          <img src={event.image} alt="" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/85 to-[#0a0a0f]/40" />
                        </div>
                      )}
                      {!event.image && <div className="absolute -top-20 -right-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />}

                      <div className="relative z-10 p-6 md:p-8 min-h-[280px] flex flex-col justify-center">
                        {/* Badge */}
                        <div className="flex items-center justify-center mb-4">
                          <span className="inline-flex items-center gap-1.5 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-primary/30">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            {t('home.limitedOffer')}
                          </span>
                        </div>

                        {/* Discount */}
                        {event.discount > 0 && (
                          <div className="flex items-baseline justify-center gap-1 mb-3">
                            <span className="text-5xl md:text-6xl font-bold text-primary leading-none">{event.discount}</span>
                            <div className="flex flex-col">
                              <span className="text-2xl font-bold text-primary">%</span>
                              <span className="text-xs font-bold text-white -mt-1">{t('home.discount')}</span>
                            </div>
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-white font-bold text-base md:text-lg text-center mb-2">{event.title}</h3>
                        <p className="text-white/60 text-xs text-center leading-relaxed mb-4 max-w-md mx-auto">{event.description}</p>

                        {/* Prices */}
                        {event.newPrice > 0 && (
                          <div className="flex items-center justify-center gap-3 mb-4">
                            {event.oldPrice > 0 && (
                              <span className="text-white/30 line-through text-sm">{event.oldPrice} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                            )}
                            <span className="text-primary font-bold text-xl">{event.newPrice} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                          </div>
                        )}

                        {/* Expiry */}
                        {event.expiryDate && (
                          <p className="text-white/40 text-[10px] text-center mb-5 flex items-center justify-center gap-1">
                            <Icons.Clock className="w-3 h-3" />
                            {t('home.offerUntil')} {event.expiryDate}
                          </p>
                        )}

                        {/* CTA */}
                        <div className="flex justify-center">
                          <Link to="/booking" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-300 text-sm hover:shadow-lg hover:shadow-primary/40 hover:scale-105">
                            {t('home.bookNow')}
                            <Icons.ArrowLeft className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* ===== POST CARD (image + text) ===== */
                    <>
                      {event.image && (
                        <div className="relative h-52 md:h-60 overflow-hidden">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                          {/* Badge overlay */}
                          <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center gap-1.5 bg-surface/80 backdrop-blur-md text-primary text-[10px] font-bold px-3 py-1.5 rounded-full border border-overlay/20 shadow-lg">
                              <Icons.Bolt className="w-3 h-3" />
                              {t('home.eventBadge')}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-5 md:p-6">
                        {!event.image && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full">
                              <Icons.Bolt className="w-3 h-3" />
                              {t('home.eventBadge')}
                            </span>
                          </div>
                        )}
                        <h3 className="text-heading font-bold text-lg md:text-xl mb-2 group-hover:text-primary transition-colors duration-300">{event.title}</h3>
                        <p className="text-muted text-sm leading-relaxed">{event.description}</p>
                        {/* Decorative bottom line */}
                        <div className="mt-4 flex items-center gap-2">
                          <span className="w-8 h-px bg-primary/30 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
                          <Icons.ArrowLeft className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-500" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ ABOUT US PREVIEW ============ */}
      <section className="py-10 md:py-14 bg-surface relative overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Video */}
            <div className="relative group lg:sticky lg:top-24 lg:self-start">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative rounded-2xl overflow-hidden border border-overlay/10 shadow-2xl shadow-primary/10">
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img src="https://images.unsplash.com/photo-1632823471565-1ecdf5c6da77?w=800" alt={lang === 'ar' ? 'ورشة أكاديمية السيارات' : 'Automotive Academy Workshop'} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/30 to-transparent" />

                  {/* Glow ring */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-primary/20 rounded-full blur-md animate-pulse" />
                      <button className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-all duration-300 hover:scale-110 shadow-2xl shadow-primary/50 border-2 border-overlay/20">
                        <Icons.Play className="w-8 h-8 mr-1" />
                      </button>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur rounded-lg px-4 py-2 border border-overlay/10">
                    <p className="text-heading text-sm font-medium">{t('home.watchVideo')}</p>
                  </div>

                  {/* Decorative corners */}
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <span className="text-primary font-bold text-sm flex items-center gap-2 mb-3">
                <span className="w-8 h-px bg-primary" />
                {t('home.aboutLabel')}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-heading mb-2">{lang === 'ar' ? aboutText.title : aboutText.titleEn}</h2>
              <p className="text-primary font-bold text-lg mb-4">{lang === 'ar' ? aboutText.subtitle : aboutText.subtitleEn}</p>
              {(lang === 'ar' ? aboutText.paragraphs : aboutText.paragraphsEn).map((p, i) => (
                <p key={i} className="text-muted mb-3 leading-relaxed text-sm">{p}</p>
              ))}
              <ul className="space-y-3 mb-8 mt-4">
                {aboutBulletPoints.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-body text-sm">
                    <span className="w-7 h-7 bg-primary/15 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                      <Icons.CheckCircle className="w-4 h-4" />
                    </span>
                    {lang === 'ar' ? item.ar : item.en}
                  </li>
                ))}
              </ul>
              <Link to="/about" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/30">
                {t('home.aboutMore')}
                <Icons.ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BOOKING STEPS ============ */}
      <section className="py-10 md:py-14 bg-dark relative overflow-hidden">
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-sm flex items-center justify-center gap-2 mb-3">
              <span className="w-8 h-px bg-primary" />
              {t('home.bookingStepsLabel')}
              <span className="w-8 h-px bg-primary" />
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-heading">{t('home.bookingStepsTitle')}</h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-12 right-[12%] left-[12%] h-px bg-gradient-to-l from-primary/0 via-primary/30 to-primary/0" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {bookingSteps.map((step, index) => {
                const stepIcons = ['Calendar', 'User', 'CheckCircle', 'Clock']
                const Icon = Icons[stepIcons[index]]
                return (
                  <div key={index} className="relative group text-center">
                    {/* Icon circle */}
                    <div className="relative w-24 h-24 mx-auto mb-5">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-md group-hover:bg-primary/20 transition-all duration-500" />
                      <div className="relative w-24 h-24 bg-surface rounded-full flex items-center justify-center border-2 border-primary/20 group-hover:border-primary group-hover:bg-primary transition-all duration-500 group-hover:scale-110">
                        {Icon && <Icon className="w-9 h-9 text-primary group-hover:text-white transition-colors duration-300" />}
                        {/* Step number badge */}
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold border-4 border-dark group-hover:scale-110 transition-transform duration-300">
                          {step.num}
                        </div>
                      </div>
                    </div>

                    {/* Text */}
                    <h4 className="text-heading font-bold text-base mb-2 group-hover:text-primary transition-colors">{lang === 'ar' ? step.title : step.titleEn}</h4>
                    <p className="text-muted text-sm leading-relaxed max-w-[200px] mx-auto">{lang === 'ar' ? step.desc : step.descEn}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  )
}
