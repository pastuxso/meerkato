-- Initialize PostgreSQL database with pgvector extension
-- This script runs when the database is first created

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify pgvector is installed
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';

-- Create a test vector table to verify functionality
CREATE TABLE IF NOT EXISTS vector_test (
    id SERIAL PRIMARY KEY,
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add some test data
INSERT INTO vector_test (embedding) VALUES
    ('[1,2,3]'::vector),
    ('[4,5,6]'::vector);

-- Test vector similarity
SELECT
    id,
    embedding,
    embedding <-> '[1,2,3]'::vector as distance
FROM vector_test
ORDER BY embedding <-> '[1,2,3]'::vector
LIMIT 5;

-- Clean up test table
DROP TABLE vector_test;

-- Log successful initialization
SELECT 'pgvector extension successfully initialized' as status;