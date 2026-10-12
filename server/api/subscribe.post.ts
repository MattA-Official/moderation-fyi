import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().trim().max(100).optional().default(''),
  email: z.email().trim().toLowerCase().max(254),
})

let tableReady = false

export default defineEventHandler(async (event) => {
  const { name, email } = await readValidatedBody(event, body => bodySchema.parse(body))
  const db = useDatabase()

  try {
    if (!tableReady) {
      await db.sql`CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`
      tableReady = true
    }

    // Respond identically whether or not the address was already subscribed,
    // so the endpoint can't be used to discover who is on the list
    await db.sql`
      INSERT INTO subscribers (name, email)
      VALUES (${name}, ${email})
      ON CONFLICT (email) DO NOTHING
    `
  }
  catch (error) {
    console.error('Newsletter subscription failed:', error)
    throw createError({ statusCode: 500, message: 'We couldn\'t save your subscription. Please try again later.' })
  }

  return { success: true }
})
