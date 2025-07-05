import { Button } from '@/components/ui/button.jsx';
import { ArrowRight, Calculator, Camera, MessageCircle } from 'lucide-react';
import { getBrandingConfig, getFeatureFlags } from '@/lib/domain-config.js';

export function Hero() {
  // Get domain-specific configuration
  const branding = getBrandingConfig();
  const features = getFeatureFlags();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${branding.heroBackground || 'https://static.wixstatic.com/media/10d52d_8658ee3d06944967b7897cc2aa1e32de~mv2.png'})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Transform Your Home with
            <span className="block gfe-text-gold">Premium Windows & Doors</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            {branding.name === 'Good Faith Windows' 
              ? 'Test and experience our cutting-edge window estimation tools and professional services in our development environment.'
              : 'Experience the future of home improvement with our AI-powered estimation tools and professional installation services.'
            }
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {features.aiEstimation && (
              <Button
                size="lg"
                className="gfe-button-primary text-lg px-8 py-6"
                onClick={() => scrollToSection('estimator')}
              >
                <Calculator className="mr-2 h-5 w-5" />
                Get Instant Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            
            {features.windowMeasurement && (
              <Button
                size="lg"
                variant="outline"
                className="gfe-button-secondary text-lg px-8 py-6"
                onClick={() => scrollToSection('ai-measure')}
              >
                <Camera className="mr-2 h-5 w-5" />
                AI Window Measure
              </Button>
            )}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.aiEstimation && (
              <div className="gfe-card rounded-lg p-6 text-center">
                <Calculator className="h-12 w-12 gfe-text-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">AI Estimation</h3>
                <p className="text-gray-300">
                  Get accurate quotes instantly with our advanced AI technology
                </p>
              </div>
            )}

            {features.windowMeasurement && (
              <div className="gfe-card rounded-lg p-6 text-center">
                <Camera className="h-12 w-12 gfe-text-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Smart Measuring</h3>
                <p className="text-gray-300">
                  Upload photos for precise measurements using computer vision
                </p>
              </div>
            )}

            {features.chatSupport && (
              <div className="gfe-card rounded-lg p-6 text-center">
                <MessageCircle className="h-12 w-12 gfe-text-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Expert Support</h3>
                <p className="text-gray-300">
                  Chat with our AI assistant or schedule a consultation
                </p>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-gray-600">
            <p className="text-gray-300 mb-6">
              {branding.name === 'Good Faith Windows' 
                ? 'Testing platform for innovative window solutions'
                : 'Trusted by homeowners across the region'
              }
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <img 
                src="https://static.wixstatic.com/media/10d52d_7df98cb648bb485d8e2f0922a3da18f4~mv2.jpeg" 
                alt="Marvin" 
                className="h-8 grayscale hover:grayscale-0 transition-all"
              />
              <img 
                src="https://static.wixstatic.com/media/10d52d_19c62f7d131445829ff8fdde2b581b98~mv2.jpeg" 
                alt="Andersen" 
                className="h-8 grayscale hover:grayscale-0 transition-all"
              />
              <img 
                src="https://static.wixstatic.com/media/10d52d_739b01217f084e21a41dd8591b98e6b8~mv2.jpeg" 
                alt="Pella" 
                className="h-8 grayscale hover:grayscale-0 transition-all"
              />
              <img 
                src="https://static.wixstatic.com/media/10d52d_bcbbb5675e7b496891f63cb64e37fa07~mv2.png" 
                alt="Provia" 
                className="h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

