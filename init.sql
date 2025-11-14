-- Create weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
    city VARCHAR(100) PRIMARY KEY,
    temperature DECIMAL(5, 2) NOT NULL,
    wind_speed DECIMAL(5, 2) NOT NULL,
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on last_updated for faster queries
CREATE INDEX IF NOT EXISTS idx_weather_data_last_updated ON weather_data(last_updated);

-- Create a function to get the last sync timestamp
CREATE OR REPLACE FUNCTION get_last_sync_timestamp()
RETURNS TIMESTAMP AS $$
    SELECT MAX(last_updated) FROM weather_data;
$$ LANGUAGE SQL;

