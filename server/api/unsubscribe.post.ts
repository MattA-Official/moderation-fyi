import { z } from 'zod'

const bodySchema = z.object({
  email: z.email().trim().toLowerCase().max(254),
})

export default defineEventHandler(async (event) => {
  const { email } = await readValidatedBody(event, body => bodySchema.parse(body))
  const db = useDatabase()

  try {
    // Older sign-ups were stored as typed, so match case-insensitively
    await db.sql`DELETE FROM subscribers WHERE lower(email) = ${email}`
  }
  catch (error) {
    // A missing table means there is nobody to unsubscribe
    if (!String(error).includes('no such table')) {
      console.error('Newsletter unsubscribe failed:', error)
      throw createError({ statusCode: 500, message: 'We couldn\'t process your request. Please try again later.' })
    }
  }

  // Respond identically whether or not the address was subscribed, so the
  // endpoint can't be used to discover who is on the list
  return { success: true }
})
