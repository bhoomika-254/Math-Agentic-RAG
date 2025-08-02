import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Brain, Zap, Shield, Globe, Database } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Solutions',
      description: 'Advanced RAG architecture combines knowledge base search with intelligent web fallback',
      color: 'primary'
    },
    {
      icon: Database,
      title: '5,000+ Math Problems',
      description: 'Curated knowledge base with comprehensive step-by-step solutions',
      color: 'secondary'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Vector similarity search delivers relevant results in milliseconds',
      color: 'yellow'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Multi-layer validation ensures accurate and safe responses',
      color: 'green'
    },
    {
      icon: Globe,
      title: 'Web Fallback',
      description: 'Intelligent fallback to web search when knowledge base confidence is low',
      color: 'blue'
    },
    {
      icon: Calculator,
      title: 'Beautiful Math',
      description: 'KaTeX rendering for properly formatted mathematical expressions',
      color: 'purple'
    }
  ];

  const stats = [
    { label: 'Math Problems Solved', value: '10,000+', color: 'primary' },
    { label: 'Average Response Time', value: '<2s', color: 'secondary' },
    { label: 'Accuracy Rate', value: '95%', color: 'green' },
    { label: 'Knowledge Base Size', value: '5,005', color: 'blue' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'text-primary-600 bg-primary-100',
      secondary: 'text-secondary-600 bg-secondary-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      green: 'text-green-600 bg-green-100',
      blue: 'text-blue-600 bg-blue-100',
      purple: 'text-purple-600 bg-purple-100'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Meet <span className="gradient-text">MathGenius AI</span>
              <br />
              Your Smart Math Companion
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
              Advanced AI-powered math problem solver using Retrieval-Augmented Generation (RAG) 
              to provide accurate, step-by-step solutions from a curated knowledge base of 5,000+ problems.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="btn btn-primary btn-lg group"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Try MathGenius AI
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/about"
                className="btn btn-outline btn-lg"
              >
                Learn How It Works
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold ${stat.color === 'primary' ? 'text-primary-600' : 
                    stat.color === 'secondary' ? 'text-secondary-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    'text-blue-600'}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge AI technology to deliver the most accurate and helpful math solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-hover p-6 group"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(feature.color)} group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our 5-step RAG pipeline ensures you get the most accurate and helpful responses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { step: '1', title: 'Input Validation', desc: 'Guardrails ensure safe and valid math questions' },
              { step: '2', title: 'Knowledge Search', desc: 'Vector similarity search across 5,000+ problems' },
              { step: '3', title: 'Smart Decision', desc: 'AI decides between knowledge base or web search' },
              { step: '4', title: 'Response Validation', desc: 'Quality checks and safety validation' },
              { step: '5', title: 'Analytics & Learning', desc: 'Performance tracking and continuous improvement' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Solve Your Math Problems?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Experience the power of AI-driven math solutions. Get started in seconds.
          </p>
          
          <Link
            to="/search"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl group"
          >
            <Calculator className="h-5 w-5 mr-2" />
            Start Solving Problems
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
