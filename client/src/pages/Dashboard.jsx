import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icons from '../components/Icons'
import Logo from '../components/Logo'
import { services as defaultServices, offers as defaultOffers, courses as defaultCourses, testimonials as defaultTestimonials } from '../data/content'

const renderIcon = (name, className = 'w-5 h-5') => {
  const Icon = Icons[name]
  return Icon ? <Icon className={className} /> : null
}

const iconOptions = ['Wrench', 'Gear', 'Shield', 'Bolt', 'Car', 'Oil', 'Computer', 'Brake', 'Snowflake', 'Search', 'Tag', 'Trophy']

const EmptyState = ({ icon = 'Search', title = 'لا توجد بيانات', sub = '' }) => (
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
  { k: 'all', l: 'الكل' },
  { k: 'pending', l: 'قيد الانتظار' },
  { k: 'confirmed', l: 'مؤكد' },
  { k: 'completed', l: 'مكتمل' },
  { k: 'cancelled', l: 'ملغي' },
]

const StatusSelect = ({ value, onChange }) => (
  <select
    value={value || 'pending'}
    onChange={e => onChange(e.target.value)}
    className="text-xs px-3 py-2 rounded-lg border border-overlay/10 bg-overlay/5 text-heading focus:outline-none focus:border-primary transition-all cursor-pointer"
  >
    <option value="pending" className="bg-dark">قيد الانتظار</option>
    <option value="confirmed" className="bg-dark">مؤكد</option>
    <option value="completed" className="bg-dark">مكتمل</option>
    <option value="cancelled" className="bg-dark">ملغي</option>
  </select>
)

const DeleteBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-red-400 hover:text-red-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition-all flex items-center gap-1"
  >
    <Icons.Shield className="w-3.5 h-3.5" />
    حذف
  </button>
)

const EditBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-blue-400 hover:text-blue-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10 transition-all flex items-center gap-1"
  >
    <Icons.Search className="w-3.5 h-3.5" />
    تعديل
  </button>
)

const AddBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 hover:shadow-lg hover:shadow-primary/30"
  >
    <span className="text-base leading-none">+</span>
    إضافة
  </button>
)

