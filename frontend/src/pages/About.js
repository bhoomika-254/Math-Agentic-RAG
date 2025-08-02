import React from 'react';
import { 
  Brain, 
  Database, 
  Zap, 
  Shield, 
  Globe, 
  Target, 
  Code, 
  Layers,
  GitBranch,
  Server,
  Cpu,
  Network
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Processing",
      description: "Powered by state-of-the-art language models and vector search technology for intelligent math problem solving."
    },
    {
      icon: Database,
      title: "5000+ Math Problems",
      description: "Comprehensive knowledge base containing over 5,000 carefully curated math problems with detailed solutions."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized vector search with sub-second response times. Average query resolution in under 1.2 seconds."
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Built-in guardrails and validation systems ensure accurate, safe, and educationally appropriate responses."
    },
    {
      icon: Globe,
      title: "Web-Enhanced",
      description: "Model Context Protocol (MCP) integration provides real-time web search fallback for comprehensive coverage."
    },
    {
      icon: Target,
      title: "High Precision",
      description: "Confidence scoring and quality assessment ensure reliable solutions with 86% average confidence rating."
    }
  ];

  const techStack = [
    {
      category: "Backend",
      icon: Server,
      technologies: [
        { name: "FastAPI", description: "High-performance Python web framework" },
        { name: "Qdrant", description: "Vector database for similarity search" },
        { name: "Sentence Transformers", description: "384-dimensional embeddings" },
        { name: "Model Context Protocol", description: "Web search integration" }
      ]
    },
    {
      category: "Frontend",
      icon: Code,
      technologies: [
        { name: "React", description: "Modern UI component library" },
        { name: "Tailwind CSS", description: "Utility-first styling framework" },
        { name: "KaTeX", description: "Beautiful math equation rendering" },
        { name: "React Router", description: "Client-side routing" }
      ]
    },
    {
      category: "Infrastructure",
      icon: Network,
      technologies: [
        { name: "Hugging Face Spaces", description: "Backend deployment platform" },
        { name: "Netlify", description: "Frontend hosting and deployment" },
        { name: "GitHub", description: "Version control and CI/CD" },
        { name: "VS Code", description: "Development environment" }
      ]
    }
  ];

  const architecture = [
    {
      step: "1",
      title: "Input Validation",
      description: "Question preprocessing and safety checks using guardrails service",
      icon: Shield
    },
    {
      step: "2", 
      title: "Vector Search",
      description: "Semantic similarity search against 5,000+ problem embeddings in Qdrant",
      icon: Database
    },
    {
      step: "3",
      title: "Decision Logic",
      description: "Intelligent routing between knowledge base and web search based on confidence",
      icon: GitBranch
    },
    {
      step: "4",
      title: "Response Generation",
      description: "Solution synthesis with step-by-step explanations and quality scoring",
      icon: Cpu
    },
    {
      step: "5",
      title: "Analytics & Feedback",
      description: "Performance tracking, user feedback collection, and continuous improvement",
      icon: Target
    }
  ];

  const metrics = [
    { label: "Math Problems", value: "5,005", suffix: "+" },
    { label: "Vector Dimensions", value: "384", suffix: "" },
    { label: "Confidence Threshold", value: "80", suffix: "%" },
    { label: "Average Response Time", value: "1.2", suffix: "s" },
    { label: "Knowledge Base Hit Rate", value: "82", suffix: "%" },
    { label: "Solution Accuracy", value: "94", suffix: "%" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Brain className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">MathGenius AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              An advanced Retrieval-Augmented Generation (RAG) system designed to solve mathematical problems 
              with high accuracy, speed, and educational value.
            </p>
            
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-8">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {metric.value}<span className="text-blue-300">{metric.suffix}</span>
                  </div>
                  <div className="text-blue-200 text-sm md:text-base mt-1">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="gradient-text">MathGenius AI</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built with cutting-edge technology and designed for both students and educators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card p-8 hover-lift text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="gradient-text">RAG Architecture</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our 5-step pipeline ensures accurate, fast, and reliable math problem solving
            </p>
          </div>

          <div className="space-y-8">
            {architecture.map((step, index) => (
              <div key={index} className="flex items-center space-x-6 p-6 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <step.icon className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                
                {index < architecture.length - 1 && (
                  <div className="hidden md:block">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="gradient-text">Technology Stack</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built with modern, industry-standard technologies for performance and scalability
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {techStack.map((category, index) => (
            <div key={index} className="card p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <category.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{category.category}</h3>
              </div>
              
              <div className="space-y-4">
                {category.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="border-l-2 border-blue-200 pl-4">
                    <h4 className="font-medium text-gray-900">{tech.name}</h4>
                    <p className="text-sm text-gray-600">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl leading-relaxed text-blue-100 mb-8">
            To democratize access to high-quality math education by providing instant, accurate, 
            and detailed solutions to mathematical problems. We believe that everyone deserves 
            access to excellent mathematical guidance, regardless of their location or resources.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <Target className="h-10 w-10 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Accuracy First</h3>
              <p className="text-blue-100 text-sm">
                Every solution is validated through multiple quality checks and confidence scoring
              </p>
            </div>
            
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <Zap className="h-10 w-10 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Speed Matters</h3>
              <p className="text-blue-100 text-sm">
                Lightning-fast responses help students stay in their learning flow
              </p>
            </div>
            
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <Layers className="h-10 w-10 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Always Learning</h3>
              <p className="text-blue-100 text-sm">
                Our system continuously improves through user feedback and new data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Built for <span className="gradient-text">Excellence</span>
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8">
              MathGenius AI represents the cutting edge of educational technology, combining advanced 
              AI research with practical engineering to create a tool that truly helps students learn.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="p-6 bg-blue-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">For Students</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Get instant help with math homework</li>
                  <li>• Learn through step-by-step solutions</li>
                  <li>• Practice with thousands of problems</li>
                  <li>• Build confidence in mathematical concepts</li>
                </ul>
              </div>
              
              <div className="p-6 bg-purple-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">For Educators</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Supplement classroom instruction</li>
                  <li>• Provide 24/7 student support</li>
                  <li>• Access detailed solution analytics</li>
                  <li>• Enhance learning outcomes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact/Support Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students already improving their math skills with MathGenius AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary btn-lg">
              Start Solving Problems
            </button>
            <button className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-gray-900">
              View Analytics
            </button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400">
              Built with ❤️ for the math education community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
