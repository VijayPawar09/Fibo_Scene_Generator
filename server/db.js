import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join } from 'path'

const file = join(process.cwd(), 'db.json')
const adapter = new JSONFile(file)
// provide default data to satisfy lowdb requirements
const db = new Low(adapter, { history: [] })

// initialize; Low will ensure default data exists
await db.read()
if (!db.data) db.data = { history: [] }

export default db
