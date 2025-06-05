require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const path     = require('path');
const fs       = require('fs');

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true
  })
  .then(()    => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// routes
const uploadRoute = require('./controllers/uploadController');
app.post('/api/upload', uploadRoute);

// metadata endpoints
const File = require('./models/File');
app.get('/api/files', async (req, res) => {
  try {
    const files = await File.find().sort({ uploaded: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch files' });
  }
});
app.get('/api/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'Not found' });
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: 'Fetch error' });
  }
});

// Microservice C: File Deletion
app.delete('/api/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    
    // Delete physical file
    const filePath = path.resolve(process.env.UPLOAD_DIR, file.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete from database
    await File.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Could not delete file' });
  }
});

// Microservice B: Audio Streaming
app.get('/api/stream/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    
    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      return res.status(400).json({ error: 'File is not an audio file' });
    }
    
    const filePath = path.resolve(process.env.UPLOAD_DIR, file.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Physical file not found' });
    }
    
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    if (range) {
      // Support for range requests (streaming)
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': file.type,
      });
      fileStream.pipe(res);
    } else {
      // Full file
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': file.type,
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    console.error('Stream error:', err);
    res.status(500).json({ error: 'Could not stream file' });
  }
});

// Microservice D: File Preview
app.get('/api/preview/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    
    // Check if file is previewable (image or PDF)
    const previewableTypes = ['image/', 'application/pdf'];
    const isPreviewable = previewableTypes.some(type => file.type.startsWith(type));
    
    if (!isPreviewable) {
      return res.status(400).json({ error: 'File type not previewable' });
    }
    
    const filePath = path.resolve(process.env.UPLOAD_DIR, file.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Physical file not found' });
    }
    
    // Set appropriate headers for preview
    res.setHeader('Content-Type', file.type);
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    // Stream the file for preview
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ error: 'Could not preview file' });
  }
});

// serve static uploads
app.use('/uploads', express.static(path.resolve(process.env.UPLOAD_DIR)));

app.listen(PORT, () => 
  console.log(`Server listening on http://localhost:${PORT}`)
);
