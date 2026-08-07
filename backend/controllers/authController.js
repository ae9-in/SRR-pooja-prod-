import jwt from 'jsonwebtoken'
import env from '../config/env.js'

export async function adminLogin(req, res) {
  const { password } = req.body

  if (!password) {
    return res.status(400).json({ success: false, error: 'Password is required.' })
  }

  if (password !== env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Invalid password.' })
  }

  const token = jwt.sign({ role: 'admin' }, env.JWT_SECRET, { expiresIn: '24h' })

  return res.json({ success: true, token, message: 'Login successful.' })
}

export async function verifyAdmin(_req, res) {
  return res.json({ success: true, message: 'Token is valid.' })
}
