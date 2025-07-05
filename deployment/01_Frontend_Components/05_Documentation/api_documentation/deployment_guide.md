# Deployment Guide

## Prerequisites
1. Node.js 18+ installed
2. Domain DNS configured
3. SSL certificate installed
4. Wix OAuth client configured

## Build Process
```bash
cd frontend/gfe-headless-frontend
npm install
npm run build
```

## Deployment Options

### Option 1: Static Hosting (Recommended)
- Netlify
- Vercel
- AWS S3 + CloudFront
- Google Cloud Storage

### Option 2: Container Deployment
- Docker + Google Cloud Run
- AWS ECS
- Azure Container Instances

### Option 3: Traditional Hosting
- Apache/Nginx
- cPanel hosting
- Shared hosting with Node.js support

## Environment Variables
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_OAUTH_CLIENT_ID`: OAuth client ID
- `VITE_ENVIRONMENT`: production/test/development
