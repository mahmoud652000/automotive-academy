import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { useSettings } from '../context/SettingsContext'
import Icons from '../components/Icons'
import Logo from '../components/Logo'
import { siteInfo } from '../data/content'

const renderIcon = (name, className = 'w-5 h-5') => {
  const Icon = Icons[name]
  return Icon ? <Icon className={className} /> : null
}

const iconOptions = ['Wrench', 'Gear', 'Shield', 'Bolt', 'Car', 'Oil', 'Computer', 'Brake', 'Snowflake', 'Search', 'Tag', 'Trophy']

const iconLabels = {
  Wrench: 'ميكانيكا',
  Gear: 'قطع غيار',
  Shield: 'حماية',
  Bolt: 'كهرباء',
  Car: 'عفشة',
  Oil: 'زيت',
  Computer: 'كمبيوتر',
  Brake: 'فرامل',
  Snowflake: 'تكييف',
  Search: 'فحص',
  Tag: 'سعر',
  Trophy: 'جودة',
}

const serviceCategories = [
  'ميكانيكا', 'عفشة', 'كهرباء', 'تكييف', 'فرامل', 'صيانة دورية',
  'سمكرة ودهان', 'إطارات', 'زيوت', 'كشوف', 'تنظيف', 'كمبيوتر وتشخيص', 'عام'
]

const offerCategoryMap = {
  'كشوف': ['كشف شامل', 'كشف محرك', 'كشف عفشة', 'كشف قير', 'كشف كهرباء', 'كشف تكييف', 'كشف فرامل', 'كشف بيع وشراء'],
  'ميكانيكا': ['محرك', 'قير', 'زيوت وفلاتر', 'طلمبة بنزين', 'دورة تبريد', 'حساسات'],
  'عفشة': ['مساعدات', 'نوابض', 'أذرع تحكم', 'رولمان بلي', 'مفصلات', 'مقود'],
  'كهرباء': ['بطارية', 'دينمو', 'إنارة', 'أسلاك', 'حساسات', 'فيوزات'],
  'تكييف': ['شحن فريون', 'تنظيف تكييف', 'كومبروسر', 'مروحة تكييف', 'خراطيم', 'فلاتر تكييف'],
  'فرامل': ['تيل أمامي', 'تيل خلفي', 'طنابير', 'أقراص', 'هيدروليك', 'ABS'],
  'صيانة': ['صيانة دورية', 'تغيير زيت', 'فلتر هواء', 'فحص شامل', 'ضبط محرك', 'صيانة وقائية'],
  'تنظيف': ['غسيل خارجي', 'غسيل داخلي', 'تلميع', 'تعقيم', 'حماية سطح', 'تفصيل داخلي'],
  'سمكرة ودهان': ['سمكرة', 'دهان', 'صقل', 'إصلاح خدوش', 'حماية'],
  'إطارات': ['تغيير إطارات', 'ميزان', 'ضبط زوايا', 'إصلاح ثقب', 'تخزين إطارات'],
  'كمبيوتر وتشخيص': ['فحص كمبيوتر', 'برمجة', 'مسح أكواد', 'إعادة ضبط', 'تشخيص أعطال'],
}

const apiCall = async (url, method = 'GET', body = null) => {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(url, opts)
  const data = await res.json()
  if (!res.ok || data.success === false) throw new Error(data.message || 'حدث خطأ في العملية')
  return data
}

const uploadFile = async (file) => {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('فشل رفع الملف')
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'فشل رفع الملف')
  return data.data.url
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
    <Icons.Trash className="w-3.5 h-3.5" />
    {t('dash.delete')}
  </button>
)

const ViewBtn = ({ onClick, t }) => (
  <button
    onClick={onClick}
    className="text-emerald-400 hover:text-emerald-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/10 transition-all flex items-center gap-1"
  >
    <Icons.Eye className="w-3.5 h-3.5" />
    {t('dash.view')}
  </button>
)

