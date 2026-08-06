import Product from '../models/Product.js'
import { dbState } from '../config/db.js'
import { defaultProducts } from '../data/defaultProducts.js'
import {
  createProduct as createRuntimeProduct,
  deleteProduct as deleteRuntimeProduct,
  getProductById as getRuntimeProductById,
  getProducts as getRuntimeProducts,
  updateProduct as updateRuntimeProduct,
} from '../data/runtimeStore.js'

const buildProductQuery = ({ category, search }) => {
  const query = {}

  if (category && category !== 'All') {
    query.category = category
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
  }

  return query
}

const filterRuntimeProducts = (products, { category, search }) => {
  const searchTerm = search?.trim().toLowerCase()

  return products.filter((product) => {
    const categoryMatch = !category || category === 'All' || product.category === category
    const searchMatch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)

    return categoryMatch && searchMatch
  })
}

const mongoSeedProducts = defaultProducts.map(({ _id, ...product }) => product)

const latestPriceByName = {
  'Sandalwood Agarbatti': 'Rs. 59',
  'Rose Agarbatti': 'Rs. 59',
  'Lavender Agarbatti': 'Rs. 59',
  '3-in-1 Assorted Agarbatti Pack': 'Rs. 59',
  'Pure Camphor 100g box': 'Rs. 220',
  'Pooja Oil 1L': 'Rs. 210',
  'Cotton Wicks': 'Rs. 10',
  'Sandalwood Dhoop Sticks': 'Rs. 59',
}

const normalizeProductImage = (product) => {
  if (!product) return product

  return {
    ...product,
    image: product.image?.replace('/images/products/', '/images/products/').replace('.jpg', '.png'),
    price: latestPriceByName[product.name] || product.price,
  }
}

async function ensureMongoProductsSeeded() {
  const count = await Product.countDocuments()

  if (count === 0) {
    await Product.insertMany(mongoSeedProducts)
  }
}

export async function listProducts(req, res, next) {
  try {
    if (dbState.connected) {
      await ensureMongoProductsSeeded()
      const data = await Product.find(buildProductQuery(req.query)).sort({ createdAt: -1 })
      const normalizedData = data.map((product) => normalizeProductImage(product.toObject()))
      return res.json({ success: true, count: normalizedData.length, data: normalizedData, source: 'mongo' })
    }

    const data = filterRuntimeProducts(getRuntimeProducts(), req.query)
    return res.json({ success: true, count: data.length, data, source: 'memory' })
  } catch (error) {
    return next(error)
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = dbState.connected
      ? await Product.findById(req.params.id)
      : getRuntimeProductById(req.params.id)

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' })
    }

    const normalizedProduct =
      dbState.connected && product?.toObject
        ? normalizeProductImage(product.toObject())
        : normalizeProductImage(product)

    return res.json({ success: true, data: normalizedProduct, source: dbState.connected ? 'mongo' : 'memory' })
  } catch (error) {
    return next(error)
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = dbState.connected
      ? await new Product(req.body).save()
      : createRuntimeProduct(req.body)

    return res.status(201).json({
      success: true,
      data: product,
      source: dbState.connected ? 'mongo' : 'memory',
    })
  } catch (error) {
    error.statusCode = 400
    return next(error)
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = dbState.connected
      ? await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      : updateRuntimeProduct(req.params.id, req.body)

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' })
    }

    return res.json({
      success: true,
      data: product,
      source: dbState.connected ? 'mongo' : 'memory',
    })
  } catch (error) {
    error.statusCode = 400
    return next(error)
  }
}

export async function removeProduct(req, res, next) {
  try {
    const product = dbState.connected
      ? await Product.findByIdAndDelete(req.params.id)
      : deleteRuntimeProduct(req.params.id)

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' })
    }

    return res.json({
      success: true,
      message: 'Product deleted.',
      source: dbState.connected ? 'mongo' : 'memory',
    })
  } catch (error) {
    return next(error)
  }
}
