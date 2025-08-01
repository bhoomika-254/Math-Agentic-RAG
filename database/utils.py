"""
Utility functions for data processing and embedding generation.
"""
import logging
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
from datasets import Dataset
import uuid

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmbeddingGenerator:
    """Handles text embedding generation using sentence transformers."""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """Initialize the embedding model."""
        logger.info(f"Loading embedding model: {model_name}")
        self.model = SentenceTransformer(model_name)
        self.model_name = model_name
    
    def embed_text(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts."""
        logger.info(f"Generating embeddings for {len(texts)} texts")
        embeddings = self.model.encode(texts, show_progress_bar=True)
        return embeddings.tolist()
    
    def embed_single_text(self, text: str) -> List[float]:
        """Generate embedding for a single text."""
        embedding = self.model.encode([text])
        return embedding[0].tolist()

def preprocess_dataset_entry(entry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Preprocess a single dataset entry to create combined text for embedding.
    
    Args:
        entry: Dictionary containing 'problem' and 'solution' keys
        
    Returns:
        Processed entry with 'text' field for embedding
    """
    problem = entry.get('problem', '')
    solution = entry.get('solution', '')
    
    # Create combined text for embedding
    combined_text = f"Question: {problem}\nAnswer: {solution}"
    
    return {
        'id': str(uuid.uuid4()),
        'text': combined_text,
        'problem': problem,
        'solution': solution,
        'source': entry.get('source', 'unknown')
    }

def batch_process_dataset(dataset: Dataset, batch_size: int = 100) -> List[List[Dict[str, Any]]]:
    """
    Process dataset in batches for memory efficiency.
    
    Args:
        dataset: HuggingFace dataset
        batch_size: Number of items per batch
        
    Returns:
        List of batches, each containing processed entries
    """
    batches = []
    total_items = len(dataset)
    
    logger.info(f"Processing {total_items} items in batches of {batch_size}")
    
    for i in range(0, total_items, batch_size):
        batch_end = min(i + batch_size, total_items)
        batch_data = dataset[i:batch_end]
        
        # Process each item in the batch
        processed_batch = []
        for j in range(len(batch_data['problem'])):
            entry = {
                'problem': batch_data['problem'][j],
                'solution': batch_data['solution'][j],
                'source': batch_data['source'][j]
            }
            processed_entry = preprocess_dataset_entry(entry)
            processed_batch.append(processed_entry)
        
        batches.append(processed_batch)
        logger.info(f"Processed batch {len(batches)}/{(total_items + batch_size - 1) // batch_size}")
    
    return batches

def format_retrieval_results(results: List[Dict]) -> str:
    """
    Format retrieval results for display.
    
    Args:
        results: List of search results from Qdrant
        
    Returns:
        Formatted string for display
    """
    if not results:
        return "No results found."
    
    output = []
    for i, result in enumerate(results, 1):
        payload = result.payload
        score = result.score
        
        output.append(f"\n--- Result {i} (Score: {score:.4f}) ---")
        output.append(f"Question: {payload['problem']}")
        output.append(f"Answer: {payload['solution'][:200]}...")  # Truncate long answers
        output.append("-" * 50)
    
    return "\n".join(output)
