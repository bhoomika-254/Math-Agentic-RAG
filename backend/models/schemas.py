"""
Pydantic models for API request/response schemas.
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
import uuid

# Request Models
class SearchRequest(BaseModel):
    """Request model for search endpoint."""
    question: str = Field(..., description="Math question to search for", max_length=200)

class FeedbackRequest(BaseModel):
    """Request model for feedback endpoint."""
    question: str = Field(..., description="Original question")
    response_id: str = Field(..., description="UUID of the response")
    correctness_rating: int = Field(..., ge=1, le=5, description="Rating from 1-5")
    comment: str = Field("", description="Optional feedback comment")

# Response Models
class SearchResult(BaseModel):
    """Individual search result."""
    problem: str = Field(..., description="Math problem statement")
    solution: str = Field(..., description="Solution to the problem")
    score: float = Field(..., description="Similarity score")

class SearchResponse(BaseModel):
    """Response model for search endpoint."""
    response_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    final_answer: str = Field(..., description="The main answer to the question")
    source: Literal["KB", "MCP"] = Field(..., description="Source of the answer")
    explanation: Optional[str] = Field(None, description="Optional explanation")
    results: List[SearchResult] = Field(default_factory=list, description="Detailed search results")
    metadata: dict = Field(default_factory=dict, description="Additional metadata")
    response_time_ms: Optional[float] = Field(None, description="Response time in milliseconds")

class FeedbackResponse(BaseModel):
    """Response model for feedback endpoint."""
    message: str = Field(..., description="Confirmation message")
    feedback_id: str = Field(default_factory=lambda: str(uuid.uuid4()))

# Internal Models
class APILogEntry(BaseModel):
    """Model for logging API requests and responses."""
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    endpoint: str = Field(..., description="API endpoint called")
    method: str = Field(..., description="HTTP method")
    request_data: dict = Field(..., description="Request payload")
    response_data: dict = Field(..., description="Response payload")
    response_time_ms: float = Field(..., description="Response time in milliseconds")
    source: Literal["KB", "MCP"] = Field(..., description="Source of the answer")
    feedback_received: bool = Field(default=False, description="Whether feedback was received")
    status_code: int = Field(..., description="HTTP status code")

class ErrorResponse(BaseModel):
    """Standard error response model."""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
    request_id: Optional[str] = Field(None, description="Request ID for tracking")
