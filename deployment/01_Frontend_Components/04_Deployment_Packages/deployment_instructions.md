# GFE Headless Website Deployment Instructions

## Overview
This document provides step-by-step instructions for deploying the GFE headless OAuth website to both goodfaithexteriors.com and goodfaithwindows.com domains.

## Prerequisites

### 1. Domain Configuration
- **goodfaithexteriors.com** (Production)
- **goodfaithwindows.com** (Test Environment)
- DNS records configured to point to hosting provider
- SSL certificates installed for both domains

### 2. Backend Requirements
- Google Cloud Run backend: `https://gfe-backend-837326026335.us-central1.run.app`
- OAuth Client ID: `c00f1459-791d-4700-81ce-dadda7becc65`
- Google Cloud Organization: `518845478181`
- Service Account: `837326026335-compute@developer.gserviceaccount.com`

### 3. Hosting Requirements
- Static hosting provider (Netlify, Vercel, AWS S3, etc.)
- Node.js 18+ for build process
- Support for SPA routing (single-page application)

## Deployment Options

### Option 1: Netlify (Recommended)

#### Step 1: Prepare Build
```bash
# Navigate to frontend directory
cd frontend/gfe-headless-frontend

# Install dependencies
npm install

# Build for production
npm run build
```

#### Step 2: Deploy to Netlify
1. Create new site on Netlify
2. Connect to Git repository or drag/drop `dist` folder
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables:
   - `VITE_API_BASE_URL`: `https://gfe-backend-837326026335.us-central1.run.app`
   - `VITE_OAUTH_CLIENT_ID`: `c00f1459-791d-4700-81ce-dadda7becc65`

#### Step 3: Configure Custom Domain
1. Go to Domain settings in Netlify
2. Add custom domain (goodfaithexteriors.com or goodfaithwindows.com)
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Netlify)

### Option 2: Vercel

#### Step 1: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
cd frontend/gfe-headless-frontend
vercel --prod
```

#### Step 2: Configure Environment Variables
Add in Vercel dashboard:
- `VITE_API_BASE_URL`: `https://gfe-backend-837326026335.us-central1.run.app`
- `VITE_OAUTH_CLIENT_ID`: `c00f1459-791d-4700-81ce-dadda7becc65`

#### Step 3: Configure Custom Domain
1. Go to Project Settings > Domains
2. Add custom domain
3. Configure DNS as instructed

### Option 3: AWS S3 + CloudFront

#### Step 1: Create S3 Bucket
```bash
# Create bucket
aws s3 mb s3://goodfaithexteriors-website

# Configure for static hosting
aws s3 website s3://goodfaithexteriors-website --index-document index.html --error-document index.html
```

#### Step 2: Upload Build Files
```bash
# Sync build files
aws s3 sync dist/ s3://goodfaithexteriors-website --delete
```

#### Step 3: Configure CloudFront
1. Create CloudFront distribution
2. Set origin to S3 bucket
3. Configure custom error pages for SPA routing
4. Add custom domain and SSL certificate

### Option 4: Google Cloud Storage

#### Step 1: Create Storage Bucket
```bash
# Create bucket
gsutil mb gs://goodfaithexteriors-website

# Configure for static hosting
gsutil web set -m index.html -e index.html gs://goodfaithexteriors-website
```

#### Step 2: Upload Build Files
```bash
# Upload files
gsutil -m rsync -r -d dist/ gs://goodfaithexteriors-website
```

#### Step 3: Configure Load Balancer
1. Create HTTP(S) load balancer
2. Configure backend bucket
3. Add custom domain and SSL certificate

## Domain-Specific Configuration

### goodfaithexteriors.com (Production)
- Environment: `production`
- Features: All enabled
- Branding: Full Good Faith Exteriors branding
- OAuth Redirect: `https://goodfaithexteriors.com/auth/callback`

