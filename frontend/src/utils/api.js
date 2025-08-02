// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://bhoomika19-math-routing-agent.hf.space'  // Replace with actual HF Space URL
  : 'http://localhost:8000';

// API endpoints
export const API_ENDPOINTS = {
  search: `${API_BASE_URL}/api/search`,
  feedback: `${API_BASE_URL}/api/feedback`,
};

// Search function
export const searchMathProblem = async (question) => {
  try {
    const response = await fetch(API_ENDPOINTS.search, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Search API error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Feedback function
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await fetch(API_ENDPOINTS.feedback, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Feedback API error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Helper function to format response time
export const formatResponseTime = (ms) => {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
};

// Helper function to get source display name
export const getSourceDisplayName = (source) => {
  switch (source) {
    case 'KB':
      return 'Knowledge Base';
    case 'MCP':
      return 'Web Search';
    default:
      return source;
  }
};

// Helper function to get confidence level
export const getConfidenceLevel = (score) => {
  if (score >= 0.8) return { level: 'High', color: 'green' };
  if (score >= 0.6) return { level: 'Medium', color: 'yellow' };
  if (score >= 0.4) return { level: 'Low', color: 'orange' };
  return { level: 'Very Low', color: 'red' };
};

// Mock analytics data - replace with real API call when backend analytics endpoint is ready
export const getAnalyticsData = async (timeframe = '7d') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: {
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
    }
  };
};
