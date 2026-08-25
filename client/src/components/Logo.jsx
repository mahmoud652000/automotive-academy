import { useSettings } from '../context/SettingsContext'

export default function Logo({ className = 'w-12 h-12', showText = true }) {
  const { get } = useSettings()
  const logoSrc = get('site_logo') || '/logo.png'
  const siteName = get('site_name') || 'Automotive Academy'

  return (
    <img
      src={logoSrc}
      alt={siteName}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
