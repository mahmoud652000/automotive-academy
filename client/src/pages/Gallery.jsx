import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import CTABanner from '../components/CTABanner'
import Icons from '../components/Icons'
import { useLanguage } from '../context/LanguageContext'
import { galleryStats, testimonials } from '../data/content'

const getYouTubeEmbed = (url) => {
  if (!url) return ''
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
  return ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}` : url
}

const getYouTubeThumb = (url) => {
  if (!url) return ''
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
  return ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : ''
}

function BeforeAfterSlider({ photo, lang, t, onExpand }) {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef(null)
  const isDragging = useRef(false)

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(percent)
  }, [])

  const handleMouseDown = (e) => { isDragging.current = true; handleMove(e.clientX) }
  const handleTouchStart = (e) => { isDragging.current = true; handleMove(e.touches[0].clientX) }

  useEffect(() => {
    const onMouseMove = (e) => { if (isDragging.current) handleMove(e.clientX) }
    const onTouchMove = (e) => { if (isDragging.current) handleMove(e.touches[0].clientX) }
    const stop = () => { isDragging.current = false }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('mouseup', stop)
    document.addEventListener('touchend', stop)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('mouseup', stop)
      document.removeEventListener('touchend', stop)
    }
  }, [handleMove])

  const title = lang === 'ar' ? photo.title : (photo.titleEn || photo.title)
  const category = lang === 'ar' ? photo.category : (photo.categoryEn || photo.category)
  const beforeImg = photo.beforeImage || photo.before
  const afterImg = photo.afterImage || photo.after

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-overlay/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 bg-surface">
      <div
        ref={containerRef}
        className="relative h-64 overflow-hidden cursor-ew-resize select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <img src={afterImg} alt={title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" draggable={false}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6da77?w=600' }} />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
          <img src={beforeImg} alt={`${title} - ${t('gallery.before')}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover" draggable={false}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6da77?w=600' }} />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 pointer-events-none" />

        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="text-[10px] text-white font-bold bg-red-600/90 px-2.5 py-1 rounded-full border border-white/10 shadow-lg">{t('gallery.before')}</span>
        </div>
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="text-[10px] text-white font-bold bg-green-600/90 px-2.5 py-1 rounded-full border border-white/10 shadow-lg">{t('gallery.after')}</span>
        </div>
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <span className="text-[10px] text-white/80 font-medium bg-black/50 px-2 py-0.5 rounded">{category}</span>
        </div>

        <div className="absolute top-0 bottom-0 z-20 pointer-events-none" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-2xl flex items-center justify-center ring-4 ring-white/20 group-hover:ring-primary/20 transition-all duration-300">
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 12h8M8 12l3-3M8 12l3 3M16 12l-3-3M16 12l-3 3" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 z-10 pointer-events-none opacity-60 group-hover:opacity-0 transition-opacity duration-300">
          <span className="text-[9px] text-white/70 bg-black/50 px-2 py-0.5 rounded flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 12h8M8 12l3-3M8 12l3 3M16 12l-3-3M16 12l-3 3" />
            </svg>
            {t('gallery.dragToCompare')}
          </span>
        </div>
      </div>

      <div className="p-4 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-heading font-bold text-sm group-hover:text-primary transition-colors truncate">{title}</h3>
          <p className="text-faint text-[10px] mt-0.5">{category}</p>
        </div>
        <button onClick={() => onExpand(photo)} className="flex-shrink-0 w-9 h-9 rounded-xl bg-overlay/5 hover:bg-primary text-muted hover:text-white flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/30" title={t('gallery.viewDetails')}>
          <Icons.Search className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function VideoCard({ video, lang, t, onPlay, isPlaying }) {
  const title = lang === 'ar' ? video.title : (video.titleEn || video.title)
  const category = lang === 'ar' ? video.category : (video.categoryEn || video.category)

  if (isPlaying) {
    return (
      <div className="group relative rounded-2xl overflow-hidden border border-overlay/10 hover:border-primary/30 transition-all duration-500 bg-surface">
        <div className="aspect-video">
          <iframe src={getYouTubeEmbed(video.videoUrl)} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={title} />
        </div>
      </div>
    )
  }

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-overlay/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 bg-surface cursor-pointer" onClick={() => onPlay(video._id)}>
      <div className="relative aspect-video overflow-hidden">
        <img src={getYouTubeThumb(video.videoUrl)} alt={title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6da77?w=600' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-red-600/20 rounded-full" />
            <div className="relative w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300 shadow-2xl shadow-red-600/50 ring-4 ring-white/10">
              <svg className="w-7 h-7 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        </div>

        <div className="absolute top-3 right-3">
          <span className="text-[10px] text-white font-medium bg-red-600/90 px-2.5 py-1 rounded-full border border-white/10">{category}</span>
        </div>

        {video.duration && (
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] text-white font-medium bg-black/70 px-2 py-0.5 rounded flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {video.duration}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 right-0 left-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">{title}</h3>
          <div className="flex items-center gap-1.5 text-white/60 text-[10px]">
            <svg className="w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            <span>{t('gallery.watchNow')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCounter({ stat, lang }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const label = lang === 'ar' ? stat.label : stat.labelEn

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let current = 0
        const increment = stat.value / 40
        const timer = setInterval(() => {
          current += increment
          if (current >= stat.value) { setCount(stat.value); clearInterval(timer) }
          else setCount(Math.floor(current))
        }, 25)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [stat.value])

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-heading">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-faint text-[10px] md:text-xs mt-0.5">{label}</div>
    </div>
  )
}

