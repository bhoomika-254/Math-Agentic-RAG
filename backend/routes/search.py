"""
Search endpoint for the Math Agentic RAG system.
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
import sys
from pathlib import Path
import structlog
import time
import uuid

# Add parent directory to import database module
parent_dir = Path(__file__).parent.parent.parent
sys.path.append(str(parent_dir))

from models.schemas import SearchRequest, SearchResponse, ErrorResponse, SearchResult
from services.qdrant_service import QdrantService
from services.mcp_service import MCPService
from services.guardrails_service import GuardrailsService

router = APIRouter()
logger = structlog.get_logger()

# Initialize services (will be properly initialized when packages are installed)
qdrant_service = None
mcp_service = None
guardrails_service = None

def initialize_services():
    """Initialize services on first request."""
    global qdrant_service, mcp_service, guardrails_service
    
    if qdrant_service is None:
        qdrant_service = QdrantService()
        mcp_service = MCPService()
        guardrails_service = GuardrailsService()

@router.post("/search", response_model=SearchResponse)
async def search_math_problems(
    request: SearchRequest,
    background_tasks: BackgroundTasks
) -> SearchResponse:
    """
    Search for math problems in knowledge base or web.
    
    Args:
        request: Search request containing the math question
        background_tasks: Background tasks for logging
        
    Returns:
        SearchResponse with results and metadata
    """
    start_time = time.time()
    response_id = str(uuid.uuid4())
    
    try:
        # Initialize services if not already done
        initialize_services()
        
        logger.info("Processing search request", 
                   request_id=response_id, 
                   question=request.question)
        
        # Step 1: Validate input with guardrails
        validated_question = guardrails_service.validate_input(request.question)
        
        # Step 2: Search knowledge base (Qdrant)
        kb_results = await qdrant_service.search_similar(validated_question)
        
        # Step 3: Determine if we need web search fallback
        confidence_threshold = 0.5
        best_score = kb_results[0].score if kb_results else 0.0
        
        if best_score >= confidence_threshold:
            # Use knowledge base results
            source = "KB"
            final_answer = kb_results[0].solution if kb_results else "No solution found"
            explanation = f"Found similar problem with confidence score: {best_score:.3f}"
            results = kb_results[:3]  # Return top 3 results
            
        else:
            # Fallback to web search via MCP
            logger.info("Low confidence KB results, using web search fallback",
                       best_score=best_score, threshold=confidence_threshold)
            
            try:
                web_results = await mcp_service.search_web(validated_question)
                source = "MCP"
                final_answer = web_results.get("answer", "No web results found")
                explanation = f"Knowledge base confidence too low ({best_score:.3f}), used web search"
                
                # Convert web results to SearchResult format
                results = [SearchResult(
                    problem=validated_question,
                    solution=final_answer,
                    score=0.8  # Default score for web results
                )]
                
            except Exception as e:
                logger.error("Web search failed, falling back to KB results", error=str(e))
                source = "KB"
                final_answer = kb_results[0].solution if kb_results else "No solution available"
                explanation = f"Web search failed, using best KB result (score: {best_score:.3f})"
                results = kb_results[:1] if kb_results else []
        
        # Step 4: Validate output with guardrails
        validated_response = guardrails_service.validate_output(final_answer)
        
        # Calculate response time
        response_time_ms = (time.time() - start_time) * 1000
        
        # Create response
        response = SearchResponse(
            response_id=response_id,
            final_answer=validated_response,
            source=source,
            explanation=explanation,
            results=results,
            metadata={
                "confidence_score": best_score,
                "threshold_used": confidence_threshold,
                "kb_results_count": len(kb_results) if kb_results else 0
            },
            response_time_ms=response_time_ms
        )
        
        # Log API call in background
        background_tasks.add_task(
            log_api_call,
            request=request.dict(),
            response=response.dict(),
            response_time_ms=response_time_ms,
            source=source
        )
        
        logger.info("Search request completed successfully",
                   request_id=response_id,
                   source=source,
                   response_time_ms=response_time_ms)
        
        return response
        
    except Exception as e:
        logger.error("Search request failed", 
                    request_id=response_id, 
                    error=str(e))
        
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

async def log_api_call(
    request: dict,
    response: dict,
    response_time_ms: float,
    source: str
):
    """Log API call to Qdrant for analytics."""
    try:
        if qdrant_service:
            await qdrant_service.log_api_call(
                endpoint="/search",
                method="POST",
                request_data=request,
                response_data=response,
                response_time_ms=response_time_ms,
                source=source
            )
    except Exception as e:
        logger.warning("Failed to log API call", error=str(e))
