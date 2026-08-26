import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function CTABanner() {
  const { t } = useLanguage()
  return (
    <section className="py-10 sm:py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="/cta-banner.webp" alt="" className="w-full h-full object-cover" />
        <div className="hero-overlay-left" />
      </div>
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-center lg:text-right">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-hero mb-2 drop-shadow-lg">
              {t('cta.title')}
            </h2>
            <p className="text-on-hero-secondary text-sm sm:text-base md:text-lg drop-shadow">
              {t('cta.desc')}
            </p>
          </div>
          <div className="flex gap-3 sm:gap-4">
            <Link to="/booking" className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 sm:py-3 px-5 sm:px-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 text-sm sm:text-base">
              {t('cta.book')}
            </Link>
            <a href="tel:01103197077" className="border-2 border-overlay/20 text-heading hover:bg-overlay/5 hover:text-primary font-bold py-2.5 sm:py-3 px-5 sm:px-8 rounded-lg transition-all duration-300 text-sm sm:text-base">
              {t('cta.call')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
