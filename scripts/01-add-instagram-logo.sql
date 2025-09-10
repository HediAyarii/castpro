-- Add Instagram logo to partner_logos table
-- This script runs after the database schema is created

INSERT INTO partner_logos (name, logo_url, alt_text, website_url, category)
VALUES (
    'Instagram CastPro Tunisie',
    '/images/Instagram-Logo.png',
    'Instagram CastPro Tunisie',
    'https://www.instagram.com/castpro_tunisie',
    'partner'
) ON CONFLICT DO NOTHING;
