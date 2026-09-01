#!/bin/bash
set -e

# Use sudo only when not running as root (Hostinger VPS default is root)
SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  SUDO="sudo"
fi

# ===== Configuration =====
PROJECT_DIR="/var/www/automotive-academy"
DOMAIN="automotiveacademy-car.com"
# =========================

echo "=== Automotive Academy - Deployment ==="

# 1. Install Node.js if missing
if ! command -v node &> /dev/null; then
  echo "[1/8] Installing Node.js 18..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | ${SUDO} -E bash -
  ${SUDO} apt install -y nodejs
else
  echo "[1/8] Node.js already installed: $(node -v)"
fi

# 2. Install PM2 if missing
if ! command -v pm2 &> /dev/null; then
  echo "[2/8] Installing PM2..."
  ${SUDO} npm install -g pm2
else
  echo "[2/8] PM2 already installed"
fi

# 3. Install build tools for better-sqlite3
echo "[3/8] Installing build tools..."
${SUDO} apt install -y python3 make g++ nginx

# 4. Install dependencies
echo "[4/8] Installing dependencies..."
cd "$PROJECT_DIR"
npm install
cd server && npm install
cd ../client && npm install

# 5. Build frontend
echo "[5/8] Building frontend..."
npm run build

# 6. Start/Restart PM2
echo "[6/8] Starting PM2..."
cd "$PROJECT_DIR"
pm2 delete automotive-api 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup 2>/dev/null || true

# 7. Configure Nginx
echo "[7/8] Configuring Nginx..."
NGINX_FILE="/etc/nginx/sites-available/automotive-academy"
${SUDO} cp "$PROJECT_DIR/deploy/nginx.conf" "$NGINX_FILE"
${SUDO} sed -i "s/yourdomain.com/$DOMAIN/g" "$NGINX_FILE"
${SUDO} sed -i "s|/home/youruser/automotive-academy|$PROJECT_DIR|g" "$NGINX_FILE"
${SUDO} ln -sf "$NGINX_FILE" /etc/nginx/sites-enabled/
${SUDO} rm -f /etc/nginx/sites-enabled/default
${SUDO} nginx -t
${SUDO} systemctl reload nginx

# 8. SSL (optional)
echo "[8/8] Setting up SSL..."
read -p "Install SSL certificate with Let's Encrypt? (y/n): " -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
  ${SUDO} apt install -y certbot python3-certbot-nginx
  ${SUDO} certbot --nginx -d "$DOMAIN"
  echo "SSL installed!"
else
  echo "Skipping SSL — you can install later with: ${SUDO} certbot --nginx -d $DOMAIN"
fi

echo ""
echo "=== Deployment Complete ==="
echo "Frontend: http://$DOMAIN"
echo "API:      http://$DOMAIN/api"
echo "PM2 logs: pm2 logs automotive-api"
echo ""
echo "Don't forget to update server/.env with your real values!"
