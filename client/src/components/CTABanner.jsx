import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function CTABanner() {
  const { t } = useLanguage()
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="/cta-banner.webp" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0f]/95 via-[#0a0a0f]/70 to-[#0a0a0f]/40" />
      </div>
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-right">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {t('cta.title')}
            </h2>
            <p className="text-white/80 text-lg drop-shadow">
              {t('cta.desc')}
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/booking" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/40">
              {t('cta.book')}
            </Link>
            <a href="tel:01103197077" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-3 px-8 rounded-lg transition-all duration-300">
              {t('cta.call')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
