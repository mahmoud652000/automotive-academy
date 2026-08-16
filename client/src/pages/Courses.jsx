import { useState } from 'react'
import Icons from '../components/Icons'
import CTABanner from '../components/CTABanner'
import { courses, siteInfo, timeSlots } from '../data/content'

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', course: '', date: '', time: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleEnroll = (courseTitle) => {
    setSelectedCourse(courseTitle)
    setForm({ name: '', phone: '', course: courseTitle, date: '', time: '' })
    setSubmitted(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, type: 'course', course: form.course }),
    })
      .then((res) => res.json())
      .then(() => setSubmitted(true))
      .catch(() => alert('حدث خطأ، يرجى المحاولة مرة أخرى.'))
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-12 md:py-16 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/courses-bg.jpg" alt="" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/40 via-[#0a0a0f]/60 to-[#0a0a0f]" />
        </div>
        <div className="container-custom text-center relative z-10 w-full">
          <span className="text-primary font-bold text-sm flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-px bg-primary" />
            الدورات التدريبية
            <span className="w-8 h-px bg-primary" />
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">دوراتنا التدريبية</h1>
          <p className="text-white/80 text-base max-w-2xl mx-auto">
            برامج تدريب احترافية للجيل القادم من خبراء السيارات
          </p>
        </div>
      </section>

      {/* Courses grid */}
      <section className="py-8 md:py-10 bg-dark relative">
        {/* Divider */}
        <div className="absolute top-0 left-0 right-0 flex justify-center -translate-y-1/2">
          <div className="flex items-center gap-3 px-4">
            <span className="w-12 h-px bg-gradient-to-l from-primary/40 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <span className="w-12 h-px bg-gradient-to-r from-primary/40 to-transparent" />
          </div>
        </div>

        <div className="container-custom">
          {/* Simple instructions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-2 bg-overlay/5 border border-overlay/10 rounded-full px-4 py-2">
              <Icons.Search className="w-4 h-4 text-primary" />
              <span className="text-muted text-xs">اختر الدورة المناسبة</span>
            </div>
            <span className="w-6 h-px bg-overlay/20" />
            <div className="flex items-center gap-2 bg-overlay/5 border border-overlay/10 rounded-full px-4 py-2">
              <Icons.Calendar className="w-4 h-4 text-primary" />
              <span className="text-muted text-xs">سجل موعدك</span>
            </div>
            <span className="w-6 h-px bg-overlay/20" />
            <div className="flex items-center gap-2 bg-overlay/5 border border-overlay/10 rounded-full px-4 py-2">
              <Icons.Trophy className="w-4 h-4 text-primary" />
              <span className="text-muted text-xs">ابدأ مسيرتك الاحترافية</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group relative rounded-xl overflow-hidden border border-overlay/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 bg-surface flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-44">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/50 to-transparent" />
                  <div className="absolute top-0 right-0 left-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
                  {/* Duration badge */}
                  <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded">
                    {course.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-heading font-bold text-sm mb-1.5 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-muted text-xs leading-relaxed mb-3 flex-1 line-clamp-2">{course.desc}</p>
                  <button
                    onClick={() => handleEnroll(course.title)}
                    className="w-full flex items-center justify-center gap-2 bg-overlay/5 hover:bg-primary text-heading hover:text-white font-bold py-2 rounded-lg transition-all duration-300 text-xs border border-overlay/10 hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/30"
                  >
                    سجل الآن
                    <Icons.ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedCourse(null)}>
          <div className="bg-overlay/10 backdrop-blur-2xl rounded-2xl p-6 md:p-8 border border-overlay/20 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {submitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-heading font-bold text-lg mb-2">تم التسجيل بنجاح!</h3>
                <p className="text-muted text-sm mb-5">سنتواصل معك قريباً لتأكيد التسجيل في دورة: {selectedCourse}</p>
                <button onClick={() => setSelectedCourse(null)} className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-lg transition-all duration-300 text-sm">
                  إغلاق
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-heading font-bold text-lg">التسجيل في الدورة</h3>
                  <button onClick={() => setSelectedCourse(null)} className="text-muted hover:text-heading transition-colors text-xl">✕</button>
                </div>
                <p className="text-muted text-xs mb-5">دورة: <span className="text-primary font-bold">{selectedCourse}</span></p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="الاسم الكامل"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-overlay/10 backdrop-blur-md border border-overlay/20 rounded-lg px-4 py-2.5 text-heading placeholder-overlay/50 focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="w-full bg-overlay/10 backdrop-blur-md border border-overlay/20 rounded-lg px-4 py-2.5 text-heading placeholder-overlay/50 focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      required
                      className="w-full bg-overlay/10 backdrop-blur-md border border-overlay/20 rounded-lg px-4 py-2.5 text-heading placeholder-overlay/50 focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm"
                    />
                    <select
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      required
                      className="w-full bg-overlay/10 backdrop-blur-md border border-overlay/20 rounded-lg px-4 py-2.5 text-heading focus:border-primary focus:bg-overlay/15 focus:outline-none text-sm"
                    >
                      <option value="" className="bg-dark">اختر الوقت</option>
                      {timeSlots.map((time) => <option key={time} value={time} className="bg-dark">{time}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-all duration-300 text-sm">
                    تأكيد التسجيل
                  </button>
                </form>
                <p className="text-faint text-[10px] text-center mt-3">أو اتصل بنا: {siteInfo.phone}</p>
              </>
            )}
          </div>
        </div>
      )}

      <CTABanner />
    </div>
  )
}
