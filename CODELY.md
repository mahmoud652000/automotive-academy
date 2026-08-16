

## Codely Structured Memories

### User
- [2026-08-16 16:59:21] User communicates in Arabic and works on the Automotive Academy project — a car maintenance/service web app (React + Vite + Tailwind, Arabic RTL). User prefers Arabic responses.
### Feedback

### Project
- [2026-08-16 21:24:34] Events feature added 2026-08-16: Dynamic "الأحداث" section replacing the static promo banner on Home page. Backend model Event.js (type: post/offer) with CRUD at /api/events. Dashboard has events tab where admin can add posts (image+text) or limited offers (discount, prices, expiry).
- [2026-08-16 23:20:07] Dashboard uses localStorage to persist offers/services/courses edits (key: dashboard_offers, dashboard_services, dashboard_courses). Events use MongoDB via /api/events with _id. Edit feature uses openForm(type, item) with editId tracking — events use item._id, others use item.id.
- [2026-08-17 00:48:40] Vercel deployment configured 2026-08-17: Server converted to serverless (api/index.js entry point, server.js exports app with lazy MongoDB connection, vercel.json with rewrites). Root package.json now includes server deps. Client builds to client/dist. MongoDB Atlas connection string set in server/.env.

### Reference

