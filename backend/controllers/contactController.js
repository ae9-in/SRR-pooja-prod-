import Contact from '../models/Contact.js'
import { dbState } from '../config/db.js'
import {
  createContact as createRuntimeContact,
  getContacts as getRuntimeContacts,
  updateContactStatus as updateRuntimeContactStatus,
  deleteContact as deleteRuntimeContact,
} from '../data/runtimeStore.js'

const allowedStatuses = new Set(['new', 'contacted', 'converted', 'closed'])

const validateInquiry = (payload) => {
  const requiredFields = ['name', 'shopName', 'phone', 'city', 'productInterest']
  const missingFields = requiredFields.filter((field) => !payload[field]?.trim?.())

  if (missingFields.length) {
    const error = new Error(`Missing required fields: ${missingFields.join(', ')}`)
    error.statusCode = 400
    throw error
  }
}

export async function createContact(req, res, next) {
  try {
    validateInquiry(req.body)

    const inquiry = dbState.connected
      ? await new Contact(req.body).save()
      : createRuntimeContact(req.body)

    return res.status(201).json({
      success: true,
      message: 'Inquiry received successfully.',
      data: inquiry,
      source: dbState.connected ? 'mongo' : 'memory',
    })
  } catch (error) {
    return next(error)
  }
}

export async function listContacts(_req, res, next) {
  try {
    const data = dbState.connected
      ? await Contact.find().sort({ createdAt: -1 })
      : getRuntimeContacts()

    return res.json({ success: true, count: data.length, data, source: dbState.connected ? 'mongo' : 'memory' })
  } catch (error) {
    return next(error)
  }
}

export async function updateContactStatus(req, res, next) {
  try {
    if (!allowedStatuses.has(req.body.status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value.' })
    }

    const inquiry = dbState.connected
      ? await Contact.findByIdAndUpdate(
          req.params.id,
          { status: req.body.status },
          { new: true, runValidators: true },
        )
      : updateRuntimeContactStatus(req.params.id, req.body.status)

    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found.' })
    }

    return res.json({ success: true, data: inquiry, source: dbState.connected ? 'mongo' : 'memory' })
  } catch (error) {
    return next(error)
  }
}

export async function removeContact(req, res, next) {
  try {
    const inquiry = dbState.connected
      ? await Contact.findByIdAndDelete(req.params.id)
      : deleteRuntimeContact(req.params.id)

    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found.' })
    }

    return res.json({
      success: true,
      message: 'Inquiry deleted.',
      source: dbState.connected ? 'mongo' : 'memory',
    })
  } catch (error) {
    return next(error)
  }
}
