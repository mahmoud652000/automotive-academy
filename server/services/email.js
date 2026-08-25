import { Resend } from 'resend'
import dotenv from 'dotenv'
import db from '../db.js'

dotenv.config()

function getApiKey() {
  // Check database settings first, then fall back to env var
  try {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('resend_api_key')
    if (row?.value && row.value.trim()) return row.value.trim()
  } catch {}
  return process.env.RESEND_API_KEY || null
}

function getResendClient() {
  const key = getApiKey()
  return key ? new Resend(key) : null
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Automotive Academy <onboarding@resend.dev>'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// --- Email Templates ---

function confirmationEmailHTML(token) {
  const confirmUrl = `${FRONTEND_URL}/newsletter/confirm/${token}`
  return `
  <!DOCTYPE html>
  <html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد الاشتراك</title>
  </head>
  <body style="margin:0;padding:0;background:#0a0a0f;font-family:'Cairo','Segoe UI',Tahoma,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;min-height:100vh;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#15151f;border:1px solid #2a2a3a;border-radius:16px;overflow:hidden;max-width:600px;">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#dc2626,#991b1b);padding:30px 40px;text-align:center;">
                <h1 style="color:#fff;font-size:24px;margin:0;font-weight:700;">Automotive Academy</h1>
                <p style="color:#fff;opacity:0.8;font-size:13px;margin:5px 0 0;">خبراء صيانة وإصلاح السيارات</p>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:40px;">
                <h2 style="color:#fff;font-size:20px;margin:0 0 15px;">تأكيد الاشتراك في النشرة البريدية</h2>
                <p style="color:#a0a0b0;font-size:14px;line-height:1.8;margin:0 0 20px;">
                  مرحباً بك! تم تسجيل بريدك الإلكتروني في قائمة اشتراكات النشرة البريدية لـ Automotive Academy.
                  لتأكيد اشتراكك واستقبال آخر الأخبار والعروض والمقالات، يرجى الضغط على الزر التالي:
                </p>
                <div style="text-align:center;margin:30px 0;">
                  <a href="${confirmUrl}" style="display:inline-block;background:#dc2626;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:10px;">تأكيد الاشتراك</a>
                </div>
                <p style="color:#606070;font-size:12px;line-height:1.6;margin:20px 0 0;">
                  إذا لم تطلب الاشتراك في النشرة البريدية، يمكنك تجاهل هذه الرسالة.<br>
                  أو يمكنك إلغاء الاشتراك <a href="${FRONTEND_URL}/newsletter/unsubscribe/${token}" style="color:#dc2626;">من هنا</a>.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#0f0f17;padding:20px 40px;border-top:1px solid #2a2a3a;">
                <p style="color:#404050;font-size:11px;text-align:center;margin:0;">
                  © 2025 Automotive Academy — جميع الحقوق محفوظة
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}

function newsletterEmailHTML(contentType, content, subscriberToken) {
  const typeLabels = {
    event: 'حدث جديد',
    offer: 'عرض جديد',
    article: 'مقال جديد',
  }
  const typeLabel = typeLabels[contentType] || 'جديد'
  const unsubscribeUrl = `${FRONTEND_URL}/newsletter/unsubscribe/${subscriberToken}`

  const imageBlock = content.image
    ? `<div style="margin:20px 0;border-radius:12px;overflow:hidden;">
         <img src="${content.image}" alt="${content.title || ''}" style="width:100%;display:block;" />
       </div>`
    : ''

  const detailsBlock = content.discount
    ? `<div style="background:#dc262615;border:1px solid #dc262630;border-radius:10px;padding:15px;margin:20px 0;text-align:center;">
         <span style="color:#dc2626;font-size:28px;font-weight:700;">${content.discount}%</span>
         <span style="color:#a0a0b0;font-size:13px;margin-right:10px;">خصم</span>
       </div>`
    : ''

  const contentText = content.description || content.desc || content.excerpt || ''

  return `
  <!DOCTYPE html>
  <html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${typeLabel} — Automotive Academy</title>
  </head>
  <body style="margin:0;padding:0;background:#0a0a0f;font-family:'Cairo','Segoe UI',Tahoma,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;min-height:100vh;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#15151f;border:1px solid #2a2a3a;border-radius:16px;overflow:hidden;max-width:600px;">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#dc2626,#991b1b);padding:25px 40px;">
                <table width="100%">
                  <tr>
                    <td>
                      <h1 style="color:#fff;font-size:20px;margin:0;font-weight:700;">Automotive Academy</h1>
                      <p style="color:#fff;opacity:0.8;font-size:12px;margin:3px 0 0;">خبراء صيانة وإصلاح السيارات</p>
                    </td>
                    <td style="text-align:left;">
                      <span style="background:#fff20;color:#dc2626;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;">${typeLabel}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:35px 40px;">
                <h2 style="color:#fff;font-size:22px;margin:0 0 10px;">${content.title || ''}</h2>
                ${imageBlock}
                ${detailsBlock}
                ${contentText ? `<p style="color:#a0a0b0;font-size:14px;line-height:1.8;margin:15px 0;">${contentText}</p>` : ''}
                <div style="text-align:center;margin:30px 0;">
                  <a href="${FRONTEND_URL}" style="display:inline-block;background:#dc2626;color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 35px;border-radius:10px;">زيارة الموقع</a>
                </div>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#0f0f17;padding:20px 40px;border-top:1px solid #2a2a3a;">
                <p style="color:#404050;font-size:11px;text-align:center;margin:0 0 8px;">
                  © 2025 Automotive Academy — جميع الحقوق محفوظة
                </p>
                <p style="text-align:center;margin:0;">
                  <a href="${unsubscribeUrl}" style="color:#606070;font-size:11px;text-decoration:none;">إلغاء الاشتراك في النشرة البريدية</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}

// --- API ---

export async function sendConfirmationEmail(email, token) {
  const resend = getResendClient()
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping confirmation email')
    return { skipped: true }
  }

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'تأكيد الاشتراك في نشرة Automotive Academy البريدية',
    html: confirmationEmailHTML(token),
  })

  if (error) throw new Error(`Resend error: ${error.message}`)
  return { id: data?.id }
}

export async function sendNewsletterEmail(subscribers, contentType, content) {
  const resend = getResendClient()
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping newsletter email')
    return { skipped: true, count: 0 }
  }

  if (!subscribers || subscribers.length === 0) return { count: 0 }

  const typeLabels = {
    event: 'حدث جديد',
    offer: 'عرض جديد',
    article: 'مقال جديد',
  }
  const subject = `${typeLabels[contentType] || 'جديد'}: ${content.title || ''} — Automotive Academy`

  let sentCount = 0

  // Send individually to include per-recipient unsubscribe link
  for (const sub of subscribers) {
    try {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: sub.email,
        subject,
        html: newsletterEmailHTML(contentType, content, sub.token),
      })
      if (!error) sentCount++
      else console.error(`[email] Failed to send to ${sub.email}:`, error.message)
    } catch (err) {
      console.error(`[email] Failed to send to ${sub.email}:`, err.message)
    }
  }

  return { count: sentCount }
}
