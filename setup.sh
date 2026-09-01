#!/bin/bash
# Automotive Academy — تشغيل كامل بأمر واحد على Hostinger VPS (Ubuntu)
# الاستخدام: بعد فك الضغط في /var/www شغّل:  bash setup.sh
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== Automotive Academy — الإعداد الكامل ==="

# فتح بورتات 80 و443 إذا كان جدار الحماية ufw مفعلاً
if command -v ufw >/dev/null 2>&1 && ufw status 2>/dev/null | grep -q "Status: active"; then
  echo "[*] فتح بورتات 80 و443 في جدار الحماية..."
  ufw allow 80/tcp >/dev/null 2>&1 || true
  ufw allow 443/tcp >/dev/null 2>&1 || true
fi

# التشغيل الكامل (Node + PM2 + nginx + بناء + SSL)
bash deploy/deploy.sh
