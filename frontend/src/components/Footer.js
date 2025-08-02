import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xl font-bold gradient-text">MathGenius</span>
                <Sparkles className="h-4 w-4 text-secondary-500" />
                <span className="text-xl font-bold text-gray-700">AI</span>
              </div>
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              Advanced AI-powered math problem solver using Retrieval-Augmented Generation (RAG) 
              to provide accurate, step-by-step solutions from a curated knowledge base.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/bhoomika-254"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/bhoomika-254"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:bhoomika.254@example.com"
                className="text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Technology
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-600">React + Tailwind CSS</li>
              <li className="text-gray-600">FastAPI Backend</li>
              <li className="text-gray-600">Qdrant Vector DB</li>
              <li className="text-gray-600">RAG Architecture</li>
              <li className="text-gray-600">KaTeX Math Rendering</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 text-gray-600">
              <span>© {currentYear} MathGenius AI. Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for educational purposes.</span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500">
                Built for recruiters & portfolio showcase
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
