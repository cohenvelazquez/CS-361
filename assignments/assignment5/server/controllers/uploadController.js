// server/controllers/uploadController.js
const path = require('path')
const File = require('../models/File')
const upload = require('../middleware/multerConfig')

module.exports = (req, res) => {
  upload.single('file')(req, res, async err => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    // Build metadata from req.file
    const { destination, filename, mimetype, size } = req.file
    // destination might be ".../uploads/pictures"
    // strip off the base upload dir to get the relative path:
    const relPath = path.relative(
      path.resolve(process.env.UPLOAD_DIR),
      path.join(destination, filename)
    )

    const metadata = {
      name:     filename,
      size:     size,
      type:     mimetype,
      path:     relPath.replace(/\\/g, '/'), // store with forward slashes
      uploaded: new Date()
    }

    // Save to Mongo
    try {
      await File.create(metadata)
    } catch (dbErr) {
      console.error(dbErr)
      // but we still return success
    }

    res.json({ success: true, metadata })
  })
}
