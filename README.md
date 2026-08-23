# Automotive Academy

موقع متكامل لمركز صيانة سيارات بتصميم Dark Mode عربي RTL.

## التقنيات
- **Frontend:** React 18 + Vite + React Router DOM + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **الخط:** Cairo (Google Fonts)

## التشغيل

### 1. تثبيت الحزم
```bash
cd automotive-academy
npm run install:all
```

### 2. تشغيل المشروع (Frontend + Backend)
```bash
npm run dev
```

أو تشغيل كل جزء منفصلاً:
```bash
# Frontend (port 5173)
npm run dev:client

# Backend (port 5000)
npm run dev:server
```

### 3. إعداد قاعدة البيانات
تأكد من تشغيل MongoDB محلياً على المنفذ 27017، أو عدّل `MONGODB_URI` في `server/.env`

## هيكل المشروع
```
automotive-academy/
├── client/          # React Frontend
│   ├── src/
│   │   ├── components/   # مكونات مشتركة
│   │   ├── pages/        # الصفحات
│   │   ├── data/         # بيانات ثابتة
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── server/          # Node.js Backend
│   ├── models/       # نماذج MongoDB
│   ├── routes/       # API Routes
│   ├── server.js
│   └── package.json
└── package.json     # سكربتات مشتركة
```

## API Endpoints
- `POST /api/bookings` - إنشاء حجز
- `GET /api/bookings` - عرض الحجوزات
- `POST /api/contacts` - إرسال رسالة
- `GET /api/services` - عرض الخدمات
- `GET /api/offers` - عرض العروض
