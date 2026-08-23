import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import Icons from '../components/Icons'
import Logo from '../components/Logo'
import { services as defaultServices, offers as defaultOffers, courses as defaultCourses, testimonials as defaultTestimonials, siteInfo } from '../data/content'

const renderIcon = (name, className = 'w-5 h-5') => {
  const Icon = Icons[name]
  return Icon ? <Icon className={className} /> : null
}

const iconOptions = ['Wrench', 'Gear', 'Shield', 'Bolt', 'Car', 'Oil', 'Computer', 'Brake', 'Snowflake', 'Search', 'Tag', 'Trophy']

const apiCall = async (url, method = 'GET', body = null) => {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(url, opts)
  return res.json()
}

const EmptyState = ({ icon = 'Search', title, sub = '' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-overlay/5 border border-overlay/10 flex items-center justify-center text-faint mb-4">
      {renderIcon(icon, 'w-7 h-7')}
    </div>
    <p className="text-heading font-bold text-sm mb-1">{title}</p>
    {sub && <p className="text-faint text-xs">{sub}</p>}
  </div>
)

const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
    <div>
      <div className="flex items-center gap-2.5 mb-1">
        <span className="w-1 h-6 bg-primary rounded-full" />
        <h2 className="text-xl font-bold text-heading">{title}</h2>
      </div>
      {subtitle && <p className="text-faint text-xs mr-4">{subtitle}</p>}
    </div>
    {action}
  </div>
)

const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="relative max-w-xs w-full">
    <span className="absolute top-1/2 -translate-y-1/2 right-3 text-faint pointer-events-none">
      <Icons.Search className="w-4 h-4" />
    </span>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-overlay/5 border border-overlay/10 rounded-xl pr-10 pl-3 py-2.5 text-heading text-sm placeholder-faint focus:outline-none focus:border-primary focus:bg-overlay/10 transition-all duration-300"
    />
  </div>
)

