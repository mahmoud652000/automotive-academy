import { useLanguage } from '../context/LanguageContext'

export default function WhatsAppButton() {
  const { t } = useLanguage()
  return (
    <a
      href="https://wa.me/201103197077"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-[60] group"
      aria-label="WhatsApp"
    >
      <div className="relative">
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40" />
        <span className="absolute -inset-1 rounded-full bg-green-500/20 animate-pulse" />

        {/* Button */}
        <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 group-hover:scale-110 transition-all duration-300 border-2 border-overlay/30">
          <svg
            viewBox="0 0 32 32"
            className="w-9 h-9 text-heading"
            fill="currentColor"
          >
            <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.966 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-3.106 7.41c-1.518 0-3.036-.43-4.338-1.246l-3.036.802.802-2.95c-.916-1.318-1.39-2.85-1.39-4.43 0-4.267 3.494-7.76 7.76-7.76 4.268 0 7.76 3.493 7.76 7.76.014 4.266-3.493 7.746-7.76 7.746zm0-16.84c-5.04 0-9.12 4.08-9.12 9.12 0 1.605.43 3.18 1.232 4.553l-1.305 4.78 4.897-1.276c1.323.72 2.816 1.1 4.338 1.1h.014c5.04 0 9.12-4.08 9.12-9.12 0-2.44-.946-4.726-2.663-6.444-1.718-1.718-4.02-2.663-6.46-2.663z"/>
          </svg>
        </div>

        {/* Label badge */}
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-dark">
          1
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-900 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl">
          {t('whatsapp.tooltip')}
        </div>
      </div>
    </a>
  )
}
