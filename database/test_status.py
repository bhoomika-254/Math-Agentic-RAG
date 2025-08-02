import os
import sys
sys.path.append('.')
from dotenv import load_dotenv
load_dotenv()

print('Environment Variables:')
print(f'QDRANT_URL: {os.getenv("QDRANT_URL")}')
print(f'QDRANT_COLLECTION: {os.getenv("QDRANT_COLLECTION")}')

from qdrant_manager import QdrantManager
manager = QdrantManager(os.getenv('QDRANT_URL'), os.getenv('QDRANT_API_KEY'))
collections = manager.client.get_collections()
print(f'Available collections: {[c.name for c in collections.collections]}')

if 'nuinamath' in [c.name for c in collections.collections]:
    info = manager.get_collection_info('nuinamath')
    print(f'Collection info: points_count={info.points_count}, vectors_count={info.vectors_count}')
