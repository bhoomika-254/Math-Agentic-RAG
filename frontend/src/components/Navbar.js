import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, Menu, X, Brain, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Search', href: '/search', icon: null },
    { name: 'Analytics', href: '/analytics', icon: null },
    { name: 'About', href: '/about', icon: null },
  ];

  const isActivePage = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xl font-bold gradient-text">MathGenius</span>
              <Sparkles className="h-4 w-4 text-secondary-500" />
              <span className="text-xl font-bold text-gray-700">AI</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActivePage(item.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* CTA Button */}
            <Link
              to="/search"
              className="btn btn-primary btn-sm ml-4"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Try Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePage(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <Link
                to="/search"
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-primary btn-sm mt-4 self-start"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Try Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
