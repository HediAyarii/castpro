# <CHANGE> Creating database setup instructions
# CastPro Database Setup

## Quick Start

1. **Start the database:**
   \`\`\`bash
   docker-compose up -d postgres
   \`\`\`

2. **Verify the database is running:**
   \`\`\`bash
   docker-compose ps
   \`\`\`

3. **Access the database:**
   - Host: localhost
   - Port: 5432
   - Database: castpro_db
   - Username: castpro_user
   - Password: castpro_password_2024

## Optional: Database Management with pgAdmin

1. **Start pgAdmin:**
   \`\`\`bash
   docker-compose up -d pgadmin
   \`\`\`

2. **Access pgAdmin:**
   - URL: http://localhost:8080
   - Email: admin@castpro.com
   - Password: admin2024

3. **Connect to PostgreSQL in pgAdmin:**
   - Host: postgres (container name)
   - Port: 5432
   - Database: castpro_db
   - Username: castpro_user
   - Password: castpro_password_2024

## Database Schema

The database includes the following tables:
- `users` - Admin authentication
- `appointments` - Appointment bookings
- `portfolio_items` - Public and private portfolio items
- `castings` - Casting announcements
- `testimonials` - Client testimonials
- `access_keys` - API access keys
- `media_items` - Collaboration videos and partner logos

## Environment Setup

1. Copy `.env.example` to `.env`
2. Update the database connection string if needed
3. Set your admin password and JWT secrets

## Stopping Services

\`\`\`bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v
