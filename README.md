# Math Agentic RAG - Intelligent Math Problem Solver

> An advanced AI-powered mathematics tutoring system that combines knowledge base search, web search, and LLM capabilities to provide comprehensive step-by-step solutions to mathematical problems.

## 🎯 Overview

Math Agentic RAG is a sophisticated educational platform that leverages multiple AI technologies to solve mathematical problems with detailed explanations. The system intelligently routes queries through different knowledge sources to provide the most accurate and comprehensive solutions.

### Key Features

- **🧠 Multi-Source Intelligence**: Combines knowledge base, web search, and Gemini LLM for optimal results
- **📚 Step-by-Step Solutions**: Detailed explanations with mathematical reasoning
- **⚡ Intelligent Routing**: Automatically selects the best source based on confidence scores
- **🎨 Beautiful Math Rendering**: LaTeX-powered mathematical notation with KaTeX
- **📊 Analytics & Feedback**: Built-in performance tracking and user feedback system
- **🔒 Input Validation**: Guardrails for safe and appropriate content
- **🚀 Real-time Processing**: Fast response times with optimized caching

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • Search UI     │    │ • API Routes    │    │ • Qdrant DB    │
│ • Math Render   │    │ • Services      │    │ • Gemini LLM   │
│ • KaTeX Display │    │ • Guardrails    │    │ • MCP Service  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

**Frontend:**
- React 18 with modern hooks
- Tailwind CSS for styling
- KaTeX for mathematical rendering
- React Hot Toast for notifications

**Backend:**
- FastAPI for high-performance APIs
- Pydantic for data validation
- Structlog for comprehensive logging
- Python 3.11+

**AI & Data:**
- Qdrant vector database for semantic search
- Google Gemini 2.0 Flash for LLM processing
- Model Context Protocol (MCP) for web search
- Sentence Transformers for embeddings

## 🚀 Quick Start

### Prerequisites

- Python 3.11 or higher
- Node.js 18+ and npm
- Git

### Environment Setup

1. **Clone the repository:**
```bash
git clone https://github.com/bhoomika-254/Math-Agentic-RAG.git
cd Math-Agentic-RAG
```

2. **Set up environment variables:**
```bash
# Create .env file in the root directory
touch .env
```

Add the following variables to your `.env` file:
```env
# Required API Keys
GEMINI_API_KEY=your_gemini_api_key_here
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION=collection_name

```

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create and activate virtual environment:**
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Start the backend server:**
```bash
python main.py
```
The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory (in a new terminal):**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```
The frontend will be available at `http://localhost:3000`

### Database Setup

1. **Navigate to database directory:**
```bash
cd database
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Ingest sample math data:**
```bash
python ingest.py
```

## 📖 Usage Guide

### Basic Usage

1. **Open the application** in your browser at `http://localhost:3000`

2. **Enter a math question** in the search box, such as:
   - "Find the derivative of f(x) = 3x² + 2x - 1"
   - "Solve the quadratic equation: x² + 5x + 6 = 0"
   - "What is the integral of sin(x) dx?"

3. **View the solution** with step-by-step explanations and beautiful mathematical notation

4. **Provide feedback** using the thumbs up/down buttons to help improve the system

### Advanced Features

- **Copy solutions** to clipboard using the copy button
- **Share results** with the share functionality
- **View metadata** including confidence scores and processing time
- **Explore related solutions** when multiple results are available

## 🛠️ API Documentation

The backend provides RESTful APIs accessible at `http://localhost:8000/docs` (Swagger UI).

### Main Endpoints

- `POST /api/search` - Submit math questions for solving
- `POST /api/feedback` - Submit user feedback on solutions
- `GET /api/health` - Health check endpoint

### System Configuration

The system uses a three-tier approach for solving math problems:

1. **Knowledge Base Search** (Primary): High-confidence semantic search in Qdrant
2. **Web Search via MCP** (Secondary): Real-time web search for current information  
3. **Gemini LLM** (Fallback): Direct AI problem solving when other sources have low confidence

### Confidence Thresholds

- High Confidence: ≥ 0.8 (Use KB results)
- Medium Confidence: 0.6-0.79 (Use MCP results)
- Low Confidence: < 0.6 (Use Gemini LLM)

## 🧪 Development

### Project Structure

```
Math-Agentic-RAG/
├── backend/               # FastAPI backend
│   ├── main.py           # Application entry point
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic services
│   ├── models/           # Pydantic models
│   └── requirements.txt  # Python dependencies
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── utils/        # Utility functions
│   ├── public/           # Static assets
│   └── package.json      # Node dependencies
├── database/             # Database setup and ingestion
│   ├── ingest.py         # Data ingestion script
│   ├── qdrant_manager.py # Database management
│   └── utils.py          # Database utilities
└── README.md             # This file
```

## 🔒 Security & Guardrails

- **Input validation** prevents malicious content
- **Output sanitization** ensures safe responses
- **Rate limiting** prevents abuse
- **API key protection** secures external services

## 🤝 Acknowledgments

- **Qdrant** for vector database capabilities
- **Google Gemini** for advanced language modeling  
- **KaTeX** for beautiful mathematical rendering
- **FastAPI** for high-performance backend framework
- **React** for modern frontend development

---

**Built with ❤️ by bhoomi**