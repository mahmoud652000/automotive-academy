import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icons from '../components/Icons'
import { services as defaultServices } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'

const renderIcon = (name, className = 'w-6 h-6') => {
  const Icon = Icons[name]
  return Icon ? <Icon className={className} /> : null
}

export default function Services() {
  const { lang, t } = useLanguage()
  const { get } = useSettings()
  const [services, setServices] = useState(defaultServices)

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(d => { if (d.success) setServices(d.data) })
      .catch(() => {})
  }, [])

  return (
    <div className="pt-16 sm:pt-20 lg:pt-20">
      {/* Hero with background */}
      <section className="relative min-h-[35vh] sm:min-h-[45vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={get('bg_services') || '/services-bg.png'} alt="" className="w-full h-full object-cover" style={{ objectPosition: `${get('bg_services_x') || 50}% ${get('bg_services_y') || 50}%` }} />
          <div className="hero-overlay-left" />
        </div>
        <div className="container-custom text-center relative z-10 w-full py-8">
          <span className="text-primary font-medium text-xs sm:text-sm">{lang === 'ar' ? (get('hero_services_label') || t('services.label')) : t('services.label')}</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-hero mt-2 mb-3">{lang === 'ar' ? (get('hero_services_title') || t('services.title')) : t('services.title')}</h1>
          <p className="text-on-hero-secondary text-sm sm:text-base max-w-2xl mx-auto">{lang === 'ar' ? (get('hero_services_desc') || t('services.desc')) : t('services.desc')}</p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-8 sm:py-10 md:py-14 bg-dark relative">
        {/* Divider */}
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-3 px-4">
            <span className="w-16 h-px bg-gradient-to-l from-primary/40 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <span className="w-16 h-px bg-gradient-to-r from-primary/40 to-transparent" />
          </div>
        </div>

        <div className="container-custom">
          {/* Simple instructions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-2 bg-overlay/5 border border-overlay/10 rounded-full px-4 py-2">
              <Icons.Search className="w-4 h-4 text-primary" />
              <span className="text-muted text-xs">{t('services.step1')}</span>
            </div>
            <span className="w-6 h-px bg-overlay/20" />
            <div className="flex items-center gap-2 bg-overlay/5 border border-overlay/10 rounded-full px-4 py-2">
              <Icons.Calendar className="w-4 h-4 text-primary" />
              <span className="text-muted text-xs">{t('services.step2')}</span>
            </div>
            <span className="w-6 h-px bg-overlay/20" />
            <div className="flex items-center gap-2 bg-overlay/5 border border-overlay/10 rounded-full px-4 py-2">
              <Icons.CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-muted text-xs">{t('services.step3')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {services.map((service) => (
              <Link
                key={service.id}
                to="/booking"
                className="group relative rounded-xl overflow-hidden border border-overlay/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 block"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-44 sm:h-52 md:h-60">
                   <img src={service.image} alt={lang === 'ar' ? service.title : service.titleEn} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="card-img-overlay" />
                   <div className="absolute top-0 right-0 left-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
                 </div>

                 {/* Content */}
                 <div className="absolute bottom-0 right-0 left-0 p-3 sm:p-4 md:p-5">
                   <div className="flex items-center gap-2 sm:gap-2.5 mb-2">
                     <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary border border-primary/30 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                       {renderIcon(service.icon, 'w-4 h-4 sm:w-5 sm:h-5')}
                     </div>
                     <h3 className="text-on-hero font-bold text-sm sm:text-base">{lang === 'ar' ? service.title : service.titleEn}</h3>
                   </div>
                   <p className="text-on-hero-secondary text-xs leading-relaxed line-clamp-3 mb-2">{lang === 'ar' ? service.description : service.descriptionEn}</p>
                   <div className="flex items-center gap-1 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     {t('services.bookNow')}
                     <Icons.ArrowLeft className="w-3.5 h-3.5" />
                   </div>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
