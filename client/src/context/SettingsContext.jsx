import { createContext, useContext, useState, useEffect } from 'react'
import { siteInfo as defaultSiteInfo } from '../data/content'

const SettingsContext = createContext()

// Default settings — used as fallback when DB has no value
const DEFAULTS = {
  // Site info
  site_name: defaultSiteInfo.name,
  site_name_en: defaultSiteInfo.nameEn,
  site_slogan: defaultSiteInfo.slogan,
  site_slogan_en: defaultSiteInfo.sloganEn,
  site_phone: defaultSiteInfo.phone,
  site_whatsapp: defaultSiteInfo.whatsapp,
  site_email: defaultSiteInfo.email,
  site_address: defaultSiteInfo.address,
  site_address_en: defaultSiteInfo.addressEn,
  site_working_hours: defaultSiteInfo.workingHours,
  site_working_hours_en: defaultSiteInfo.workingHoursEn,
  site_logo: '/logo.png',

  // Background images
  bg_home: '/hero-bg.png',
  bg_about: '/hero-bg.png',
  bg_booking: '/hero-bg.png',
  bg_contact: '/contact-bg.webp',
  bg_courses: '/courses-bg.webp',
  bg_login: '/hero-bg.png',
  bg_services: '/services-bg.png',
  bg_offers: '/offers-bg.png',
  bg_articles: '/articles-bg.webp',

  // Background positions (object-position X% Y%)
  bg_home_x: '50', bg_home_y: '50',
  bg_about_x: '50', bg_about_y: '50',
  bg_booking_x: '50', bg_booking_y: '50',
  bg_contact_x: '50', bg_contact_y: '50',
  bg_courses_x: '50', bg_courses_y: '50',
  bg_login_x: '50', bg_login_y: '50',
  bg_services_x: '50', bg_services_y: '50',
  bg_offers_x: '50', bg_offers_y: '50',
  bg_articles_x: '50', bg_articles_y: '50',

  // Hero texts — Home
  hero_home_title1: 'Automotive Academy',
  hero_home_title2: 'خبراء العناية بسيارتك',
  hero_home_desc: 'مركز متخصص في صيانة وإصلاح السيارات بأحدث الأجهزة وفنيين محترفين',

  // Hero texts — About
  hero_about_title: 'من نحن',
  hero_about_subtitle: 'خبرة طويلة في عالم صيانة السيارات',

  // Hero texts — Contact
  hero_contact_title: 'نحن هنا لخدمتك',
  hero_contact_desc: 'مركز Automotive Academy — حيث تلتقي الخبرة بأحدث التقنيات لخدمة سيارتك على أعلى مستوى',

  // Hero texts — Services
  hero_services_label: 'خدماتنا',
  hero_services_title: 'خدماتنا',
  hero_services_desc: 'كل ما تحتاجه سيارتك في مكان واحد',

  // Hero texts — Offers
  hero_offers_title1: 'عروضنا',
  hero_offers_title2: 'المميزة',
  hero_offers_desc: 'أفضل العروض والخدمات بأعلى جودة لأن سيارتك تستحق الأفضل',

  // Hero texts — Articles
  hero_articles_label: 'المقالات',
  hero_articles_title: 'مقالات وإرشادات',
  hero_articles_desc: 'مقالات متخصصة ونصائح احترافية للعناية بسيارتك',

  // Workshop video
  workshop_video: '/workshop-video.mp4',

  // Dashboard credentials
  dashboard_user: 'automotive',
  dashboard_pass: 'automotive2000',
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setSettings({ ...DEFAULTS, ...d.data })
        }
      })
      .catch(() => {})
      .finally(() => setSettingsLoaded(true))
  }, [])

  // Helper: get setting with fallback
  const get = (key) => settings[key] ?? DEFAULTS[key] ?? ''

  return (
    <SettingsContext.Provider value={{ settings, get, settingsLoaded }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
