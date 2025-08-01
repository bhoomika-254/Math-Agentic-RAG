"""
Test script for retrieving similar math problems from Qdrant.
"""
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration settings
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY") 
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "nuinamath")
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

from utils import EmbeddingGenerator, format_retrieval_results
from qdrant_manager import QdrantManager

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_retrieval():
    """Test the retrieval system with sample math questions."""
    
    # Sample test questions
    test_questions = [
        "What is the value of x in 3x + 5 = 20?",
        "How do you find the area of a triangle given 3 sides?",
        "Solve for y: 2y - 7 = 15",
        "What is the derivative of x^2 + 3x?",
        "Find the arithmetic sequence common difference"
    ]
    
    try:
        # Initialize components
        logger.info("Initializing retrieval system...")
        embedding_generator = EmbeddingGenerator(EMBEDDING_MODEL)
        qdrant_manager = QdrantManager(QDRANT_URL, QDRANT_API_KEY)
        
        # Test each question
        for i, question in enumerate(test_questions, 1):
            print(f"\n{'='*60}")
            print(f"TEST QUERY {i}: {question}")
            print('='*60)
            
            # Generate embedding for the question
            query_embedding = embedding_generator.embed_single_text(question)
            
            # Search for similar problems
            results = qdrant_manager.search_similar(
                collection_name=QDRANT_COLLECTION,
                query_vector=query_embedding,
                limit=3,
                score_threshold=0.1
            )
            
            # Format and display results
            formatted_results = format_retrieval_results(results)
            print(formatted_results)
    
    except Exception as e:
        logger.error(f"Error in retrieval test: {e}")

def test_collection_status():
    """Check the status of the Qdrant collection."""
    try:
        qdrant_manager = QdrantManager(QDRANT_URL, QDRANT_API_KEY)
        
        print(f"\n{'='*40}")
        print("COLLECTION STATUS")
        print('='*40)
        
        info = qdrant_manager.get_collection_info(QDRANT_COLLECTION)
        if info:
            print(f"Collection Name: {QDRANT_COLLECTION}")
            print(f"Status: {info.status}")
            print(f"Vectors Count: {info.vectors_count}")
            print(f"Vector Size: {info.config.params.vectors.size}")
            print(f"Distance Metric: {info.config.params.vectors.distance}")
        else:
            print("Collection not found or error occurred")
            
    except Exception as e:
        logger.error(f"Error checking collection status: {e}")

if __name__ == "__main__":
    print("Testing Qdrant Collection Status...")
    test_collection_status()
    
    print("\n\nTesting Retrieval System...")
    test_retrieval()
