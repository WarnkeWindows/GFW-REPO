# OAuth Setup Guide

## Wix OAuth Configuration

### Client Configuration
- Client ID: `c00f1459-791d-4700-81ce-dadda7becc65`
- Authorization URL: `https://www.wix.com/oauth/authorize`
- Token URL: `https://www.wix.com/oauth/access_token`
- Scope: `offline_access`

### Redirect URIs
- Production: `https://goodfaithexteriors.com/auth/callback`
- Test: `https://goodfaithwindows.com/auth/callback`
- Development: `http://localhost:5174/auth/callback`

### Implementation
The OAuth flow is implemented in `src/lib/api.js` with automatic domain detection.
