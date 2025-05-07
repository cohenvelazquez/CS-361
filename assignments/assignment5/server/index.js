require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const path     = require('path');

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

// serve static uploads
app.use('/uploads', express.static(path.resolve(process.env.UPLOAD_DIR)));

app.listen(PORT, () => 
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
);
