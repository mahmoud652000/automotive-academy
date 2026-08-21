import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icons from '../components/Icons'
import { services, siteInfo, bookingSteps, timeSlots } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

const renderIcon = (name, className = 'w-5 h-5') => {
  const Icon = Icons[name]
  return Icon ? <Icon className={className} /> : null
}

const inputCls = "w-full bg-overlay/5 border border-overlay/10 rounded-xl pr-4 pl-11 py-3 text-heading placeholder-faint focus:border-primary focus:bg-overlay/10 focus:outline-none transition-all duration-300 text-sm"

const Field = ({ icon, children, label }) => (
  <div>
    <label className="text-faint text-xs mb-1.5 block font-medium">{label}</label>
    <div className="relative group">
      {children}
      {icon && (
        <span className="absolute top-1/2 -translate-y-1/2 left-4 text-faint group-focus-within:text-primary transition-colors duration-300">
          {renderIcon(icon, 'w-4 h-4')}
        </span>
      )}
    </div>
  </div>
)

export default function Booking() {
  const { lang, t } = useLanguage()
  const [form, setForm] = useState({ name: '', phone: '', carModel: '', service: '', date: '', time: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const canProceed = () => {
    if (currentStep === 1) return form.name && form.phone
    if (currentStep === 2) return form.service && form.carModel
    if (currentStep === 3) return form.date && form.time
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, type: 'service' }),
    })
      .then((res) => res.json())
      .then(() => setSubmitted(true))
      .catch(() => alert(t('booking.bookingError')))
  }

  const resetForm = () => {
    setSubmitted(false)
    setCurrentStep(1)
    setForm({ name: '', phone: '', carModel: '', service: '', date: '', time: '', notes: '' })
  }

  const stepLabels = [t('booking.step1Label'), t('booking.step2Label'), t('booking.step3Label'), t('booking.step4Label')]

  const contactItems = [
    { icon: 'Phone', label: siteInfo.phone, href: `tel:${siteInfo.phone.replace(/\s/g, '')}` },
    { icon: 'Mail', label: siteInfo.email, href: `mailto:${siteInfo.email}` },
    { icon: 'MapPin', label: lang === 'ar' ? siteInfo.address : siteInfo.addressEn, href: null },
    { icon: 'Clock', label: lang === 'ar' ? siteInfo.workingHours : siteInfo.workingHoursEn, href: null },
  ]

  return (
    <div className="pt-16 min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative py-10 md:py-14 overflow-hidden bg-dark">
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.png" alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/70 to-[#0a0a0f]" />
        </div>
        <div className="absolute -top-20 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

        <div className="container-custom relative z-10 text-center">
          <span className="text-primary font-bold text-sm flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-px bg-primary" />
            {t('booking.label')}
            <span className="w-8 h-px bg-primary" />
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{t('booking.title')}</h1>
          <p className="text-white/80 text-base max-w-2xl mx-auto">{t('booking.desc')}</p>
        </div>
      </section>

      {submitted ? (
        /* ===== SUCCESS ===== */
        <section className="py-16 md:py-24 bg-dark relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
          <div className="container-custom relative z-10">
            <div className="max-w-md mx-auto text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                  <Icons.CheckCircle className="w-10 h-10 text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-heading mb-3">{t('booking.successTitle')}</h2>
              <p className="text-muted text-sm mb-8 leading-relaxed">
                {t('booking.successDesc')} {form.name}. {t('booking.successDesc2')}<br />
                {t('booking.successDesc3')} {form.phone} {t('booking.successDesc4')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={resetForm} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 text-sm hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2">
                  {t('booking.bookAnother')}
                  <Icons.ArrowLeft className="w-4 h-4" />
                </button>
                <Link to="/" className="border border-overlay/10 text-heading hover:bg-overlay/5 font-bold py-3 px-8 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2">
                  {t('booking.backHome')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* ===== BOOKING FORM + SIDEBAR ===== */}
          <section className="py-6 md:py-8 bg-dark relative">
            <div className="container-custom">
              <div className="grid lg:grid-cols-3 gap-6">

                {/* === Form === */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    {/* Glow */}
                    <div className="absolute -inset-2 bg-primary/5 rounded-3xl blur-2xl opacity-50" />

                    <div className="relative bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl border border-overlay/10 overflow-hidden">
                      {/* Header */}
                      <div className="p-5 border-b border-overlay/10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <Icons.Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-heading font-bold text-base">{t('booking.formTitle')}</h2>
                          <p className="text-faint text-[10px]">{t('booking.formSub')}</p>
                        </div>
                      </div>

                      {/* Step indicator */}
                      <div className="px-5 pt-5">
                        <div className="flex items-center justify-between">
                          {stepLabels.map((label, i) => (
                            <div key={i} className="flex items-center flex-1 last:flex-none">
                              <div className="flex flex-col items-center gap-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                  currentStep > i + 1
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : currentStep === i + 1
                                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                                      : 'bg-overlay/5 text-faint border border-overlay/10'
                                }`}>
                                  {currentStep > i + 1 ? <Icons.CheckCircle className="w-4 h-4" /> : i + 1}
                                </div>
                                <span className={`text-[9px] font-medium whitespace-nowrap ${currentStep >= i + 1 ? 'text-heading' : 'text-faint'}`}>{label}</span>
                              </div>
                              {i < stepLabels.length - 1 && (
                                <div className="flex-1 h-px mx-2 -mt-4 rounded-full overflow-hidden bg-overlay/10">
                                  <div className={`h-full bg-primary transition-all duration-500 ${currentStep > i + 1 ? 'w-full' : 'w-0'}`} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="p-5 space-y-4">

                        {/* Step 1: Personal */}
                        {currentStep === 1 && (
                          <div className="space-y-4 animate-fadeIn">
                            <Field label={t('booking.fullName')} icon="User">
                              <input type="text" placeholder={lang === 'ar' ? 'اكتب اسمك' : 'Type your name'} value={form.name} onChange={set('name')} required className={inputCls} />
                            </Field>
                            <Field label={t('booking.phone')} icon="Phone">
                              <input type="tel" placeholder="01xxxxxxxxx" value={form.phone} onChange={set('phone')} required className={inputCls} />
                            </Field>
                          </div>
                        )}

                        {/* Step 2: Service & Car */}
                        {currentStep === 2 && (
                          <div className="space-y-4 animate-fadeIn">
                            <Field label={t('booking.carModel')} icon="Car">
                              <input type="text" placeholder={t('booking.carModelPlaceholder')} value={form.carModel} onChange={set('carModel')} required className={inputCls} />
                            </Field>
                            <div>
                              <label className="text-faint text-xs mb-1.5 block font-medium">{t('booking.serviceRequired')}</label>
                              <div className="relative">
                                <select value={form.service} onChange={set('service')} required className={inputCls + ' appearance-none pl-11'}>
                                  <option value="">{t('booking.selectService')}</option>
                                  {services.map((s) => (<option key={s.id} value={lang === 'ar' ? s.title : s.titleEn} className="bg-dark">{lang === 'ar' ? s.title : s.titleEn}</option>))}
                                  <option value={t('booking.other')} className="bg-dark">{t('booking.other')}</option>
                                </select>
                                <span className="absolute top-1/2 -translate-y-1/2 left-4 text-faint pointer-events-none">
                                  <Icons.Wrench className="w-4 h-4" />
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 3: Date & Time */}
                        {currentStep === 3 && (
                          <div className="space-y-4 animate-fadeIn">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <Field label={t('booking.date')} icon="Calendar">
                                <input type="date" value={form.date} onChange={set('date')} required className={inputCls} />
                              </Field>
                              <div>
                                <label className="text-faint text-xs mb-1.5 block font-medium">{t('booking.time')}</label>
                                <div className="relative">
                                  <select value={form.time} onChange={set('time')} required className={inputCls + ' appearance-none pl-11'}>
                                    <option value="">{t('booking.selectTime')}</option>
                                    {timeSlots.map((slot) => (<option key={slot} value={slot} className="bg-dark">{slot}</option>))}
                                  </select>
                                  <span className="absolute top-1/2 -translate-y-1/2 left-4 text-faint pointer-events-none">
                                    <Icons.Clock className="w-4 h-4" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 4: Notes & Confirm */}
                        {currentStep === 4 && (
                          <div className="space-y-4 animate-fadeIn">
                            <div>
                              <label className="text-faint text-xs mb-1.5 block font-medium">{t('booking.notes')}</label>
                              <textarea placeholder={t('booking.notesPlaceholder')} value={form.notes} onChange={set('notes')} rows={3} className={inputCls + ' resize-none pl-4'} />
                            </div>
                            {/* Summary */}
                            <div className="bg-overlay/5 rounded-xl p-4 border border-overlay/10 space-y-2">
                              <p className="text-heading font-bold text-xs mb-3 flex items-center gap-2">
                                <Icons.CheckCircle className="w-4 h-4 text-primary" />
                                {t('booking.summary')}
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-2 text-muted"><Icons.User className="w-3.5 h-3.5 text-faint" /> {form.name}</div>
                                <div className="flex items-center gap-2 text-muted"><Icons.Phone className="w-3.5 h-3.5 text-faint" /> {form.phone}</div>
                                <div className="flex items-center gap-2 text-muted"><Icons.Car className="w-3.5 h-3.5 text-faint" /> {form.carModel}</div>
                                <div className="flex items-center gap-2 text-muted"><Icons.Wrench className="w-3.5 h-3.5 text-faint" /> {form.service}</div>
                                <div className="flex items-center gap-2 text-muted"><Icons.Calendar className="w-3.5 h-3.5 text-faint" /> {form.date}</div>
                                <div className="flex items-center gap-2 text-muted"><Icons.Clock className="w-3.5 h-3.5 text-faint" /> {form.time}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center gap-3 pt-2">
                          {currentStep > 1 && (
                            <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="px-5 py-3 rounded-xl text-sm font-bold text-muted hover:text-heading bg-overlay/5 hover:bg-overlay/10 transition-all duration-300 flex items-center gap-2">
                              {t('booking.prev')}
                            </button>
                          )}
                          {currentStep < 4 ? (
                            <button type="button" onClick={() => canProceed() && setCurrentStep(currentStep + 1)} disabled={!canProceed()} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${canProceed() ? 'bg-primary hover:bg-primary-dark text-white hover:shadow-lg hover:shadow-primary/30' : 'bg-overlay/5 text-faint cursor-not-allowed'}`}>
                            {t('booking.next')}
                              <Icons.ArrowLeft className="w-4 h-4" />
                            </button>
                          ) : (
                            <button type="submit" className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all duration-300 text-sm hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2">
                              <Icons.CheckCircle className="w-4 h-4" />
                              {t('booking.confirm')}
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* === Sidebar === */}
                <div className="space-y-4">
                  {/* Contact info */}
                  <div className="bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl p-5 border border-overlay/10">
                    <h3 className="text-heading font-bold text-sm mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-primary rounded-full" />
                      {t('booking.contactInfo')}
                    </h3>
                    <div className="space-y-3">
                      {contactItems.map((item, i) => {
                        const Icon = Icons[item.icon]
                        const content = (
                          <div className="flex items-start gap-3 group">
                            <div className="w-8 h-8 bg-overlay/5 rounded-lg flex items-center justify-center text-primary border border-overlay/5 group-hover:bg-primary/10 transition-all duration-300 flex-shrink-0">
                              {Icon && <Icon className="w-4 h-4" />}
                            </div>
                            <span className="text-muted group-hover:text-heading transition-colors text-xs leading-relaxed pt-1.5">{item.label}</span>
                          </div>
                        )
                        return item.href ? (
                          <a key={i} href={item.href}>{content}</a>
                        ) : (
                          <div key={i}>{content}</div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Note */}
                  <div className="relative bg-gradient-to-br from-primary/10 to-transparent rounded-2xl p-5 border border-primary/20 overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                    <div className="relative z-10">
                      <div className="w-9 h-9 bg-primary/15 rounded-lg flex items-center justify-center text-primary mb-3">
                        <Icons.Shield className="w-4 h-4" />
                      </div>
                      <h3 className="text-heading font-bold text-sm mb-2">{t('booking.importantNote')}</h3>
                      <p className="text-muted text-xs leading-relaxed">{t('booking.noteDesc')}</p>
                    </div>
                  </div>

                  {/* Working hours */}
                  <div className="bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl p-5 border border-overlay/10">
                    <h3 className="text-heading font-bold text-sm mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-primary rounded-full" />
                      {t('booking.workingHours')}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400">
                        <Icons.Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-heading text-xs font-bold">{t('booking.satThu')}</p>
                        <p className="text-muted text-xs">{lang === 'ar' ? '10:00 ص - 12:00 م' : '10:00 AM - 12:00 AM'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-overlay/5">
                      <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400">
                        <Icons.Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-heading text-xs font-bold">{t('booking.friday')}</p>
                        <p className="text-muted text-xs">{t('booking.holiday')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== STEPS ===== */}
          <section className="py-10 md:py-14 bg-surface relative overflow-hidden">
            <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="container-custom relative z-10">
              <div className="text-center mb-10">
                <span className="text-primary font-bold text-sm flex items-center justify-center gap-2 mb-2">
                  <span className="w-8 h-px bg-primary" />
                  {t('booking.stepsLabel')}
                  <span className="w-8 h-px bg-primary" />
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-heading">{t('booking.stepsTitle')}</h2>
              </div>
              <div className="relative">
                {/* Connecting line */}
                <div className="hidden lg:block absolute top-12 right-[12%] left-[12%] h-px bg-gradient-to-l from-primary/0 via-primary/30 to-primary/0" />

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                  {bookingSteps.map((step, index) => {
                    const stepIcons = ['Calendar', 'User', 'CheckCircle', 'Clock']
                    const Icon = Icons[stepIcons[index]]
                    return (
                      <div key={index} className="relative group text-center">
                        <div className="relative w-24 h-24 mx-auto mb-5">
                          <div className="absolute inset-0 bg-primary/10 rounded-full blur-md group-hover:bg-primary/20 transition-all duration-500" />
                          <div className="relative w-24 h-24 bg-surface rounded-full flex items-center justify-center border-2 border-primary/20 group-hover:border-primary group-hover:bg-primary transition-all duration-500 group-hover:scale-110">
                            {Icon && <Icon className="w-9 h-9 text-primary group-hover:text-white transition-colors duration-300" />}
                            <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold border-4 border-surface group-hover:scale-110 transition-transform duration-300">
                              {step.num}
                            </div>
                          </div>
                        </div>
                        <h4 className="text-heading font-bold text-base mb-2 group-hover:text-primary transition-colors">{lang === 'ar' ? step.title : step.titleEn}</h4>
                        <p className="text-muted text-sm leading-relaxed max-w-[200px] mx-auto">{lang === 'ar' ? step.desc : step.descEn}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
