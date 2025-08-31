-- Migration script to add age field to portfolio_items table
-- Run this script if you have an existing database

-- Add age column to portfolio_items table
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS age VARCHAR(50);

-- Update existing records with default values if needed
-- UPDATE portfolio_items SET age = '' WHERE age IS NULL;

-- Make sure the column is not null (optional, uncomment if needed)
-- ALTER TABLE portfolio_items ALTER COLUMN age SET NOT NULL;
