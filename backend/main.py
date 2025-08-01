"""
FastAPI backend for Math Agentic RAG system.
"""
import sys
import os
from pathlib import Path

# Add the parent directory to Python path to import database module
parent_dir = Path(__file__).parent.parent
sys.path.append(str(parent_dir))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import structlog
from dotenv import load_dotenv

# Import routes
from routes.search import router as search_router
from routes.feedback import router as feedback_router

# Load environment variables
load_dotenv()

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    logger.info("Starting Math Agentic RAG Backend...")
    
    # Startup
    try:
        # Initialize services here if needed
        logger.info("Backend services initialized successfully")
        yield
    except Exception as e:
        logger.error("Failed to initialize backend services", error=str(e))
        raise
    finally:
        # Cleanup
        logger.info("Shutting down Math Agentic RAG Backend...")

# Create FastAPI application
app = FastAPI(
    title="Math Agentic RAG API",
    description="Backend API for Math-focused Agentic RAG system with knowledge base and web search capabilities",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(search_router, prefix="/api", tags=["search"])
app.include_router(feedback_router, prefix="/api", tags=["feedback"])

@app.get("/")
async def root():
    """Root endpoint for health check."""
    return {
        "message": "Math Agentic RAG Backend API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": structlog.processors.TimeStamper(fmt="iso")._stamper(),
        "services": {
            "api": "running",
            "database": "connected",  # Will be updated with actual checks
            "mcp": "available"        # Will be updated with actual checks
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
