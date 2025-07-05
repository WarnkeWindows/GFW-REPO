// API integration library for GFE backend communication

import { getApiConfig, getOAuthConfig } from './domain-config.js';

// Get API configuration
const apiConfig = getApiConfig();
const API_BASE_URL = apiConfig.baseUrl;

// Get OAuth configuration
const getOAuthConfigData = () => getOAuthConfig();

// API client class
class GFEApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = localStorage.getItem('gfe_access_token');
    this.config = apiConfig;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('gfe_access_token', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('gfe_access_token');
  }

  // Get authentication headers
  getAuthHeaders() {
    const headers = {
      ...this.config.headers,
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic API request method with retry logic
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      timeout: this.config.timeout,
      ...options,
    };

    let lastError;
    
    // Retry logic
    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          if (response.status === 401) {
            this.clearToken();
            throw new Error('Authentication required');
          }
          if (response.status === 403) {
            throw new Error('Access forbidden - check authentication');
          }
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        
        return await response.text();
      } catch (error) {
        lastError = error;
        console.error(`API request attempt ${attempt} failed:`, error);
        
        // Don't retry on authentication errors
        if (error.message.includes('Authentication required') || 
            error.message.includes('Access forbidden')) {
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < this.config.retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw lastError;
  }

  // Authentication methods
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async getAuthStatus() {
    return this.request('/api/auth/status');
  }

  // Quote management
  async getQuotes() {
    return this.request('/api/quotes');
  }

  async createQuote(quoteData) {
    return this.request('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  }

  async getQuote(quoteId) {
    return this.request(`/api/quotes/${quoteId}`);
  }

  async updateQuote(quoteId, quoteData) {
    return this.request(`/api/quotes/${quoteId}`, {
      method: 'PUT',
      body: JSON.stringify(quoteData),
    });
  }

  // Lead management
  async getLeads() {
    return this.request('/api/leads');
  }

  async createLead(leadData) {
    return this.request('/api/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  // Product catalog
  async getProducts() {
    return this.request('/api/products');
  }

  async getProduct(productId) {
    return this.request(`/api/products/${productId}`);
  }

  // AI estimation
  async getAIEstimate(estimationData) {
    return this.request('/api/ai/estimate', {
      method: 'POST',
      body: JSON.stringify(estimationData),
    });
  }

  // Chat functionality
  async sendChatMessage(message) {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Customer portal
  async getCustomerData() {
    return this.request('/api/customer/profile');
  }

  async updateCustomerData(customerData) {
    return this.request('/api/customer/profile', {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async getCustomerProjects() {
    return this.request('/api/customer/projects');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// OAuth helper functions
export const oauth = {
  // Generate OAuth authorization URL
  getAuthorizationUrl() {
    const config = getOAuthConfigData();
    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: 'code',
      scope: config.scope,
      redirect_uri: config.redirectUri,
      state: config.state,
    });

    localStorage.setItem('oauth_state', config.state);
    return `${config.authorizationUrl}?${params.toString()}`;
  },

  // Handle OAuth callback
  async handleCallback(code, state) {
    const storedState = localStorage.getItem('oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid OAuth state parameter');
    }

    const config = getOAuthConfigData();
    const tokenData = {
      grant_type: 'authorization_code',
      client_id: config.clientId,
      code,
      redirect_uri: config.redirectUri,
    };

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(tokenData),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange authorization code for token');
    }

    const tokens = await response.json();
    localStorage.removeItem('oauth_state');
    
    return tokens;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('gfe_access_token');
  },

  // Get current OAuth configuration
  getConfig() {
    return getOAuthConfigData();
  }
};

// Create and export API client instance
export const apiClient = new GFEApiClient();

// Export configuration getter
export const getApiConfiguration = () => apiConfig;

