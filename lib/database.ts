import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'castpro_db',
  user: process.env.DB_USER || 'castpro_user',
  password: process.env.DB_PASSWORD || 'castpro_password_2024',
})

// Helper function to execute SQL queries
async function sql(strings: TemplateStringsArray, ...values: any[]) {
  // Ensure undefined values are treated as NULL and keep placeholders aligned
  const processedValues = values.map((v) => (v === undefined ? null : v))
  const query = strings.reduce((result, str, i) => {
    const needsPlaceholder = i < processedValues.length
    return result + str + (needsPlaceholder ? `$${i + 1}` : '')
  }, '')
  const client = await pool.connect()
  try {
    const result = await client.query(query, processedValues)
    return result.rows
  } finally {
    client.release()
  }
}

// Testimonials
export async function getTestimonials() {
  try {
    const testimonials = await sql`
      SELECT * FROM testimonials 
      ORDER BY created_at DESC
    `
    return testimonials
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}

export async function createTestimonial(data: any) {
  try {
    // Générer un ID unique
    const id = `testimonial_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    const name = data.name ?? 'Témoignage'
    const role = data.role ?? ''
    const content = data.content ?? ''
    const rating = Number.isFinite(Number(data.rating)) && Number(data.rating) >= 1 && Number(data.rating) <= 5
      ? Number(data.rating)
      : 5
    const image = (typeof data.image === 'string' && data.image.trim() !== '') ? data.image : null
    
    const result = await sql`
      INSERT INTO testimonials (id, name, role, content, rating, image)
      VALUES (${id}, ${name}, ${role}, ${content}, ${rating}, ${image})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating testimonial:", error)
    throw error
  }
}

export async function updateTestimonial(id: string, data: any) {
  try {
    const result = await sql`
      UPDATE testimonials 
      SET name = ${data.name}, role = ${data.role}, content = ${data.content}, 
          rating = ${data.rating}, image = ${data.image}
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error updating testimonial:", error)
    throw error
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await sql`DELETE FROM testimonials WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    throw error
  }
}

// Portfolio
export async function getPortfolioItems(isSecret = false) {
  try {
    const items = await sql`
      SELECT * FROM portfolio_items 
      WHERE is_secret = ${isSecret}
      ORDER BY created_at DESC
    `
    return items
  } catch (error) {
    console.error("Error fetching portfolio items:", error)
    return []
  }
}

export async function createPortfolioItem(data: any) {
  try {
    // Générer un ID unique
    const id = `portfolio_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    
    const result = await sql`
      INSERT INTO portfolio_items (id, name, age, category, image, description, experience, specialties, is_secret)
      VALUES (${id}, ${data.name}, ${data.age}, ${data.category}, ${data.image}, ${data.description}, 
              ${data.experience}, ${data.specialties}, ${data.is_secret || false})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating portfolio item:", error)
    throw error
  }
}

export async function updatePortfolioItem(id: number, data: any) {
  try {
    const result = await sql`
      UPDATE portfolio_items 
      SET name = ${data.name}, age = ${data.age}, category = ${data.category}, image = ${data.image},
          description = ${data.description}, experience = ${data.experience}, 
          specialties = ${data.specialties}, is_secret = ${data.is_secret}
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error updating portfolio item:", error)
    throw error
  }
}

export async function deletePortfolioItem(id: number) {
  try {
    await sql`DELETE FROM portfolio_items WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting portfolio item:", error)
    throw error
  }
}

// Castings
export async function getCastings() {
  try {
    const castings = await sql`
      SELECT * FROM castings 
      ORDER BY created_at DESC
    `
    return castings
  } catch (error) {
    console.error("Error fetching castings:", error)
    return []
  }
}

export async function createCasting(data: any) {
  try {
    // Générer un ID unique
    const id = `casting_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    
    const result = await sql`
      INSERT INTO castings (id, title, description, requirements, location, date, budget, status)
      VALUES (${id}, ${data.title}, ${data.description}, ${data.requirements}, 
              ${data.location}, ${data.date}, ${data.budget}, ${data.status || "open"})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating casting:", error)
    throw error
  }
}

export async function updateCasting(id: string, data: any) {
  try {
    const result = await sql`
      UPDATE castings 
      SET title = ${data.title}, description = ${data.description}, 
          requirements = ${data.requirements}, location = ${data.location},
          date = ${data.date}, budget = ${data.budget}, status = ${data.status}
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error updating casting:", error)
    throw error
  }
}

export async function deleteCasting(id: string) {
  try {
    await sql`DELETE FROM castings WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting casting:", error)
    throw error
  }
}

// Appointments
export async function getAppointments() {
  try {
    const appointments = await sql`
      SELECT * FROM appointments 
      ORDER BY created_at DESC
    `
    return appointments
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return []
  }
}

export async function createAppointment(data: any) {
  try {
    const result = await sql`
      INSERT INTO appointments (nom, prenom, telephone1, telephone2, date, time, status)
      VALUES (${data.nom}, ${data.prenom}, ${data.telephone1}, ${data.telephone2}, 
              ${data.date}, ${data.time}, ${data.status || "pending"})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating appointment:", error)
    throw error
  }
}

export async function updateAppointmentStatus(id: number, status: string) {
  try {
    const result = await sql`
      UPDATE appointments 
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error updating appointment status:", error)
    throw error
  }
}

// Collaboration Videos
export async function getCollaborationVideos() {
  try {
    const videos = await sql`
      SELECT * FROM collaboration_videos 
      ORDER BY created_at DESC
    `
    return videos
  } catch (error) {
    console.error("Error fetching collaboration videos:", error)
    return []
  }
}

export async function createCollaborationVideo(data: any) {
  try {
    const result = await sql`
      INSERT INTO collaboration_videos (title, description, video_url)
      VALUES (${data.title}, ${data.description}, ${data.video_url})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating collaboration video:", error)
    throw error
  }
}

export async function deleteCollaborationVideo(id: number) {
  try {
    await sql`DELETE FROM collaboration_videos WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting collaboration video:", error)
    throw error
  }
}

// Partner Logos
export async function getPartnerLogos() {
  try {
    const logos = await sql`
      SELECT * FROM partner_logos 
      ORDER BY created_at DESC
    `
    return logos
  } catch (error) {
    console.error("Error fetching partner logos:", error)
    return []
  }
}

export async function createPartnerLogo(data: any) {
  try {
    const category = (data.category === 'client' ? 'client' : 'partner')
    const result = await sql`
      INSERT INTO partner_logos (name, logo_url, alt_text, website_url, category)
      VALUES (${data.name}, ${data.logo_url}, ${data.alt_text}, ${data.website_url}, ${category})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating partner logo:", error)
    throw error
  }
}

export async function deletePartnerLogo(id: number) {
  try {
    await sql`DELETE FROM partner_logos WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting partner logo:", error)
    throw error
  }
}

// Access Keys
export async function getAccessKeys() {
  try {
    const keys = await sql`
      SELECT * FROM access_keys 
      ORDER BY created_at DESC
    `
    return keys
  } catch (error) {
    console.error("Error fetching access keys:", error)
    return []
  }
}

export async function createAccessKey(data: any) {
  try {
    const keyValue = "ck_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const id = `key_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    const name = data.name || 'Clé d\'accès'
    const permissions = JSON.stringify(data.permissions || [])
    const expiresAt = data.expires_at || null
    const isActive = data.is_active !== undefined ? data.is_active : true
    
    const result = await sql`
      INSERT INTO access_keys (id, name, key, permissions, expires_at, is_active)
      VALUES (${id}, ${name}, ${keyValue}, ${permissions}::jsonb, ${expiresAt}, ${isActive})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating access key:", error)
    throw error
  }
}

export async function updateAccessKey(data: any) {
  try {
    const name = data.name || 'Clé d\'accès'
    const permissions = JSON.stringify(data.permissions || [])
    const expiresAt = data.expires_at || null
    const isActive = data.is_active !== undefined ? data.is_active : true
    
    const result = await sql`
      UPDATE access_keys 
      SET name = ${name}, permissions = ${permissions}::jsonb, expires_at = ${expiresAt}, is_active = ${isActive}
      WHERE id = ${data.id}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error updating access key:", error)
    throw error
  }
}

export async function toggleAccessKey(id: string) {
  try {
    const result = await sql`
      UPDATE access_keys 
      SET is_active = NOT is_active
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error toggling access key:", error)
    throw error
  }
}

export async function deleteAccessKey(id: string) {
  try {
    await sql`DELETE FROM access_keys WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting access key:", error)
    throw error
  }
}

export async function verifyAccessKey(key: string) {
  try {
    const result = await sql`
      SELECT * FROM access_keys 
      WHERE key = ${key} 
      AND is_active = true 
      AND (expires_at IS NULL OR expires_at > NOW())
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error verifying access key:", error)
    return null
  }
}