### goodfaithwindows.com (Test)
- Environment: `test`
- Features: All enabled (for testing)
- Branding: Good Faith Windows test branding
- OAuth Redirect: `https://goodfaithwindows.com/auth/callback`

## Post-Deployment Testing

### 1. Basic Functionality
- [ ] Website loads correctly
- [ ] Responsive design works on mobile/desktop
- [ ] Navigation functions properly
- [ ] Forms submit without errors

### 2. OAuth Integration
- [ ] Login button redirects to Wix OAuth
- [ ] OAuth callback handles authorization code
- [ ] User authentication state persists
- [ ] Logout functionality works

### 3. API Integration
- [ ] Estimator widget connects to backend
- [ ] Quote generation works
- [ ] Lead creation functions
- [ ] Error handling displays appropriately

### 4. Domain-Specific Features
- [ ] Correct branding displays for each domain
- [ ] Environment indicators show correctly
- [ ] Feature flags work as expected
- [ ] Contact information is domain-appropriate

## Troubleshooting

### Common Issues

#### 1. OAuth Redirect Errors
- Verify redirect URI matches exactly in Wix dashboard
- Check that domain is properly configured
- Ensure HTTPS is enabled

#### 2. API Connection Issues
- Verify backend URL is accessible
- Check CORS configuration on backend
- Validate API key and authentication

#### 3. Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all environment variables are set

#### 4. Routing Issues (404 on refresh)
- Configure hosting provider for SPA routing
- Ensure `_redirects` file is included in build
- Check server configuration for fallback to index.html

### Environment Variables Reference

```bash
# Required for all deployments
VITE_API_BASE_URL=https://gfe-backend-837326026335.us-central1.run.app
VITE_OAUTH_CLIENT_ID=c00f1459-791d-4700-81ce-dadda7becc65

# Optional for analytics
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=SENTRY_DSN_URL

# Environment detection (auto-detected from domain)
VITE_ENVIRONMENT=production|test|development
```

## Security Considerations

### 1. HTTPS Enforcement
- Always use HTTPS in production
- Configure HSTS headers
- Use secure cookies for authentication

### 2. API Security
- Validate all API responses
- Implement proper error handling
- Use CORS appropriately

### 3. OAuth Security
- Validate state parameter
- Use secure redirect URIs
- Implement proper token storage

## Monitoring and Analytics

### 1. Performance Monitoring
- Set up Google Analytics
- Configure Sentry for error tracking
- Monitor Core Web Vitals

### 2. API Monitoring
- Monitor backend response times
- Track API error rates
- Set up alerts for downtime

### 3. User Analytics
- Track conversion rates
- Monitor user engagement
- Analyze feature usage

## Maintenance

### 1. Regular Updates
- Keep dependencies updated
- Monitor security vulnerabilities
- Update OAuth configurations as needed

### 2. Backup Strategy
- Regular backups of configuration
- Version control for all changes
- Document all customizations

### 3. Performance Optimization
- Regular performance audits
- Image optimization
- Code splitting optimization

## Support

For deployment support or issues:
- Check documentation in `05_Documentation/`
- Review troubleshooting guides
- Contact development team

## Deployment Checklist

### Pre-Deployment
- [ ] Code reviewed and tested
- [ ] Build process verified
- [ ] Environment variables configured
- [ ] Domain DNS configured
- [ ] SSL certificates installed

### Deployment
- [ ] Build created successfully
- [ ] Files uploaded to hosting provider
- [ ] Custom domain configured
- [ ] HTTPS enabled
- [ ] Environment variables set

### Post-Deployment
- [ ] Website accessibility verified
- [ ] OAuth flow tested
- [ ] API integration tested
- [ ] Mobile responsiveness verified
- [ ] Performance metrics baseline established

### Go-Live
- [ ] DNS propagation complete
- [ ] All tests passing
- [ ] Monitoring configured
- [ ] Team notified of deployment
- [ ] Documentation updated

---

**Last Updated:** July 5, 2025
**Version:** 1.0.0
**Environment:** Production Ready

