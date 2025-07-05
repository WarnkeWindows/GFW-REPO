import { useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { EstimatorWidget } from './components/EstimatorWidget.jsx';
import { oauth, apiClient } from './lib/api.js';
import { getBrandingConfig, getFeatureFlags, getSEOConfig, getEnvironment } from './lib/domain-config.js';
import './App.css';

function App() {
  // Get domain-specific configuration
  const branding = getBrandingConfig();
  const features = getFeatureFlags();
  const seo = getSEOConfig();
  const environment = getEnvironment();

  useEffect(() => {
    // Update document title and meta tags
    document.title = seo.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seo.description);
    }
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', seo.keywords);
    }
    
    // Update favicon if different
    if (branding.favicon) {
      let favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.setAttribute('href', branding.favicon);
      }
    }

    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      handleOAuthCallback(code, state);
    }

    // Add environment indicator for non-production
    if (environment !== 'production') {
      console.log(`Running in ${environment} environment`);
    }
  }, [seo, branding, environment]);

  const handleOAuthCallback = async (code, state) => {
    try {
      const tokens = await oauth.handleCallback(code, state);
      apiClient.setToken(tokens.access_token);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Reload to update auth state
      window.location.reload();
    } catch (error) {
      console.error('OAuth callback failed:', error);
      // Redirect to home on error
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Environment indicator for non-production */}
      {environment !== 'production' && (
        <div className="bg-yellow-600 text-black text-center py-2 text-sm font-medium">
          {environment.toUpperCase()} ENVIRONMENT - {branding.name}
        </div>
      )}
      
      <Header />
      <main>
        <Hero />
        
        {/* Estimator Widget - only show if feature is enabled */}
        {features.aiEstimation && <EstimatorWidget />}
        
        {/* Services Section */}
        <section id="services" className="py-16 bg-card/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gfe-text-gold">
                Our Services
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {branding.name === 'Good Faith Windows' 
                  ? 'Testing and development platform for innovative window solutions'
                  : 'Comprehensive window and door solutions for your home'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.windowMeasurement && (
                <div className="gfe-card rounded-lg p-6 text-center">
                  <img 
                    src="https://static.wixstatic.com/media/10d52d_1f0bc35da9f64cfaaf3e7bdd0e19e46d~mv2.png" 
                    alt="AI Window Measure" 
                    className="h-16 w-16 mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2 gfe-text-gold">AI Window Measurement</h3>
                  <p className="text-muted-foreground">
                    Upload photos and get precise measurements using advanced computer vision technology
                  </p>
                </div>
              )}
              
              <div className="gfe-card rounded-lg p-6 text-center">
                <img 
                  src="https://static.wixstatic.com/media/10d52d_d988707487cd498ab95e653e09f5ca4a~mv2.png" 
                  alt="GF Estimator" 
                  className="h-16 w-16 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2 gfe-text-gold">Professional Installation</h3>
                <p className="text-muted-foreground">
                  Expert installation services with warranty and ongoing support
                </p>
              </div>
              
              <div className="gfe-card rounded-lg p-6 text-center">
                <img 
                  src="https://static.wixstatic.com/media/10d52d_eea1622cce0b4367b734bb51a0d81eb8~mv2.jpg" 
                  alt="Grid Flow Engine" 
                  className="h-16 w-16 mx-auto mb-4 rounded"
                />
                <h3 className="text-xl font-semibold mb-2 gfe-text-gold">Project Management</h3>
                <p className="text-muted-foreground">
                  Complete project coordination from initial quote to final installation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section - only show if feature is enabled */}
        {features.productCatalog && (
          <section id="products" className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 gfe-text-gold">
                  Premium Products
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  We partner with leading manufacturers to bring you the best in quality and design
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="text-center">
                  <img 
                    src="https://static.wixstatic.com/media/10d52d_7df98cb648bb485d8e2f0922a3da18f4~mv2.jpeg" 
                    alt="Marvin" 
                    className="h-16 mx-auto mb-4 grayscale hover:grayscale-0 transition-all"
                  />
                  <h4 className="font-semibold">Marvin</h4>
                </div>
                <div className="text-center">
                  <img 
                    src="https://static.wixstatic.com/media/10d52d_19c62f7d131445829ff8fdde2b581b98~mv2.jpeg" 
                    alt="Andersen" 
                    className="h-16 mx-auto mb-4 grayscale hover:grayscale-0 transition-all"
                  />
                  <h4 className="font-semibold">Andersen</h4>
                </div>
                <div className="text-center">
                  <img 
                    src="https://static.wixstatic.com/media/10d52d_739b01217f084e21a41dd8591b98e6b8~mv2.jpeg" 
                    alt="Pella" 
                    className="h-16 mx-auto mb-4 grayscale hover:grayscale-0 transition-all"
                  />
                  <h4 className="font-semibold">Pella</h4>
                </div>
                <div className="text-center">
                  <img 
                    src="https://static.wixstatic.com/media/10d52d_bcbbb5675e7b496891f63cb64e37fa07~mv2.png" 
                    alt="Provia" 
                    className="h-16 mx-auto mb-4 grayscale hover:grayscale-0 transition-all"
                  />
                  <h4 className="font-semibold">Provia</h4>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="gfe-card rounded-lg p-4 text-center">
                  <img 
                    src="https://static.wixstatic.com/media/10d52d_b8bfb21fc4d6460ebce21673473667f5~mv2.png" 
                    alt="Double Hung" 
                    className="h-20 w-20 mx-auto mb-3 object-contain"
                  />
                  <h4 className="font-semibold text-sm">Double Hung</h4>
                </div>
                <div className="gfe-card rounded-lg p-4 text-center">
                  <img 
                    src="https://static.wixstatic.com/media/10d52d_79a4cd4776a94ba2a958989178a6ee7f~mv2.png" 
                    alt="Casement" 
                    className="h-20 w-20 mx-auto mb-3 object-contain"
                  />
                  <h4 className="font-semibold text-sm">Casement</h4>
                </div>
                <div className="gfe-card rounded-lg p-4 text-center">
                  <img 
                    src="https://static.wixstatic.com/media/10d52d_d4baffa175394b2c88b4f75dfd833eeb~mv2.png" 
                    alt="Slider" 
                    className="h-20 w-20 mx-auto mb-3 object-contain"
                  />
                  <h4 className="font-semibold text-sm">Slider</h4>
                </div>
                <div className="gfe-card rounded-lg p-4 text-center">
                  <img 
                    src="https://static.wixstatic.com/media/10d52d_27545cce879743aeb6e85256d4837f97~mv2.png" 
                    alt="Bay" 
                    className="h-20 w-20 mx-auto mb-3 object-contain"
                  />
                  <h4 className="font-semibold text-sm">Bay</h4>
                </div>
                <div className="gfe-card rounded-lg p-4 text-center">
                  <img 
                    src="https://static.wixstatic.com/media/10d52d_bcaf2da6be774a72a562e3dc7527ec90~mv2.png" 
                    alt="Entry Door" 
                    className="h-20 w-20 mx-auto mb-3 object-contain"
                  />
                  <h4 className="font-semibold text-sm">Entry Door</h4>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-card/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gfe-text-gold">
                Get In Touch
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {branding.name === 'Good Faith Windows' 
                  ? 'Questions about our testing platform? Contact our development team'
                  : 'Ready to transform your home? Contact us for a consultation'
                }
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto text-center">
              <div className="gfe-card rounded-lg p-8">
                <h3 className="text-2xl font-semibold mb-6 gfe-text-gold">
                  {features.appointmentScheduling 
                    ? 'Schedule Your Free Consultation'
                    : 'Contact Us Today'
                  }
                </h3>
                <p className="text-muted-foreground mb-6">
                  {branding.contact.address !== 'Development Environment' 
                    ? 'Our experts will visit your home to provide accurate measurements and detailed quotes'
                    : 'Get in touch with our development team for support and feedback'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 gfe-button-primary py-3 px-6 rounded-lg font-semibold">
                    Call {branding.contact.phone}
                  </button>
                  {features.appointmentScheduling && (
                    <button className="flex-1 gfe-button-secondary py-3 px-6 rounded-lg font-semibold">
                      Schedule Online
                    </button>
                  )}
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Email: {branding.contact.email}</p>
                  {branding.contact.address !== 'Development Environment' && (
                    <p>{branding.contact.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img 
                src={branding.logo} 
                alt={branding.name} 
                className="h-8 w-auto"
              />
              <div>
                <h3 className="font-bold gfe-text-gold">{branding.name}</h3>
                <p className="text-sm text-muted-foreground">{branding.tagline}</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © 2025 {branding.name}. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground">
                Powered by AI technology
                {environment !== 'production' && ` • ${environment.toUpperCase()}`}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

