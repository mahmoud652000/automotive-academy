<div align="right" dir="rtl">

# 🚗 Automotive Academy

<div align="center">

<img src="client/public/logo.png" alt="Automotive Academy Logo" width="120" />

### منصة متكاملة لإدارة مركز صيانة السيارات

تصميم احترافي عربي RTL مع وضع داكن — يجمع بين إدارة الحجوزات، العروض، الدورات، المقالات، المعرض، ونظام النشرة البريدية في مكان واحد.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## ✨ المميزات

### 🖥️ واجهة المستخدم
- **تصميم Dark Mode** احترافي مع دعم Light Mode
- **ثنائي اللغة** (عربي / إنجليزي) مع دعم كامل لـ RTL/LTR
- **متجاوب بالكامل** مع جميع الأحجام (موبايل، تابلت، ديسكتوب)
- **أنيميشن وتأثيرات** انتقالية سلسة باستخدام Framer Motion
- **شاشة ترحيب (Intro)** متحركة عند الدخول

### 📄 الصفحات
| الصفحة | الوصف |
|--------|-------|
| 🏠 **الرئيسية** | Hero متحرك + حجز سريع + آراء العملاء + أحداث + علامات السيارات |
| 🔧 **الخدمات** | عرض جميع الخدمات بتصنيفات وأيقونات |
| 📅 **الحجز** | حجز موعد بخطوات متعددة (Multi-step Form) |
| 🏷️ **العروض** | شبكة عروض مع فلترة بالتصنيفات + نشرة بريدية |
| 🎓 **الدورات** | دورات تدريبية مع نظام تسجيل |
| 🖼️ **المعرض** | صور قبل/بعد بمنزلق تفاعلي + فيديوهات يوتيوب |
| 📰 **المقالات** | مقالات مع تصنيفات ووسوم وتصفية |
| ℹ️ **من نحن** | قصة الشركة + المؤسس + القيم + الشركاء |
| 📞 **تواصل معنا** | نموذج تواصل + خريطة Google + أفرع |

### ⚙️ لوحة التحكم (Dashboard)
- **نظرة عامة** — إحصائيات وآخر النشاطات
- **إدارة الحجوزات** — خدمات، دورات، عروض (تتبع الحالة، طباعة PDF)
- **إدارة المحتوى** — عروض، خدمات، دورات، أحداث، معرض، مقالات، آراء
- **المشتركون** — قائمة مشتركي النشرة البريدية مع حالاتهم
- **الرسائل** — رسائل العملاء
- **الإعدادات** — معلومات الموقع، صور الخلفيات، النصوص، الأمان، مفتاح Resend API
- **مصادقة** — تسجيل دخول محمي

### 📧 نظام النشرة البريدية
- **اشتراك Double Opt-in** — تأكيد مزدوج عبر البريد الإلكتروني
- **إرسال تلقائي** — عند إضافة حدث/عرض/مقال جديد
- **إلغاء اشتراك** — رابط في كل إيميل
- **قوالب HTML** احترافية بالعربية

### 🔌 API كامل
```
/api/bookings     — الحجوزات (CRUD + Status)
/api/contacts     — الرسائل
/api/services     — الخدمات (CRUD)
/api/offers       — العروض (CRUD)
/api/courses      — الدورات (CRUD)
/api/events       — الأحداث (CRUD)
/api/gallery      — المعرض (CRUD)
/api/articles     — المقالات (CRUD)
/api/reviews      — الآراء (CRUD)
/api/settings     — الإعدادات
/api/upload       — رفع الصور
/api/subscribers  — النشرة البريدية (Subscribe/Confirm/Unsubscribe)
```

---

## 🛠️ التقنيات المستخدمة

| الفئة | التقنية |
|------|---------|
| **Frontend** | React 18, Vite 5, React Router DOM 6, Tailwind CSS 3 |
| **Animation** | Framer Motion |
| **Icons** | Lucide React (مخصص) |
| **Backend** | Node.js, Express 4 |
| **Database** | SQLite (better-sqlite3) |
| **File Upload** | Multer |
| **Email** | Resend API (النشرة البريدية) |
| **Deployment** | Vercel (Serverless) |
| **Fonts** | Cairo (Google Fonts) |

