import React, { useState } from 'react';
import { Search as SearchIcon, Send, Clock, Database, Globe, ThumbsUp, ThumbsDown, Copy, Share2 } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import toast from 'react-hot-toast';

import { searchMathProblem, submitFeedback, formatResponseTime, getSourceDisplayName, getConfidenceLevel } from '../utils/api';

const Search = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Please enter a math question');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      const result = await searchMathProblem(question);
      
      if (result.success) {
        setSearchResult(result.data);
        toast.success('Solution found!');
      } else {
        setError(result.error);
        toast.error('Failed to get solution');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (isCorrect) => {
    if (!searchResult) return;

    try {
      const feedbackData = {
        question: question,
        response: searchResult.final_answer,
        correct: isCorrect,
        response_id: searchResult.response_id
      };

      const result = await submitFeedback(feedbackData);
      
      if (result.success) {
        toast.success('Thanks for your feedback!');
      } else {
        toast.error('Error submitting feedback');
      }
    } catch (err) {
      toast.error('Failed to submit feedback');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'MathGenius AI Solution',
        text: `Question: ${question}\n\nSolution: ${searchResult?.final_answer}`,
        url: window.location.href,
      });
    } else {
      copyToClipboard(`Question: ${question}\n\nSolution: ${searchResult?.final_answer}`);
    }
  };

  const renderMathContent = (content) => {
    if (!content) return '';
    
    // Convert LaTeX \(...\) and \[...\] to $...$ and $$...$$ format
    let processedContent = content
      .replace(/\\?\\\(/g, '$')      // \( -> $
      .replace(/\\?\\\)/g, '$')      // \) -> $
      .replace(/\\?\\\[/g, '$$')     // \[ -> $$
      .replace(/\\?\\\]/g, '$$');    // \] -> $$
    
    // Handle line breaks and create formatted sections
    const sections = processedContent.split(/\n\s*\n/); // Split on empty lines
    
    return (
      <div className="space-y-4">
        {sections.map((section, sectionIndex) => {
          const lines = section.split('\n');
          
          return (
            <div key={sectionIndex} className="section">
              {lines.map((line, lineIndex) => {
                // Check if line is a section header
                if (line.match(/^(Solution Steps?|Final Answer|Verification):/i)) {
                  return (
                    <h4 key={lineIndex} className="text-lg font-semibold text-gray-900 mt-6 mb-3 first:mt-0">
                      {line}
                    </h4>
                  );
                }
                
                // Process math in the line with robust error handling
                try {
                  const mathRegex = /\$\$(.+?)\$\$|\$(.+?)\$/g;
                  const parts = line.split(mathRegex);
                  
                  if (parts.length === 1 && !line.trim()) {
                    return null; // Skip empty lines
                  }
                  
                  return (
                    <div key={lineIndex} className="mb-2 leading-relaxed">
                      {parts.map((part, partIndex) => {
                        if (partIndex % 3 === 1) {
                          // Block math ($$...$$)
                          try {
                            // Clean the math expression before rendering
                            const cleanMath = part.trim();
                            if (!cleanMath) return null;
                            return <BlockMath key={partIndex} math={cleanMath} />;
                          } catch (e) {
                            console.warn('KaTeX block math error:', e.message, 'for expression:', part);
                            return (
                              <div key={partIndex} className="inline-block text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded border">
                                {part}
                              </div>
                            );
                          }
                        } else if (partIndex % 3 === 2) {
                          // Inline math ($...$)
                          try {
                            // Clean the math expression before rendering
                            const cleanMath = part.trim();
                            if (!cleanMath) return null;
                            return <InlineMath key={partIndex} math={cleanMath} />;
                          } catch (e) {
                            console.warn('KaTeX inline math error:', e.message, 'for expression:', part);
                            return (
                              <span key={partIndex} className="text-gray-800 font-mono bg-gray-100 px-1 rounded border">
                                {part}
                              </span>
                            );
                          }
                        } else {
                          // Regular text
                          return part ? <span key={partIndex}>{part}</span> : null;
                        }
                      })}
                    </div>
                  );
                } catch (e) {
                  console.warn('Error processing line:', e.message, 'for line:', line);
                  return <div key={lineIndex} className="mb-2 leading-relaxed text-gray-800">{line}</div>;
                }
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const exampleQuestions = [
    "Solve the quadratic equation: x² + 5x + 6 = 0",
    "Find the derivative of f(x) = 3x² + 2x - 1",
    "What is the integral of sin(x) dx?",
    "Calculate the limit: lim(x→0) (sin(x)/x)",
    "Solve the system: 2x + 3y = 7, x - y = 1"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="gradient-text">Search & Solve</span> Math Problems
          </h1>
          <p className="text-lg text-gray-600">
            Ask any math question and get detailed, step-by-step solutions
          </p>
        </div>

        {/* Search Form */}
        <div className="card p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your math question here... (e.g., Solve x² + 5x + 6 = 0)"
                className="textarea pl-10 h-32 resize-none"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {question.length}/1000 characters
              </span>
              
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="btn btn-primary btn-md"
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner mr-2" />
                    Solving...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Solve Problem
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Example Questions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Try these examples:</h3>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(example)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="card p-6 mb-8 border-red-200 bg-red-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <SearchIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-900">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResult && (
          <div className="space-y-6">
            {/* Result Header */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Solution</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatResponseTime(searchResult.response_time_ms)}
                    </div>
                    
                    <div className="flex items-center">
                      {searchResult.source === 'KB' ? (
                        <Database className="h-4 w-4 mr-1" />
                      ) : (
                        <Globe className="h-4 w-4 mr-1" />
                      )}
                      {getSourceDisplayName(searchResult.source)}
                    </div>
                    
                    {searchResult.metadata?.confidence_score && (
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          getConfidenceLevel(searchResult.metadata.confidence_score).color === 'green' 
                            ? 'bg-green-100 text-green-800'
                            : getConfidenceLevel(searchResult.metadata.confidence_score).color === 'yellow'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getConfidenceLevel(searchResult.metadata.confidence_score).level} Confidence
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(searchResult.final_answer)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={shareResult}
                    className="btn btn-secondary btn-sm"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Your Question:</h3>
                <p className="text-gray-700">{question}</p>
              </div>
            </div>

            {/* Answer */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
              
              <div className="prose max-w-none">
                <div className="bg-white p-6 rounded-lg border border-gray-200 math-content">
                  {renderMathContent(searchResult.final_answer)}
                </div>
              </div>

              {searchResult.explanation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                  <p className="text-blue-800 text-sm">{searchResult.explanation}</p>
                </div>
              )}
            </div>

            {/* Additional Results */}
            {searchResult.results && searchResult.results.length > 1 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Solutions</h3>
                
                <div className="space-y-4">
                  {searchResult.results.slice(1).map((result, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">Alternative Solution {index + 1}</h4>
                        <span className="text-xs text-gray-500">
                          Score: {(result.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{result.problem}</p>
                      <div className="text-sm text-gray-600">
                        {renderMathContent(result.solution)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Was this solution helpful?</h3>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleFeedback(true)}
                  className="btn btn-outline btn-md group"
                >
                  <ThumbsUp className="h-4 w-4 mr-2 group-hover:text-green-600" />
                  Yes, helpful
                </button>
                
                <button
                  onClick={() => handleFeedback(false)}
                  className="btn btn-outline btn-md group"
                >
                  <ThumbsDown className="h-4 w-4 mr-2 group-hover:text-red-600" />
                  Needs improvement
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mt-3">
                Your feedback helps us improve the quality of our solutions.
              </p>
            </div>

            {/* Metadata */}
            {searchResult.metadata && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Response ID:</span>
                    <br />
                    <span className="text-gray-600 font-mono text-xs">{searchResult.response_id}</span>
                  </div>
                  
                  {searchResult.metadata.confidence_score && (
                    <div>
                      <span className="font-medium text-gray-700">Confidence:</span>
                      <br />
                      <span className="text-gray-600">{(searchResult.metadata.confidence_score * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  
                  {searchResult.metadata.kb_results_count !== undefined && (
                    <div>
                      <span className="font-medium text-gray-700">KB Results:</span>
                      <br />
                      <span className="text-gray-600">{searchResult.metadata.kb_results_count}</span>
                    </div>
                  )}
                  
                  {searchResult.metadata.search_strategy && (
                    <div>
                      <span className="font-medium text-gray-700">Strategy:</span>
                      <br />
                      <span className="text-gray-600">{searchResult.metadata.search_strategy}</span>
                    </div>
                  )}
                  
                  {searchResult.metadata.response_quality && (
                    <div>
                      <span className="font-medium text-gray-700">Quality Score:</span>
                      <br />
                      <span className="text-gray-600">{(searchResult.metadata.response_quality * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  
                  {searchResult.metadata.guardrails_applied !== undefined && (
                    <div>
                      <span className="font-medium text-gray-700">Safety Check:</span>
                      <br />
                      <span className="text-gray-600">
                        {searchResult.metadata.guardrails_applied ? 'Applied' : 'Passed'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
