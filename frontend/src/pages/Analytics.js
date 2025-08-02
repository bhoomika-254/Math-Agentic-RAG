import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Database, Clock, Target, Users, Globe, Brain } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalQueries: 0,
    averageResponseTime: 0,
    kbHitRate: 0,
    averageConfidence: 0,
    totalUsers: 0,
    popularTopics: [],
    responseTimeHistory: [],
    confidenceDistribution: [],
    sourceBreakdown: { KB: 0, MCP: 0 }
  });

  const [timeframe, setTimeframe] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    // In a real app, this would fetch from your backend
    const loadAnalytics = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API call
      const mockData = {
        totalQueries: 2847,
        averageResponseTime: 1.2,
        kbHitRate: 0.82,
        averageConfidence: 0.86,
        totalUsers: 156,
        popularTopics: [
          { topic: 'Quadratic Equations', count: 342, percentage: 12.0 },
          { topic: 'Calculus Derivatives', count: 298, percentage: 10.5 },
          { topic: 'Linear Algebra', count: 267, percentage: 9.4 },
          { topic: 'Trigonometry', count: 234, percentage: 8.2 },
          { topic: 'Integration', count: 198, percentage: 7.0 },
          { topic: 'Statistics', count: 187, percentage: 6.6 }
        ],
        responseTimeHistory: [
          { date: '2024-01-01', avgTime: 1.1 },
          { date: '2024-01-02', avgTime: 1.3 },
          { date: '2024-01-03', avgTime: 1.0 },
          { date: '2024-01-04', avgTime: 1.4 },
          { date: '2024-01-05', avgTime: 1.2 },
          { date: '2024-01-06', avgTime: 1.1 },
          { date: '2024-01-07', avgTime: 1.2 }
        ],
        confidenceDistribution: [
          { range: '90-100%', count: 1520, percentage: 53.4 },
          { range: '80-89%', count: 823, percentage: 28.9 },
          { range: '70-79%', count: 341, percentage: 12.0 },
          { range: '60-69%', count: 118, percentage: 4.1 },
          { range: '50-59%', count: 45, percentage: 1.6 }
        ],
        sourceBreakdown: { KB: 82, MCP: 18 }
      };
      
      setStats(mockData);
      setIsLoading(false);
    };

    loadAnalytics();
  }, [timeframe]);

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => (
    <div className="card p-6 hover-lift">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600 font-medium">{trend}</span>
          <span className="text-sm text-gray-500 ml-1">vs last period</span>
        </div>
      )}
    </div>
  );

  const ProgressBar = ({ label, percentage, color = 'blue' }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
        <span>{label}</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="gradient-text">Analytics</span> Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                System performance and usage insights
              </p>
            </div>
            
            <div className="flex space-x-2">
              {['24h', '7d', '30d', '90d'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    timeframe === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Queries"
            value={stats.totalQueries.toLocaleString()}
            subtitle="Math problems solved"
            trend="+12.5%"
            color="blue"
          />
          
          <StatCard
            icon={Clock}
            title="Avg Response Time"
            value={`${stats.averageResponseTime}s`}
            subtitle="Lightning fast"
            trend="-8.2%"
            color="green"
          />
          
          <StatCard
            icon={Database}
            title="KB Hit Rate"
            value={`${(stats.kbHitRate * 100).toFixed(1)}%`}
            subtitle="Knowledge base efficiency"
            trend="+3.1%"
            color="purple"
          />
          
          <StatCard
            icon={Target}
            title="Avg Confidence"
            value={`${(stats.averageConfidence * 100).toFixed(1)}%`}
            subtitle="Solution accuracy"
            trend="+5.7%"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Popular Topics */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Popular Topics</h2>
              <Brain className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {stats.popularTopics.map((topic, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{topic.topic}</span>
                      <span className="text-sm text-gray-600">{topic.count} queries</span>
                    </div>
                    <ProgressBar percentage={topic.percentage} color="blue" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Based on {stats.totalQueries.toLocaleString()} total queries
              </p>
            </div>
          </div>

          {/* Confidence Distribution */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Confidence Distribution</h2>
              <Target className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {stats.confidenceDistribution.map((range, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{range.range}</span>
                      <span className="text-sm text-gray-600">{range.count} responses</span>
                    </div>
                    <ProgressBar 
                      percentage={range.percentage} 
                      color={index === 0 ? 'green' : index === 1 ? 'blue' : index === 2 ? 'yellow' : 'red'} 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Higher confidence scores indicate more accurate solutions
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Source Breakdown */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Source Breakdown</h2>
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.sourceBreakdown.KB / 100)}`}
                      className="text-blue-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{stats.sourceBreakdown.KB}%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-2" />
                    <span className="text-sm font-medium text-gray-900">Knowledge Base</span>
                  </div>
                  <span className="text-sm text-gray-600">{stats.sourceBreakdown.KB}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-2" />
                    <span className="text-sm font-medium text-gray-900">Web Search (MCP)</span>
                  </div>
                  <span className="text-sm text-gray-600">{stats.sourceBreakdown.MCP}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">System Health</h2>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Database Status</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Healthy
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">MCP Service</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Guardrails</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Enabled
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Vector Index</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  5,005 entries
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Uptime</span>
                <span className="text-sm text-gray-600">99.9%</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Performance</h2>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Response Time (avg)</span>
                  <span>{stats.averageResponseTime}s</span>
                </div>
                <ProgressBar percentage={85} color="green" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Accuracy Score</span>
                  <span>{(stats.averageConfidence * 100).toFixed(1)}%</span>
                </div>
                <ProgressBar percentage={stats.averageConfidence * 100} color="blue" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>User Satisfaction</span>
                  <span>92.3%</span>
                </div>
                <ProgressBar percentage={92.3} color="purple" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Cache Hit Rate</span>
                  <span>78.5%</span>
                </div>
                <ProgressBar percentage={78.5} color="orange" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Analytics data is updated in real-time. All metrics are calculated for the selected time period.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