export default function Gallery() {
  const { lang, t } = useLanguage()
  const [items, setItems] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [playingVideo, setPlayingVideo] = useState(null)

  useEffect(() => {
    fetch('/api/gallery?active=true')
      .then(r => r.json())
      .then(d => { if (d.success) setItems(d.data || []) })
      .catch(() => {})
  }, [])

  const categories = ['all', ...new Set(items.map(i => lang === 'ar' ? i.category : (i.categoryEn || i.category)))]

  const filteredByCategory = activeCategory === 'all' ? items : items.filter(i => (lang === 'ar' ? i.category : (i.categoryEn || i.category)) === activeCategory)
  const photos = filteredByCategory.filter(i => i.type === 'photo')
  const videos = filteredByCategory.filter(i => i.type === 'video')

  const displayItems = activeTab === 'photos' ? photos : activeTab === 'videos' ? videos : filteredByCategory

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/gallery-hero.webp" alt={t('gallery.title')} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/30" />
        </div>
        <div className="container-custom relative z-10 py-10 md:py-14 text-right">
          <span className="text-primary font-bold text-sm flex items-center gap-2 mb-2">
            {t('gallery.label')}
            <span className="w-8 h-px bg-primary" />
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-2xl">{t('gallery.title')}</h1>
          <p className="text-primary font-bold text-base md:text-lg mb-2 drop-shadow-lg">{t('gallery.subtitle')}</p>
          <p className="text-white/60 text-xs md:text-sm max-w-lg mr-0 ml-auto leading-relaxed drop-shadow-lg">{t('gallery.desc')}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 bg-surface border-y border-overlay/10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryStats.map((stat, i) => (
              <StatCounter key={i} stat={stat} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 bg-dark">
        <div className="container-custom">
          {/* Tab toggle */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex gap-1 p-1 bg-overlay/5 rounded-xl border border-overlay/10">
              {[
                { key: 'all', label: t('gallery.tabAll') },
                { key: 'videos', label: t('gallery.tabVideos') },
                { key: 'photos', label: t('gallery.tabPhotos') },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'text-muted hover:text-heading'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg font-medium text-xs transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'bg-overlay/5 text-muted hover:text-heading hover:bg-overlay/10 border border-transparent'
                  }`}
                >
                  {cat === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-8 bg-dark">
        <div className="container-custom">
          {displayItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-overlay/5 border border-overlay/10 flex items-center justify-center text-faint">
                <Icons.Search className="w-9 h-9" />
              </div>
              <p className="text-muted text-sm">{t('gallery.noItems')}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayItems.map(item => (
                item.type === 'video' ? (
                  <VideoCard
                    key={item._id}
                    video={item}
                    lang={lang}
                    t={t}
                    onPlay={setPlayingVideo}
                    isPlaying={playingVideo === item._id}
                  />
                ) : (
                  <BeforeAfterSlider
                    key={item._id}
                    photo={item}
                    lang={lang}
                    t={t}
                    onExpand={setSelectedPhoto}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-10 bg-surface border-t border-overlay/10">
          <div className="container-custom">
            <div className="text-center mb-8">
              <span className="text-primary font-bold text-sm flex items-center justify-center gap-2 mb-2">
                <span className="w-8 h-px bg-primary" />
                {t('gallery.testimonialsLabel')}
                <span className="w-8 h-px bg-primary" />
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-heading">{t('gallery.testimonialsTitle')}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.slice(0, 6).map((review, i) => (
                <div key={i} className="bg-overlay/5 rounded-xl p-5 border border-overlay/10 hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {(lang === 'ar' ? review.name : review.nameEn).charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-heading font-bold text-xs">{lang === 'ar' ? review.name : review.nameEn}</h4>
                      <p className="text-faint text-[10px]">{lang === 'ar' ? review.role : review.roleEn}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Icons.Star key={j} className="w-3.5 h-3.5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted text-xs leading-relaxed">{lang === 'ar' ? review.text : review.textEn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photo detail modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80" onClick={() => setSelectedPhoto(null)}>
          <div className="bg-gradient-to-b from-surface to-[#0a0a0f] rounded-2xl border border-overlay/20 max-w-3xl w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-overlay/10">
              <h3 className="text-heading font-bold text-lg">{lang === 'ar' ? selectedPhoto.title : (selectedPhoto.titleEn || selectedPhoto.title)}</h3>
              <button onClick={() => setSelectedPhoto(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-heading hover:bg-overlay/10 transition-all">✕</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-1 p-4">
              <div className="relative">
                <img src={selectedPhoto.beforeImage || selectedPhoto.before} alt="Before" className="w-full h-64 object-cover rounded-xl" onError={(e) => { e.target.style.opacity = '0.1' }} />
                <span className="absolute top-3 right-3 text-xs text-white font-bold bg-red-600 px-2.5 py-1 rounded-full">{t('gallery.before')}</span>
              </div>
              <div className="relative">
                <img src={selectedPhoto.afterImage || selectedPhoto.after} alt="After" className="w-full h-64 object-cover rounded-xl" onError={(e) => { e.target.style.opacity = '0.1' }} />
                <span className="absolute top-3 right-3 text-xs text-white font-bold bg-green-600 px-2.5 py-1 rounded-full">{t('gallery.after')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <CTABanner />
    </div>
  )
}
