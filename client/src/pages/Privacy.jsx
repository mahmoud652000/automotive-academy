import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import CTABanner from '../components/CTABanner'
import Logo from '../components/Logo'

export default function Privacy() {
  const { t } = useLanguage()
  return (
    <div className="pt-16 sm:pt-20 lg:pt-20">
      <section className="relative py-10 sm:py-12 md:py-14 bg-dark overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="container-custom relative z-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/20 rounded-full blur-lg" />
              <Logo className="relative h-14 w-auto" showText={false} />
            </div>
          </div>
          <span className="text-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 mb-2">
            <span className="w-8 h-px bg-primary" />
            Automotive Academy
            <span className="w-8 h-px bg-primary" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-heading mb-2">سياسة الخصوصية</h1>
          <p className="text-muted text-sm">آخر تحديث: يناير 2025</p>
        </div>
      </section>

      <section className="py-8 sm:py-10 bg-surface">
        <div className="container-custom max-w-3xl">
          <div className="space-y-5 text-body text-sm leading-relaxed">
            <div>
              <h2 className="text-heading font-bold text-base mb-2">1. مقدمة</h2>
              <p className="text-muted">نحن في Automotive Academy نولي اهتماماً كبيراً بخصوصية عملائنا. توضح سياسة الخصوصية هذه كيف نقوم بجمع واستخدام وحماية المعلومات الشخصية التي تقدمها لنا عند استخدام موقعنا الإلكتروني وخدماتنا.</p>
            </div>

            <div>
              <h2 className="text-heading font-bold text-base mb-2">2. المعلومات التي نجمعها</h2>
              <p className="text-muted mb-2">قد نقوم بجمع المعلومات التالية:</p>
              <ul className="list-disc pr-5 space-y-1 text-muted">
                <li>الاسم ورقم الهاتف عند الحجز أو التواصل معنا</li>
                <li>البريد الإلكتروني عند الاشتراك في النشرة البريدية</li>
                <li>معلومات عن سيارتك (الموديل، نوع الخدمة) لتحسين服务质量</li>
                <li>معلومات تقنية تلقائية (عنوان IP، نوع المتصفح) لتحسين تجربة المستخدم</li>
              </ul>
            </div>

            <div>
              <h2 className="text-heading font-bold text-base mb-2">3. كيف نستخدم معلوماتك</h2>
              <ul className="list-disc pr-5 space-y-1 text-muted">
                <li>تأكيد الحجوزات والتواصل معك بشأن الخدمات</li>
                <li>إرسال العروض والتحديثات (للمشتركين في النشرة البريدية فقط)</li>
                <li>تحسين خدماتنا وتجربة المستخدم على الموقع</li>
                <li>الرد على استفساراتك وطلباتك</li>
              </ul>
            </div>

            <div>
              <h2 className="text-heading font-bold text-base mb-2">4. حماية المعلومات</h2>
              <p className="text-muted">نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. لا نقوم ببيع أو تأجير معلوماتك الشخصية لأي طرف ثالث.</p>
            </div>

            <div>
              <h2 className="text-heading font-bold text-base mb-2">5. ملفات تعريف الارتباط (Cookies)</h2>
              <p className="text-muted">يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة المستخدم وتذكر تفضيلاتك (مثل اللغة والوضع الليلي/النهاري). يمكنك تعطيل ملفات تعريف الارتباط من إعدادات متصفحك.</p>
            </div>

            <div>
              <h2 className="text-heading font-bold text-base mb-2">6. حقوقك</h2>
              <p className="text-muted">لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها. يمكنك أيضاً إلغاء الاشتراك في النشرة البريدية في أي وقت من خلال الرابط الموجود في كل رسالة.</p>
            </div>

            <div>
              <h2 className="text-heading font-bold text-base mb-2">7. التواصل معنا</h2>
              <p className="text-muted">إذا كان لديك أي أسئلة حول سياسة الخصوصية، يمكنك التواصل معنا عبر:</p>
              <ul className="list-disc pr-5 space-y-1 text-muted mt-2">
                <li>الهاتف: 01103197077</li>
                <li>البريد الإلكتروني: academyoa7@gmail.com</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-lg transition-all duration-300 text-sm hover:shadow-lg hover:shadow-primary/30">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  )
}
