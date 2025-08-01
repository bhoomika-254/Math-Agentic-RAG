# Database Module - Math Agentic RAG

This module handles the knowledge base creation and retrieval for the Math Agentic RAG system.

## Files Overview

### Core Files
- **`utils.py`** - Utility functions for embedding generation and data processing
- **`qdrant_manager.py`** - Qdrant vector database client wrapper
- **`ingest.py`** - Main ingestion script for loading dataset into Qdrant (includes config)
- **`test_retrieval.py`** - Testing script for validating retrieval functionality (includes config)

### Dependencies
- **`requirements.txt`** - Python package dependencies

## Usage

1. **Setup Environment Variables**: Ensure `.env` file has Qdrant credentials
2. **Install Dependencies**: `pip install -r requirements.txt`
3. **Ingest Data**: `python ingest.py`
4. **Test Retrieval**: `python test_retrieval.py`

## Current Status
- ✅ Dataset: Nuinamath (5,000 mathematical problems)
- ✅ Vector DB: Qdrant Cloud 
- ✅ Embedding Model: all-MiniLM-L6-v2 (384 dimensions)
- ✅ Status: Ready for Phase 2
