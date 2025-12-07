import db from '../db.js'
import logger from '../logger.js'

// Adds a history entry to the persistent DB
export const addHistory = async (req, res) => {
  try {
    const { prompt, json, imageUrl } = req.body

    const entry = {
      id: (db.data.history.length ? db.data.history[db.data.history.length - 1].id : 0) + 1,
      prompt,
      json,
      imageUrl,
      createdAt: new Date().toISOString(),
    }

    db.data.history.push(entry)
    await db.write()

    logger.info(`Added history entry id=${entry.id}`)
    return res.json({ success: true, entry })
  } catch (err) {
    logger.error(`addHistory error: ${err.message}`)
    return res.status(500).json({ success: false, message: 'Failed to add history' })
  }
}

// Returns all history entries
export const getHistory = async (req, res) => {
  try {
    const history = db.data.history || []
    return res.json({ success: true, history })
  } catch (err) {
    logger.error(`getHistory error: ${err.message}`)
    return res.status(500).json({ success: false, message: 'Failed to fetch history' })
  }
}
