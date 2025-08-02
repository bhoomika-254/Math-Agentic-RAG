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
from services.gemini_service import GeminiService

router = APIRouter()
logger = structlog.get_logger()

# Initialize services (will be properly initialized when packages are installed)
qdrant_service = None
mcp_service = None
guardrails_service = None
gemini_service = None

def initialize_services():
    """Initialize services on first request."""
    global qdrant_service, mcp_service, guardrails_service, gemini_service
    
    if qdrant_service is None:
        qdrant_service = QdrantService()
        mcp_service = MCPService()
        guardrails_service = GuardrailsService()
        gemini_service = GeminiService()

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
        
        # Step 3: Determine if we need web search fallback with enhanced logic
        confidence_threshold = 0.8  # Increased from 0.5 to 0.8 for higher confidence requirement
        best_score = kb_results[0].score if kb_results else 0.0
        
        logger.info("Evaluating search results",
                   kb_results_found=len(kb_results) if kb_results else 0,
                   best_score=best_score,
                   threshold=confidence_threshold)
        
        if best_score >= confidence_threshold:
            # Use knowledge base results - high confidence match found
            source = "KB"
            final_answer = kb_results[0].solution if kb_results else "No solution found"
            explanation = f"High confidence match found (score: {best_score:.3f} ≥ {confidence_threshold})"
            results = kb_results[:3]  # Return top 3 results
            
            logger.info("Using knowledge base results",
                       confidence_score=best_score,
                       results_returned=len(results))
            
        else:
            # First fallback: Web search via MCP
            logger.info("Low confidence KB results, trying web search fallback",
                       best_score=best_score, 
                       threshold=confidence_threshold)
            
            try:
                web_results = await mcp_service.search_web(validated_question)
                mcp_answer = web_results.get("answer", "")
                mcp_confidence = web_results.get("confidence", 0.6)  # Default MCP confidence
                
                logger.info("MCP web search completed",
                           answer_length=len(mcp_answer),
                           mcp_confidence=mcp_confidence)
                
                # Check if MCP results meet confidence threshold
                if mcp_confidence >= confidence_threshold and mcp_answer:
                    # Use MCP results - sufficient confidence
                    source = "MCP"
                    final_answer = mcp_answer
                    explanation = f"KB confidence too low ({best_score:.3f} < {confidence_threshold}), used web search (confidence: {mcp_confidence:.3f})"
                    
                    results = [SearchResult(
                        problem=validated_question,
                        solution=final_answer,
                        score=mcp_confidence
                    )]
                    
                    logger.info("Using MCP web search results",
                               mcp_confidence=mcp_confidence)
                
                else:
                    # Second fallback: Gemini LLM when both KB and MCP have low confidence
                    logger.info("Both KB and MCP have low confidence, falling back to Gemini LLM",
                               kb_score=best_score,
                               mcp_confidence=mcp_confidence,
                               threshold=confidence_threshold)
                    
                    try:
                        if gemini_service and gemini_service.is_available():
                            gemini_result = await gemini_service.solve_math_problem(validated_question)
                            
                            source = "Gemini"
                            final_answer = gemini_result.get("answer", "No solution generated")
                            gemini_confidence = gemini_result.get("confidence", 0.75)
                            explanation = f"Both KB ({best_score:.3f}) and MCP ({mcp_confidence:.3f}) below threshold ({confidence_threshold}), used Gemini LLM"
                            
                            results = [SearchResult(
                                problem=validated_question,
                                solution=final_answer,
                                score=gemini_confidence
                            )]
                            
                            logger.info("Gemini LLM response generated successfully",
                                       answer_length=len(final_answer),
                                       gemini_confidence=gemini_confidence)
                        
                        else:
                            # Ultimate fallback: Use best available result
                            logger.warning("Gemini service unavailable, using best available result")
                            
                            if mcp_answer and len(mcp_answer) > 20:  # Prefer MCP if it has substantial content
                                source = "MCP"
                                final_answer = mcp_answer
                                explanation = f"All services below threshold, using MCP result (confidence: {mcp_confidence:.3f})"
                                results = [SearchResult(problem=validated_question, solution=final_answer, score=mcp_confidence)]
                            else:
                                source = "KB"
                                final_answer = kb_results[0].solution if kb_results else "No solution available"
                                explanation = f"All services below threshold, using best KB result (score: {best_score:.3f})"
                                results = kb_results[:1] if kb_results else []
                    
                    except Exception as gemini_error:
                        logger.error("Gemini LLM failed, using MCP results", error=str(gemini_error))
                        source = "MCP"
                        final_answer = mcp_answer if mcp_answer else "No solution available"
                        explanation = f"Gemini failed, used MCP result (confidence: {mcp_confidence:.3f})"
                        results = [SearchResult(problem=validated_question, solution=final_answer, score=mcp_confidence)] if mcp_answer else []
                
            except Exception as mcp_error:
                logger.error("MCP web search failed, trying Gemini fallback", error=str(mcp_error))
                
                # If MCP fails, try Gemini directly
                try:
                    if gemini_service and gemini_service.is_available():
                        gemini_result = await gemini_service.solve_math_problem(validated_question)
                        
                        source = "Gemini"
                        final_answer = gemini_result.get("answer", "No solution generated")
                        gemini_confidence = gemini_result.get("confidence", 0.75)
                        explanation = f"KB confidence low ({best_score:.3f}), MCP failed, used Gemini LLM"
                        
                        results = [SearchResult(
                            problem=validated_question,
                            solution=final_answer,
                            score=gemini_confidence
                        )]
                        
                        logger.info("Gemini LLM used after MCP failure",
                                   answer_length=len(final_answer))
                    
                    else:
                        # Final fallback to KB results
                        logger.warning("Both MCP and Gemini failed, using KB results")
                        source = "KB"
                        final_answer = kb_results[0].solution if kb_results else "No solution available"
                        explanation = f"MCP and Gemini failed, using best KB result (score: {best_score:.3f})"
                        results = kb_results[:1] if kb_results else []
                
                except Exception as final_error:
                    logger.error("All fallbacks failed, using KB results", error=str(final_error))
                    source = "KB"
                    final_answer = kb_results[0].solution if kb_results else "No solution available"
                    explanation = f"All services failed, using best KB result (score: {best_score:.3f})"
                    results = kb_results[:1] if kb_results else []
        
        
        # Step 4: Validate output with guardrails and create comprehensive response
        logger.info("Validating final answer with guardrails",
                   answer_length=len(final_answer),
                   source=source)
        
        try:
            validated_response = guardrails_service.validate_output(final_answer)
            
            # Check if validation changed the response
            if validated_response != final_answer:
                logger.warning("Guardrails modified the response",
                             original_length=len(final_answer),
                             validated_length=len(validated_response))
            
        except Exception as e:
            logger.error("Guardrails validation failed, using original response", error=str(e))
            validated_response = final_answer
        
        # Calculate response time
        response_time_ms = (time.time() - start_time) * 1000
        
        # Create comprehensive response with enhanced metadata
        response = SearchResponse(
            response_id=response_id,
            final_answer=validated_response,
            source=source,
            explanation=explanation,
            results=results,
            metadata={
                "confidence_score": best_score,
                "threshold_used": confidence_threshold,
                "kb_results_count": len(kb_results) if kb_results else 0,
                "search_strategy": "semantic_similarity" if source == "KB" else "web_search",
                "guardrails_applied": validated_response != final_answer,
                "processing_time_ms": response_time_ms
            },
            response_time_ms=response_time_ms
        )
        
        logger.info("Response created successfully",
                   response_id=response_id,
                   final_answer_length=len(validated_response),
                   results_count=len(results),
                   metadata_fields=len(response.metadata))
        
        # Step 5: Post-processing, analytics, and optimization
        logger.info("Starting post-processing and analytics",
                   response_id=response_id,
                   source=source)
        
        try:
            # 5.1: Performance optimization - cache high-confidence results
            if source == "KB" and best_score >= 0.9:
                logger.info("High confidence result detected for potential caching",
                           confidence_score=best_score,
                           question_hash=hash(validated_question))
            
            # 5.2: Quality assessment
            response_quality = assess_response_quality(
                question=validated_question,
                answer=validated_response,
                source=source,
                confidence=best_score
            )
            
            # 5.3: Add quality metrics to metadata
            response.metadata.update({
                "response_quality": response_quality,
                "optimization_applied": best_score >= 0.9,
                "search_efficiency": calculate_search_efficiency(
                    kb_results_count=len(kb_results) if kb_results else 0,
                    source=source,
                    response_time_ms=response_time_ms
                )
            })
            
            # 5.4: Trigger analytics and learning
            background_tasks.add_task(
                update_analytics,
                question=validated_question,
                response_data=response.dict(),
                performance_metrics={
                    "kb_hit": source == "KB",
                    "confidence_score": best_score,
                    "response_time_ms": response_time_ms,
                    "quality_score": response_quality
                }
            )
            
            logger.info("Post-processing completed successfully",
                       response_id=response_id,
                       quality_score=response_quality,
                       total_metadata_fields=len(response.metadata))
            
        except Exception as e:
            logger.warning("Post-processing failed, but response is still valid", 
                          error=str(e), response_id=response_id)
        
        # Log API call in background for analytics
        background_tasks.add_task(
            log_api_call,
            request=request.dict(),
            response=response.dict(),
            response_time_ms=response_time_ms,
            source=source
        )
        
        # Final completion log with comprehensive metrics
        logger.info("Search request completed successfully",
                   request_id=response_id,
                   source=source,
                   confidence_score=best_score,
                   threshold_used=confidence_threshold,
                   kb_results_count=len(kb_results) if kb_results else 0,
                   final_results_count=len(results),
                   response_time_ms=response_time_ms,
                   guardrails_applied=response.metadata.get("guardrails_applied", False))
        
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