const EditBtn = ({ onClick, t }) => (
  <button
    onClick={onClick}
    className="text-blue-400 hover:text-blue-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10 transition-all flex items-center gap-1"
  >
    <Icons.Edit className="w-3.5 h-3.5" />
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
  const { settings } = useSettings()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('overview')

  const [bookings, setBookings] = useState([])
  const [contacts, setContacts] = useState([])
  const [offers, setOffers] = useState([])
  const [services, setServices] = useState([])
  const [courses, setCourses] = useState([])
  const [reviews, setReviews] = useState([])
  const [events, setEvents] = useState([])
  const [gallery, setGallery] = useState([])
  const [articles, setArticles] = useState([])
  const [subscribers, setSubscribers] = useState([])

  const [bookingFilter, setBookingFilter] = useState('all')
  const [courseBookingFilter, setCourseBookingFilter] = useState('all')
  const [offerBookingFilter, setOfferBookingFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [courseSearch, setCourseSearch] = useState('')
  const [offerSearch, setOfferSearch] = useState('')
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  // Settings state — initialized from SettingsContext
  const [settingsForm, setSettingsForm] = useState({})
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  useEffect(() => {
    if (!settingsLoaded && settings) {
      setSettingsForm({ ...settings })
      setSettingsLoaded(true)
    }
  }, [settings, settingsLoaded])

  const handleSettingsChange = (key, value) => {
    setSettingsForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSettingsUpload = async (key, file) => {
    try {
      const url = await uploadFile(file)
      setSettingsForm(prev => ({ ...prev, [key]: url }))
    } catch (e) { showToast(e.message) }
  }

  const handleSaveSettings = async () => {
    try {
      await apiCall('/api/settings', 'PUT', settingsForm)
      showToast(t('dash.settingsSaved'), 'success')
      // Reload to apply settings everywhere
      setTimeout(() => window.location.reload(), 1200)
    } catch (e) { showToast(e.message) }
  }

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Fetch all data on mount
  useEffect(() => {
    const init = async () => {
      try {
        const results = await Promise.allSettled([
          apiCall('/api/bookings'),
          apiCall('/api/contacts'),
          apiCall('/api/events'),
          apiCall('/api/offers'),
          apiCall('/api/services'),
          apiCall('/api/courses'),
          apiCall('/api/gallery'),
          apiCall('/api/articles'),
          apiCall('/api/reviews'),
          apiCall('/api/subscribers'),
        ])
        const val = (r) => r.status === 'fulfilled' ? r.value : { data: [] }
        const [bk, ct, ev, of, sv, cr, gl, ar, rv, subs] = results.map(val)
        setBookings(bk.data || [])
        setContacts(ct.data || [])
        setEvents(ev.data || [])
        setOffers(of.data || [])
        setServices(sv.data || [])
        setCourses(cr.data || [])
        setGallery(gl.data || [])
        setArticles(ar.data || [])
        setReviews(rv.data || [])
        setSubscribers(subs.data || [])
      } catch (e) {
        console.error('Fetch failed:', e.message)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const updateBookingStatus = async (id, status) => {
    try {
      await apiCall(`/api/bookings/${id}`, 'PATCH', { status })
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b))
    } catch (e) { showToast(e.message) }
  }
  const deleteBooking = async (id) => {
    try {
      await apiCall(`/api/bookings/${id}`, 'DELETE')
      setBookings(prev => prev.filter(b => b._id !== id))
      showToast(t('dash.deletedSuccess'), 'success')
    } catch (e) { showToast(e.message) }
  }
  const deleteContact = async (id) => {
    try {
      await apiCall(`/api/contacts/${id}`, 'DELETE')
      setContacts(prev => prev.filter(c => c._id !== id))
      showToast(t('dash.deletedSuccess'), 'success')
    } catch (e) { showToast(e.message) }
  }
  const deleteEvent = async (id) => {
    try {
      await apiCall(`/api/events/${id}`, 'DELETE')
      setEvents(prev => prev.filter(e => e._id !== id))
      showToast(t('dash.deletedSuccess'), 'success')
    } catch (e) { showToast(e.message) }
  }
  const deleteOffer = async (id) => {
    try {
      await apiCall(`/api/offers/${id}`, 'DELETE')
      setOffers(prev => prev.filter(o => o._id !== id))
      showToast(t('dash.deletedSuccess'), 'success')
    } catch (e) { showToast(e.message) }
  }
  const deleteService = async (id) => {
    try {
      await apiCall(`/api/services/${id}`, 'DELETE')
      setServices(prev => prev.filter(s => s._id !== id))
      showToast(t('dash.deletedSuccess'), 'success')
    } catch (e) { showToast(e.message) }
  }
  const deleteCourse = async (id) => {
    try {
      await apiCall(`/api/courses/${id}`, 'DELETE')
      setCourses(prev => prev.filter(c => c._id !== id))
      showToast(t('dash.deletedSuccess'), 'success')
    } catch (e) { showToast(e.message) }
  }
  const deleteGalleryItem = async (id) => {
    try {
      await apiCall(`/api/gallery/${id}`, 'DELETE')
      setGallery(prev => prev.filter(g => g._id !== id))
      showToast(t('dash.deletedSuccess'), 'success')
    } catch (e) { showToast(e.message) }
  }
  const deleteArticle = async (id) => {
    try {
      await apiCall(`/api/articles/${id}`, 'DELETE')
      setArticles(prev => prev.filter(a => a._id !== id))
      showToast(t('dash.deletedSuccess'), 'success')
    } catch (e) { showToast(e.message) }
  }
  const deleteSubscriber = async (id) => {
    try {
      await apiCall(`/api/subscribers/${id}`, 'DELETE')
      setSubscribers(prev => prev.filter(s => s._id !== id))
      showToast(t('dash.deletedSuccess'), 'success')
    } catch (e) { showToast(e.message) }
  }

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

  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [previewType, setPreviewType] = useState('')

  const openPreview = (type, item) => {
    setPreviewType(type)
    setPreviewData(item)
    setShowPreview(true)
  }
  const closePreview = () => { setShowPreview(false); setPreviewData(null); setPreviewType('') }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formType === 'offer') {
        if (editId) {
          const d = await apiCall(`/api/offers/${editId}`, 'PUT', formData)
          if (d.success) setOffers(prev => prev.map(o => o._id === editId ? d.data : o))
        } else {
          const d = await apiCall('/api/offers', 'POST', formData)
          if (d.success) setOffers(prev => [...prev, d.data])
        }
      }
      else if (formType === 'service') {
        if (editId) {
          const d = await apiCall(`/api/services/${editId}`, 'PUT', formData)
          if (d.success) setServices(prev => prev.map(s => s._id === editId ? d.data : s))
        } else {
          const d = await apiCall('/api/services', 'POST', formData)
          if (d.success) setServices(prev => [...prev, d.data])
        }
      }
      else if (formType === 'course') {
        if (editId) {
          const d = await apiCall(`/api/courses/${editId}`, 'PUT', formData)
          if (d.success) setCourses(prev => prev.map(c => c._id === editId ? d.data : c))
        } else {
          const d = await apiCall('/api/courses', 'POST', formData)
          if (d.success) setCourses(prev => [...prev, d.data])
        }
      }
      else if (formType === 'event') {
        const method = editId ? 'PUT' : 'POST'
        const url = editId ? `/api/events/${editId}` : '/api/events'
        const d = await apiCall(url, method, formData)
        if (d.success) {
          if (editId) setEvents(prev => prev.map(e => e._id === editId ? d.data : e))
          else setEvents(prev => [...prev, d.data])
        }
      }
      else if (formType === 'gallery') {
        if (editId) {
          const d = await apiCall(`/api/gallery/${editId}`, 'PUT', formData)
          if (d.success) setGallery(prev => prev.map(g => g._id === editId ? d.data : g))
        } else {
          const d = await apiCall('/api/gallery', 'POST', formData)
          if (d.success) setGallery(prev => [...prev, d.data])
        }
      }
      else if (formType === 'article') {
        const submitData = { ...formData }
        // Auto-generate tags from article content
        const stopWords = new Set([
          'في', 'من', 'إلى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك', 'التي', 'الذي',
          'ما', 'لا', 'لن', 'لم', 'قد', 'كل', 'بعض', 'أو', 'أم', 'ثم', 'إذا', 'حتى', 'لكن',
          'بين', 'عند', 'لدى', 'أن', 'إن', 'كان', 'كانت', 'يكون', 'تكون', 'هو', 'هي', 'نحن',
          'أنا', 'أنت', 'هم', 'هما', 'هؤلاء', 'هناك', 'هنا', 'كما', 'حيث', 'كي', 'لذلك',
          'بعد', 'قبل', 'عند', 'فقط', 'أيضا', 'و', 'أو', 'ف', 'ب', 'ل', 'ك', 'ال', 'أي',
          'بعض', 'غير', 'مثل', 'لأن', 'حتى', 'وقد', 'فقد', 'التي', 'الذي', 'الذين', 'اللاتي',
          'اللواتي', 'اللذان', 'اللذين', 'إلى', 'علي', 'في', 'عن', 'مع', 'the', 'a', 'an', 'and',
          'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are',
          'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
          'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'this', 'that',
          'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which',
          'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
          'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
          'than', 'too', 'very', 'just', 'also'
        ])
        const text = `${submitData.title || ''} ${submitData.content || ''}`
        const words = text
          .replace(/[^\u0600-\u06FFa-zA-Z\s]/g, ' ')
          .split(/\s+/)
          .map(w => w.trim())
          .filter(w => w.length >= 3 && !stopWords.has(w.toLowerCase()))
        const freq = {}
        words.forEach(w => {
          const lw = w.toLowerCase()
          freq[lw] = (freq[lw] || 0) + 1
        })
        submitData.tags = Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(e => e[0])

        if (editId) {
          const d = await apiCall(`/api/articles/${editId}`, 'PUT', submitData)
          if (d.success) setArticles(prev => prev.map(a => a._id === editId ? d.data : a))
        } else {
          const d = await apiCall('/api/articles', 'POST', submitData)
          if (d.success) setArticles(prev => [...prev, d.data])
        }
      }
      showToast(editId ? 'تم التحديث بنجاح' : 'تمت الإضافة بنجاح', 'success')
    } catch (e) {
      showToast(e.message)
    }
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
    const q = search.toLowerCase()
    const matchSearch = !search || b.name?.toLowerCase().includes(q) || b.phone?.includes(q) || b.service?.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const filteredCourseBookings = courseBookings.filter(b => {
    const matchFilter = courseBookingFilter === 'all' || b.status === courseBookingFilter
    const q = courseSearch.toLowerCase()
    const matchSearch = !courseSearch || b.name?.toLowerCase().includes(q) || b.phone?.includes(q) || b.course?.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const filteredOfferBookings = offerBookings.filter(b => {
    const matchFilter = offerBookingFilter === 'all' || b.status === offerBookingFilter
    const q = offerSearch.toLowerCase()
    const matchSearch = !offerSearch || b.name?.toLowerCase().includes(q) || b.phone?.includes(q) || b.offer?.toLowerCase().includes(q)
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
        { id: 'articles', name: t('dash.articles'), icon: 'BookOpen' },
        { id: 'reviews', name: t('dash.reviews'), icon: 'Star' },
      ],
    },
    {
      title: t('dash.groupContact'),
      items: [
        { id: 'contacts', name: t('dash.contacts'), icon: 'Mail' },
        { id: 'subscribers', name: t('dash.subscribers'), icon: 'Mail' },
      ],
    },
    {
      title: t('dash.groupSettings'),
      items: [{ id: 'settings', name: t('dash.settings'), icon: 'Gear' }],
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
    { label: t('dash.articles'), value: articles.length, icon: 'BookOpen', color: 'text-teal-400 bg-teal-500/10', tab: 'articles' },
    { label: t('dash.reviews'), value: reviews.length, icon: 'Star', color: 'text-cyan-400 bg-cyan-500/10', tab: 'reviews' },
    { label: t('dash.subscribers'), value: subscribers.length, icon: 'Mail', color: 'text-indigo-400 bg-indigo-500/10', tab: 'subscribers' },
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
      <header className="relative z-50 flex items-center justify-between h-16 px-4 md:px-5 bg-surface border-b border-overlay/10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Logo className="h-9 w-auto flex-shrink-0" showText={false} />
          <div>
            <h1 className="text-heading font-bold text-sm leading-tight">{lang === 'ar' ? (settings.site_name || siteInfo.name) : (settings.site_name_en || siteInfo.nameEn)}</h1>
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
        <aside className="w-56 bg-surface border-l border-overlay/10 fixed right-0 top-16 bottom-0 overflow-y-auto z-40 hidden md:flex flex-col">
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
        <div className="md:hidden fixed top-16 right-0 left-0 z-40 bg-surface border-b border-overlay/10 overflow-x-auto">
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

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-faint text-xs">{t('dash.loading')}</p>
              </div>
            </div>
          )}

          {/* === OVERVIEW === */}
          {activeTab === 'overview' && !loading && (
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-4">
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
          {activeTab === 'bookings' && !loading && (
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
          {activeTab === 'course-bookings' && !loading && (
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
          {activeTab === 'offer-bookings' && !loading && (
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
          {activeTab === 'contacts' && !loading && (
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
          {activeTab === 'offers' && !loading && (
            <div className="animate-fadeIn">
              <PageHeader title={t('dash.offers')} subtitle={`${offers.length} ${t('dash.offerCount')}`} action={<AddBtn onClick={() => openForm('offer')} t={t} />} />
              <div className="space-y-3">
                {offers.map(o => (
                  <div key={o._id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 flex items-center justify-between hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-3">
                      {o.image ? (
                        <img src={o.image} alt={o.title} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">{renderIcon(o.icon || 'Tag', 'w-5 h-5')}</div>
                      )}
                      <div>
                        <h3 className="text-heading font-bold text-sm">{o.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          {o.discount > 0 && <span className="text-primary text-xs font-bold">{o.discount}% {t('dash.discountPlaceholder')}</span>}
                          <span className="text-faint text-[10px]">• {o.category}{o.subcategory ? ` / ${o.subcategory}` : ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <ViewBtn onClick={() => openPreview('offer', o)} t={t} />
                      <EditBtn onClick={() => openForm('offer', o)} t={t} />
                      <DeleteBtn onClick={() => deleteOffer(o._id)} t={t} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === SERVICES === */}
          {activeTab === 'services' && !loading && (
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
                      <ViewBtn onClick={() => openPreview('service', s)} t={t} />
                      <EditBtn onClick={() => openForm('service', s)} t={t} />
                      <DeleteBtn onClick={() => deleteService(s._id)} t={t} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === COURSES === */}
          {activeTab === 'courses' && !loading && (
            <div className="animate-fadeIn">
              <PageHeader title={t('dash.courses')} subtitle={`${courses.length} ${t('dash.courseCount')}`} action={<AddBtn onClick={() => openForm('course')} t={t} />} />
              <div className="space-y-3">
                {courses.map(c => (
                  <div key={c._id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 flex items-center justify-between hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-3">
                      {c.image ? (
                        <img src={c.image} alt={c.title} className="w-11 h-11 rounded-xl object-cover" />
                      ) : (
                        <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">{renderIcon('Gear', 'w-5 h-5')}</div>
                      )}
                      <div>
                        <h3 className="text-heading font-bold text-sm">{c.title}</h3>
                        <p className="text-faint text-xs mt-0.5"><span className="text-primary">{c.duration}</span> • {c.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <ViewBtn onClick={() => openPreview('course', c)} t={t} />
                      <EditBtn onClick={() => openForm('course', c)} t={t} />
                      <DeleteBtn onClick={() => deleteCourse(c._id)} t={t} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === EVENTS === */}
          {activeTab === 'events' && !loading && (
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
                      <ViewBtn onClick={() => openPreview('event', ev)} t={t} />
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
          {activeTab === 'gallery' && !loading && (
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
                          /(?:youtube\.com|youtu\.be)/.test(g.videoUrl) ? (
                            <iframe
                              src={g.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/').split('&')[0]}
                              title={g.title}
                              className="w-full h-full"
                              allowFullScreen
                            />
                          ) : (
                            <video src={g.videoUrl} className="w-full h-full object-cover bg-black" controls />
                          )
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
                          <ViewBtn onClick={() => openPreview('gallery', g)} t={t} />
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

          {/* === ARTICLES === */}
          {activeTab === 'articles' && !loading && (
            <div className="animate-fadeIn">
              <PageHeader title={t('dash.articles')} subtitle={`${articles.length} ${t('dash.articleCount')}`} action={<AddBtn onClick={() => openForm('article')} t={t} />} />
              {articles.length === 0 ? (
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-overlay/10">
                  <EmptyState icon="BookOpen" title={t('dash.noArticles')} sub={t('dash.noArticlesSub')} />
                </div>
              ) : (
                <div className="space-y-3">
                  {articles.map(ar => (
                    <div key={ar._id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 flex items-center justify-between hover:border-primary/20 transition-all duration-500">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {ar.image ? (
                          <img src={ar.image} alt={ar.title} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-11 h-11 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400 flex-shrink-0">
                            <Icons.BookOpen className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="text-heading font-bold text-sm truncate">{ar.title}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-faint text-[10px] bg-overlay/10 px-1.5 py-0.5 rounded">{ar.category}</span>
                            {ar.excerpt && <p className="text-faint text-xs line-clamp-1">{ar.excerpt}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <ViewBtn onClick={() => openPreview('article', ar)} t={t} />
                        <EditBtn onClick={() => openForm('article', ar)} t={t} />
                        <DeleteBtn onClick={() => deleteArticle(ar._id)} t={t} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === REVIEWS === */}
          {activeTab === 'reviews' && !loading && (
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
                      <DeleteBtn onClick={async () => { try { await apiCall(`/api/reviews/${r._id}`, 'DELETE'); setReviews(reviews.filter((_, idx) => idx !== i)); showToast(t('dash.deletedSuccess'), 'success') } catch (e) { showToast(e.message) } }} t={t} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === SUBSCRIBERS === */}
          {activeTab === 'subscribers' && !loading && (
            <div className="animate-fadeIn">
              <PageHeader title={t('dash.subscribers')} subtitle={`${subscribers.length} ${t('dash.subscriberCount')}`} />
              {subscribers.length === 0 ? (
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-overlay/10">
                  <EmptyState icon="Mail" title={t('dash.noSubscribers')} sub={t('dash.noSubscribersSub')} />
                </div>
              ) : (
                <div className="space-y-3">
                  {subscribers.map(s => (
                    <div key={s._id} className="group bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-4 border border-overlay/10 flex items-center justify-between hover:border-primary/20 transition-all duration-500">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 flex-shrink-0">
                          <Icons.Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-heading font-bold text-sm">{s.email}</h3>
                          <p className="text-faint text-[10px]">{s.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-1 rounded border ${
                          s.status === 'confirmed' ? 'bg-green-500/15 text-green-400 border-green-500/30' :
                          s.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' :
                          'bg-gray-500/15 text-gray-400 border-gray-500/30'
                        }`}>
                          {s.status === 'confirmed' ? t('dash.statusConfirmedSub') :
                           s.status === 'pending' ? t('dash.statusPending') :
                           t('dash.statusUnsubscribed')}
                        </span>
                        <DeleteBtn onClick={() => deleteSubscriber(s._id)} t={t} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === SETTINGS === */}
          {activeTab === 'settings' && !loading && (
            <div className="animate-fadeIn">
              <PageHeader title={t('dash.settings')} subtitle="" />

              <div className="space-y-6">

                {/* Site Info */}
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-5 border border-overlay/10">
                  <h3 className="text-heading font-bold text-sm mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary">{renderIcon('Computer', 'w-4 h-4')}</span>
                    {t('dash.settingsSiteInfo')}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'اسم الموقع (عربي)' : 'Site Name (AR)'}</label>
                      <input type="text" value={settingsForm.site_name || ''} onChange={e => handleSettingsChange('site_name', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'اسم الموقع (إنجليزي)' : 'Site Name (EN)'}</label>
                      <input type="text" value={settingsForm.site_name_en || ''} onChange={e => handleSettingsChange('site_name_en', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'الشعار (عربي)' : 'Slogan (AR)'}</label>
                      <input type="text" value={settingsForm.site_slogan || ''} onChange={e => handleSettingsChange('site_slogan', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'الشعار (إنجليزي)' : 'Slogan (EN)'}</label>
                      <input type="text" value={settingsForm.site_slogan_en || ''} onChange={e => handleSettingsChange('site_slogan_en', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'الهاتف' : 'Phone'}</label>
                      <input type="text" value={settingsForm.site_phone || ''} onChange={e => handleSettingsChange('site_phone', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</label>
                      <input type="text" value={settingsForm.site_whatsapp || ''} onChange={e => handleSettingsChange('site_whatsapp', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                      <input type="text" value={settingsForm.site_email || ''} onChange={e => handleSettingsChange('site_email', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'ساعات العمل (عربي)' : 'Working Hours (AR)'}</label>
                      <input type="text" value={settingsForm.site_working_hours || ''} onChange={e => handleSettingsChange('site_working_hours', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'ساعات العمل (إنجليزي)' : 'Working Hours (EN)'}</label>
                      <input type="text" value={settingsForm.site_working_hours_en || ''} onChange={e => handleSettingsChange('site_working_hours_en', e.target.value)} className={inputCls} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'العنوان (عربي)' : 'Address (AR)'}</label>
                      <input type="text" value={settingsForm.site_address || ''} onChange={e => handleSettingsChange('site_address', e.target.value)} className={inputCls} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'العنوان (إنجليزي)' : 'Address (EN)'}</label>
                      <input type="text" value={settingsForm.site_address_en || ''} onChange={e => handleSettingsChange('site_address_en', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'اللوجو' : 'Logo'}</label>
                      <label className="flex items-center gap-2 border-2 border-dashed border-overlay/15 rounded-xl p-3 cursor-pointer hover:border-primary/40 transition-all bg-overlay/5">
                        {settingsForm.site_logo ? <img src={settingsForm.site_logo} alt="" className="w-8 h-8 rounded object-contain" /> : <Icons.Search className="w-4 h-4 text-faint" />}
                        <span className="text-faint text-xs">{settingsForm.site_logo ? '✓' : (lang === 'ar' ? 'رفع لوجو' : 'Upload Logo')}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) handleSettingsUpload('site_logo', f) }} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Background Images */}
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-5 border border-overlay/10">
                  <h3 className="text-heading font-bold text-sm mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary">{renderIcon('Search', 'w-4 h-4')}</span>
                    {t('dash.settingsBgImages')}
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'bg_home', label: lang === 'ar' ? 'الرئيسية' : 'Home' },
                      { key: 'bg_about', label: lang === 'ar' ? 'من نحن' : 'About' },
                      { key: 'bg_booking', label: lang === 'ar' ? 'الحجز' : 'Booking' },
                      { key: 'bg_contact', label: lang === 'ar' ? 'تواصل معنا' : 'Contact' },
                      { key: 'bg_courses', label: lang === 'ar' ? 'الدورات' : 'Courses' },
                      { key: 'bg_login', label: lang === 'ar' ? 'الدخول' : 'Login' },
                      { key: 'bg_services', label: lang === 'ar' ? 'الخدمات' : 'Services' },
                      { key: 'bg_offers', label: lang === 'ar' ? 'العروض' : 'Offers' },
                      { key: 'bg_articles', label: lang === 'ar' ? 'المقالات' : 'Articles' },
                    ].map(bg => (
                      <div key={bg.key} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-overlay/5 rounded-xl p-3">
                        <div className="flex items-center gap-3 flex-1">
                          {settingsForm[bg.key] ? (
                            <img src={settingsForm[bg.key]} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-16 h-12 rounded-lg bg-overlay/10 flex items-center justify-center flex-shrink-0"><Icons.Search className="w-4 h-4 text-faint" /></div>
                          )}
                          <div className="flex-1">
                            <p className="text-heading text-xs font-bold">{bg.label}</p>
                            <label className="inline-flex items-center gap-1 text-primary text-[10px] cursor-pointer hover:text-primary-light mt-1">
                              <Icons.Edit className="w-3 h-3" />
                              {lang === 'ar' ? 'تغيير الصورة' : 'Change Image'}
                              <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) handleSettingsUpload(bg.key, f) }} />
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <label className="text-faint text-[10px] mb-0.5">X (%)</label>
                            <input type="range" min="0" max="100" value={settingsForm[`${bg.key}_x`] || '50'} onChange={e => handleSettingsChange(`${bg.key}_x`, e.target.value)} className="w-20 accent-primary" />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-faint text-[10px] mb-0.5">Y (%)</label>
                            <input type="range" min="0" max="100" value={settingsForm[`${bg.key}_y`] || '50'} onChange={e => handleSettingsChange(`${bg.key}_y`, e.target.value)} className="w-20 accent-primary" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hero Texts */}
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-5 border border-overlay/10">
                  <h3 className="text-heading font-bold text-sm mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary">{renderIcon('BookOpen', 'w-4 h-4')}</span>
                    {t('dash.settingsHeroTexts')}
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-overlay/5 rounded-xl p-3">
                      <p className="text-faint text-[10px] mb-2">{lang === 'ar' ? 'الرئيسية' : 'Home'}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <input type="text" placeholder={lang === 'ar' ? 'العنوان 1' : 'Title 1'} value={settingsForm.hero_home_title1 || ''} onChange={e => handleSettingsChange('hero_home_title1', e.target.value)} className={inputCls} />
                        <input type="text" placeholder={lang === 'ar' ? 'العنوان 2' : 'Title 2'} value={settingsForm.hero_home_title2 || ''} onChange={e => handleSettingsChange('hero_home_title2', e.target.value)} className={inputCls} />
                      </div>
                      <textarea placeholder={lang === 'ar' ? 'الوصف' : 'Description'} value={settingsForm.hero_home_desc || ''} onChange={e => handleSettingsChange('hero_home_desc', e.target.value)} rows={2} className={inputCls + ' resize-none mt-2'} />
                    </div>
                    <div className="bg-overlay/5 rounded-xl p-3">
                      <p className="text-faint text-[10px] mb-2">{lang === 'ar' ? 'من نحن' : 'About'}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <input type="text" placeholder={lang === 'ar' ? 'العنوان' : 'Title'} value={settingsForm.hero_about_title || ''} onChange={e => handleSettingsChange('hero_about_title', e.target.value)} className={inputCls} />
                        <input type="text" placeholder={lang === 'ar' ? 'العنوان الفرعي' : 'Subtitle'} value={settingsForm.hero_about_subtitle || ''} onChange={e => handleSettingsChange('hero_about_subtitle', e.target.value)} className={inputCls} />
                      </div>
                    </div>
                    <div className="bg-overlay/5 rounded-xl p-3">
                      <p className="text-faint text-[10px] mb-2">{lang === 'ar' ? 'تواصل معنا' : 'Contact'}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <input type="text" placeholder={lang === 'ar' ? 'العنوان' : 'Title'} value={settingsForm.hero_contact_title || ''} onChange={e => handleSettingsChange('hero_contact_title', e.target.value)} className={inputCls} />
                        <input type="text" placeholder={lang === 'ar' ? 'العنوان الفرعي' : 'Subtitle'} value={settingsForm.hero_contact_desc || ''} onChange={e => handleSettingsChange('hero_contact_desc', e.target.value)} className={inputCls} />
                      </div>
                    </div>
                    <div className="bg-overlay/5 rounded-xl p-3">
                      <p className="text-faint text-[10px] mb-2">{lang === 'ar' ? 'الخدمات' : 'Services'}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <input type="text" placeholder={lang === 'ar' ? 'العلامة' : 'Label'} value={settingsForm.hero_services_label || ''} onChange={e => handleSettingsChange('hero_services_label', e.target.value)} className={inputCls} />
                        <input type="text" placeholder={lang === 'ar' ? 'العنوان' : 'Title'} value={settingsForm.hero_services_title || ''} onChange={e => handleSettingsChange('hero_services_title', e.target.value)} className={inputCls} />
                      </div>
                      <textarea placeholder={lang === 'ar' ? 'الوصف' : 'Description'} value={settingsForm.hero_services_desc || ''} onChange={e => handleSettingsChange('hero_services_desc', e.target.value)} rows={2} className={inputCls + ' resize-none mt-2'} />
                    </div>
                    <div className="bg-overlay/5 rounded-xl p-3">
                      <p className="text-faint text-[10px] mb-2">{lang === 'ar' ? 'العروض' : 'Offers'}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <input type="text" placeholder={lang === 'ar' ? 'العنوان 1' : 'Title 1'} value={settingsForm.hero_offers_title1 || ''} onChange={e => handleSettingsChange('hero_offers_title1', e.target.value)} className={inputCls} />
                        <input type="text" placeholder={lang === 'ar' ? 'العنوان 2' : 'Title 2'} value={settingsForm.hero_offers_title2 || ''} onChange={e => handleSettingsChange('hero_offers_title2', e.target.value)} className={inputCls} />
                      </div>
                      <textarea placeholder={lang === 'ar' ? 'الوصف' : 'Description'} value={settingsForm.hero_offers_desc || ''} onChange={e => handleSettingsChange('hero_offers_desc', e.target.value)} rows={2} className={inputCls + ' resize-none mt-2'} />
                    </div>
                    <div className="bg-overlay/5 rounded-xl p-3">
                      <p className="text-faint text-[10px] mb-2">{lang === 'ar' ? 'المقالات' : 'Articles'}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <input type="text" placeholder={lang === 'ar' ? 'العلامة' : 'Label'} value={settingsForm.hero_articles_label || ''} onChange={e => handleSettingsChange('hero_articles_label', e.target.value)} className={inputCls} />
                        <input type="text" placeholder={lang === 'ar' ? 'العنوان' : 'Title'} value={settingsForm.hero_articles_title || ''} onChange={e => handleSettingsChange('hero_articles_title', e.target.value)} className={inputCls} />
                      </div>
                      <textarea placeholder={lang === 'ar' ? 'الوصف' : 'Description'} value={settingsForm.hero_articles_desc || ''} onChange={e => handleSettingsChange('hero_articles_desc', e.target.value)} rows={2} className={inputCls + ' resize-none mt-2'} />
                    </div>
                  </div>
                </div>

                {/* Workshop Video */}
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-5 border border-overlay/10">
                  <h3 className="text-heading font-bold text-sm mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary">{renderIcon('Play', 'w-4 h-4')}</span>
                    {t('dash.settingsVideo')}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="flex-1 w-full">
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'رابط الفيديو (يوتيوب أو رابط مباشر)' : 'Video URL (YouTube or direct link)'}</label>
                      <input type="text" placeholder="https://youtube.com/watch?v=... أو /workshop-video.mp4" value={settingsForm.workshop_video || ''} onChange={e => handleSettingsChange('workshop_video', e.target.value)} className={inputCls} />
                      <label className="inline-flex items-center gap-1 text-primary text-[10px] cursor-pointer hover:text-primary-light mt-2">
                        <Icons.Edit className="w-3 h-3" />
                        {lang === 'ar' ? 'أو رفع فيديو من الجهاز' : 'Or upload from device'}
                        <input type="file" accept="video/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) handleSettingsUpload('workshop_video', f) }} />
                      </label>
                    </div>
                    {settingsForm.workshop_video && /(?:youtube\.com|youtu\.be)/.test(settingsForm.workshop_video) && (
                      <div className="w-full sm:w-48 rounded-lg overflow-hidden border border-overlay/10">
                        <iframe src={settingsForm.workshop_video.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/').split('&')[0]} title="preview" className="w-full h-28" allowFullScreen />
                      </div>
                    )}
                  </div>
                </div>

                {/* Security */}
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl p-5 border border-overlay/10">
                  <h3 className="text-heading font-bold text-sm mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary">{renderIcon('Shield', 'w-4 h-4')}</span>
                    {t('dash.settingsSecurity')}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                      <input type="text" value={settingsForm.dashboard_user || ''} onChange={e => handleSettingsChange('dashboard_user', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                      <input type="text" value={settingsForm.dashboard_pass || ''} onChange={e => handleSettingsChange('dashboard_pass', e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-faint text-xs mb-1 block">{lang === 'ar' ? 'مفتاح Resend API (للنشرة البريدية)' : 'Resend API Key (Newsletter)'}</label>
                    <input type="text" placeholder="re_xxxxxxxxxxxxx" value={settingsForm.resend_api_key || ''} onChange={e => handleSettingsChange('resend_api_key', e.target.value)} className={inputCls} />
                  </div>
                </div>

                {/* Save Button */}
                <button onClick={handleSaveSettings} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2">
                  <Icons.CheckCircle className="w-4 h-4" />
                  {t('dash.settingsSaveAll')}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* === ADD FORM MODAL === */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70" onClick={closeForm}>
          <div className="bg-gradient-to-b from-surface to-[#0a0a0f] rounded-2xl p-6 border border-overlay/20 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {renderIcon(formType === 'offer' ? 'Tag' : formType === 'service' ? 'Wrench' : formType === 'course' ? 'Gear' : formType === 'article' ? 'BookOpen' : 'Bolt', 'w-4 h-4')}
                </div>
                <h3 className="text-heading font-bold text-lg">{editId ? t('dash.editTitle') : t('dash.addTitle')} {formType === 'offer' ? t('dash.offerLabel') : formType === 'service' ? t('dash.serviceLabel') : formType === 'course' ? t('dash.courseLabel') : formType === 'article' ? t('dash.articleLabel') : t('dash.eventLabel')}</h3>
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
              <input type="text" placeholder={formType === 'offer' ? t('dash.offerLabel') : formType === 'service' ? t('dash.serviceLabel') : formType === 'course' ? t('dash.courseLabel') : formType === 'article' ? t('dash.articleTitle') : t('dash.eventLabel')} value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required className={inputCls} />
              <textarea placeholder={formType === 'article' ? t('dash.articleExcerpt') : t('dash.descPlaceholder')} value={formData.desc || formData.description || formData.excerpt || ''} onChange={e => setFormData({ ...formData, [formType === 'service' ? 'description' : formType === 'event' ? 'description' : formType === 'article' ? 'excerpt' : 'desc']: e.target.value })} required rows={2} className={inputCls + ' resize-none'} />
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
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        if (!file) return
                        try {
                          const url = await uploadFile(file)
                          setFormData({ ...formData, image: url })
                        } catch (err) { showToast(err.message) }
                      }}
                    />
                  </label>
                </div>
              )}
              {formType === 'offer' && (
                <>
                  <input type="number" min="0" placeholder={t('dash.discountPlaceholder')} value={formData.discount ?? ''} onChange={e => setFormData({ ...formData, discount: +e.target.value })} className={inputCls} />
                  <select value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value, subcategory: '' })} required className={inputCls}>
                    <option value="" className="bg-dark">{t('dash.categoryPlaceholder')}</option>
                    {Object.keys(offerCategoryMap).map(cat => (
                      <option key={cat} value={cat} className="bg-dark">{cat}</option>
                    ))}
                  </select>
                  {formData.category && offerCategoryMap[formData.category] && (
                    <select value={formData.subcategory || ''} onChange={e => setFormData({ ...formData, subcategory: e.target.value })} className={inputCls}>
                      <option value="" className="bg-dark">{lang === 'ar' ? 'اختر التصنيف الفرعي' : 'Select subcategory'}</option>
                      {offerCategoryMap[formData.category].map(sub => (
                        <option key={sub} value={sub} className="bg-dark">{sub}</option>
                      ))}
                    </select>
                  )}
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
                        onChange={async (e) => {
                          const file = e.target.files[0]
                          if (!file) return
                          try {
                            const url = await uploadFile(file)
                            setFormData({ ...formData, image: url })
                          } catch (err) { showToast(err.message) }
                        }}
                      />
                    </label>
                  </div>
                </>
              )}
              {formType === 'course' && (
                <>
                  <input type="text" placeholder={t('dash.durationPlaceholder')} value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} required className={inputCls} />
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
                        onChange={async (e) => {
                          const file = e.target.files[0]
                          if (!file) return
                          try {
                            const url = await uploadFile(file)
                            setFormData({ ...formData, image: url })
                          } catch (err) { showToast(err.message) }
                        }}
                      />
                    </label>
                  </div>
                </>
              )}

              {/* Gallery Form */}
              {formType === 'gallery' && (
                <>
                  <div className="flex gap-2 p-1 bg-overlay/5 rounded-xl">
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'photo' })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${formData.type !== 'video' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted'}`}>
                      {lang === 'ar' ? 'صورة قبل/بعد' : 'Before/After Photo'}
                    </button>
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'video' })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${formData.type === 'video' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted'}`}>
                      {lang === 'ar' ? 'رفع فيديو' : 'Upload Video'}
                    </button>
                  </div>

                  {formData.type === 'video' && (
                    <div>
                      <label className="text-faint text-xs mb-1.5 block">{lang === 'ar' ? 'رابط يوتيوب' : 'YouTube URL'}</label>
                      <input
                        type="text"
                        placeholder={lang === 'ar' ? 'https://youtube.com/watch?v=...' : 'https://youtube.com/watch?v=...'}
                        value={formData.videoUrl || ''}
                        onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                        className={inputCls}
                      />
                      {formData.videoUrl && /(?:youtube\.com|youtu\.be)/.test(formData.videoUrl) && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-overlay/10">
                          <iframe
                            src={formData.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/').split('&')[0]}
                            title="preview"
                            className="w-full h-32"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
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
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files[0]; if (!file) return
                            try { const url = await uploadFile(file); setFormData({ ...formData, beforeImage: url }) } catch (err) { showToast(err.message) }
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
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files[0]; if (!file) return
                            try { const url = await uploadFile(file); setFormData({ ...formData, afterImage: url }) } catch (err) { showToast(err.message) }
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
                <>
                  <select value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputCls}>
                    <option value="" className="bg-dark">{lang === 'ar' ? 'اختر التصنيف' : 'Select category'}</option>
                    {serviceCategories.map(cat => (
                      <option key={cat} value={cat} className="bg-dark">{cat}</option>
                    ))}
                  </select>
                  <select value={formData.icon || 'Wrench'} onChange={e => setFormData({ ...formData, icon: e.target.value })} className={inputCls}>
                    {Object.entries(iconLabels).map(([val, label]) => (
                      <option key={val} value={val} className="bg-dark">{label}</option>
                    ))}
                  </select>
                  <div>
                    <label className="text-faint text-xs mb-2 block">{lang === 'ar' ? 'صورة الخدمة' : 'Service Image'}</label>
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
                        onChange={async (e) => {
                          const file = e.target.files[0]
                          if (!file) return
                          try {
                            const url = await uploadFile(file)
                            setFormData({ ...formData, image: url })
                          } catch (err) { showToast(err.message) }
                        }}
                      />
                    </label>
                  </div>
                </>
              )}
              {formType === 'article' && (
                <>
                  <textarea placeholder={t('dash.articleContentPlaceholder')} value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })} required rows={5} className={inputCls + ' resize-none'} />
                  <select value={formData.category || 'صيانة'} onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputCls}>
                    <option value="صيانة" className="bg-dark">{lang === 'ar' ? 'صيانة' : 'Maintenance'}</option>
                    <option value="ميكانيكا" className="bg-dark">{lang === 'ar' ? 'ميكانيكا' : 'Mechanics'}</option>
                    <option value="عفشة" className="bg-dark">{lang === 'ar' ? 'عفشة' : 'Suspension'}</option>
                    <option value="فرامل" className="bg-dark">{lang === 'ar' ? 'فرامل' : 'Brakes'}</option>
                    <option value="تكييف" className="bg-dark">{lang === 'ar' ? 'تكييف' : 'AC'}</option>
                    <option value="كهرباء" className="bg-dark">{lang === 'ar' ? 'كهرباء' : 'Electrical'}</option>
                    <option value="زيوت" className="bg-dark">{lang === 'ar' ? 'زيوت' : 'Oils'}</option>
                    <option value="إطارات" className="bg-dark">{lang === 'ar' ? 'إطارات' : 'Tires'}</option>
                    <option value="دهان" className="bg-dark">{lang === 'ar' ? 'دهان' : 'Paint'}</option>
                    <option value="سمكرة" className="bg-dark">{lang === 'ar' ? 'سمكرة' : 'Bodywork'}</option>
                    <option value="كشوف" className="bg-dark">{lang === 'ar' ? 'كشوف' : 'Inspections'}</option>
                    <option value="تنظيف" className="bg-dark">{lang === 'ar' ? 'تنظيف' : 'Cleaning'}</option>
                    <option value="نصائح" className="bg-dark">{lang === 'ar' ? 'نصائح' : 'Tips'}</option>
                    <option value="عام" className="bg-dark">{lang === 'ar' ? 'عام' : 'General'}</option>
                  </select>
                  <div>
                    <label className="text-faint text-xs mb-2 block">{t('dash.articleImage')}</label>
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
                        onChange={async (e) => {
                          const file = e.target.files[0]
                          if (!file) return
                          try {
                            const url = await uploadFile(file)
                            setFormData({ ...formData, image: url })
                          } catch (err) { showToast(err.message) }
                        }}
                      />
                    </label>
                  </div>
                </>
              )}
              {formType === 'event' && formData.type === 'offer' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

      {/* Toast notifications */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-fadeIn">
          <div className={`px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {toast.type === 'success' ? <Icons.CheckCircle className="w-4 h-4" /> : <Icons.Shield className="w-4 h-4" />}
            {toast.msg}
          </div>
        </div>
      )}

      {/* === PREVIEW MODAL === */}
      {showPreview && previewData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70" onClick={closePreview}>
          <div className="bg-gradient-to-b from-surface to-[#0a0a0f] rounded-2xl p-6 border border-overlay/20 max-w-md w-full shadow-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                  <Icons.Eye className="w-4 h-4" />
                </div>
                <h3 className="text-heading font-bold text-lg">{t('dash.view')}</h3>
              </div>
              <button onClick={closePreview} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-heading hover:bg-overlay/10 transition-all">✕</button>
            </div>

            {/* Offer Preview */}
            {previewType === 'offer' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">{renderIcon(previewData.icon || 'Tag', 'w-7 h-7')}</div>
                  <div>
                    <h3 className="text-heading font-bold text-base">{previewData.title}</h3>
                    <span className="text-faint text-xs">{previewData.category}{previewData.subcategory ? ` / ${previewData.subcategory}` : ''}</span>
                  </div>
                </div>
                {previewData.image && <img src={previewData.image} alt={previewData.title} className="w-full h-40 rounded-xl object-cover" />}
                {previewData.discount > 0 && (
                  <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-3">
                    <span className="text-primary font-bold text-2xl">{previewData.discount}%</span>
                    <span className="text-muted text-xs">{t('dash.discountPlaceholder')}</span>
                  </div>
                )}
                {previewData.desc && <p className="text-body text-sm leading-relaxed">{previewData.desc}</p>}
              </div>
            )}

            {/* Service Preview */}
            {previewType === 'service' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">{renderIcon(previewData.icon || 'Wrench', 'w-7 h-7')}</div>
                  <div>
                    <h3 className="text-heading font-bold text-base">{previewData.title}</h3>
                    <span className="text-faint text-xs">{previewData.category || (lang === 'ar' ? 'عام' : 'General')}</span>
                  </div>
                </div>
                {previewData.image && <img src={previewData.image} alt={previewData.title} className="w-full h-40 rounded-xl object-cover" />}
                <p className="text-body text-sm leading-relaxed">{previewData.description}</p>
              </div>
            )}

            {/* Course Preview */}
            {previewType === 'course' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {previewData.image ? (
                    <img src={previewData.image} alt={previewData.title} className="w-14 h-14 rounded-xl object-cover" />
                  ) : (
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">{renderIcon('Gear', 'w-7 h-7')}</div>
                  )}
                  <div>
                    <h3 className="text-heading font-bold text-base">{previewData.title}</h3>
                    <span className="text-primary text-xs font-medium">{previewData.duration}</span>
                  </div>
                </div>
                {previewData.image && <img src={previewData.image} alt={previewData.title} className="w-full h-40 rounded-xl object-cover" />}
                <p className="text-body text-sm leading-relaxed">{previewData.desc}</p>
              </div>
            )}

            {/* Event Preview */}
            {previewType === 'event' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {previewData.image ? (
                    <img src={previewData.image} alt={previewData.title} className="w-14 h-14 rounded-xl object-cover" />
                  ) : (
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">{renderIcon('Bolt', 'w-7 h-7')}</div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-heading font-bold text-base">{previewData.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${previewData.type === 'offer' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'}`}>
                      {previewData.type === 'offer' ? t('dash.limitedOffer') : t('dash.post')}
                    </span>
                  </div>
                </div>
                {previewData.image && <img src={previewData.image} alt={previewData.title} className="w-full h-40 rounded-xl object-cover" />}
                <p className="text-body text-sm leading-relaxed">{previewData.description}</p>
                {previewData.type === 'offer' && previewData.discount > 0 && (
                  <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-3">
                    <span className="text-primary font-bold text-2xl">{previewData.discount}%</span>
                    <div className="flex flex-col">
                      <span className="text-muted text-xs">{t('dash.discountPlaceholder')}</span>
                      {previewData.oldPrice > 0 && (
                        <span className="text-faint text-[10px] line-through">{previewData.oldPrice} • {previewData.newPrice}</span>
                      )}
                    </div>
                    {previewData.expiryDate && <span className="text-faint text-[10px] mr-auto">{t('dash.expiryDate')}: {previewData.expiryDate}</span>}
                  </div>
                )}
              </div>
            )}

            {/* Gallery Preview */}
            {previewType === 'gallery' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${previewData.type === 'photo' ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'}`}>
                    {previewData.type === 'photo' ? (lang === 'ar' ? 'صورة' : 'Photo') : (lang === 'ar' ? 'فيديو' : 'Video')}
                  </span>
                  <h3 className="text-heading font-bold text-base">{previewData.title}</h3>
                </div>
                <span className="text-faint text-xs">{previewData.category}</span>
                {previewData.type === 'photo' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-faint text-[10px] mb-1">{lang === 'ar' ? 'قبل' : 'Before'}</p>
                      {previewData.beforeImage && <img src={previewData.beforeImage} alt="before" className="w-full h-32 rounded-xl object-cover" />}
                    </div>
                    <div>
                      <p className="text-faint text-[10px] mb-1">{lang === 'ar' ? 'بعد' : 'After'}</p>
                      {previewData.afterImage && <img src={previewData.afterImage} alt="after" className="w-full h-32 rounded-xl object-cover" />}
                    </div>
                  </div>
                ) : (
                  previewData.videoUrl && (
                    /(?:youtube\.com|youtu\.be)/.test(previewData.videoUrl) ? (
                      <iframe
                        src={previewData.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/').split('&')[0]}
                        title={previewData.title}
                        className="w-full h-48 rounded-xl"
                        allowFullScreen
                      />
                    ) : (
                      <video src={previewData.videoUrl} className="w-full h-48 rounded-xl object-cover bg-black" controls />
                    )
                  )
                )}
              </div>
            )}

            {/* Article Preview */}
            {previewType === 'article' && (
              <div className="space-y-4">
                {previewData.image && <img src={previewData.image} alt={previewData.title} className="w-full h-40 rounded-xl object-cover" />}
                <div className="flex items-center gap-2">
                  <span className="text-faint text-[10px] bg-overlay/10 px-1.5 py-0.5 rounded">{previewData.category}</span>
                  <h3 className="text-heading font-bold text-base">{previewData.title}</h3>
                </div>
                {previewData.excerpt && <p className="text-muted text-sm font-medium">{previewData.excerpt}</p>}
                {previewData.content && <p className="text-body text-sm leading-relaxed whitespace-pre-wrap">{previewData.content}</p>}
                {previewData.tags && previewData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {previewData.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] text-faint bg-overlay/5 px-2 py-0.5 rounded">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
