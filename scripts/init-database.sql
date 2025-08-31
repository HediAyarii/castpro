-- Updated admin password hash for ADMIN2024 and removed default testimonials to start empty
-- Creating complete database schema for CastPro admin system
-- Initialize CastPro Database Schema

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone1 VARCHAR(20) NOT NULL,
    telephone2 VARCHAR(20),
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio items table (includes both public and private)
CREATE TABLE IF NOT EXISTS portfolio_items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    age VARCHAR(50),
    category VARCHAR(100) NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    experience TEXT,
    specialties JSONB, -- Array of specialties stored as JSON
    is_secret BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Castings table
CREATE TABLE IF NOT EXISTS castings (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location VARCHAR(200),
    date DATE,
    budget VARCHAR(100),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Access keys table
CREATE TABLE IF NOT EXISTS access_keys (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    key VARCHAR(100) UNIQUE NOT NULL,
    permissions JSONB, -- Array of permissions stored as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Media items table (videos and logos)
CREATE TABLE IF NOT EXISTS media_items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('video', 'logo', 'collaboration_video')),
    url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user with password ADMIN2024 (bcrypt hash)
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_secret ON portfolio_items(is_secret);
CREATE INDEX IF NOT EXISTS idx_castings_status ON castings(status);
CREATE INDEX IF NOT EXISTS idx_castings_date ON castings(date);
CREATE INDEX IF NOT EXISTS idx_access_keys_active ON access_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_media_type ON media_items(type);

-- Partner logos table
CREATE TABLE IF NOT EXISTS partner_logos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    logo_url TEXT NOT NULL,
    alt_text TEXT,
    website_url TEXT,
    category VARCHAR(20) NOT NULL DEFAULT 'partner' CHECK (category IN ('partner','client')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
