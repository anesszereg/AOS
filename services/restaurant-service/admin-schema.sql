-- Add rejection_reason column to restaurants table
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Update status enum if needed (status can be: pending, active, rejected, suspended)
-- The status column should already exist, this is just documentation
