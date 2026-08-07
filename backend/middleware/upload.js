import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Upload to frontend/public/images/products so Vite dev server serves them
const uploadDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'images', 'products')

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadDir)
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    const baseName = file.originalname
      .replace(ext, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const uniqueName = `${baseName}-${Date.now()}${ext}`
    cb(null, uniqueName)
  },
})

const fileFilter = (_req, file, cb) => {
  const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i
  if (allowed.test(path.extname(file.originalname))) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (jpg, png, gif, webp, svg) are allowed.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
})

export default upload