def assess_response_quality(question: str, answer: str, source: str, confidence: float) -> float:
    """
    Assess the quality of the response based on multiple factors.
    
    Returns:
        Quality score between 0.0 and 1.0
    """
    try:
        quality_score = 0.0
        
        # Factor 1: Answer length (not too short, not too long)
        answer_length = len(answer.strip())
        if 50 <= answer_length <= 2000:
            quality_score += 0.3
        elif answer_length > 20:
            quality_score += 0.1
        
        # Factor 2: Source reliability
        if source == "KB":
            quality_score += 0.4 * confidence  # Scale by confidence
        else:
            quality_score += 0.3  # Web search baseline
        
        # Factor 3: Mathematical content indicators
        math_indicators = ['=', '+', '-', '*', '/', '^', '√', '∫', '∑', 'x', 'y', 'equation']
        math_content = sum(1 for indicator in math_indicators if indicator in answer.lower())
        quality_score += min(0.3, math_content * 0.05)
        
        return min(1.0, quality_score)
        
    except Exception as e:
        logger.warning("Quality assessment failed", error=str(e))
        return 0.5  # Default neutral score

def calculate_search_efficiency(kb_results_count: int, source: str, response_time_ms: float) -> float:
    """
    Calculate search efficiency based on results and performance.
    
    Returns:
        Efficiency score between 0.0 and 1.0
    """
    try:
        efficiency = 0.0
        
        # Factor 1: Speed (faster is better)
        if response_time_ms < 1000:
            efficiency += 0.5
        elif response_time_ms < 3000:
            efficiency += 0.3
        else:
            efficiency += 0.1
        
        # Factor 2: Result availability
        if kb_results_count > 0:
            efficiency += 0.3
        
        # Factor 3: Source efficiency (KB is more efficient)
        if source == "KB":
            efficiency += 0.2
        
        return min(1.0, efficiency)
        
    except Exception as e:
        logger.warning("Efficiency calculation failed", error=str(e))
        return 0.5

async def update_analytics(question: str, response_data: dict, performance_metrics: dict):
    """
    Update analytics and learning systems with search data.
    """
    try:
        logger.info("Updating analytics",
                   kb_hit=performance_metrics.get("kb_hit", False),
                   confidence=performance_metrics.get("confidence_score", 0),
                   quality=performance_metrics.get("quality_score", 0))
        
        # Future: Could integrate with ML systems for:
        # - Query pattern analysis
        # - Response quality improvement
        # - Automatic threshold adjustment
        # - Usage pattern detection
        
        # For now, just comprehensive logging
        analytics_data = {
            "question_length": len(question),
            "question_hash": hash(question),
            "timestamp": time.time(),
            **performance_metrics
        }
        
        logger.info("Analytics updated", **analytics_data)
        
    except Exception as e:
        logger.warning("Analytics update failed", error=str(e))
