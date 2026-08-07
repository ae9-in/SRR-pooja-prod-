import express from 'express'
import { adminLogin, verifyAdmin } from '../controllers/authController.js'
import { requireAdmin } from '../middleware/authMiddleware.js'
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct,
} from '../controllers/productsController.js'
import {
  listContacts,
  updateContactStatus,
  removeContact,
} from '../controllers/contactController.js'
import upload from '../middleware/upload.js'

const router = express.Router()

// Public auth routes
router.post('/login', adminLogin)

// Protected routes (require JWT)
router.get('/verify', requireAdmin, verifyAdmin)

// Products CRUD (admin-protected)
router.get('/products', requireAdmin, listProducts)
router.get('/products/:id', requireAdmin, getProduct)
router.post('/products', requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    // If an image was uploaded, set the image path
    if (req.file) {
      req.body.image = `/images/products/${req.file.filename}`
    }
    // Parse boolean/number fields from form data
    if (req.body.inStock !== undefined) {
      req.body.inStock = req.body.inStock === 'true' || req.body.inStock === true
    }
    if (req.body.minimumOrder !== undefined) {
      req.body.minimumOrder = Number(req.body.minimumOrder)
    }
    return createProduct(req, res, next)
  } catch (error) {
    return next(error)
  }
})
router.put('/products/:id', requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/images/products/${req.file.filename}`
    }
    if (req.body.inStock !== undefined) {
      req.body.inStock = req.body.inStock === 'true' || req.body.inStock === true
    }
    if (req.body.minimumOrder !== undefined) {
      req.body.minimumOrder = Number(req.body.minimumOrder)
    }
    return updateProduct(req, res, next)
  } catch (error) {
    return next(error)
  }
})
router.delete('/products/:id', requireAdmin, removeProduct)

// Contact queries (admin-protected)
router.get('/contacts', requireAdmin, listContacts)
router.patch('/contacts/:id/status', requireAdmin, updateContactStatus)
router.delete('/contacts/:id', requireAdmin, removeContact)

export default router
