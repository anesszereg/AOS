-- Driver status table
CREATE TABLE IF NOT EXISTS driver_status (
  driver_id UUID PRIMARY KEY,
  status VARCHAR(20) DEFAULT 'offline',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  last_location_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delivery ratings table
CREATE TABLE IF NOT EXISTS delivery_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID NOT NULL,
  driver_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add delivery_fee and tip columns to deliveries table if they don't exist
ALTER TABLE deliveries 
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS tip DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_driver_status_driver_id ON driver_status(driver_id);
CREATE INDEX IF NOT EXISTS idx_delivery_ratings_driver_id ON delivery_ratings(driver_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_driver_status ON deliveries(driver_id, status);
CREATE INDEX IF NOT EXISTS idx_deliveries_completed_at ON deliveries(completed_at);
