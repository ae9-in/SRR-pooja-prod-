import mongoose from 'mongoose'
import env from './env.js'

export const dbState = {
  connected: false,
  mode: env.ALLOW_MEMORY_FALLBACK ? 'memory' : 'mongo',
  lastError: null,
}

let cachedPromise = null

export async function connectDatabase() {
  if (!env.MONGO_URI) {
    dbState.lastError = 'MONGO_URI is not configured.'
    dbState.mode = 'memory'
    dbState.connected = false
    return dbState
  }

  if (mongoose.connection.readyState === 1) {
    dbState.connected = true
    dbState.mode = 'mongo'
    dbState.lastError = null
    return dbState
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    }).catch((error) => {
      cachedPromise = null
      throw error
    })
  }

  try {
    await cachedPromise
    dbState.connected = true
    dbState.mode = 'mongo'
    dbState.lastError = null
    return dbState
  } catch (error) {
    dbState.connected = false
    dbState.lastError = error.message

    if (!env.ALLOW_MEMORY_FALLBACK) {
      throw error
    }

    dbState.mode = 'memory'
    return dbState
  }
}
