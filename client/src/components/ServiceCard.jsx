import { Link } from 'react-router-dom'
import Icons from '../components/Icons'

export default function ServiceCard({ service, renderIcon }) {
  return (
    <Link
      to="/booking"
      className="group relative rounded-xl overflow-hidden border border-overlay/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 block"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-40">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/60 to-transparent" />
        {/* Red accent line on hover */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 right-0 left-0 p-3">
        <div className="flex items-center gap-2 mb-1">
          {renderIcon && (
            <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center text-primary border border-primary/30 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              {renderIcon(service.icon, 'w-4 h-4')}
            </div>
          )}
          <h3 className="text-white font-bold text-sm">{service.title}</h3>
        </div>
        <p className="text-white/80 text-[10px] leading-relaxed line-clamp-2">{service.description}</p>
        <div className="flex items-center gap-1 text-primary text-xs font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          احجز الآن
          <Icons.ArrowLeft className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  )
}
