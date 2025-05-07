const multer  = require('multer')
const fs      = require('fs')
const path    = require('path')

const UPLOAD_BASE = path.resolve(process.env.UPLOAD_DIR || 'uploads')

// Map raw categories to folder names
const CATEGORY_MAP = {
  application: 'apps',
  text:        'documents',
  image:       'pictures',
  audio:       'audio_files',
  video:       'videos'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 1) Derive raw category
    const raw = file.mimetype.split('/')[0] || 'other'

    // 2) Override PDFs if you like
    const category = file.mimetype === 'application/pdf'
      ? 'pictures'
      : (CATEGORY_MAP[raw] || raw)

    // 3) Build full path
    const dir = path.join(UPLOAD_BASE, category)

    // 4) Create it (async) then tell Multer to write there
    fs.mkdir(dir, { recursive: true }, err => {
      cb(err, dir)
    })
  },

  filename: (req, file, cb) => {
    // generate a timestamped name to avoid collisions
    const name = `${Date.now()}-${file.originalname}`
    cb(null, name)
  }
})

module.exports = multer({
  storage,
  limits: {
    fileSize: 50 * 1024  // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // optional: only allow certain types
    const allowed = ['image/', 'text/', 'audio/', 'video/', 'application/pdf']
    if (allowed.some(prefix => file.mimetype.startsWith(prefix))) {
      cb(null, true)
    } else {
      cb(new Error('Unsupported file type'), false)
    }
  }
})