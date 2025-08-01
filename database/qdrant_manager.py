"""
Qdrant client wrapper for vector database operations.
"""
import logging
from typing import List, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import time

logger = logging.getLogger(__name__)

class QdrantManager:
    """Manages Qdrant vector database operations."""
    
    def __init__(self, url: str, api_key: str):
        """Initialize Qdrant client."""
        self.client = QdrantClient(url=url, api_key=api_key)
        logger.info(f"Connected to Qdrant at {url}")
    
    def create_collection(self, collection_name: str, vector_size: int, distance: str = "Cosine"):
        """
        Create a new collection in Qdrant.
        
        Args:
            collection_name: Name of the collection
            vector_size: Dimension of vectors
            distance: Distance metric (Cosine, Euclidean, Dot)
        """
        try:
            # Check if collection already exists
            collections = self.client.get_collections().collections
            existing_names = [col.name for col in collections]
            
            if collection_name in existing_names:
                logger.info(f"Collection '{collection_name}' already exists")
                return True
            
            # Create new collection
            distance_map = {
                "Cosine": Distance.COSINE,
                "Euclidean": Distance.EUCLID,
                "Dot": Distance.DOT
            }
            
            self.client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=vector_size,
                    distance=distance_map.get(distance, Distance.COSINE)
                )
            )
            logger.info(f"Created collection '{collection_name}' with vector size {vector_size}")
            return True
            
        except Exception as e:
            logger.error(f"Error creating collection: {e}")
            return False
    
    def upsert_points(self, collection_name: str, points_data: List[Dict[str, Any]], 
                     embeddings: List[List[float]], max_retries: int = 3):
        """
        Upsert points into Qdrant collection with retry logic.
        
        Args:
            collection_name: Name of the collection
            points_data: List of point data dictionaries
            embeddings: List of embedding vectors
            max_retries: Maximum number of retry attempts
        """
        points = []
        for i, (data, embedding) in enumerate(zip(points_data, embeddings)):
            point = PointStruct(
                id=data['id'],
                vector=embedding,
                payload={
                    'problem': data['problem'],
                    'solution': data['solution'],
                    'source': data['source']
                }
            )
            points.append(point)
        
        # Retry logic for network issues
        for attempt in range(max_retries):
            try:
                self.client.upsert(
                    collection_name=collection_name,
                    points=points
                )
                logger.info(f"Successfully upserted {len(points)} points")
                return True
                
            except Exception as e:
                logger.warning(f"Attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    logger.error(f"Failed to upsert points after {max_retries} attempts")
                    raise e
    
    def search_similar(self, collection_name: str, query_vector: List[float], 
                      limit: int = 3, score_threshold: float = 0.0):
        """
        Search for similar vectors in the collection.
        
        Args:
            collection_name: Name of the collection
            query_vector: Query embedding vector
            limit: Number of results to return
            score_threshold: Minimum similarity score
            
        Returns:
            Search results from Qdrant
        """
        try:
            results = self.client.search(
                collection_name=collection_name,
                query_vector=query_vector,
                limit=limit,
                score_threshold=score_threshold
            )
            logger.info(f"Found {len(results)} similar results")
            return results
            
        except Exception as e:
            logger.error(f"Error searching collection: {e}")
            return []
    
    def get_collection_info(self, collection_name: str):
        """Get information about a collection."""
        try:
            info = self.client.get_collection(collection_name)
            logger.info(f"Collection info: {info}")
            return info
        except Exception as e:
            logger.error(f"Error getting collection info: {e}")
            return None
