import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Icons from '../components/Icons'

export default function NewsletterConfirm() {
  const { token } = useParams()
  const { t } = useLanguage()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false)

  useEffect(() => {
    fetch(`/api/subscribers/confirm/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setAlreadyConfirmed(!!data.alreadyConfirmed)
          setStatus('success')
        } else {
          setStatus('error')
        }
      })
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-b from-surface to-[#0a0a0f] rounded-2xl border border-overlay/10 p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 mx-auto mb-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <h2 className="text-heading font-bold text-lg mb-2">{t('newsletter.confirmTitle')}</h2>
              <p className="text-faint text-sm">{t('newsletter.confirming')}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                <Icons.CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-heading font-bold text-lg mb-2">{t('newsletter.confirmTitle')}</h2>
              <p className="text-green-400 text-sm font-medium mb-1">
                {alreadyConfirmed ? t('newsletter.alreadyConfirmed') : t('newsletter.confirmSuccess')}
              </p>
              <p className="text-muted text-xs leading-relaxed mb-6">{t('newsletter.confirmSuccessDesc')}</p>
              <Link to="/" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all duration-300">
                {t('newsletter.backHome')}
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                <Icons.Shield className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-heading font-bold text-lg mb-2">{t('newsletter.confirmTitle')}</h2>
              <p className="text-red-400 text-sm font-medium mb-6">{t('newsletter.confirmError')}</p>
              <Link to="/" className="inline-flex items-center gap-2 bg-overlay/5 hover:bg-overlay/10 text-heading font-bold text-sm px-6 py-2.5 rounded-xl border border-overlay/10 transition-all duration-300">
                {t('newsletter.backHome')}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
