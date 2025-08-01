"""
Qdrant service for vector database operations.
"""
import sys
from pathlib import Path
import structlog
from typing import List, Dict, Any, Optional

# Add parent directory to import database module
parent_dir = Path(__file__).parent.parent.parent
sys.path.append(str(parent_dir))

try:
    from database.qdrant_manager import QdrantManager
    from database.utils import EmbeddingGenerator
    from models.schemas import SearchResult, APILogEntry
except ImportError as e:
    # Services will be initialized when packages are available
    pass

logger = structlog.get_logger()

class QdrantService:
    """Service layer for Qdrant vector database operations."""
    
    def __init__(self):
        """Initialize Qdrant service."""
        self.qdrant_manager = None
        self.embedding_generator = None
        self._initialize()
    
    def _initialize(self):
        """Initialize Qdrant manager and embedding generator."""
        try:
            # Qdrant configuration (matching database/ingest.py)
            qdrant_config = {
                'url': 'https://7c49e9a8-f84b-4cc8-9e14-bbffdc2e68ad.us-east4-0.gcp.cloud.qdrant.io:6333',
                'api_key': 'aFrfsC3xnXVgMEjClC3VNgY2Hgp0f6A5Zd30UM5yQJx4SkEPgn4xSw',
                'collection_name': 'math_problems'
            }
            
            self.qdrant_manager = QdrantManager(
                url=qdrant_config['url'],
                api_key=qdrant_config['api_key']
            )
            
            self.embedding_generator = EmbeddingGenerator()
            
            logger.info("Qdrant service initialized successfully")
            
        except Exception as e:
            logger.error("Failed to initialize Qdrant service", error=str(e))
            # Service will work in degraded mode
    
    async def search_similar(self, question: str, limit: int = 5) -> List[SearchResult]:
        """
        Search for similar math problems in the knowledge base.
        
        Args:
            question: The math question to search for
            limit: Maximum number of results to return
            
        Returns:
            List of SearchResult objects
        """
        if not self.qdrant_manager or not self.embedding_generator:
            logger.warning("Qdrant service not properly initialized")
            return []
        
        try:
            # Generate embedding for the question
            query_embedding = self.embedding_generator.embed_text(question)
            
            # Search in Qdrant
            results = self.qdrant_manager.search_similar(
                collection_name='math_problems',
                query_vector=query_embedding,
                limit=limit
            )
            
            # Convert to SearchResult objects
            search_results = []
            for result in results:
                payload = result.payload
                search_result = SearchResult(
                    problem=payload.get('problem', ''),
                    solution=payload.get('solution', ''),
                    score=result.score
                )
                search_results.append(search_result)
            
            logger.info("Knowledge base search completed",
                       question_length=len(question),
                       results_count=len(search_results),
                       best_score=search_results[0].score if search_results else 0)
            
            return search_results
            
        except Exception as e:
            logger.error("Knowledge base search failed", error=str(e))
            return []
    
    async def log_api_call(
        self,
        endpoint: str,
        method: str,
        request_data: Dict[str, Any],
        response_data: Dict[str, Any],
        response_time_ms: float,
        source: str
    ):
        """
        Log API call to Qdrant for analytics.
        
        Args:
            endpoint: API endpoint called
            method: HTTP method
            request_data: Request payload
            response_data: Response payload
            response_time_ms: Response time in milliseconds
            source: Source of the response (KB/MCP)
        """
        if not self.qdrant_manager or not self.embedding_generator:
            logger.warning("Cannot log API call - Qdrant service not initialized")
            return
        
        try:
            # Create log entry
            log_entry = APILogEntry(
                endpoint=endpoint,
                method=method,
                request_data=request_data,
                response_data=response_data,
                response_time_ms=response_time_ms,
                source=source
            )
            
            # TODO: Store log entry in Qdrant analytics collection
            # For now, just log to stdout
            logger.info("API call logged",
                       endpoint=endpoint,
                       method=method,
                       response_time_ms=response_time_ms,
                       source=source)
            
        except Exception as e:
            logger.warning("Failed to log API call", error=str(e))
