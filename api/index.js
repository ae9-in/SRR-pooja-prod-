import app from '../backend/app.js'
import { connectDatabase } from '../backend/config/db.js'

export default async function handler(req, res) {
  try {
    await connectDatabase()
    return app(req, res)
  } catch (error) {
    console.error('Database connection failed:', error)
    return res.status(500).json({
      success: false,
      error: 'Database connection failed. Please check backend logs or configuration.',
      details: error.message
    })
  }
}
