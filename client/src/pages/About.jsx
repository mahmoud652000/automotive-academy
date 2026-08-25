import { Link } from 'react-router-dom'
import Icons from '../components/Icons'
import CTABanner from '../components/CTABanner'
import { values, brands, aboutStats, aboutText, aboutBulletPoints } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import { useSettings } from '../context/SettingsContext'

const renderIcon = (name, className = 'w-6 h-6') => {
  const Icon = Icons[name]
  return Icon ? <Icon className={className} /> : null
}

export default function About() {
  const { lang, t } = useLanguage()
  const { get } = useSettings()

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={get('bg_about') || '/hero-bg.png'} alt="" className="w-full h-full object-cover" style={{ objectPosition: `${get('bg_about_x') || 50}% ${get('bg_about_y') || 50}%` }} />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0f] via-[#0a0a0f]/85 to-[#0a0a0f]/50" />
        </div>
        <div className="container-custom relative z-10 w-full text-center">
          <span className="text-primary font-medium text-sm">{get('hero_about_title') || t('about.label')}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-2">{get('hero_about_subtitle') || t('about.title')}</h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {get('hero_about_subtitle') || t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* About section with founder */}
      <section className="py-10 md:py-14 bg-dark">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Text - 3 cols */}
            <div className="lg:col-span-3">
              <span className="text-primary font-medium text-sm">{t('about.storyLabel')}</span>
              <h2 className="text-xl md:text-2xl font-bold text-heading mt-2 mb-4">{t('about.storyTitle')}</h2>
              {(lang === 'ar' ? aboutText.paragraphs : aboutText.paragraphsEn).map((p, i) => (
                <p key={i} className="text-muted text-sm leading-relaxed mb-3">{p}</p>
              ))}
              <ul className="space-y-2 mb-5">
                {aboutBulletPoints.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-body text-sm">
                    <span className="text-primary flex-shrink-0"><Icons.CheckCircle className="w-4 h-4" /></span>
                    {lang === 'ar' ? item.ar : item.en}
                  </li>
                ))}
              </ul>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-lg transition-all duration-300 text-sm hover:shadow-lg hover:shadow-primary/30"
              >
                {t('about.knowServices')}
                <Icons.ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            {/* Founder card + Stats - 2 cols */}
            <div className="lg:col-span-2 space-y-4">
              {/* Founder card */}
              <div className="relative group bg-overlay/5 rounded-2xl p-6 border border-overlay/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                <div className="absolute -top-12 -left-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <div className="absolute inset-0 bg-primary/15 rounded-full blur-md" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center border-2 border-primary/30">
                      <span className="text-3xl font-bold text-primary">أ</span>
                    </div>
                  </div>
                  <h3 className="text-heading font-bold text-lg">{lang === 'ar' ? aboutText.owner : aboutText.ownerEn}</h3>
                  <p className="text-primary text-sm font-medium">{lang === 'ar' ? aboutText.ownerRole : aboutText.ownerRoleEn}</p>
                  <p className="text-muted text-xs mt-3 leading-relaxed">
                    {t('about.founderDesc')}
                  </p>
                </div>
              </div>

              {/* Logo with glow */}
              <div className="relative group bg-overlay/5 rounded-2xl p-8 border border-overlay/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500 animate-pulse" />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <img
                    src="/logo-glow.png"
                    alt="Automotive Academy"
                    className="w-full max-w-[200px] h-auto object-contain drop-shadow-[0_0_25px_rgba(220,38,38,0.5)] group-hover:drop-shadow-[0_0_40px_rgba(220,38,38,0.8)] transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 md:py-14 bg-surface">
        <div className="container-custom">
          <div className="text-center mb-8">
            <span className="text-primary font-medium text-sm">{t('about.valuesLabel')}</span>
            <h2 className="text-xl md:text-2xl font-bold text-heading mt-2">{t('about.valuesTitle')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {values.map((value, index) => (
              <div key={index} className="group bg-overlay/5 rounded-xl p-5 text-center border border-overlay/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {renderIcon(value.icon, 'w-6 h-6')}
                </div>
                <h3 className="text-heading font-bold text-sm mb-1">{lang === 'ar' ? value.title : value.titleEn}</h3>
                <p className="text-muted text-xs">{lang === 'ar' ? value.desc : value.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-8 bg-dark">
        <div className="container-custom">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-heading">{t('about.partnersTitle')}</h2>
            <p className="text-muted text-xs mt-1">{t('about.partnersDesc')}</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="group flex items-center justify-center p-5 h-28 transition-all duration-300"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-20 max-w-full object-contain opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
                />
                <span className="hidden text-muted font-bold text-base group-hover:text-heading transition-colors">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  )
}
