import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="container-custom">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-9xl font-black text-primary mb-6">404</div>
          <h1 className="text-4xl font-bold text-heading mb-4">{t('notfound.title')}</h1>
          <p className="text-muted text-lg mb-8">
            {t('notfound.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary">
              {t('notfound.goHome')}
            </Link>
            <Link to="/contact" className="btn-secondary">
              {t('notfound.contactSupport')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
