#!/bin/bash
set -e
cd /vercel/share/v0-project
rm -rf node_modules package-lock.json .npmrc 2>/dev/null || true
npm cache clean --force
npm install --legacy-peer-deps
npm run dev
