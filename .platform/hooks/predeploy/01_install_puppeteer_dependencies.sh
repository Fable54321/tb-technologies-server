#!/bin/bash

echo "Installing Puppeteer dependencies..."

yum install -y \
  atk \
  cups-libs \
  gtk3 \
  alsa-lib \
  xorg-x11-server-Xvfb \
  libXcomposite \
  libXcursor \
  libXdamage \
  libXext \
  libXi \
  libXtst \
  pango \
  cairo \
  libXScrnSaver \
  libXrandr \
  nss \
  xorg-x11-fonts-100dpi \
  xorg-x11-fonts-75dpi \
  xorg-x11-utils \
  xorg-x11-fonts-Type1 \
  xorg-x11-fonts-cyrillic

echo "Done installing Puppeteer dependencies."