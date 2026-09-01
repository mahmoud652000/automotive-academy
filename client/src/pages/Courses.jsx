import { useState, useEffect } from 'react'
import Icons from '../components/Icons'
import CTABanner from '../components/CTABanner'
import Toast, { useToast } from '../components/Toast'
import { courses as defaultCourses, timeSlots } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'

export default function Courses() {
  const { lang, t } = useLanguage()
  const { get } = useSettings()
  const { toast, showToast } = useToast()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', course: '', date: '', time: '' })
  const [submitted, setSubmitted] = useState(false)
  const [courses, setCourses] = useState(defaultCourses)

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(d => { if (d.success) setCourses(d.data) })
      .catch(() => {})
  }, [])

  const handleEnroll = (courseTitle) => {
    setSelectedCourse(courseTitle)
    setForm({ name: '', phone: '', course: courseTitle, date: '', time: '' })
    setSubmitted(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, type: 'course', course: form.course }),
    })
      .then((res) => res.json())
      .then(() => setSubmitted(true))
      .catch(() => showToast(t('courses.enrollError')))
  }

  return (
    <div className="pt-16 sm:pt-20 lg:pt-20">
      {/* Hero */}
      <section className="relative py-10 sm:py-12 md:py-16 lg:py-20 flex items-center overflow-hidden bg-dark">
        <div className="absolute inset-0 z-0">
          <img src={get('bg_courses') || '/courses-bg.webp'} alt="" className="w-full h-full object-cover" style={{ objectPosition: `${get('bg_courses_x') || 50}% ${get('bg_courses_y') || 50}%` }} />
          <div className="hero-overlay-left-fade" />
        </div>
        <div className="container-custom relative z-10 w-full">
          <div className="max-w-lg ms-auto">
            <span className="text-primary font-bold text-xs sm:text-sm flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-8 h-px bg-primary" />
              {t('courses.label')}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-hero mb-2 sm:mb-3 leading-tight">{t('courses.title')}</h1>
            <p className="text-on-hero-secondary text-sm sm:text-base leading-relaxed">
              {t('courses.desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Courses grid */}
      <section className="py-6 sm:py-8 md:py-10 bg-dark relative">
        {/* Divider */}
        <div className="absolute top-0 left-0 right-0 flex justify-center -translate-y-1/2">
          <div className="flex items-center gap-3 px-4">
            <span className="w-12 h-px bg-gradient-to-l from-primary/40 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <span className="w-12 h-px bg-gradient-to-r from-primary/40 to-transparent" />
          </div>
        </div>

        <div className="container-custom">
          {/* Simple instructions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-2 bg-overlay/5 border border-overlay/10 rounded-full px-4 py-2">
              <Icons.Search className="w-4 h-4 text-primary" />
              <span className="text-muted text-xs">{t('courses.step1')}</span>
            </div>
            <span className="w-6 h-px bg-overlay/20" />
            <div className="flex items-center gap-2 bg-overlay/5 border border-overlay/10 rounded-full px-4 py-2">
              <Icons.Calendar className="w-4 h-4 text-primary" />
              <span className="text-muted text-xs">{t('courses.step2')}</span>
            </div>
            <span className="w-6 h-px bg-overlay/20" />
            <div className="flex items-center gap-2 bg-overlay/5 border border-overlay/10 rounded-full px-4 py-2">
              <Icons.Trophy className="w-4 h-4 text-primary" />
              <span className="text-muted text-xs">{t('courses.step3')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group relative rounded-xl overflow-hidden border border-overlay/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 bg-surface flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-36 sm:h-40 md:h-44">
                  <img src={course.image} alt={lang === 'ar' ? course.title : course.titleEn} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="card-img-overlay" />
                  <div className="absolute top-0 right-0 left-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
                  {/* Duration badge */}
                  <div className="absolute top-3 right-3 bg-primary/90  text-white text-[10px] font-bold px-2 py-1 rounded">
                    {lang === 'ar' ? course.duration : course.durationEn}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <h3 className="text-heading font-bold text-xs sm:text-sm mb-1.5 group-hover:text-primary transition-colors">{lang === 'ar' ? course.title : course.titleEn}</h3>
                  <p className="text-muted text-[11px] sm:text-xs leading-relaxed mb-3 flex-1 line-clamp-2">{lang === 'ar' ? course.desc : course.descEn}</p>
                  <button
                    onClick={() => handleEnroll(lang === 'ar' ? course.title : course.titleEn)}
                    className="w-full flex items-center justify-center gap-2 bg-overlay/5 hover:bg-primary text-heading hover:text-white font-bold py-2 rounded-lg transition-all duration-300 text-xs border border-overlay/10 hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/30"
                  >
                    {t('courses.enroll')}
                    <Icons.ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70" onClick={() => setSelectedCourse(null)}>
          <div className="bg-surface rounded-2xl p-6 md:p-8 border border-overlay/20 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {submitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-heading font-bold text-lg mb-2">{t('courses.enrollSuccess')}</h3>
                <p className="text-muted text-sm mb-5">{t('courses.enrollSuccessDesc')} {selectedCourse}</p>
                <button onClick={() => setSelectedCourse(null)} className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-lg transition-all duration-300 text-sm">
                  {t('courses.close')}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-heading font-bold text-lg">{t('courses.enrollTitle')}</h3>
                  <button onClick={() => setSelectedCourse(null)} className="text-muted hover:text-heading transition-colors text-xl">✕</button>
                </div>
                <p className="text-muted text-xs mb-5">{t('courses.courseLabel')} <span className="text-primary font-bold">{selectedCourse}</span></p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder={t('courses.fullName')}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-overlay/10 border border-overlay/20 rounded-lg px-4 py-2.5 text-heading placeholder-overlay/50 focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm"
                  />
                  <input
                    type="tel"
                    placeholder={t('courses.phone')}
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
                      <option value="" className="bg-dark">{t('courses.selectTime')}</option>
                      {timeSlots.map((time) => <option key={time} value={time} className="bg-dark">{time}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-all duration-300 text-sm">
                    {t('courses.confirmEnroll')}
                  </button>
                </form>
                <p className="text-faint text-[10px] text-center mt-3">{t('courses.orCall')} {get('site_phone')}</p>
              </>
            )}
          </div>
        </div>
      )}

      <CTABanner />
      <Toast toast={toast} />
    </div>
  )
}
