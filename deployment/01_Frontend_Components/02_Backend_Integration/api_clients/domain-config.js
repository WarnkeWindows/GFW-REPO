// Domain-specific configuration for GFE headless websites

// Detect current domain
const getCurrentDomain = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  return 'localhost';
};

// Domain configurations
const DOMAIN_CONFIGS = {
  'goodfaithexteriors.com': {
    name: 'Good Faith Exteriors',
    tagline: 'Premium Window & Door Solutions',
    primaryColor: '#d4af37',
    secondaryColor: '#1a2332',
    logo: 'https://static.wixstatic.com/media/10d52d_651a76065cb8426294f04e1b7483a3a2~mv2.png',
    favicon: 'https://static.wixstatic.com/media/10d52d_91ba6fdf18634b31b4ebedf5f0f7f8d3~mv2.png',
    heroBackground: 'https://static.wixstatic.com/media/10d52d_8658ee3d06944967b7897cc2aa1e32de~mv2.png',
    phone: '(555) 123-4567',
    email: 'info@goodfaithexteriors.com',
    address: '123 Main Street, Your City, State 12345',
    oauth: {
      clientId: 'c00f1459-791d-4700-81ce-dadda7becc65',
      redirectUri: 'https://goodfaithexteriors.com/auth/callback'
    },
    analytics: {
      googleAnalyticsId: 'GA_MEASUREMENT_ID_EXTERIORS',
      sentryDsn: 'https://daf10ccaaf2dcea42bc8ab5340f36027@o4509594994868224.ingest.us.sentry.io/4509595014463489'
    },
    features: {
      aiEstimation: true,
      windowMeasurement: true,
      productCatalog: true,
      customerPortal: true,
      appointmentScheduling: true,
      chatSupport: true
    },
    seo: {
      title: 'Good Faith Exteriors - Premium Window & Door Installation',
      description: 'Professional window and door installation services with AI-powered estimation tools. Get instant quotes and schedule consultations.',
      keywords: 'windows, doors, installation, estimation, Good Faith Exteriors, AI measurement, home improvement'
    }
  },
  
  'goodfaithwindows.com': {
    name: 'Good Faith Windows',
    tagline: 'Expert Window Solutions & Testing',
    primaryColor: '#d4af37',
    secondaryColor: '#1a2332',
    logo: 'https://static.wixstatic.com/media/10d52d_651a76065cb8426294f04e1b7483a3a2~mv2.png',
    favicon: 'https://static.wixstatic.com/media/10d52d_91ba6fdf18634b31b4ebedf5f0f7f8d3~mv2.png',
    heroBackground: 'https://static.wixstatic.com/media/10d52d_8658ee3d06944967b7897cc2aa1e32de~mv2.png',
    phone: '(555) 123-4567',
    email: 'info@goodfaithwindows.com',
    address: '123 Main Street, Your City, State 12345',
    oauth: {
      clientId: 'c00f1459-791d-4700-81ce-dadda7becc65',
      redirectUri: 'https://goodfaithwindows.com/auth/callback'
    },
    analytics: {
      googleAnalyticsId: 'GA_MEASUREMENT_ID_WINDOWS',
      sentryDsn: 'https://daf10ccaaf2dcea42bc8ab5340f36027@o4509594994868224.ingest.us.sentry.io/4509595014463489'
    },
    features: {
      aiEstimation: true,
      windowMeasurement: true,
      productCatalog: true,
      customerPortal: true,
      appointmentScheduling: true,
      chatSupport: true
    },
    seo: {
      title: 'Good Faith Windows - Testing & Development Platform',
      description: 'Testing platform for window estimation and measurement tools. Development environment for Good Faith Exteriors services.',
      keywords: 'windows, testing, development, estimation, Good Faith Windows, AI measurement, beta testing'
    }
  },
  
  // Localhost configuration for development
  'localhost': {
    name: 'Good Faith Exteriors (Dev)',
    tagline: 'Development Environment',
    primaryColor: '#d4af37',
    secondaryColor: '#1a2332',
    logo: 'https://static.wixstatic.com/media/10d52d_651a76065cb8426294f04e1b7483a3a2~mv2.png',
    favicon: 'https://static.wixstatic.com/media/10d52d_91ba6fdf18634b31b4ebedf5f0f7f8d3~mv2.png',
    heroBackground: 'https://static.wixstatic.com/media/10d52d_8658ee3d06944967b7897cc2aa1e32de~mv2.png',
    phone: '(555) 123-4567',
    email: 'dev@goodfaithexteriors.com',
    address: 'Development Environment',
    oauth: {
      clientId: 'c00f1459-791d-4700-81ce-dadda7becc65',
      redirectUri: 'http://localhost:5174/auth/callback'
    },
    analytics: {
      googleAnalyticsId: null,
      sentryDsn: null
    },
    features: {
      aiEstimation: true,
      windowMeasurement: true,
      productCatalog: true,
      customerPortal: true,
      appointmentScheduling: true,
      chatSupport: true
    },
    seo: {
      title: 'Good Faith Exteriors - Development',
      description: 'Development environment for Good Faith Exteriors website',
      keywords: 'development, testing, Good Faith Exteriors'
    }
  }
};

