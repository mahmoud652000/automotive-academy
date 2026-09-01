import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'data.db')

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

// --- Table schemas (mirror Mongoose models) ---
db.exec(`
  CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    titleEn TEXT DEFAULT '',
    desc TEXT NOT NULL,
    descEn TEXT DEFAULT '',
    oldPrice REAL DEFAULT 0,
    newPrice REAL DEFAULT 0,
    discount REAL DEFAULT 0,
    category TEXT NOT NULL,
    subcategory TEXT DEFAULT '',
    categoryEn TEXT DEFAULT '',
    image TEXT DEFAULT '',
    icon TEXT DEFAULT 'Tag',
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    titleEn TEXT DEFAULT '',
    description TEXT NOT NULL,
    descriptionEn TEXT DEFAULT '',
    icon TEXT DEFAULT '',
    image TEXT DEFAULT '',
    category TEXT DEFAULT 'عام',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    titleEn TEXT DEFAULT '',
    desc TEXT NOT NULL,
    descEn TEXT DEFAULT '',
    duration TEXT NOT NULL,
    durationEn TEXT DEFAULT '',
    image TEXT DEFAULT '/course-2.png',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('post','offer')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT DEFAULT '',
    discount REAL DEFAULT 0,
    oldPrice REAL DEFAULT 0,
    newPrice REAL DEFAULT 0,
    expiryDate TEXT DEFAULT '',
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    carModel TEXT DEFAULT '',
    service TEXT DEFAULT '',
    course TEXT DEFAULT '',
    offer TEXT DEFAULT '',
    type TEXT DEFAULT 'service',
    date TEXT DEFAULT '',
    time TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('photo','video')),
    title TEXT NOT NULL,
    titleEn TEXT DEFAULT '',
    category TEXT DEFAULT 'صيانة',
    categoryEn TEXT DEFAULT 'Maintenance',
    beforeImage TEXT DEFAULT '',
    afterImage TEXT DEFAULT '',
    videoUrl TEXT DEFAULT '',
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    excerpt TEXT DEFAULT '',
    content TEXT NOT NULL,
    image TEXT DEFAULT '',
    category TEXT DEFAULT 'صيانة',
    tags TEXT DEFAULT '[]',
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT DEFAULT '',
    text TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','unsubscribed')),
    token TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`)

// --- Migrations: add columns to existing tables ---
try {
  const cols = db.prepare("PRAGMA table_info(offers)").all().map(c => c.name)
  if (!cols.includes('subcategory')) {
    db.exec("ALTER TABLE offers ADD COLUMN subcategory TEXT DEFAULT ''")
  }
} catch {}

// --- Helpers ---

const BOOL_COLUMNS = {
  offers: ['active'],
  events: ['active'],
  gallery: ['active'],
  articles: ['active'],
  reviews: ['active'],
}

const JSON_COLUMNS = {
  articles: ['tags'],
}

const FIELD_MAPS = {}

const TABLE_COLUMNS = {
  offers: ['title', 'titleEn', 'desc', 'descEn', 'oldPrice', 'newPrice', 'discount', 'category', 'subcategory', 'categoryEn', 'image', 'icon', 'active'],
  services: ['title', 'titleEn', 'description', 'descriptionEn', 'icon', 'image', 'category'],
  courses: ['title', 'titleEn', 'desc', 'descEn', 'duration', 'durationEn', 'image'],
  events: ['type', 'title', 'description', 'image', 'discount', 'oldPrice', 'newPrice', 'expiryDate', 'active'],
  bookings: ['name', 'phone', 'carModel', 'service', 'course', 'offer', 'type', 'date', 'time', 'notes', 'status'],
  contacts: ['name', 'phone', 'email', 'subject', 'message', 'status'],
  gallery: ['type', 'title', 'titleEn', 'category', 'categoryEn', 'beforeImage', 'afterImage', 'videoUrl', 'active'],
  articles: ['title', 'excerpt', 'content', 'image', 'category', 'tags', 'active'],
  reviews: ['name', 'role', 'text', 'rating', 'active'],
  subscribers: ['email', 'status', 'token'],
}

const REVERSE_FIELD_MAPS = {}
for (const [table, maps] of Object.entries(FIELD_MAPS)) {
  REVERSE_FIELD_MAPS[table] = {}
  for (const [from, to] of Object.entries(maps)) {
    REVERSE_FIELD_MAPS[table][to] = from
  }
}

export function formatRow(row, table) {
  if (!row) return null
  const formatted = {}
  for (const [key, value] of Object.entries(row)) {
    if (key === 'id') {
      formatted._id = String(value)
    } else if (key === 'created_at') {
      formatted.createdAt = value
    } else if (key === 'updated_at') {
      formatted.updatedAt = value
    } else if ((BOOL_COLUMNS[table] || []).includes(key)) {
      formatted[key] = Boolean(value)
    } else if ((JSON_COLUMNS[table] || []).includes(key) && typeof value === 'string') {
      try { formatted[key] = JSON.parse(value) } catch { formatted[key] = [] }
    } else if ((REVERSE_FIELD_MAPS[table] || {})[key]) {
      formatted[REVERSE_FIELD_MAPS[table][key]] = value
    } else {
      formatted[key] = value
    }
  }
  return formatted
}

export function formatRows(rows, table) {
  return rows.map(r => formatRow(r, table))
}

export function prepareBody(body, table) {
  const data = {...body }
  delete data._id
  delete data.id
  delete data.createdAt
  delete data.updatedAt
  delete data.created_at
  delete data.updated_at
  const fieldMap = FIELD_MAPS[table] || {}
  for (const [from, to] of Object.entries(fieldMap)) {
    if (from in data &&!(to in data)) {
      data[to] = data[from]
      delete data[from]
    }
  }
  const validCols = TABLE_COLUMNS[table] || []
  const filtered = {}
  for (const col of validCols) {
    if (col in data) filtered[col] = data[col]
  }
  for (const col of BOOL_COLUMNS[table] || []) {
    if (col in filtered) filtered[col] = filtered[col]? 1 : 0
  }
  for (const col of JSON_COLUMNS[table] || []) {
    if (col in filtered && Array.isArray(filtered[col])) {
      filtered[col] = JSON.stringify(filtered[col])
    }
  }
  return filtered
}

export function buildInsert(table, data) {
  const keys = Object.keys(data)
  const placeholders = keys.map(() => '?').join(', ')
  const values = keys.map(k => data[k])
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`
  return { sql, values }
}

export function buildUpdate(table, data) {
  const keys = Object.keys(data)
  if (keys.length === 0) {
    return { sql: `UPDATE ${table} SET updated_at = datetime('now') WHERE id =?`, values: [] }
  }
  const sets = keys.map(k => `${k} =?`).join(', ')
  const values = keys.map(k => data[k])
  const sql = `UPDATE ${table} SET ${sets}, updated_at = datetime('now') WHERE id =?`
  return { sql, values }
}

export default db