const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generateCard } = require('./cardGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure directories exist
const uploadDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'output');
[uploadDir, outputDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png) are allowed!'));
    }
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/output', express.static(outputDir));

// Enable CORS for API access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve the test page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'test.html'));
});

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'FUT-Style Player Card Generator API',
    endpoints: {
      generateCard: 'POST /generate-card'
    }
  });
});

// Generate card endpoint
app.post('/generate-card', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Photo file is required' });
    }

    const { name, tier, position, country, overall, skill, manner } = req.body;

    // Validate required fields
    if (!name || !tier || !position || !overall || !skill || !manner) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'tier', 'position', 'country', 'overall', 'skill', 'manner']
      });
    }

    // Validate tier
    const validTiers = ['bronze', 'silver', 'gold'];
    if (!validTiers.includes(tier.toLowerCase())) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'Invalid tier',
        validTiers
      });
    }

    // Generate card
    const cardData = {
      name: name.toUpperCase(),
      tier: tier.toLowerCase(),
      position: position.toUpperCase(),
      country: country || 'XX',
      overall: parseInt(overall),
      skill: parseInt(skill),
      manner: parseInt(manner),
      photoPath: req.file.path
    };

    const outputPath = await generateCard(cardData);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Send response with card URL
    const cardFilename = path.basename(outputPath);
    const imageUrl = `/output/${cardFilename}`;
    res.json({
      success: true,
      imageUrl,
      downloadUrl: `http://localhost:${PORT}${imageUrl}`,
      filename: cardFilename
    });

  } catch (error) {
    console.error('Error generating card:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Failed to generate card',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'File upload error',
      message: error.message
    });
  }
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📸 Ready to generate player cards!`);
});