// Get current domain configuration
export const getDomainConfig = () => {
  const domain = getCurrentDomain();
  
  // Check for exact match first
  if (DOMAIN_CONFIGS[domain]) {
    return DOMAIN_CONFIGS[domain];
  }
  
  // Check for subdomain matches
  if (domain.includes('goodfaithexteriors.com')) {
    return DOMAIN_CONFIGS['goodfaithexteriors.com'];
  }
  
  if (domain.includes('goodfaithwindows.com')) {
    return DOMAIN_CONFIGS['goodfaithwindows.com'];
  }
  
  // Default to localhost config for development
  return DOMAIN_CONFIGS['localhost'];
};

// Get API configuration based on domain
export const getApiConfig = () => {
  const domain = getCurrentDomain();
  
  return {
    baseUrl: 'https://gfe-backend-837326026335.us-central1.run.app',
    timeout: 10000,
    retries: 3,
    headers: {
      'Content-Type': 'application/json',
      'X-Domain': domain,
      'X-Client-Version': '1.0.0'
    }
  };
};

// Get OAuth configuration based on domain
export const getOAuthConfig = () => {
  const config = getDomainConfig();
  
  return {
    clientId: config.oauth.clientId,
    authorizationUrl: 'https://www.wix.com/oauth/authorize',
    tokenUrl: 'https://www.wix.com/oauth/access_token',
    scope: 'offline_access',
    redirectUri: config.oauth.redirectUri,
    state: generateRandomState()
  };
};

// Get branding configuration
export const getBrandingConfig = () => {
  const config = getDomainConfig();
  
  return {
    name: config.name,
    tagline: config.tagline,
    logo: config.logo,
    favicon: config.favicon,
    colors: {
      primary: config.primaryColor,
      secondary: config.secondaryColor
    },
    contact: {
      phone: config.phone,
      email: config.email,
      address: config.address
    }
  };
};

// Get feature flags based on domain
export const getFeatureFlags = () => {
  const config = getDomainConfig();
  return config.features;
};

// Get SEO configuration
export const getSEOConfig = () => {
  const config = getDomainConfig();
  return config.seo;
};

// Get analytics configuration
export const getAnalyticsConfig = () => {
  const config = getDomainConfig();
  return config.analytics;
};

// Utility function to generate random state for OAuth
function generateRandomState() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Check if current domain is production
export const isProduction = () => {
  const domain = getCurrentDomain();
  return domain === 'goodfaithexteriors.com' || domain === 'goodfaithwindows.com';
};

// Check if current domain is test environment
export const isTestEnvironment = () => {
  const domain = getCurrentDomain();
  return domain === 'goodfaithwindows.com' || domain.includes('test') || domain.includes('staging');
};

// Get environment name
export const getEnvironment = () => {
  const domain = getCurrentDomain();
  
  if (domain === 'goodfaithexteriors.com') return 'production';
  if (domain === 'goodfaithwindows.com') return 'test';
  if (domain === 'localhost' || domain.includes('localhost')) return 'development';
  
  return 'unknown';
};

export default {
  getDomainConfig,
  getApiConfig,
  getOAuthConfig,
  getBrandingConfig,
  getFeatureFlags,
  getSEOConfig,
  getAnalyticsConfig,
  isProduction,
  isTestEnvironment,
  getEnvironment
};

