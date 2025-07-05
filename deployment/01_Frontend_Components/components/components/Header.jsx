import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Menu, X, User, LogOut } from 'lucide-react';
import { oauth, apiClient } from '@/lib/api.js';
import { getBrandingConfig, getFeatureFlags } from '@/lib/domain-config.js';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // Get domain-specific configuration
  const branding = getBrandingConfig();
  const features = getFeatureFlags();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    if (oauth.isAuthenticated()) {
      try {
        const authStatus = await apiClient.getAuthStatus();
        setIsAuthenticated(true);
        setUser(authStatus.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  };

  const handleLogin = () => {
    const authUrl = oauth.getAuthorizationUrl();
    window.location.href = authUrl;
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      setIsAuthenticated(false);
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src={branding.logo} 
              alt={branding.name} 
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gfe-text-gold">{branding.name}</h1>
              <p className="text-sm gfe-text-silver">{branding.tagline}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#services" className="text-foreground hover:text-primary transition-colors">
              Services
            </a>
            {features.productCatalog && (
              <a href="#products" className="text-foreground hover:text-primary transition-colors">
                Products
              </a>
            )}
            {features.aiEstimation && (
              <a href="#estimator" className="text-foreground hover:text-primary transition-colors">
                Get Quote
              </a>
            )}
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
            {features.customerPortal && isAuthenticated && (
              <a href="#portal" className="text-foreground hover:text-primary transition-colors">
                My Projects
              </a>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{user?.name || 'User'}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gfe-button-secondary"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="gfe-button-primary"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#services" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </a>
              {features.productCatalog && (
                <a 
                  href="#products" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </a>
              )}
              {features.aiEstimation && (
                <a 
                  href="#estimator" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Quote
                </a>
              )}
              <a 
                href="#about" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              {features.customerPortal && isAuthenticated && (
                <a 
                  href="#portal" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Projects
                </a>
              )}
              
              {/* Mobile Auth */}
              <div className="pt-4 border-t border-border">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>{user?.name || 'User'}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full gfe-button-secondary"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleLogin}
                    className="w-full gfe-button-primary"
                  >
                    Login
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

