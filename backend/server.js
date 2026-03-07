import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { analyzeImage } from './services/gemini.js';
import { normalizeProductSource, searchCatalog } from './services/shopify.js';
import {
  applyBoostsToResults,
  getBoostScores,
  logBoosts,
  recordClick,
  recordImpressions,
} from './analytics/boost.js';
import { connectPrisma } from './db/prisma.js';
import {
  findCachedCatalogQuery,
  getInsights,
  upsertCatalogQueryCache,
} from './db/repositories.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const USE_POSTGRES = process.env.USE_POSTGRES !== 'false';

// CORS configuration - allow all origins for development
// This is needed because:
// 1. Content scripts run in the context of the web page (youtube.com)
// 2. Background scripts run in chrome-extension:// context
// 3. Errors can bypass the cors middleware, so we need permissive settings
app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Ensure CORS headers are set even on errors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());

function resolveUserId(headers) {
  const value = headers['x-anonymous-id'] || headers['x-user-id'] || 'anonymous';
  return Array.isArray(value) ? value[0] : value;
}

function buildCatalogSearchWithCache(userId) {
  return async (query, limit, productSource) => {
    const source = normalizeProductSource(productSource);
    const cached = await findCachedCatalogQuery({
      userId,
      query,
      productSource: source,
    });

    if (cached) {
      return {
        query,
        products: cached.products || [],
      };
    }

    const fresh = await searchCatalog(query, limit, source);
    await upsertCatalogQueryCache({
      userId,
      query,
      productSource: source,
      products: fresh.products || [],
    });
    return fresh;
  };
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// POST /health
app.post('/health', (req, res) => {
  res.json({ ok: true });
});

// POST /shop-frame - accepts multipart/form-data with "frame" field
app.post('/shop-frame', upload.single('frame'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No image file provided'
    });
  }

  const userId = resolveUserId(req.headers);
  const requestId = crypto.randomUUID();

  try {
    const boosts = await getBoostScores().catch((error) => {
      console.error('[Boosts] Failed to load boosts:', error);
      return { categoryBoosts: {}, queryBoosts: {}, boostsByKey: {} };
    });
    logBoosts(boosts);

    const result = await analyzeImage(req.file.path, {
      productSource: req.body?.productSource,
      catalogSearch: buildCatalogSearchWithCache(userId),
    });

    const boostedResult = applyBoostsToResults(result, boosts);

    recordImpressions({
      userId,
      requestId,
      frameItems: boostedResult.frameItems,
      results: boostedResult.results,
      }).catch((error) => {
        console.error('[Boosts] Failed to record impressions:', error);
      });

    // Clean up uploaded file after processing
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Failed to delete temp file:', err);
    });

    res.json({
      ...boostedResult,
      requestId,
    });
  } catch (error) {
    // Clean up on error
    fs.unlink(req.file.path, () => {});

    console.error('Gemini analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze image'
    });
  }
});

// POST /track - accepts JSON for server-side tracking (e.g., product clicks)
app.post('/track', (req, res) => {
  const { eventName, userId, eventProps } = req.body || {};

  if (!eventName) {
    return res.status(400).json({ ok: false, error: 'eventName is required' });
  }

  if (eventName === 'product_clicked') {
    recordClick({
      userId,
      requestId: eventProps?.requestId,
      category: eventProps?.category,
      query: eventProps?.query,
      productId: eventProps?.productId,
      productUrl: eventProps?.productUrl,
    }).catch((error) => {
      console.error('[Boosts] Failed to record click:', error);
    });
  }

  res.json({ ok: true });
});

// GET /insights - lightweight analytics for merchants (last 7 days)
app.get('/insights', async (req, res) => {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const limit = 10;

  try {
    const insights = await getInsights(since, limit);
    res.json({
      windowDays: 7,
      ...insights,
    });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ ok: false, error: 'Failed to load insights' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Ensure CORS headers are set on error responses
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  console.error('Server error:', err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

if (!USE_POSTGRES) {
  console.log('[Postgres] disabled via USE_POSTGRES=false');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} else {
  connectPrisma()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
}
