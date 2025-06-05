// mock-metadata-service.js - Simple mock service for testing
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// In-memory storage for demo
const metadataStore = new Map();

app.use(express.json());
app.use(cors());

// Handle POST requests (add/update metadata)
app.post('/metadata/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  const { metadata } = req.body;

  if (!metadata) {
    return res.status(400).json({ error: 'Data or metadata Missing' });
  }

  // Check if file exists
  const exists = metadataStore.has(fileId);
  metadataStore.set(fileId, metadata);

  if (exists) {
    res.status(200).json({
      message: 'Metadata updated successfully',
      id: fileId
    });
  } else {
    res.status(201).json({
      message: 'Metadata added successfully', 
      id: fileId
    });
  }
});

// Handle GET requests (retrieve metadata)
app.get('/metadata/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  const metadata = metadataStore.get(fileId);

  if (!metadata) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.status(200).json(metadata);
});

// Handle other methods
app.all('/metadata/:fileId', (req, res) => {
  res.status(405).json({ error: 'Method not allowed' });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Mock Metadata Service is running!',
    endpoints: {
      'POST /metadata/:fileId': 'Add/update metadata',
      'GET /metadata/:fileId': 'Retrieve metadata'
    },
    stored: Array.from(metadataStore.keys()).length + ' files'
  });
});

app.listen(PORT, () => {
  console.log(`🔧 Mock Metadata Service running on http://localhost:${PORT}`);
  console.log('📝 This simulates Tyler\'s microservice for testing purposes');
});

module.exports = app;
