import { defaultProducts } from './defaultProducts.js'

const now = () => new Date().toISOString()
const clone = (value) => JSON.parse(JSON.stringify(value))

const runtimeStore = {
  products: clone(defaultProducts).map((product) => ({
    ...product,
    createdAt: now(),
    updatedAt: now(),
  })),
  contacts: [],
}

export const getProducts = () => runtimeStore.products

export const getProductById = (id) =>
  runtimeStore.products.find((product) => product._id === id)

export const createProduct = (payload) => {
  const item = {
    _id: `seed-${Date.now()}`,
    createdAt: now(),
    updatedAt: now(),
    ...payload,
  }

  runtimeStore.products.unshift(item)
  return item
}

export const updateProduct = (id, payload) => {
  const index = runtimeStore.products.findIndex((product) => product._id === id)
  if (index === -1) return null

  runtimeStore.products[index] = {
    ...runtimeStore.products[index],
    ...payload,
    updatedAt: now(),
  }

  return runtimeStore.products[index]
}

export const deleteProduct = (id) => {
  const index = runtimeStore.products.findIndex((product) => product._id === id)
  if (index === -1) return null

  const [deleted] = runtimeStore.products.splice(index, 1)
  return deleted
}

export const getContacts = () => runtimeStore.contacts

export const createContact = (payload) => {
  const inquiry = {
    _id: `contact-${Date.now()}`,
    status: 'new',
    createdAt: now(),
    updatedAt: now(),
    ...payload,
  }

  runtimeStore.contacts.unshift(inquiry)
  return inquiry
}

export const updateContactStatus = (id, status) => {
  const index = runtimeStore.contacts.findIndex((contact) => contact._id === id)
  if (index === -1) return null

  runtimeStore.contacts[index] = {
    ...runtimeStore.contacts[index],
    status,
    updatedAt: now(),
  }

  return runtimeStore.contacts[index]
}

export const deleteContact = (id) => {
  const index = runtimeStore.contacts.findIndex((contact) => contact._id === id)
  if (index === -1) return null

  const [deleted] = runtimeStore.contacts.splice(index, 1)
  return deleted
}
