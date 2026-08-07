import jwt from 'jsonwebtoken'
import env from '../config/env.js'

export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Access denied. No token provided.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)

    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Insufficient permissions.' })
    }

    req.admin = decoded
    return next()
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' })
  }
}
