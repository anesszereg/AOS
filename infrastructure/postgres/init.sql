-- Create databases for each microservice

CREATE DATABASE auth_db;
CREATE DATABASE user_db;
CREATE DATABASE restaurant_db;
CREATE DATABASE menu_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE delivery_db;
CREATE DATABASE notification_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE user_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE menu_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE order_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE payment_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE delivery_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE notification_db TO postgres;
