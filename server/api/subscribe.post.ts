export default defineEventHandler(async (event) => {
  const { name = '', email } = await readBody(event)
  const db = useDatabase()

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required',
      data: {
        email: null,
      },
    })
  }

  try {
    const result = await db.sql`
      INSERT INTO subscribers (name, email)
      VALUES (${name}, ${email})
      ON CONFLICT (email) DO NOTHING
    `

    console.log('Insert result:', result)

    // Check if insertion was successful
    if (result.rows?.length === 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email already exists',
        data: {
          email,
        },
      })
    }

    return { success: true, message: 'Subscription successful' }
  }
  catch (error) {
    console.error('Database error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Server error',
    })
  }
})
