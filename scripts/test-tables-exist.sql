-- Test script to verify tables exist
-- Run this in psql to check if all tables were created

\echo 'Checking if all required tables exist...'

-- Check each table
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') 
        THEN '✅ users table exists'
        ELSE '❌ users table missing'
    END as users_check;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') 
        THEN '✅ appointments table exists'
        ELSE '❌ appointments table missing'
    END as appointments_check;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'portfolio_items') 
        THEN '✅ portfolio_items table exists'
        ELSE '❌ portfolio_items table missing'
    END as portfolio_items_check;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'castings') 
        THEN '✅ castings table exists'
        ELSE '❌ castings table missing'
    END as castings_check;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'testimonials') 
        THEN '✅ testimonials table exists'
        ELSE '❌ testimonials table missing'
    END as testimonials_check;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'access_keys') 
        THEN '✅ access_keys table exists'
        ELSE '❌ access_keys table missing'
    END as access_keys_check;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'media_items') 
        THEN '✅ media_items table exists'
        ELSE '❌ media_items table missing'
    END as media_items_check;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'partner_logos') 
        THEN '✅ partner_logos table exists'
        ELSE '❌ partner_logos table missing'
    END as partner_logos_check;

-- Show all tables
\echo 'All tables in the database:'
\dt
