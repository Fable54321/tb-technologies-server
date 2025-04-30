echo "Installing required libraries for Puppeteer..."

sudo yum install -y \
  atk \
  cups-libs \
  gtk3 \
  libatk-1.0.so.0 \
  libgdk-x11-2.0.so.0 \
  libpango-1.0.so.0 \
  libx11 \
  libxcomposite \
  libxdamage \
  libxrandr \
  xorg-x11-server-Xvfb \
  libnss3 \
  alsa-lib \
  cairo \
  pango \
  xorg-x11-fonts-75dpi \
  xorg-x11-fonts-Type1 \
  libXScrnSaver

# Optional: Make sure the cache for Puppeteer is set properly
echo "Setting Puppeteer cache location..."
export PUPPETEER_CACHE_DIR=/tmp/puppeteer_cache