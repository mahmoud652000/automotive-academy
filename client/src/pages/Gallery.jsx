import { useState } from 'react'
import CTABanner from '../components/CTABanner'
import { galleryCategories, galleryVideos, galleryPhotos, galleryStats, testimonials } from '../data/content'

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('الكل')

  const filteredVideos = activeCategory === 'الكل' ? galleryVideos : galleryVideos.filter((v) => v.category === activeCategory)
  const filteredPhotos = activeCategory === 'الكل' ? galleryPhotos : galleryPhotos.filter((p) => p.category === activeCategory)

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-dark py-16 md:py-20">
        <div className="container-custom text-center">
          <span className="text-primary font-medium">معرض الأعمال</span>
          <h1 className="text-4xl md:text-5xl font-bold text-heading mt-2 mb-4">معرض الأعمال</h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">شاهد بعضاً من أعمالنا السابقة</p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 border-b border-overlay/5">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {galleryCategories.map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${activeCategory === category ? 'bg-primary text-white' : 'bg-overlay/5 text-muted hover:text-heading hover:bg-overlay/10'}`}>
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-heading mb-8">فيديوهات</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <div key={video.id} className="bg-overlay/5 rounded-xl overflow-hidden border border-overlay/5 hover:border-primary/30 transition-all group cursor-pointer">
                <div className="relative overflow-hidden h-48">
                  <img src={video.thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl">▶</div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs">{video.duration}</div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-faint">{video.category}</span>
                  <h3 className="text-heading font-bold mt-1">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="py-16 bg-surface">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-heading mb-8">صور قبل وبعد</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="bg-overlay/5 rounded-xl overflow-hidden border border-overlay/5 hover:border-primary/30 transition-all group">
                <div className="relative overflow-hidden h-56">
                  <img src={photo.after} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">بعد</div>
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">قبل</div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-faint">{photo.category}</span>
                  <h3 className="text-heading font-bold mt-1">{photo.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryStats.map((stat, index) => (
              <div key={index} className="bg-overlay/5 rounded-xl p-6 text-center border border-overlay/5">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}{stat.suffix}</div>
                <p className="text-muted text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-surface">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-primary font-medium">آراء العملاء</span>
            <h2 className="text-3xl md:text-4xl font-bold text-heading mt-2">ماذا يقول عملاؤنا؟</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-overlay/5 rounded-xl p-6 border border-overlay/5">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-muted mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-heading font-bold">{testimonial.name}</h4>
                    <p className="text-faint text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  )
}