export default function Dashboard() {
  const { username, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const [bookings, setBookings] = useState([])
  const [contacts, setContacts] = useState([])
  const [offers, setOffers] = useState(() => {
    const saved = localStorage.getItem('dashboard_offers')
    return saved ? JSON.parse(saved) : defaultOffers
  })
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('dashboard_services')
    return saved ? JSON.parse(saved) : defaultServices
  })
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('dashboard_courses')
    return saved ? JSON.parse(saved) : defaultCourses
  })
  const [reviews, setReviews] = useState(defaultTestimonials)
  const [events, setEvents] = useState([])

  const [bookingFilter, setBookingFilter] = useState('all')
  const [courseBookingFilter, setCourseBookingFilter] = useState('all')
  const [offerBookingFilter, setOfferBookingFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [courseSearch, setCourseSearch] = useState('')
  const [offerSearch, setOfferSearch] = useState('')

  useEffect(() => {
    fetch('/api/bookings').then(r => r.json()).then(d => setBookings(d.data || [])).catch(() => {})
    fetch('/api/contacts').then(r => r.json()).then(d => setContacts(d.data || [])).catch(() => {})
    fetch('/api/events').then(r => r.json()).then(d => setEvents(d.data || [])).catch(() => {})
  }, [])

  useEffect(() => { localStorage.setItem('dashboard_offers', JSON.stringify(offers)) }, [offers])
  useEffect(() => { localStorage.setItem('dashboard_services', JSON.stringify(services)) }, [services])
  useEffect(() => { localStorage.setItem('dashboard_courses', JSON.stringify(courses)) }, [courses])

  const updateBookingStatus = (id, status) => {
    fetch(`/api/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    setBookings(bookings.map(b => b._id === id ? { ...b, status } : b))
  }
  const deleteBooking = (id) => { fetch(`/api/bookings/${id}`, { method: 'DELETE' }); setBookings(bookings.filter(b => b._id !== id)) }
  const deleteContact = (id) => { fetch(`/api/contacts/${id}`, { method: 'DELETE' }); setContacts(contacts.filter(c => c._id !== id)) }
  const deleteEvent = (id) => { fetch(`/api/events/${id}`, { method: 'DELETE' }); setEvents(events.filter(e => e._id !== id)) }

  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('')
  const [formData, setFormData] = useState({})

  const [editId, setEditId] = useState(null)

  const openForm = (type, item = null) => {
    setFormType(type)
    setShowForm(true)
    if (item) {
      const itemId = type === 'event' ? item._id : item.id
      setEditId(itemId)
      setFormData(type === 'event' ? { ...item, type: item.type || 'post' } : { ...item })
    } else {
      setEditId(null)
      setFormData(type === 'event' ? { type: 'post' } : {})
    }
  }
  const closeForm = () => { setShowForm(false); setFormType(''); setFormData({}); setEditId(null) }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (formType === 'offer') {
      if (editId) setOffers(offers.map(o => o.id === editId ? { ...formData, id: editId } : o))
      else setOffers([...offers, { ...formData, id: Date.now() }])
    }
    else if (formType === 'service') {
      if (editId) setServices(services.map(s => s.id === editId ? { ...formData, id: editId } : s))
      else setServices([...services, { ...formData, id: Date.now() }])
    }
    else if (formType === 'course') {
      if (editId) setCourses(courses.map(c => c.id === editId ? { ...formData, id: editId, image: c.image } : c))
      else setCourses([...courses, { ...formData, id: Date.now(), image: '/course-2.png' }])
    }
    else if (formType === 'event') {
      const method = editId ? 'PUT' : 'POST'
      const url = editId ? `/api/events/${editId}` : '/api/events'
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(r => r.json())
        .then(d => {
          if (d.success) {
            if (editId) setEvents(events.map(e => (e._id === editId || e.id === editId) ? d.data : e))
            else setEvents([...events, d.data])
          }
        })
        .catch(() => {})
    }
    closeForm()
  }

  const statusColors = {
    pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-green-500/15 text-green-400 border-green-500/30',
    completed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
  }
  const statusLabels = { pending: 'قيد الانتظار', confirmed: 'مؤكد', completed: 'مكتمل', cancelled: 'ملغي' }

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
      title: 'عام',
      items: [{ id: 'overview', name: 'نظرة عامة', icon: 'Computer' }],
    },
    {
      title: 'الحجوزات',
      items: [
        { id: 'bookings', name: 'حجوزات الخدمات', icon: 'Calendar' },
        { id: 'course-bookings', name: 'حجوزات الدورات', icon: 'Trophy' },
        { id: 'offer-bookings', name: 'حجوزات العروض', icon: 'Tag' },
      ],
    },
    {
      title: 'المحتوى',
      items: [
        { id: 'offers', name: 'العروض', icon: 'Tag' },
        { id: 'services', name: 'الخدمات', icon: 'Wrench' },
        { id: 'courses', name: 'الدورات', icon: 'Gear' },
        { id: 'events', name: 'الأحداث', icon: 'Bolt' },
        { id: 'reviews', name: 'الآراء', icon: 'Star' },
      ],
    },
    {
      title: 'التواصل',
      items: [{ id: 'contacts', name: 'الرسائل', icon: 'Mail' }],
    },
  ]

  const allTabs = navGroups.flatMap(g => g.items)

  const stats = [
    { label: 'حجوزات الخدمات', value: serviceBookings.length, icon: 'Calendar', color: 'text-blue-400 bg-blue-500/10', tab: 'bookings' },
    { label: 'حجوزات الدورات', value: courseBookings.length, icon: 'Trophy', color: 'text-amber-400 bg-amber-500/10', tab: 'course-bookings' },
    { label: 'حجوزات العروض', value: offerBookings.length, icon: 'Tag', color: 'text-emerald-400 bg-emerald-500/10', tab: 'offer-bookings' },
    { label: 'الرسائل', value: contacts.length, icon: 'Mail', color: 'text-green-400 bg-green-500/10', tab: 'contacts' },
    { label: 'العروض', value: offers.length, icon: 'Tag', color: 'text-amber-400 bg-amber-500/10', tab: 'offers' },
    { label: 'الخدمات', value: services.length, icon: 'Wrench', color: 'text-red-400 bg-red-500/10', tab: 'services' },
    { label: 'الدورات', value: courses.length, icon: 'Gear', color: 'text-purple-400 bg-purple-500/10', tab: 'courses' },
    { label: 'الأحداث', value: events.length, icon: 'Bolt', color: 'text-amber-400 bg-amber-500/10', tab: 'events' },
    { label: 'الآراء', value: reviews.length, icon: 'Star', color: 'text-cyan-400 bg-cyan-500/10', tab: 'reviews' },
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
    <div className="pt-16 min-h-screen bg-dark relative flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/2 rounded-full blur-3xl" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* === Sidebar === */}
        <aside className="w-56 bg-surface/80 backdrop-blur-xl border-l border-overlay/10 fixed right-0 top-16 bottom-0 overflow-y-auto z-40 hidden md:flex flex-col">
          {/* Header */}
          <div className="p-3">
            <div className="flex items-center gap-2.5 mb-4 p-2.5 bg-gradient-to-l from-primary/10 to-transparent rounded-xl border border-overlay/10">
              <div className="relative">
                <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm opacity-50" />
                <Logo className="relative h-8 w-auto flex-shrink-0" showText={false} />
              </div>
              <div>
                <p className="text-heading font-bold text-xs">{username}</p>
                <p className="text-primary text-[9px] font-medium">مدير النظام</p>
              </div>
            </div>

            {/* Nav groups */}
            <nav className="space-y-3">
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

            {/* Bottom actions */}
            <div className="mt-4 pt-3 border-t border-overlay/10 space-y-0.5">
              <Link to="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted hover:text-heading hover:bg-overlay/5 transition-all">
                <Icons.ArrowLeft className="w-3.5 h-3.5" />
                العودة للموقع
              </Link>
              <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-all">
                <Icons.Shield className="w-3.5 h-3.5" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </aside>

        {/* === Mobile top bar === */}
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
            <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-red-400 bg-overlay/5 whitespace-nowrap">
              <Icons.Shield className="w-3.5 h-3.5" />
              خروج
            </button>
          </div>
        </div>

        {/* === Main Content === */}
        <main className="flex-1 md:mr-56 p-4 md:p-5 mt-12 md:mt-4 relative z-10 overflow-y-auto">

          {/* === OVERVIEW === */}
          {activeTab === 'overview' && (
            <div className="animate-fadeIn">
              {/* Header banner */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-l from-primary/15 via-surface to-surface border border-overlay/10 p-4 mb-4">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-primary text-base">👋</span>
                    <h2 className="text-lg font-bold text-heading">أهلاً، {username}</h2>
                  </div>
                  <p className="text-muted text-xs">إليك نظرة عامة على نشاط الموقع اليوم</p>
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
                  title="أحدث حجوزات الخدمات"
                  icon="Calendar"
                  items={serviceBookings}
                  emptyText="لا توجد حجوزات"
                  emptyIcon="Calendar"
                  renderItem={b => <BookingRow key={b._id} b={b} />}
                />
                <ActivityCard
                  title="أحدث حجوزات الدورات"
                  icon="Trophy"
                  items={courseBookings}
                  emptyText="لا توجد حجوزات دورات"
                  emptyIcon="Trophy"
                  renderItem={b => <BookingRow key={b._id} b={b} showCourse />}
                />
              </div>
              <div className="mt-3 grid md:grid-cols-2 gap-3">
                <ActivityCard
                  title="أحدث حجوزات العروض"
                  icon="Tag"
                  items={offerBookings}
                  emptyText="لا توجد حجوزات عروض"
                  emptyIcon="Tag"
                  renderItem={b => <BookingRow key={b._id} b={b} showOffer />}
                />
                <ActivityCard
                  title="أحدث الرسائل"
                  icon="Mail"
                  items={contacts}
                  emptyText="لا توجد رسائل"
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
                subtitle={`${filteredBookings.length} حجز`}
                action={<SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الهاتف..." />}
              />
              <FilterChips items={statusFilters} active={bookingFilter} onChange={setBookingFilter} />
              {filteredBookings.length === 0 ? (
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-overlay/10">
                  <EmptyState icon="Calendar" title="لا توجد حجوزات" sub="لم يتم استلام أي حجوزات خدمات بعد" />
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
                          <StatusSelect value={b.status} onChange={v => updateBookingStatus(b._id, v)} />
                          <DeleteBtn onClick={() => deleteBooking(b._id)} />
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
                subtitle={`${filteredCourseBookings.length} حجز`}
                action={<SearchInput value={courseSearch} onChange={e => setCourseSearch(e.target.value)} placeholder="بحث بالاسم أو الهاتف أو الدورة..." />}
              />
              <FilterChips items={statusFilters} active={courseBookingFilter} onChange={setCourseBookingFilter} />
              {filteredCourseBookings.length === 0 ? (
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-overlay/10">
                  <EmptyState icon="Trophy" title="لا توجد حجوزات دورات" sub="لم يتم استلام أي حجوزات دورات بعد" />
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
                          <StatusSelect value={b.status} onChange={v => updateBookingStatus(b._id, v)} />
                          <DeleteBtn onClick={() => deleteBooking(b._id)} />
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
                subtitle={`${filteredOfferBookings.length} حجز`}
                action={<SearchInput value={offerSearch} onChange={e => setOfferSearch(e.target.value)} placeholder="بحث بالاسم أو الهاتف أو العرض..." />}
              />
              <FilterChips items={statusFilters} active={offerBookingFilter} onChange={setOfferBookingFilter} />
              {filteredOfferBookings.length === 0 ? (
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-overlay/10">
                  <EmptyState icon="Tag" title="لا توجد حجوزات عروض" sub="لم يتم استلام أي حجوزات عروض بعد" />
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
                          <StatusSelect value={b.status} onChange={v => updateBookingStatus(b._id, v)} />
                          <DeleteBtn onClick={() => deleteBooking(b._id)} />
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
              <PageHeader title="رسائل التواصل" subtitle={`${contacts.length} رسالة`} />
              {contacts.length === 0 ? (
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-overlay/10">
                  <EmptyState icon="Mail" title="لا توجد رسائل" sub="لم يتم استلام أي رسائل بعد" />
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
                        <DeleteBtn onClick={() => deleteContact(c._id)} />
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
              <PageHeader title="العروض" subtitle={`${offers.length} عرض`} action={<AddBtn onClick={() => openForm('offer')} />} />
              <div className="space-y-3">
                {offers.map(o => (
                  <div key={o.id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 flex items-center justify-between hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">{renderIcon(o.icon || 'Tag', 'w-5 h-5')}</div>
                      <div>
                        <h3 className="text-heading font-bold text-sm">{o.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-primary text-xs font-bold">{o.newPrice} ج.م</span>
                          {o.oldPrice > 0 && <span className="text-faint text-[10px] line-through">{o.oldPrice}</span>}
                          <span className="text-faint text-[10px]">• خصم {o.discount}%</span>
                          <span className="text-faint text-[10px]">• {o.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <EditBtn onClick={() => openForm('offer', o)} />
                      <DeleteBtn onClick={() => setOffers(offers.filter(x => x.id !== o.id))} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === SERVICES === */}
          {activeTab === 'services' && (
            <div className="animate-fadeIn">
              <PageHeader title="الخدمات" subtitle={`${services.length} خدمة`} action={<AddBtn onClick={() => openForm('service')} />} />
              <div className="space-y-3">
                {services.map(s => (
                  <div key={s.id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 flex items-center justify-between hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">{renderIcon(s.icon || 'Wrench', 'w-5 h-5')}</div>
                      <div>
                        <h3 className="text-heading font-bold text-sm">{s.title}</h3>
                        <p className="text-faint text-xs line-clamp-1 mt-0.5">{s.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <EditBtn onClick={() => openForm('service', s)} />
                      <DeleteBtn onClick={() => setServices(services.filter(x => x.id !== s.id))} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === COURSES === */}
          {activeTab === 'courses' && (
            <div className="animate-fadeIn">
              <PageHeader title="الدورات" subtitle={`${courses.length} دورة`} action={<AddBtn onClick={() => openForm('course')} />} />
              <div className="space-y-3">
                {courses.map(c => (
                  <div key={c.id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 flex items-center justify-between hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">{renderIcon('Gear', 'w-5 h-5')}</div>
                      <div>
                        <h3 className="text-heading font-bold text-sm">{c.title}</h3>
                        <p className="text-faint text-xs mt-0.5"><span className="text-primary">{c.duration}</span> • {c.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <EditBtn onClick={() => openForm('course', c)} />
                      <DeleteBtn onClick={() => setCourses(courses.filter(x => x.id !== c.id))} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === EVENTS === */}
          {activeTab === 'events' && (
            <div className="animate-fadeIn">
              <PageHeader title="الأحداث" subtitle={`${events.length} حدث`} action={<AddBtn onClick={() => openForm('event')} />} />
              {events.length === 0 ? (
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-overlay/10">
                  <EmptyState icon="Bolt" title="لا توجد أحداث بعد" sub="أضف حدثاً جديداً ليظهر في الصفحة الرئيسية" />
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
                              {ev.type === 'offer' ? 'عرض محدود' : 'بوست'}
                            </span>
                          </div>
                          <p className="text-faint text-xs line-clamp-1 mt-0.5">{ev.description}</p>
                          {ev.type === 'offer' && ev.discount > 0 && <p className="text-faint text-[10px] mt-0.5">خصم {ev.discount}% • {ev.newPrice} ج.م</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                      <EditBtn onClick={() => openForm('event', ev)} />
                      <DeleteBtn onClick={() => deleteEvent(ev._id)} />
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
              <PageHeader title="آراء العملاء" subtitle={`${reviews.length} رأي`} />
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
                      <DeleteBtn onClick={() => setReviews(reviews.filter((_, idx) => idx !== i))} />
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
                <h3 className="text-heading font-bold text-lg">{editId ? 'تعديل' : 'إضافة'} {formType === 'offer' ? 'عرض' : formType === 'service' ? 'خدمة' : formType === 'course' ? 'دورة' : 'حدث'}</h3>
              </div>
              <button onClick={closeForm} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-heading hover:bg-overlay/10 transition-all">✕</button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              {formType === 'event' && (
                <div className="flex gap-2 p-1 bg-overlay/5 rounded-xl">
                  <button type="button" onClick={() => setFormData({ ...formData, type: 'post' })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${formData.type !== 'offer' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted'}`}>
                    <span className="flex items-center justify-center gap-1.5"><Icons.Mail className="w-3.5 h-3.5" /> بوست</span>
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, type: 'offer' })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${formData.type === 'offer' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted'}`}>
                    <span className="flex items-center justify-center gap-1.5"><Icons.Tag className="w-3.5 h-3.5" /> عرض محدود</span>
                  </button>
                </div>
              )}
              <input type="text" placeholder={formType === 'offer' ? 'عنوان العرض' : formType === 'service' ? 'اسم الخدمة' : formType === 'course' ? 'اسم الدورة' : 'عنوان الحدث'} value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required className={inputCls} />
              <textarea placeholder="الوصف" value={formData.desc || formData.description || ''} onChange={e => setFormData({ ...formData, [formType === 'service' ? 'description' : formType === 'event' ? 'description' : 'desc']: e.target.value })} required rows={2} className={inputCls + ' resize-none'} />
              {formType === 'event' && (
                <div>
                  <label className="text-faint text-xs mb-2 block">صورة الحدث</label>
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-overlay/15 rounded-xl py-6 cursor-pointer hover:border-primary/40 transition-all duration-300 bg-overlay/5 hover:bg-overlay/10">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {formData.image ? <img src={formData.image} alt="" className="w-16 h-16 rounded-lg object-cover" /> : <Icons.Search className="w-5 h-5" />}
                    </div>
                    {formData.image ? (
                      <span className="text-green-400 text-xs font-medium">تم اختيار الصورة ✓</span>
                    ) : (
                      <span className="text-faint text-xs">اضغط لرفع صورة من جهازك</span>
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
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" placeholder="سعر قديم" value={formData.oldPrice || ''} onChange={e => setFormData({ ...formData, oldPrice: +e.target.value })} required className={inputCls} />
                    <input type="number" placeholder="سعر جديد" value={formData.newPrice || ''} onChange={e => setFormData({ ...formData, newPrice: +e.target.value })} required className={inputCls} />
                    <input type="number" placeholder="خصم %" value={formData.discount || ''} onChange={e => setFormData({ ...formData, discount: +e.target.value })} required className={inputCls} />
                  </div>
                  <input type="text" placeholder="التصنيف" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} required className={inputCls} />
                  <select value={formData.icon || 'Wrench'} onChange={e => setFormData({ ...formData, icon: e.target.value })} className={inputCls}>
                    {iconOptions.map(ic => <option key={ic} value={ic} className="bg-dark">{ic}</option>)}
                  </select>
                </>
              )}
              {formType === 'course' && <input type="text" placeholder="المدة" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} required className={inputCls} />}
              {formType === 'service' && (
                <select value={formData.icon || 'Wrench'} onChange={e => setFormData({ ...formData, icon: e.target.value })} className={inputCls}>
                  {iconOptions.map(ic => <option key={ic} value={ic} className="bg-dark">{ic}</option>)}
                </select>
              )}
              {formType === 'event' && formData.type === 'offer' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="سعر قديم" value={formData.oldPrice || ''} onChange={e => {
                      const oldPrice = +e.target.value
                      const newPrice = formData.newPrice || 0
                      const discount = oldPrice > 0 ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0
                      setFormData({ ...formData, oldPrice, discount })
                    }} className={inputCls} />
                    <input type="number" placeholder="سعر جديد" value={formData.newPrice || ''} onChange={e => {
                      const newPrice = +e.target.value
                      const oldPrice = formData.oldPrice || 0
                      const discount = oldPrice > 0 ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0
                      setFormData({ ...formData, newPrice, discount })
                    }} className={inputCls} />
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl px-3 py-2.5 flex items-center justify-between">
                    <span className="text-faint text-xs">نسبة الخصم المحتسبة</span>
                    <span className="text-primary font-bold text-sm">{formData.discount || 0}%</span>
                  </div>
                  <label className="block">
                    <span className="text-faint text-xs mb-1.5 block">تاريخ الانتهاء</span>
                    <input type="date" value={formData.expiryDate || ''} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} className={inputCls} />
                  </label>
                </>
              )}
              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all duration-300 text-sm hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2">
                <Icons.CheckCircle className="w-4 h-4" />
                حفظ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
