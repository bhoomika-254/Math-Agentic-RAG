"""
Main ingestion script for loading Nuinamath dataset into Qdrant.
"""
import logging
import os
from datasets import load_dataset
from tqdm import tqdm
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration settings
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "nuinamath")
DATASET_NAME = "AI-MO/NuminaMath-CoT"
DATASET_SPLIT = "train"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
VECTOR_SIZE = 384
DISTANCE_METRIC = "Cosine"
BATCH_SIZE = 100
MAX_SAMPLES = None

# Validation
if not QDRANT_URL or not QDRANT_API_KEY:
    raise ValueError("Please set QDRANT_URL and QDRANT_API_KEY in your .env file")

from utils import EmbeddingGenerator, batch_process_dataset
from qdrant_manager import QdrantManager

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    """Main ingestion pipeline."""
    try:
        # Initialize components
        logger.info("Initializing components...")
        embedding_generator = EmbeddingGenerator(EMBEDDING_MODEL)
        qdrant_manager = QdrantManager(QDRANT_URL, QDRANT_API_KEY)
        
        # Load dataset
        logger.info(f"Loading dataset: {DATASET_NAME}")
        if MAX_SAMPLES:
            dataset = load_dataset(DATASET_NAME, split=f"{DATASET_SPLIT}[:{MAX_SAMPLES}]")
            logger.info(f"Loaded {len(dataset)} samples (limited)")
        else:
            dataset = load_dataset(DATASET_NAME, split=DATASET_SPLIT)
            logger.info(f"Loaded full dataset: {len(dataset)} samples")
        
        # Create Qdrant collection
        logger.info(f"Creating collection: {QDRANT_COLLECTION}")
        success = qdrant_manager.create_collection(
            collection_name=QDRANT_COLLECTION,
            vector_size=VECTOR_SIZE,
            distance=DISTANCE_METRIC
        )
        
        if not success:
            logger.error("Failed to create collection")
            return
        
        # Process dataset in batches
        logger.info("Processing dataset in batches...")
        batches = batch_process_dataset(dataset, BATCH_SIZE)
        
        total_processed = 0
        total_batches = len(batches)
        
        for batch_idx, batch_data in enumerate(tqdm(batches, desc="Processing batches")):
            try:
                # Extract texts for embedding
                texts = [item['text'] for item in batch_data]
                
                # Generate embeddings
                logger.info(f"Generating embeddings for batch {batch_idx + 1}/{total_batches}")
                embeddings = embedding_generator.embed_text(texts)
                
                # Upsert to Qdrant
                logger.info(f"Uploading batch {batch_idx + 1} to Qdrant...")
                qdrant_manager.upsert_points(
                    collection_name=QDRANT_COLLECTION,
                    points_data=batch_data,
                    embeddings=embeddings
                )
                
                total_processed += len(batch_data)
                logger.info(f"Progress: {total_processed}/{len(dataset)} items processed")
                
                # Small delay to avoid overwhelming the API
                time.sleep(0.5)
                
            except Exception as e:
                logger.error(f"Error processing batch {batch_idx + 1}: {e}")
                continue
        
        # Final summary
        logger.info("Ingestion completed!")
        logger.info(f"Total items processed: {total_processed}")
        
        # Get collection info
        collection_info = qdrant_manager.get_collection_info(QDRANT_COLLECTION)
        if collection_info:
            logger.info(f"Collection status: {collection_info.status}")
            logger.info(f"Vectors count: {collection_info.vectors_count}")
        
    except Exception as e:
        logger.error(f"Fatal error in ingestion pipeline: {e}")
        raise

if __name__ == "__main__":
    main()
