import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import Icons from '../components/Icons'
import CTABanner from '../components/CTABanner'

export default function Articles() {
  const { lang, t } = useLanguage()
  const [articles, setArticles] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    fetch('/api/articles?active=true')
      .then(r => r.json())
      .then(d => setArticles(d.data || []))
      .catch(() => {})
  }, [])

  const categories = ['all', ...new Set(articles.map(a => a.category).filter(Boolean))]

  const filtered = activeCategory === 'all'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  const featured = filtered[0]
  const recent = filtered.slice(1, 4)
  const history = filtered.slice(4)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return lang === 'ar'
      ? d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })
      : d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const renderIcon = (name, className = 'w-6 h-6') => {
    const Icon = Icons[name]
    return Icon ? <Icon className={className} /> : null
  }

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-[#0a0a0f]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img src="/articles-bg.webp" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0a0a0f]/65" />
        </div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="container-custom relative z-10 text-center">
          <span className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-3">
            <span className="w-8 h-px bg-primary" />
            <Icons.BookOpen className="w-4 h-4" />
            {t('articles.label')}
            <span className="w-8 h-px bg-primary" />
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{t('articles.title')}</h1>
          <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto">{t('articles.desc')}</p>
        </div>
      </section>

      {articles.length === 0 ? (
        /* ===== EMPTY STATE ===== */
        <section className="py-20 bg-surface">
          <div className="container-custom">
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-overlay/5 border border-overlay/10 flex items-center justify-center text-faint mb-5">
                <Icons.BookOpen className="w-9 h-9" />
              </div>
              <h3 className="text-heading font-bold text-lg mb-1">{t('articles.noArticles')}</h3>
              <p className="text-faint text-sm">{t('articles.noArticlesSub')}</p>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* ============ FEATURED ARTICLE ============ */}
          {featured && (
            <section className="py-8 md:py-12 bg-surface relative overflow-hidden">
              <div className="container-custom">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  <h2 className="text-lg font-bold text-heading">{t('articles.featured')}</h2>
                </div>

                <div
                  className="group relative rounded-2xl overflow-hidden border border-overlay/10 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
                  onClick={() => setSelectedArticle(featured)}
                >
                  {featured.image && (
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
                    </div>
                  )}

                  <div className={`p-6 md:p-8 ${featured.image ? 'absolute bottom-0 left-0 right-0 z-10' : 'relative'}`}>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full">
                        <Icons.Bolt className="w-3 h-3" />
                        {t('articles.featured')}
                      </span>
                      <span className="text-faint text-xs bg-overlay/10 px-2.5 py-1 rounded-full">{featured.category}</span>
                    </div>
                    <h3 className="text-heading font-bold text-xl md:text-2xl mb-2 group-hover:text-primary transition-colors duration-300 leading-tight">{featured.title}</h3>
                    {featured.excerpt && <p className="text-muted text-sm leading-relaxed mb-4 max-w-2xl line-clamp-2">{featured.excerpt}</p>}
                    <div className="flex items-center gap-4 text-xs text-faint flex-wrap">
                      <span className="flex items-center gap-1"><Icons.Calendar className="w-3.5 h-3.5" /> {formatDate(featured.createdAt)}</span>
                    </div>
                  </div>

                  {!featured.image && (
                    <div className="absolute -top-20 -left-10 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ============ CATEGORY FILTER ============ */}
          <section className="py-2 bg-dark">
            <div className="container-custom">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-overlay/5 text-muted hover:text-heading hover:bg-overlay/10'
                    }`}
                  >
                    {cat === 'all' ? t('articles.allCategories') : cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ============ RECENT ARTICLES GRID ============ */}
          {recent.length > 0 && (
            <section className="py-8 md:py-12 bg-dark relative overflow-hidden">
              <div className="container-custom relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  <h2 className="text-lg font-bold text-heading">{t('articles.latest')}</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recent.map(article => (
                    <ArticleCard key={article._id} article={article} onClick={() => setSelectedArticle(article)} formatDate={formatDate} t={t} renderIcon={renderIcon} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ============ ARTICLE HISTORY / ARCHIVE ============ */}
          {history.length > 0 && (
            <section className="py-8 md:py-12 bg-surface relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
              <div className="container-custom relative z-10">
                <div className="text-center mb-8">
                  <span className="text-primary font-bold text-sm flex items-center justify-center gap-2 mb-2">
                    <span className="w-8 h-px bg-primary" />
                    {t('articles.history')}
                    <span className="w-8 h-px bg-primary" />
                  </span>
                  <p className="text-muted text-xs">{t('articles.historyDesc')}</p>
                </div>

                {/* Timeline-style list */}
                <div className="relative max-w-3xl mx-auto">
                  {/* Vertical line */}
                  <div className="absolute top-0 bottom-0 right-4 md:right-1/2 md:translate-x-1/2 w-px bg-gradient-to-b from-primary/30 via-primary/15 to-transparent" />

                  {history.map((article, i) => (
                    <div
                      key={article._id}
                      className={`relative flex gap-4 md:gap-6 mb-6 cursor-pointer group ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                      onClick={() => setSelectedArticle(article)}
                    >
                      {/* Timeline dot */}
                      <div className="absolute right-4 md:right-1/2 md:translate-x-1/2 top-5 z-10">
                        <div className="w-3 h-3 rounded-full bg-primary border-4 border-surface group-hover:scale-125 transition-transform duration-300" />
                      </div>

                      {/* Card */}
                      <div className="flex-1 mr-10 md:mr-0 md:w-1/2">
                        <div className="bg-gradient-to-b from-white/[0.04] to-transparent rounded-xl border border-overlay/10 hover:border-primary/20 p-4 transition-all duration-500 hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-primary/5">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-faint text-[10px] bg-overlay/10 px-2 py-0.5 rounded-full">{article.category}</span>
                            <span className="text-faint text-[10px] flex items-center gap-1">
                              <Icons.Calendar className="w-3 h-3" />
                              {formatDate(article.createdAt)}
                            </span>
                          </div>
                          <h4 className="text-heading font-bold text-sm mb-1.5 group-hover:text-primary transition-colors duration-300 line-clamp-2">{article.title}</h4>
                          {article.excerpt && <p className="text-muted text-xs leading-relaxed line-clamp-2">{article.excerpt}</p>}
                          <div className="flex items-center gap-3 mt-3 text-[10px] text-faint">
                            <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              {t('articles.readMore')}
                              <Icons.ArrowLeft className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Spacer for alternating layout */}
                      <div className="hidden md:block flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <CTABanner />

      {/* ============ ARTICLE READING MODAL ============ */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80" onClick={() => setSelectedArticle(null)}>
          <div
            className="bg-[#0a0a0f] rounded-2xl border border-white/10 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={e => e.stopPropagation()}
          >
              {/* Close button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 left-4 z-20 w-10 h-10 rounded-lg bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-all"
              >
                ✕
              </button>

              {/* Article image */}
              {selectedArticle.image && (
                <div className="relative h-48 md:h-60 overflow-hidden flex-shrink-0">
                  <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent" />
                </div>
              )}

              {/* Article content - scrollable */}
              <div className="p-6 md:p-8 overflow-y-auto">
                {/* Meta */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-white/50 text-xs bg-white/10 px-2.5 py-1 rounded-full">{selectedArticle.category}</span>
                </div>

                {/* Title */}
                <h1 className="text-white font-bold text-xl md:text-2xl mb-4 leading-tight">{selectedArticle.title}</h1>

                {/* Date */}
                <div className="flex items-center gap-4 pb-4 mb-4 border-b border-white/10 text-xs text-white/40 flex-wrap">
                  <span className="flex items-center gap-1"><Icons.Calendar className="w-3.5 h-3.5" /> {formatDate(selectedArticle.createdAt)}</span>
                </div>

                {/* Excerpt */}
                {selectedArticle.excerpt && (
                  <p className="text-primary font-medium text-sm leading-relaxed mb-4 italic border-r-2 border-primary/30 pr-3">
                    {selectedArticle.excerpt}
                  </p>
                )}

                {/* Content */}
                <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.content}
                </div>

                {/* Tags */}
                {selectedArticle.tags?.length > 0 && (
                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 flex-wrap">
                    {selectedArticle.tags.map((tag, i) => (
                      <span key={i} className="text-white/50 text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Back button */}
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="mt-6 flex items-center gap-2 text-white/60 hover:text-primary text-xs font-medium transition-colors"
                >
                  <Icons.ArrowLeft className="w-4 h-4 rotate-180" />
                  {t('articles.back')}
                </button>
              </div>
            </div>
        </div>
      )}
    </div>
  )
}

/* ===== Article Card Component ===== */
function ArticleCard({ article, onClick, formatDate, t, renderIcon }) {
  return (
    <div
      className="group bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl overflow-hidden border border-overlay/10 hover:border-primary/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      {article.image && (
        <div className="relative h-44 overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold bg-surface/80 backdrop-blur-md text-primary px-2.5 py-1 rounded-full border border-overlay/20">
              {article.category}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {!article.image && (
          <span className="inline-block text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full mb-3">
            {article.category}
          </span>
        )}
        <h3 className="text-heading font-bold text-base mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">{article.title}</h3>
        {article.excerpt && <p className="text-muted text-xs leading-relaxed mb-3 line-clamp-2">{article.excerpt}</p>}

        <div className="flex items-center justify-between pt-3 border-t border-overlay/5">
          <div className="flex items-center gap-3 text-[10px] text-faint">
            <span className="hidden sm:flex items-center gap-1"><Icons.Calendar className="w-3 h-3" /> {formatDate(article.createdAt)}</span>
          </div>
          <span className="flex items-center gap-1 text-primary text-[10px] font-bold opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300">
            {t('articles.readMore')}
            <Icons.ArrowLeft className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  )
}