---

## 🚀 التشغيل

### 1️⃣ تثبيت الحزم
```bash
npm run install:all
```

### 2️⃣ التشغيل في وضع التطوير
```bash
# تشغيل Frontend + Backend معاً
npm run dev

# أو تشغيل كل جزء منفصلاً
npm run dev:client    # Frontend → http://localhost:5173
npm run dev:server    # Backend  → http://localhost:3000
```

### 3️⃣ البناء للإنتاج
```bash
npm run build
```

### 4️⃣ النشر على Vercel
```bash
# المشروع جاهز للنشر على Vercel
# ملف vercel.json مُعد مسبقاً
```

---

## ⚙️ الإعداد

### متغيرات البيئة (`server/.env`)
```env
# Resend API — للحصول على المفتاح: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxx

# عنوان المُرسل (اختياري — افتراضي: onboarding@resend.dev)
RESEND_FROM_EMAIL=Automotive Academy <onboarding@resend.dev>

# رابط الواجهة الأمامية (يُستخدم في روابط الإيميل)
FRONTEND_URL=http://localhost:5173
```

> 💡 يمكن أيضاً إضافة `RESEND_API_KEY` من لوحة التحكم → الإعدادات → الأمان

---

## 📁 هيكل المشروع

```
automotive-academy/
├── api/
│   └── index.js                # نقطة دخول Vercel Serverless
├── client/
│   ├── public/                 # صور وأصول ثابتة
│   ├── src/
│   │   ├── components/         # مكونات مشتركة (Navbar, Footer, ...)
│   │   ├── context/           # React Context (Auth, Theme, Language, Settings)
│   │   ├── data/              # بيانات ثابتة + الترجمات
│   │   ├── pages/             # صفحات الموقع
│   │   ├── App.jsx            # التوجيه (Routes)
│   │   ├── main.jsx           # نقطة الدخول
│   │   └── index.css          # الأنماط العامة
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── routes/                # مسارات API
│   ├── services/
│   │   └── email.js           # خدمة إرسال البريد (Resend)
│   ├── uploads/               # الصور المرفوعة
│   ├── db.js                  # قاعدة البيانات + الـ Helpers
│   ├── server.js              # خادم Express
│   ├── .env                   # متغيرات البيئة
│   └── package.json
├── vercel.json                # إعدادات النشر
└── package.json               # سكربتات مشتركة
```

---

## 📱 التجاوب

الموقع متجاوب بالكامل مع جميع أحجام الشاشات:

| الجهاز | نقطة الكسر | السلوك |
|--------|-----------|--------|
| 📱 موبايل | `< 640px` | عمود واحد، قائمة جانبية منسدلة، نصوص أصغر |
| 📱 تابلت | `640px - 1024px` | عمودين، شبكات متوسطة |
| 💻 ديسكتوب | `> 1024px` | متعدد الأعمدة، قائمة أفقية كاملة |

---

## 🔒 الأمان

- كلمة مرور لوحة التحكم قابلة للتغيير من الإعدادات
- التحقق من صحة المدخلات في كل API
- منع تكرار الاشتراك في النشرة البريدية (UNIQUE constraint)
- Tokens عشوائية آمنة (crypto.randomUUID) للتأكيد وإلغاء الاشتراك

---

<div align="center">

---

### 👨‍💻 المطور

**محمود البنا**

[![WhatsApp](https://img.shields.io/badge/WhatsApp-201024949382-25D366?style=flat-square&logo=whatsapp&logoColor=white)](https://wa.me/201024949382)

---

© 2025 Automotive Academy — جميع الحقوق محفوظة

</div>

</div>
</think><tool_call>read_file<arg_key>absolute_path</arg_key><arg_value>C:\Users\Mahmoud\Desktop\automotive-academy\README.md