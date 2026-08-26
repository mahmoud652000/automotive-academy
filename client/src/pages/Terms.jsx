import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import CTABanner from '../components/CTABanner'
import Logo from '../components/Logo'

export default function Terms() {
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
          <h1 className="text-2xl sm:text-3xl font-bold text-heading mb-2">الشروط والأحكام</h1>
          <p className="text-muted text-sm">آخر تحديث: يناير 2025</p>
        </div>
      </section>

      <section className="py-8 sm:py-10 bg-surface">
        <div className="container-custom max-w-3xl">
          <div className="space-y-5 text-body text-sm leading-relaxed">
            <div>
              <h2 className="text-heading font-bold text-base mb-2">1. قبول الشروط</h2>
              <p className="text-muted">باستخدامك لموقع Automotive Academy وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام الموقع.</p>
            </div>

            <div>
              <h2 className="text-heading font-bold text-base mb-2">2. الخدمات المقدمة</h2>
              <p className="text-muted mb-2">يقدم Automotive Academy خدمات صيانة وإصلاح السيارات بما في ذلك:</p>
              <ul className="list-disc pr-5 space-y-1 text-muted">
                <li>صيانة وإصلاح الميكانيكا والعفشة</li>
                <li>السمكرة والدهان</li>
                <li>الكهرباء وتشخيص الأعطال</li>
                <li>صيانة التكييف</li>
                <li>كشوف البيع والشراء</li>
                <li>الدورات التدريبية</li>
              </ul>
            </div>

            <div>
              <h2 className="text-heading font-bold text-base mb-2">3. الحجوزات والمواعيد</h2>
              <ul className="list-disc pr-5 space-y-1 text-muted">
                <li>يجب الحضور قبل الموعد بـ 10 دقائق على الأقل</li>
                <li>في حالات الإلغاء، يرجى الإبلاغ قبل الموعد بـ 24 ساعة على الأقل</li>
                <li>نحتفظ بالحق في إعادة جدولة المواعيد في حالات الطوارئ</li>
                <li>الحجز لا يضمن توفر الخدمة الفورية، قد تتطلب بعض الخدمات وقتاً أطول</li>
              </ul>
            </div>

            <div>
              <h2 className="text-heading font-bold text-base mb-2">4. الأسعار والمدفوعات</h2>
              <ul className="list-disc pr-5 space-y-1 text-muted">
                <li>الأسعار المعروضة على الموقع قابلة للتغيير دون إشعار مسبق</li>
                <li>يتم تحديد السعر النهائي بعد فحص السيارة</li>
                <li>يتم استخدام قطع غيار أصلية، وقد تتأثر الأسعار بتوفر القطع</li>
                <li>الضمان على الخدمات يغطي العيوب الناتجة عن الإصلاح لمدة 6 أشهر</li>
              </ul>
            </div>

            <div>
              <h2 className="text-heading font-bold text-base mb-2">5. مسؤولية العميل</h2>
              <ul className="list-disc pr-5 space-y-1 text-muted">
                <li>تقديم معلومات صحيحة وكاملة عند الحجز</li>
                <li>إزالة الأغراض الشخصية من السيارة قبل تسليمها</li>
                <li>سحب السيارة خلال 48 ساعة من إشعار انتهاء الإصلاح</li>
                <li>الموافقة على الفحص والتشخيص قبل بدء الإصلاح</li>
              </ul>
            </div>

            <div>
              <h2 className="text-heading font-bold text-base mb-2">6. النشرة البريدية</h2>
              <p className="text-muted">عند الاشتراك في النشرة البريدية، ستصلك رسائل دورية بالعروض والأخبار. يمكنك إلغاء الاشتراك في أي وقت من خلال الرابط الموجود في كل رسالة.</p>
            </div>

            <div>
              <h2 className="text-heading font-bold text-base mb-2">7. حد المسؤولية</h2>
              <p className="text-muted">لا يتحمل Automotive Academy مسؤولية أي أضرار غير مباشرة أو عرضية. مسؤوليتنا تقتصر على قيمة الخدمة المقدمة. لا نتحمل مسؤولية الأغراض الشخصية المتروكة داخل السيارة.</p>
            </div>

            <div>
              <h2 className="text-heading font-bold text-base mb-2">8. التواصل معنا</h2>
              <p className="text-muted">لأي استفسارات حول الشروط والأحكام:</p>
              <ul className="list-disc pr-5 space-y-1 text-muted mt-2">
                <li>الهاتف: 01103197077</li>
                <li>البريد الإلكتروني: academyoa7@gmail.com</li>
                <li>العنوان: 6 أكتوبر – ميدان فودافون – محطة شِل أوت</li>
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