const FilterChips = ({ items, active, onChange }) => (
  <div className="flex gap-2 mb-5 flex-wrap">
    {items.map(f => (
      <button
        key={f.k}
        onClick={() => onChange(f.k)}
        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
          active === f.k
            ? 'bg-primary text-white shadow-lg shadow-primary/20'
            : 'bg-overlay/5 text-muted hover:text-heading hover:bg-overlay/10'
        }`}
      >
        {f.l}
      </button>
    ))}
  </div>
)

const statusFilters = [
  { k: 'all', l: null },
  { k: 'pending', l: null },
  { k: 'confirmed', l: null },
  { k: 'completed', l: null },
  { k: 'cancelled', l: null },
]

const StatusSelect = ({ value, onChange, t }) => (
  <select
    value={value || 'pending'}
    onChange={e => onChange(e.target.value)}
    className="text-xs px-3 py-2 rounded-lg border border-overlay/10 bg-overlay/5 text-heading focus:outline-none focus:border-primary transition-all cursor-pointer"
  >
    <option value="pending" className="bg-dark">{t('dash.statusPending')}</option>
    <option value="confirmed" className="bg-dark">{t('dash.statusConfirmed')}</option>
    <option value="completed" className="bg-dark">{t('dash.statusCompleted')}</option>
    <option value="cancelled" className="bg-dark">{t('dash.statusCancelled')}</option>
  </select>
)

const DeleteBtn = ({ onClick, t }) => (
  <button
    onClick={onClick}
    className="text-red-400 hover:text-red-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition-all flex items-center gap-1"
  >
    <Icons.Shield className="w-3.5 h-3.5" />
    {t('dash.delete')}
  </button>
)

const EditBtn = ({ onClick, t }) => (
  <button
    onClick={onClick}
    className="text-blue-400 hover:text-blue-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10 transition-all flex items-center gap-1"
  >
    <Icons.Search className="w-3.5 h-3.5" />
    {t('dash.edit')}
  </button>
)

const AddBtn = ({ onClick, t }) => (
  <button
    onClick={onClick}
    className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 hover:shadow-lg hover:shadow-primary/30"
  >
    <span className="text-base leading-none">+</span>
    {t('dash.add')}
  </button>
)

const PrintBtn = ({ onClick, t }) => (
  <button
    onClick={onClick}
    className="bg-overlay/5 hover:bg-overlay/10 text-heading font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 border border-overlay/10 hover:border-primary/30"
  >
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
    {t('dash.print')}
  </button>
)

const printBookings = (bookings, type, lang, t, siteInfo) => {
  const statusLabels = { pending: t('dash.statusPending'), confirmed: t('dash.statusConfirmed'), completed: t('dash.statusCompleted'), cancelled: t('dash.statusCancelled') }

  const titles = {
    service: lang === 'ar' ? 'حجوزات الخدمات' : 'Service Bookings',
    course: lang === 'ar' ? 'حجوزات الدورات' : 'Course Bookings',
    offer: lang === 'ar' ? 'حجوزات العروض' : 'Offer Bookings',
  }

  const isAr = lang === 'ar'
  const dir = isAr ? 'rtl' : 'ltr'

  const serviceHeader = isAr ? 'الخدمة' : 'Service'
  const courseHeader = isAr ? 'الدورة' : 'Course'
  const offerHeader = isAr ? 'العرض' : 'Offer'

  const typeHeader = type === 'course' ? courseHeader : type === 'offer' ? offerHeader : serviceHeader

  const rows = bookings.map((b, i) => `
    <tr>
      <td style="text-align:center">${i + 1}</td>
      <td>${b.name || '-'}</td>
      <td>${b.phone || '-'}</td>
      <td>${b.date || '-'} ${b.time || ''}</td>
      <td>${type === 'course' ? (b.course || '-') : type === 'offer' ? (b.offer || '-') : (b.service || '-')}</td>
      ${type === 'service' ? `<td>${b.carModel || '-'}</td>` : ''}
      <td>${b.notes || '-'}</td>
      <td style="text-align:center">${statusLabels[b.status] || t('dash.statusNew')}</td>
    </tr>
  `).join('')

  const win = window.open('', '_blank')
  win.document.write(`
    <!DOCTYPE html>
    <html lang="${isAr ? 'ar' : 'en'}" dir="${dir}">
    <head>
      <meta charset="UTF-8">
      <title>${titles[type]}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Cairo', 'Arial', sans-serif; background: #fff; color: #1a1a2e; padding: 30px; }
        .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #dc2626; padding-bottom: 15px; }
        .header h1 { font-size: 22px; color: #dc2626; }
        .header p { font-size: 13px; color: #666; margin-top: 5px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; color: #888; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { background: #dc2626; color: #fff; padding: 10px 8px; font-weight: 700; text-align: center; }
        th:first-child { border-radius: 8px 0 0 0; }
        th:last-child { border-radius: 0 8px 0 0; }
        td { padding: 9px 8px; border-bottom: 1px solid #eee; }
        tr:nth-child(even) { background: #f8f9fa; }
        .status-pending { background: #fef9c3; color: #854d0e; padding: 3px 8px; border-radius: 6px; font-size: 11px; }
        .status-confirmed { background: #dcfce7; color: #166534; padding: 3px 8px; border-radius: 6px; font-size: 11px; }
        .status-completed { background: #dbeafe; color: #1e40af; padding: 3px 8px; border-radius: 6px; font-size: 11px; }
        .status-cancelled { background: #fee2e2; color: #991b1b; padding: 3px 8px; border-radius: 6px; font-size: 11px; }
        .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #aaa; border-top: 1px solid #eee; padding-top: 15px; }
        @media print { body { padding: 15px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${siteInfo.name}</h1>
        <p>${titles[type]}</p>
      </div>
      <div class="meta">
        <span>${isAr ? 'التاريخ' : 'Date'}: ${new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</span>
        <span>${isAr ? 'العدد' : 'Total'}: ${bookings.length}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width:40px">#</th>
            <th>${isAr ? 'الاسم' : 'Name'}</th>
            <th>${isAr ? 'الهاتف' : 'Phone'}</th>
            <th>${isAr ? 'الموعد' : 'Date'}</th>
            <th>${typeHeader}</th>
            ${type === 'service' ? `<th>${isAr ? 'موديل السيارة' : 'Car Model'}</th>` : ''}
            <th>${isAr ? 'ملاحظات' : 'Notes'}</th>
            <th>${isAr ? 'الحالة' : 'Status'}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footer">
        ${siteInfo.name} • ${siteInfo.phone} • ${siteInfo.address}
      </div>
      <script>window.onload = () => { window.print(); }</script>
    </body>
    </html>
  `)
  win.document.close()
}

export default function Dashboard() {
  const { username, logout } = useAuth()
  const { lang, t, toggleLang } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('overview')

  const [bookings, setBookings] = useState([])
  const [contacts, setContacts] = useState([])
  const [offers, setOffers] = useState([])
  const [services, setServices] = useState([])
  const [courses, setCourses] = useState([])
  const [reviews, setReviews] = useState(defaultTestimonials)
  const [events, setEvents] = useState([])
  const [gallery, setGallery] = useState([])

  const [bookingFilter, setBookingFilter] = useState('all')
  const [courseBookingFilter, setCourseBookingFilter] = useState('all')
  const [offerBookingFilter, setOfferBookingFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [courseSearch, setCourseSearch] = useState('')
  const [offerSearch, setOfferSearch] = useState('')

  // Seed DB on first load if empty, then fetch all data
  useEffect(() => {
    const seedIfNeeded = async () => {
      try {
        const offRes = await apiCall('/api/offers')
        const svcRes = await apiCall('/api/services')
        const crsRes = await apiCall('/api/courses')
        if ((!offRes.success || offRes.data?.length === 0) && defaultOffers.length) {
          await apiCall('/api/seed', 'POST', { offers: defaultOffers })
        }
        if ((!svcRes.success || svcRes.data?.length === 0) && defaultServices.length) {
          await apiCall('/api/seed', 'POST', { services: defaultServices })
        }
        if ((!crsRes.success || crsRes.data?.length === 0) && defaultCourses.length) {
          await apiCall('/api/seed', 'POST', { courses: defaultCourses })
        }
      } catch {}
    }

    const fetchAll = async () => {
      try {
        const [bk, ct, ev, of, sv, cr, gl] = await Promise.all([
          apiCall('/api/bookings'),
          apiCall('/api/contacts'),
          apiCall('/api/events'),
          apiCall('/api/offers'),
          apiCall('/api/services'),
          apiCall('/api/courses'),
          apiCall('/api/gallery'),
        ])
        setBookings(bk.data || [])
        setContacts(ct.data || [])
        setEvents(ev.data || [])
        setOffers(of.data || [])
        setServices(sv.data || [])
        setCourses(cr.data || [])
        setGallery(gl.data || [])
      } catch {}
    }

    seedIfNeeded().then(fetchAll)
  }, [])

  const updateBookingStatus = (id, status) => {
    fetch(`/api/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    setBookings(bookings.map(b => b._id === id ? { ...b, status } : b))
  }
  const deleteBooking = (id) => { fetch(`/api/bookings/${id}`, { method: 'DELETE' }); setBookings(bookings.filter(b => b._id !== id)) }
  const deleteContact = (id) => { fetch(`/api/contacts/${id}`, { method: 'DELETE' }); setContacts(contacts.filter(c => c._id !== id)) }
  const deleteEvent = (id) => { fetch(`/api/events/${id}`, { method: 'DELETE' }); setEvents(events.filter(e => e._id !== id)) }
  const deleteOffer = (id) => { fetch(`/api/offers/${id}`, { method: 'DELETE' }); setOffers(offers.filter(o => o._id !== id)) }
  const deleteService = (id) => { fetch(`/api/services/${id}`, { method: 'DELETE' }); setServices(services.filter(s => s._id !== id)) }
  const deleteCourse = (id) => { fetch(`/api/courses/${id}`, { method: 'DELETE' }); setCourses(courses.filter(c => c._id !== id)) }
  const deleteGalleryItem = (id) => { fetch(`/api/gallery/${id}`, { method: 'DELETE' }); setGallery(gallery.filter(g => g._id !== id)) }

  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('')
  const [formData, setFormData] = useState({})

  const [editId, setEditId] = useState(null)

  const openForm = (type, item = null) => {
    setFormType(type)
    setShowForm(true)
    if (item) {
      const itemId = item._id || item.id
      setEditId(itemId)
      setFormData({ ...item })
    } else {
      setEditId(null)
      setFormData(type === 'event' ? { type: 'post' } : {})
    }
  }
  const closeForm = () => { setShowForm(false); setFormType(''); setFormData({}); setEditId(null) }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formType === 'offer') {
        if (editId) {
          const d = await apiCall(`/api/offers/${editId}`, 'PUT', formData)
          if (d.success) setOffers(offers.map(o => o._id === editId ? d.data : o))
        } else {
          const d = await apiCall('/api/offers', 'POST', formData)
          if (d.success) setOffers([...offers, d.data])
        }
      }
      else if (formType === 'service') {
        if (editId) {
          const d = await apiCall(`/api/services/${editId}`, 'PUT', formData)
          if (d.success) setServices(services.map(s => s._id === editId ? d.data : s))
        } else {
          const d = await apiCall('/api/services', 'POST', formData)
          if (d.success) setServices([...services, d.data])
        }
      }
      else if (formType === 'course') {
        if (editId) {
          const d = await apiCall(`/api/courses/${editId}`, 'PUT', formData)
          if (d.success) setCourses(courses.map(c => c._id === editId ? d.data : c))
        } else {
          const d = await apiCall('/api/courses', 'POST', formData)
          if (d.success) setCourses([...courses, d.data])
        }
      }
      else if (formType === 'event') {
        const method = editId ? 'PUT' : 'POST'
        const url = editId ? `/api/events/${editId}` : '/api/events'
        const d = await apiCall(url, method, formData)
        if (d.success) {
          if (editId) setEvents(events.map(e => e._id === editId ? d.data : e))
          else setEvents([...events, d.data])
        }
      }
      else if (formType === 'gallery') {
        if (editId) {
          const d = await apiCall(`/api/gallery/${editId}`, 'PUT', formData)
          if (d.success) setGallery(gallery.map(g => g._id === editId ? d.data : g))
        } else {
          const d = await apiCall('/api/gallery', 'POST', formData)
          if (d.success) setGallery([...gallery, d.data])
        }
      }
    } catch {}
    closeForm()
  }

  const statusColors = {
    pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-green-500/15 text-green-400 border-green-500/30',
    completed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
  }
  const statusLabels = { pending: t('dash.statusPending'), confirmed: t('dash.statusConfirmed'), completed: t('dash.statusCompleted'), cancelled: t('dash.statusCancelled') }

  const serviceBookings = bookings.filter(b => b.type !== 'course' && b.type !== 'offer')
  const courseBookings = bookings.filter(b => b.type === 'course')
  const offerBookings = bookings.filter(b => b.type === 'offer')

  const filteredBookings = serviceBookings.filter(b => {
    const matchFilter = bookingFilter === 'all' || b.status === bookingFilter
    const matchSearch = !search || b.name?.includes(search) || b.phone?.includes(search) || b.service?.includes(search)
    return matchFilter && matchSearch
  })

  const filteredCourseBookings = courseBookings.filter(b => {
    const matchFilter = courseBookingFilter === 'all' || b.status === courseBookingFilter
    const matchSearch = !courseSearch || b.name?.includes(courseSearch) || b.phone?.includes(courseSearch) || b.course?.includes(courseSearch)
    return matchFilter && matchSearch
  })

  const filteredOfferBookings = offerBookings.filter(b => {
    const matchFilter = offerBookingFilter === 'all' || b.status === offerBookingFilter
    const matchSearch = !offerSearch || b.name?.includes(offerSearch) || b.phone?.includes(offerSearch) || b.offer?.includes(offerSearch)
    return matchFilter && matchSearch
  })

  const navGroups = [
    {
      title: t('dash.groupGeneral'),
      items: [{ id: 'overview', name: t('dash.overview'), icon: 'Computer' }],
    },
    {
      title: t('dash.groupBookings'),
      items: [
        { id: 'bookings', name: t('dash.serviceBookings'), icon: 'Calendar' },
        { id: 'course-bookings', name: t('dash.courseBookings'), icon: 'Trophy' },
        { id: 'offer-bookings', name: t('dash.offerBookings'), icon: 'Tag' },
      ],
    },
    {
      title: t('dash.groupContent'),
      items: [
        { id: 'offers', name: t('dash.offers'), icon: 'Tag' },
        { id: 'services', name: t('dash.services'), icon: 'Wrench' },
        { id: 'courses', name: t('dash.courses'), icon: 'Gear' },
        { id: 'events', name: t('dash.events'), icon: 'Bolt' },
        { id: 'gallery', name: t('dash.gallery'), icon: 'Search' },
        { id: 'reviews', name: t('dash.reviews'), icon: 'Star' },
      ],
    },
    {
      title: t('dash.groupContact'),
      items: [{ id: 'contacts', name: t('dash.contacts'), icon: 'Mail' }],
    },
  ]

  const allTabs = navGroups.flatMap(g => g.items)

  const stats = [
    { label: t('dash.serviceBookings'), value: serviceBookings.length, icon: 'Calendar', color: 'text-blue-400 bg-blue-500/10', tab: 'bookings' },
    { label: t('dash.courseBookings'), value: courseBookings.length, icon: 'Trophy', color: 'text-amber-400 bg-amber-500/10', tab: 'course-bookings' },
    { label: t('dash.offerBookings'), value: offerBookings.length, icon: 'Tag', color: 'text-emerald-400 bg-emerald-500/10', tab: 'offer-bookings' },
    { label: t('dash.contacts'), value: contacts.length, icon: 'Mail', color: 'text-green-400 bg-green-500/10', tab: 'contacts' },
    { label: t('dash.offers'), value: offers.length, icon: 'Tag', color: 'text-amber-400 bg-amber-500/10', tab: 'offers' },
    { label: t('dash.services'), value: services.length, icon: 'Wrench', color: 'text-red-400 bg-red-500/10', tab: 'services' },
    { label: t('dash.courses'), value: courses.length, icon: 'Gear', color: 'text-purple-400 bg-purple-500/10', tab: 'courses' },
    { label: t('dash.events'), value: events.length, icon: 'Bolt', color: 'text-amber-400 bg-amber-500/10', tab: 'events' },
    { label: t('dash.gallery'), value: gallery.length, icon: 'Search', color: 'text-indigo-400 bg-indigo-500/10', tab: 'gallery' },
    { label: t('dash.reviews'), value: reviews.length, icon: 'Star', color: 'text-cyan-400 bg-cyan-500/10', tab: 'reviews' },
  ]

  const inputCls = "w-full bg-overlay/5 border border-overlay/10 rounded-xl px-3 py-2.5 text-heading text-sm placeholder-faint focus:outline-none focus:border-primary focus:bg-overlay/10 transition-all duration-300"

  const ActivityCard = ({ title, icon, items, emptyText, emptyIcon, renderItem }) => (
    <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-xl p-4 border border-overlay/10 hover:border-overlay/20 transition-all duration-500">
      <h3 className="text-heading font-bold text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center text-primary">{renderIcon(icon, 'w-3.5 h-3.5')}</span>
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-faint text-xs py-4 text-center">{emptyText}</p>
      ) : (
        <div className="space-y-1.5">
          {items.slice(0, 4).map(renderItem)}
        </div>
      )}
    </div>
  )

  const BookingRow = ({ b, showCourse, showOffer }) => (
    <div className="flex items-center justify-between bg-overlay/5 rounded-lg p-2 hover:bg-overlay/10 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-[10px] flex-shrink-0">
          {b.name?.charAt(0) || '?'}
        </div>
        <div>
          <p className="text-heading text-[11px] font-bold">{b.name}</p>
          <p className="text-faint text-[9px]">{showCourse ? b.course : showOffer ? b.offer : b.service}</p>
        </div>
      </div>
      <span className={`text-[9px] px-1.5 py-0.5 rounded border ${statusColors[b.status] || 'bg-gray-500/15 text-muted border-gray-500/30'}`}>
        {statusLabels[b.status] || 'جديد'}
      </span>
    </div>
  )

  return (
    <div className="h-screen bg-dark relative flex flex-col overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/2 rounded-full blur-3xl" />
      </div>

      {/* === Top Bar === */}
      <header className="relative z-50 flex items-center justify-between h-16 px-4 md:px-5 bg-surface/90 backdrop-blur-xl border-b border-overlay/10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Logo className="h-9 w-auto flex-shrink-0" showText={false} />
          <div>
            <h1 className="text-heading font-bold text-sm leading-tight">{lang === 'ar' ? siteInfo.name : siteInfo.nameEn}</h1>
            <p className="text-primary text-[10px] font-medium">{t('dash.adminRole')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-overlay/5 rounded-lg border border-overlay/10">
            <span className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
              {username?.charAt(0) || '?'}
            </span>
            <span className="text-heading text-xs font-medium">{username}</span>
          </div>

          {/* Theme + Lang toggles */}
          <div className="flex items-center gap-1 px-1.5 py-1 bg-overlay/5 rounded-lg border border-overlay/10">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-overlay/10"
              title={theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}
            >
              {theme === 'dark' ? <Icons.Sun className="w-4 h-4 text-amber-400" /> : <Icons.Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={toggleLang}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-overlay/10 text-xs font-bold text-heading"
              title={t('nav.langSwitch')}
            >
              {lang === 'ar' ? 'EN' : 'ع'}
            </button>
          </div>

          <Link to="/" className="flex items-center gap-1.5 text-muted hover:text-heading text-xs px-3 py-2 rounded-lg hover:bg-overlay/5 transition-all border border-overlay/10">
            <Icons.ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('dash.backToSite')}</span>
          </Link>
          <button onClick={logout} className="flex items-center gap-1.5 text-red-400 hover:bg-red-500/10 text-xs px-3 py-2 rounded-lg transition-all border border-overlay/10">
            <Icons.Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('dash.logout')}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* === Sidebar === */}
        <aside className="w-56 bg-surface/80 backdrop-blur-xl border-l border-overlay/10 fixed right-0 top-16 bottom-0 overflow-y-auto z-40 hidden md:flex flex-col">
          {/* Nav groups */}
          <nav className="space-y-3 p-3">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-faint text-[9px] font-bold uppercase tracking-wider px-3 mb-1">{group.title}</p>
                  <div className="space-y-0.5">
                    {group.items.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 relative ${
                          activeTab === tab.id
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-muted hover:text-heading hover:bg-overlay/5'
                        }`}
                      >
                        {activeTab === tab.id && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-l-full" />
                        )}
                        {renderIcon(tab.icon, 'w-3.5 h-3.5')}
                        {tab.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
        </aside>

        {/* === Mobile tab bar === */}
        <div className="md:hidden fixed top-16 right-0 left-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-overlay/10 overflow-x-auto">
          <div className="flex gap-1 p-2">
            {allTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted bg-overlay/5'
                }`}
              >
                {renderIcon(tab.icon, 'w-3.5 h-3.5')}
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* === Main Content === */}
        <main className="flex-1 md:mr-56 p-4 md:p-6 mt-14 md:mt-0 relative z-10 overflow-y-auto">

          {/* === OVERVIEW === */}
          {activeTab === 'overview' && (
            <div className="animate-fadeIn">
              {/* Header banner */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-l from-primary/15 via-surface to-surface border border-overlay/10 p-4 mb-4">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-primary text-base">👋</span>
                    <h2 className="text-lg font-bold text-heading">{t('dash.welcome')} {username}</h2>
                  </div>
                  <p className="text-muted text-xs">{t('dash.overviewSub')}</p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-2.5 mb-4">
                {stats.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(s.tab)}
                    className="group bg-gradient-to-b from-white/[0.04] to-transparent rounded-xl p-3 border border-overlay/10 hover:border-primary/30 transition-all duration-500 text-right hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform duration-300`}>
                        {renderIcon(s.icon, 'w-4 h-4')}
                      </div>
                      <span className="text-2xl font-bold text-heading">{s.value}</span>
                    </div>
                    <p className="text-muted text-[10px] leading-tight">{s.label}</p>
                  </button>
                ))}
              </div>

              {/* Activity cards */}
              <div className="grid md:grid-cols-2 gap-3">
                <ActivityCard
                  title={t('dash.recentServiceBookings')}
                  icon="Calendar"
                  items={serviceBookings}
                  emptyText={t('dash.noBookings')}
                  emptyIcon="Calendar"
                  renderItem={b => <BookingRow key={b._id} b={b} />}
                />
                <ActivityCard
                  title={t('dash.recentCourseBookings')}
                  icon="Trophy"
                  items={courseBookings}
                  emptyText={t('dash.noCourseBookings')}
                  emptyIcon="Trophy"
                  renderItem={b => <BookingRow key={b._id} b={b} showCourse />}
                />
              </div>
              <div className="mt-3 grid md:grid-cols-2 gap-3">
                <ActivityCard
                  title={t('dash.recentOfferBookings')}
                  icon="Tag"
                  items={offerBookings}
                  emptyText={t('dash.noOfferBookings')}
                  emptyIcon="Tag"
                  renderItem={b => <BookingRow key={b._id} b={b} showOffer />}
                />
                <ActivityCard
                  title={t('dash.recentMessages')}
                  icon="Mail"
                  items={contacts}
                  emptyText={t('dash.noMessages')}
                  emptyIcon="Mail"
                  renderItem={c => (
                    <div key={c._id} className="flex items-center justify-between bg-overlay/5 rounded-lg p-2 hover:bg-overlay/10 transition-colors duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-green-500/10 rounded-full flex items-center justify-center text-green-400 font-bold text-[10px] flex-shrink-0">
                          {c.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-heading text-[11px] font-bold">{c.name}</p>
                          <p className="text-faint text-[9px]">{c.subject}</p>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                  )}
                />
              </div>
            </div>
          )}

          {/* === BOOKINGS === */}
          {activeTab === 'bookings' && (
            <div className="animate-fadeIn">
              <PageHeader
                title="حجوزات الخدمات"
                subtitle={`${filteredBookings.length} ${t('dash.bookingCount')}`}
                action={
                  <div className="flex items-center gap-2">
                    <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder={t('dash.searchPlaceholder')} />
                    {filteredBookings.length > 0 && <PrintBtn onClick={() => printBookings(filteredBookings, 'service', lang, t, siteInfo)} t={t} />}
                  </div>
                }
              />
              <FilterChips items={statusFilters.map(f => ({ ...f, l: t(`dash.status${f.k.charAt(0).toUpperCase()}${f.k.slice(1)}`) }))} active={bookingFilter} onChange={setBookingFilter} />
              {filteredBookings.length === 0 ? (
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-overlay/10">
                  <EmptyState icon="Calendar" title={t('dash.noBookings')} sub={t('dash.noServiceBookingsSub')} />
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map(b => (
                    <div key={b._id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 hover:border-primary/20 transition-all duration-500">
                      <div className="flex items-start justify-between flex-wrap gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                            {b.name?.charAt(0) || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-heading font-bold text-sm">{b.name}</h3>
                              <span className={`text-[10px] px-2 py-0.5 rounded border ${statusColors[b.status] || 'bg-gray-500/15 text-muted border-gray-500/30'}`}>{statusLabels[b.status] || 'جديد'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted flex-wrap">
                              <span className="flex items-center gap-1"><Icons.Phone className="w-3 h-3 text-faint" /> {b.phone}</span>
                              <span className="flex items-center gap-1"><Icons.Calendar className="w-3 h-3 text-faint" /> {b.date} {b.time}</span>
                            </div>
                            <p className="text-faint text-xs mt-1.5 flex items-center gap-1"><Icons.Wrench className="w-3 h-3" /> {b.service}</p>
                            {b.carModel && <p className="text-faint text-[10px] mt-1 flex items-center gap-1"><Icons.Car className="w-3 h-3" /> {b.carModel}</p>}
                            {b.notes && <p className="text-faint text-[10px] mt-1 bg-overlay/5 rounded-lg px-2 py-1.5">📝 {b.notes}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <StatusSelect value={b.status} onChange={v => updateBookingStatus(b._id, v)} t={t} />
                          <DeleteBtn onClick={() => deleteBooking(b._id)} t={t} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === COURSE BOOKINGS === */}
          {activeTab === 'course-bookings' && (
            <div className="animate-fadeIn">
              <PageHeader
                title="حجوزات الدورات"
                subtitle={`${filteredCourseBookings.length} ${t('dash.bookingCount')}`}
                action={
                  <div className="flex items-center gap-2">
                    <SearchInput value={courseSearch} onChange={e => setCourseSearch(e.target.value)} placeholder={t('dash.searchPlaceholderCourse')} />
                    {filteredCourseBookings.length > 0 && <PrintBtn onClick={() => printBookings(filteredCourseBookings, 'course', lang, t, siteInfo)} t={t} />}
                  </div>
                }
              />
              <FilterChips items={statusFilters.map(f => ({ ...f, l: t(`dash.status${f.k.charAt(0).toUpperCase()}${f.k.slice(1)}`) }))} active={courseBookingFilter} onChange={setCourseBookingFilter} />
              {filteredCourseBookings.length === 0 ? (
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-overlay/10">
                  <EmptyState icon="Trophy" title={t('dash.noCourseBookings')} sub={t('dash.noCourseBookingsSub')} />
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCourseBookings.map(b => (
                    <div key={b._id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 hover:border-primary/20 transition-all duration-500">
                      <div className="flex items-start justify-between flex-wrap gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
                            {b.name?.charAt(0) || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-heading font-bold text-sm">{b.name}</h3>
                              <span className={`text-[10px] px-2 py-0.5 rounded border ${statusColors[b.status] || 'bg-gray-500/15 text-muted border-gray-500/30'}`}>{statusLabels[b.status] || 'جديد'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted flex-wrap">
                              <span className="flex items-center gap-1"><Icons.Phone className="w-3 h-3 text-faint" /> {b.phone}</span>
                              {b.date && <span className="flex items-center gap-1"><Icons.Calendar className="w-3 h-3 text-faint" /> {b.date} {b.time}</span>}
                            </div>
                            <p className="text-faint text-xs mt-1.5 flex items-center gap-1"><Icons.Trophy className="w-3 h-3" /> {b.course}</p>
                            {b.notes && <p className="text-faint text-[10px] mt-1 bg-overlay/5 rounded-lg px-2 py-1.5">📝 {b.notes}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <StatusSelect value={b.status} onChange={v => updateBookingStatus(b._id, v)} t={t} />
                          <DeleteBtn onClick={() => deleteBooking(b._id)} t={t} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === OFFER BOOKINGS === */}
          {activeTab === 'offer-bookings' && (
            <div className="animate-fadeIn">
              <PageHeader
                title="حجوزات العروض"
                subtitle={`${filteredOfferBookings.length} ${t('dash.bookingCount')}`}
                action={
                  <div className="flex items-center gap-2">
                    <SearchInput value={offerSearch} onChange={e => setOfferSearch(e.target.value)} placeholder={t('dash.searchPlaceholderOffer')} />
                    {filteredOfferBookings.length > 0 && <PrintBtn onClick={() => printBookings(filteredOfferBookings, 'offer', lang, t, siteInfo)} t={t} />}
                  </div>
                }
              />
              <FilterChips items={statusFilters.map(f => ({ ...f, l: t(`dash.status${f.k.charAt(0).toUpperCase()}${f.k.slice(1)}`) }))} active={offerBookingFilter} onChange={setOfferBookingFilter} />
              {filteredOfferBookings.length === 0 ? (
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-overlay/10">
                  <EmptyState icon="Tag" title={t('dash.noOfferBookings')} sub={t('dash.noOfferBookingsSub')} />
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOfferBookings.map(b => (
                    <div key={b._id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 hover:border-primary/20 transition-all duration-500">
                      <div className="flex items-start justify-between flex-wrap gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
                            {b.name?.charAt(0) || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-heading font-bold text-sm">{b.name}</h3>
                              <span className={`text-[10px] px-2 py-0.5 rounded border ${statusColors[b.status] || 'bg-gray-500/15 text-muted border-gray-500/30'}`}>{statusLabels[b.status] || 'جديد'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted flex-wrap">
                              <span className="flex items-center gap-1"><Icons.Phone className="w-3 h-3 text-faint" /> {b.phone}</span>
                              {b.date && <span className="flex items-center gap-1"><Icons.Calendar className="w-3 h-3 text-faint" /> {b.date} {b.time}</span>}
                            </div>
                            <p className="text-faint text-xs mt-1.5 flex items-center gap-1"><Icons.Tag className="w-3 h-3" /> {b.offer}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <StatusSelect value={b.status} onChange={v => updateBookingStatus(b._id, v)} t={t} />
                          <DeleteBtn onClick={() => deleteBooking(b._id)} t={t} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === CONTACTS === */}
          {activeTab === 'contacts' && (
            <div className="animate-fadeIn">
              <PageHeader title={t('dash.contacts')} subtitle={`${contacts.length} ${t('dash.messageCount')}`} />
              {contacts.length === 0 ? (
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-overlay/10">
                  <EmptyState icon="Mail" title={t('dash.noMessages')} sub={t('dash.noMessagesSub')} />
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.map(c => (
                    <div key={c._id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 hover:border-primary/20 transition-all duration-500">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 font-bold text-sm flex-shrink-0">
                            {c.name?.charAt(0) || '?'}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-heading font-bold text-sm mb-0.5">{c.name}</h3>
                            <div className="flex items-center gap-3 text-xs text-muted flex-wrap">
                              <span className="flex items-center gap-1"><Icons.Phone className="w-3 h-3 text-faint" /> {c.phone}</span>
                              {c.email && <span className="flex items-center gap-1"><Icons.Mail className="w-3 h-3 text-faint" /> {c.email}</span>}
                            </div>
                            <p className="text-body text-xs mt-2.5 bg-overlay/5 rounded-lg p-3 leading-relaxed border border-overlay/5">{c.message}</p>
                          </div>
                        </div>
                        <DeleteBtn onClick={() => deleteContact(c._id)} t={t} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === OFFERS === */}
          {activeTab === 'offers' && (
            <div className="animate-fadeIn">
              <PageHeader title={t('dash.offers')} subtitle={`${offers.length} ${t('dash.offerCount')}`} action={<AddBtn onClick={() => openForm('offer')} t={t} />} />
              <div className="space-y-3">
                {offers.map(o => (
                  <div key={o._id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 flex items-center justify-between hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">{renderIcon(o.icon || 'Tag', 'w-5 h-5')}</div>
                      <div>
                        <h3 className="text-heading font-bold text-sm">{o.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          {o.discount > 0 && <span className="text-primary text-xs font-bold">{o.discount}% {t('dash.discountPlaceholder')}</span>}
                          <span className="text-faint text-[10px]">• {o.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <EditBtn onClick={() => openForm('offer', o)} t={t} />
                      <DeleteBtn onClick={() => deleteOffer(o._id)} t={t} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === SERVICES === */}
          {activeTab === 'services' && (
            <div className="animate-fadeIn">
              <PageHeader title={t('dash.services')} subtitle={`${services.length} ${t('dash.serviceCount')}`} action={<AddBtn onClick={() => openForm('service')} t={t} />} />
              <div className="space-y-3">
                {services.map(s => (
                  <div key={s._id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 flex items-center justify-between hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">{renderIcon(s.icon || 'Wrench', 'w-5 h-5')}</div>
                      <div>
                        <h3 className="text-heading font-bold text-sm">{s.title}</h3>
                        <p className="text-faint text-xs line-clamp-1 mt-0.5">{s.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <EditBtn onClick={() => openForm('service', s)} t={t} />
                      <DeleteBtn onClick={() => deleteService(s._id)} t={t} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === COURSES === */}
          {activeTab === 'courses' && (
            <div className="animate-fadeIn">
              <PageHeader title={t('dash.courses')} subtitle={`${courses.length} ${t('dash.courseCount')}`} action={<AddBtn onClick={() => openForm('course')} t={t} />} />
              <div className="space-y-3">
                {courses.map(c => (
                  <div key={c._id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 flex items-center justify-between hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">{renderIcon('Gear', 'w-5 h-5')}</div>
                      <div>
                        <h3 className="text-heading font-bold text-sm">{c.title}</h3>
                        <p className="text-faint text-xs mt-0.5"><span className="text-primary">{c.duration}</span> • {c.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <EditBtn onClick={() => openForm('course', c)} t={t} />
                      <DeleteBtn onClick={() => deleteCourse(c._id)} t={t} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === EVENTS === */}
          {activeTab === 'events' && (
            <div className="animate-fadeIn">
              <PageHeader title={t('dash.events')} subtitle={`${events.length} ${t('dash.eventCount')}`} action={<AddBtn onClick={() => openForm('event')} t={t} />} />
              {events.length === 0 ? (
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-overlay/10">
                  <EmptyState icon="Bolt" title={t('dash.noEvents')} sub={t('dash.noEventsSub')} />
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map(ev => (
                    <div key={ev._id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 flex items-center justify-between hover:border-primary/20 transition-all duration-500">
                      <div className="flex items-center gap-3">
                        {ev.image ? (
                          <img src={ev.image} alt={ev.title} className="w-11 h-11 rounded-xl object-cover" />
                        ) : (
                          <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">{renderIcon('Bolt', 'w-5 h-5')}</div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-heading font-bold text-sm">{ev.title}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded ${ev.type === 'offer' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'}`}>
                              {ev.type === 'offer' ? t('dash.limitedOffer') : t('dash.post')}
                            </span>
                          </div>
                          <p className="text-faint text-xs line-clamp-1 mt-0.5">{ev.description}</p>
                          {ev.type === 'offer' && ev.discount > 0 && <p className="text-faint text-[10px] mt-0.5">{ev.discount}% {t('dash.discountPlaceholder')}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                      <EditBtn onClick={() => openForm('event', ev)} t={t} />
                      <DeleteBtn onClick={() => deleteEvent(ev._id)} t={t} />
                    </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === GALLERY === */}
          {activeTab === 'gallery' && (
            <div className="animate-fadeIn">
              <PageHeader title={t('dash.gallery')} subtitle={`${gallery.length} ${lang === 'ar' ? 'عنصر' : 'items'}`} action={<AddBtn onClick={() => openForm('gallery')} t={t} />} />
              {gallery.length === 0 ? (
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-overlay/10">
                  <EmptyState icon="Search" title={t('dash.noGallery')} sub={t('dash.noGallerySub')} />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gallery.map(g => (
                    <div key={g._id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl overflow-hidden border border-overlay/10 hover:border-primary/20 transition-all duration-500">
                      <div className="relative h-40 overflow-hidden">
                        {g.type === 'photo' ? (
                          <img src={g.afterImage} alt={g.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.target.style.opacity = '0.1' }} />
                        ) : g.videoUrl ? (
                          <iframe
                            src={g.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/').split('&')[0]}
                            title={g.title}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full bg-overlay/10 flex items-center justify-center">
                            <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center text-red-500">
                              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${g.type === 'photo' ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'}`}>
                            {g.type === 'photo' ? (lang === 'ar' ? 'صورة' : 'Photo') : (lang === 'ar' ? 'فيديو' : 'Video')}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-heading font-bold text-sm">{g.title}</h3>
                          <p className="text-faint text-[10px]">{g.category}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <EditBtn onClick={() => openForm('gallery', g)} t={t} />
                          <DeleteBtn onClick={() => deleteGalleryItem(g._id)} t={t} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === REVIEWS === */}
          {activeTab === 'reviews' && (
            <div className="animate-fadeIn">
              <PageHeader title={t('dash.reviews')} subtitle={`${reviews.length} ${t('dash.reviewCount')}`} />
              <div className="space-y-3">
                {reviews.map((r, i) => (
                  <div key={i} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">{r.name.charAt(0)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-heading font-bold text-sm">{r.name}</h3>
                            <span className="text-faint text-[10px]">{r.role}</span>
                            <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, j) => <Icons.Star key={j} className="w-3 h-3 text-yellow-400" />)}</div>
                          </div>
                          <p className="text-body text-xs mt-1 leading-relaxed">{r.text}</p>
                        </div>
                      </div>
                      <DeleteBtn onClick={() => setReviews(reviews.filter((_, idx) => idx !== i))} t={t} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* === ADD FORM MODAL === */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeForm}>
          <div className="bg-gradient-to-b from-surface to-[#0a0a0f] rounded-2xl p-6 border border-overlay/20 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {renderIcon(formType === 'offer' ? 'Tag' : formType === 'service' ? 'Wrench' : formType === 'course' ? 'Gear' : 'Bolt', 'w-4 h-4')}
                </div>
                <h3 className="text-heading font-bold text-lg">{editId ? t('dash.editTitle') : t('dash.addTitle')} {formType === 'offer' ? t('dash.offerLabel') : formType === 'service' ? t('dash.serviceLabel') : formType === 'course' ? t('dash.courseLabel') : t('dash.eventLabel')}</h3>
              </div>
              <button onClick={closeForm} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-heading hover:bg-overlay/10 transition-all">✕</button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              {formType === 'event' && (
                <div className="flex gap-2 p-1 bg-overlay/5 rounded-xl">
                  <button type="button" onClick={() => setFormData({ ...formData, type: 'post' })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${formData.type !== 'offer' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted'}`}>
                    <span className="flex items-center justify-center gap-1.5"><Icons.Mail className="w-3.5 h-3.5" /> {t('dash.post')}</span>
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, type: 'offer' })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${formData.type === 'offer' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted'}`}>
                    <span className="flex items-center justify-center gap-1.5"><Icons.Tag className="w-3.5 h-3.5" /> {t('dash.limitedOffer')}</span>
                  </button>
                </div>
              )}
              <input type="text" placeholder={formType === 'offer' ? t('dash.offerLabel') : formType === 'service' ? t('dash.serviceLabel') : formType === 'course' ? t('dash.courseLabel') : t('dash.eventLabel')} value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required className={inputCls} />
              <textarea placeholder={t('dash.descPlaceholder')} value={formData.desc || formData.description || ''} onChange={e => setFormData({ ...formData, [formType === 'service' ? 'description' : formType === 'event' ? 'description' : 'desc']: e.target.value })} required rows={2} className={inputCls + ' resize-none'} />
              {formType === 'event' && (
                <div>
                  <label className="text-faint text-xs mb-2 block">{t('dash.eventImage')}</label>
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-overlay/15 rounded-xl py-6 cursor-pointer hover:border-primary/40 transition-all duration-300 bg-overlay/5 hover:bg-overlay/10">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {formData.image ? <img src={formData.image} alt="" className="w-16 h-16 rounded-lg object-cover" /> : <Icons.Search className="w-5 h-5" />}
                    </div>
                    {formData.image ? (
                      <span className="text-green-400 text-xs font-medium">{t('dash.imageSelected')}</span>
                    ) : (
                      <span className="text-faint text-xs">{t('dash.uploadImage')}</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files[0]
                        if (!file) return
                        const img = new Image()
                        const canvas = document.createElement('canvas')
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          img.onload = () => {
                            const maxSize = 800
                            let { width, height } = img
                            if (width > height && width > maxSize) { height = (height * maxSize) / width; width = maxSize }
                            else if (height > maxSize) { width = (width * maxSize) / height; height = maxSize }
                            canvas.width = width
                            canvas.height = height
                            const ctx = canvas.getContext('2d')
                            ctx.drawImage(img, 0, 0, width, height)
                            setFormData({ ...formData, image: canvas.toDataURL('image/jpeg', 0.7) })
                          }
                          img.src = reader.result
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                  </label>
                </div>
              )}
              {formType === 'offer' && (
                <>
                  <input type="number" min="0" placeholder={t('dash.discountPlaceholder')} value={formData.discount ?? ''} onChange={e => setFormData({ ...formData, discount: +e.target.value })} className={inputCls} />
                  <select value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} required className={inputCls}>
                    <option value="" className="bg-dark">{t('dash.categoryPlaceholder')}</option>
                    <option value="كشوف" className="bg-dark">كشوف</option>
                    <option value="صيانة" className="bg-dark">صيانة</option>
                    <option value="تكييف" className="bg-dark">تكييف</option>
                    <option value="فرامل" className="bg-dark">فرامل</option>
                    <option value="كهرباء" className="bg-dark">كهرباء</option>
                    <option value="تنظيف" className="bg-dark">تنظيف</option>
                  </select>
                  <select value={formData.icon || 'Wrench'} onChange={e => setFormData({ ...formData, icon: e.target.value })} className={inputCls}>
                    <option value="Wrench" className="bg-dark">ميكانيكا</option>
                    <option value="Car" className="bg-dark">عفشة</option>
                    <option value="Shield" className="bg-dark">حماية</option>
                    <option value="Bolt" className="bg-dark">كهرباء</option>
                    <option value="Snowflake" className="bg-dark">تكييف</option>
                    <option value="Search" className="bg-dark">فحص</option>
                    <option value="Tag" className="bg-dark">سعر</option>
                    <option value="Trophy" className="bg-dark">جودة</option>
                    <option value="Gear" className="bg-dark">قطع غيار</option>
                    <option value="Oil" className="bg-dark">زيت</option>
                    <option value="Computer" className="bg-dark">كمبيوتر</option>
                    <option value="Brake" className="bg-dark">فرامل</option>
                  </select>
                  <div>
                    <label className="text-faint text-xs mb-2 block">{t('dash.eventImage')}</label>
                    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-overlay/15 rounded-xl py-6 cursor-pointer hover:border-primary/40 transition-all duration-300 bg-overlay/5 hover:bg-overlay/10">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {formData.image ? <img src={formData.image} alt="" className="w-16 h-16 rounded-lg object-cover" /> : <Icons.Search className="w-5 h-5" />}
                      </div>
                      {formData.image ? (
                        <span className="text-green-400 text-xs font-medium">{t('dash.imageSelected')}</span>
                      ) : (
                        <span className="text-faint text-xs">{t('dash.uploadImage')}</span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files[0]
                          if (!file) return
                          const img = new Image()
                          const canvas = document.createElement('canvas')
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            img.onload = () => {
                              const maxSize = 800
                              let { width, height } = img
                              if (width > height && width > maxSize) { height = (height * maxSize) / width; width = maxSize }
                              else if (height > maxSize) { width = (width * maxSize) / height; height = maxSize }
                              canvas.width = width
                              canvas.height = height
                              const ctx = canvas.getContext('2d')
                              ctx.drawImage(img, 0, 0, width, height)
                              setFormData({ ...formData, image: canvas.toDataURL('image/jpeg', 0.7) })
                            }
                            img.src = reader.result
                          }
                          reader.readAsDataURL(file)
                        }}
                      />
                    </label>
                  </div>
                </>
              )}
              {formType === 'course' && <input type="text" placeholder={t('dash.durationPlaceholder')} value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} required className={inputCls} />}

              {/* Gallery Form */}
              {formType === 'gallery' && (
                <>
                  <div className="flex gap-2 p-1 bg-overlay/5 rounded-xl">
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'photo' })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${formData.type !== 'video' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted'}`}>
                      {lang === 'ar' ? 'صورة قبل/بعد' : 'Before/After Photo'}
                    </button>
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'video' })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${formData.type === 'video' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted'}`}>
                      {lang === 'ar' ? 'فيديو يوتيوب' : 'YouTube Video'}
                    </button>
                  </div>

                  {formData.type === 'video' && (
                    <input type="text" placeholder={lang === 'ar' ? 'رابط فيديو يوتيوب' : 'YouTube Video URL'} value={formData.videoUrl || ''} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} required className={inputCls} />
                  )}

                  {formData.type === 'photo' && (
                    <>
                      <div>
                        <label className="text-faint text-xs mb-2 block">{lang === 'ar' ? 'صورة قبل' : 'Before Image'}</label>
                        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-overlay/15 rounded-xl py-4 cursor-pointer hover:border-primary/40 transition-all duration-300 bg-overlay/5 hover:bg-overlay/10">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            {formData.beforeImage ? <img src={formData.beforeImage} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <Icons.Search className="w-4 h-4" />}
                          </div>
                          {formData.beforeImage ? <span className="text-green-400 text-xs">{t('dash.imageSelected')}</span> : <span className="text-faint text-xs">{t('dash.uploadImage')}</span>}
                          <input type="file" accept="image/*" className="hidden" onChange={e => {
                            const file = e.target.files[0]; if (!file) return
                            const img = new Image(); const canvas = document.createElement('canvas'); const reader = new FileReader()
                            reader.onloadend = () => { img.onload = () => { const maxSize = 800; let { width, height } = img; if (width > height && width > maxSize) { height = (height * maxSize) / width; width = maxSize } else if (height > maxSize) { width = (width * maxSize) / height; height = maxSize } canvas.width = width; canvas.height = height; canvas.getContext('2d').drawImage(img, 0, 0, width, height); setFormData({ ...formData, beforeImage: canvas.toDataURL('image/jpeg', 0.7) }) }; img.src = reader.result }
                            reader.readAsDataURL(file)
                          }} />
                        </label>
                      </div>
                      <div>
                        <label className="text-faint text-xs mb-2 block">{lang === 'ar' ? 'صورة بعد' : 'After Image'}</label>
                        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-overlay/15 rounded-xl py-4 cursor-pointer hover:border-primary/40 transition-all duration-300 bg-overlay/5 hover:bg-overlay/10">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            {formData.afterImage ? <img src={formData.afterImage} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <Icons.Search className="w-4 h-4" />}
                          </div>
                          {formData.afterImage ? <span className="text-green-400 text-xs">{t('dash.imageSelected')}</span> : <span className="text-faint text-xs">{t('dash.uploadImage')}</span>}
                          <input type="file" accept="image/*" className="hidden" onChange={e => {
                            const file = e.target.files[0]; if (!file) return
                            const img = new Image(); const canvas = document.createElement('canvas'); const reader = new FileReader()
                            reader.onloadend = () => { img.onload = () => { const maxSize = 800; let { width, height } = img; if (width > height && width > maxSize) { height = (height * maxSize) / width; width = maxSize } else if (height > maxSize) { width = (width * maxSize) / height; height = maxSize } canvas.width = width; canvas.height = height; canvas.getContext('2d').drawImage(img, 0, 0, width, height); setFormData({ ...formData, afterImage: canvas.toDataURL('image/jpeg', 0.7) }) }; img.src = reader.result }
                            reader.readAsDataURL(file)
                          }} />
                        </label>
                      </div>
                    </>
                  )}

                  <select value={formData.category || 'صيانة'} onChange={e => setFormData({ ...formData, category: e.target.value })} required className={inputCls}>
                    <option value="صيانة" className="bg-dark">{lang === 'ar' ? 'صيانة' : 'Maintenance'}</option>
                    <option value="فرامل" className="bg-dark">{lang === 'ar' ? 'فرامل' : 'Brakes'}</option>
                    <option value="تكييف" className="bg-dark">{lang === 'ar' ? 'تكييف' : 'AC'}</option>
                    <option value="كهرباء" className="bg-dark">{lang === 'ar' ? 'كهرباء' : 'Electrical'}</option>
                    <option value="إطارات" className="bg-dark">{lang === 'ar' ? 'إطارات' : 'Tires'}</option>
                    <option value="دهان" className="bg-dark">{lang === 'ar' ? 'دهان' : 'Paint'}</option>
                  </select>
                </>
              )}
              {formType === 'service' && (
                <select value={formData.icon || 'Wrench'} onChange={e => setFormData({ ...formData, icon: e.target.value })} className={inputCls}>
                  {iconOptions.map(ic => <option key={ic} value={ic} className="bg-dark">{ic}</option>)}
                </select>
              )}
              {formType === 'event' && formData.type === 'offer' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder={t('dash.oldPricePlaceholder')} value={formData.oldPrice || ''} onChange={e => {
                      const oldPrice = +e.target.value
                      const newPrice = formData.newPrice || 0
                      const discount = oldPrice > 0 ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0
                      setFormData({ ...formData, oldPrice, discount })
                    }} className={inputCls} />
                    <input type="number" placeholder={t('dash.newPricePlaceholder')} value={formData.newPrice || ''} onChange={e => {
                      const newPrice = +e.target.value
                      const oldPrice = formData.oldPrice || 0
                      const discount = oldPrice > 0 ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0
                      setFormData({ ...formData, newPrice, discount })
                    }} className={inputCls} />
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl px-3 py-2.5 flex items-center justify-between">
                    <span className="text-faint text-xs">{t('dash.calculatedDiscount')}</span>
                    <span className="text-primary font-bold text-sm">{formData.discount || 0}%</span>
                  </div>
                  <label className="block">
                    <span className="text-faint text-xs mb-1.5 block">{t('dash.expiryDate')}</span>
                    <input type="date" value={formData.expiryDate || ''} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} className={inputCls} />
                  </label>
                </>
              )}
              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all duration-300 text-sm hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2">
                <Icons.CheckCircle className="w-4 h-4" />
                {t('dash.save')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
