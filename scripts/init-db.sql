-- Create database if not exists
CREATE DATABASE IF NOT EXISTS express_ts;

-- Create user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'express_user') THEN

      CREATE ROLE express_user LOGIN PASSWORD 'express_password';
   END IF;
END
$do$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE express_ts TO express_user; 