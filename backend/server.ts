import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { analyzeImage } from './services/gemini.js';
import { normalizeProductSource, searchCatalog } from './services/catalog.js';
import { recordClick, recordImpressions } from './analytics/boost.js';
import { connectPrisma } from './db/prisma.js';
import { originAllowlist, getAllowedOrigins } from './middleware/allowlist.js';
import { requireApiKey } from './middleware/apiKey.js';

dotenv.config();

const USE_POSTGRES = process.env.USE_POSTGRES !== 'false';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(
  cors({
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(originAllowlist);

app.use(express.json());

const shopFrameLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests, please try again later.' },
});

const trackLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests, please try again later.' },
});

const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ping: 'pong' });
});

app.post('/shop-frame', shopFrameLimit, requireApiKey, upload.single('frame'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image file provided' });
  }

  const requestId = crypto.randomUUID();

  try {
    const result = await analyzeImage(req.file.path, {
      productSource: req.body?.productSource,
      catalogSearch: (query, limit, productSource) =>
        searchCatalog(query, limit, normalizeProductSource(productSource)),
    });

    recordImpressions({ results: result.results }).catch((error) => {
      console.error('[Analytics] Failed to record impressions:', error);
    });

    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Failed to delete temp file:', err);
    });

    res.json({ ...result, requestId });
  } catch (error) {
    fs.unlink(req.file!.path, () => {});
    console.error('Gemini analysis error:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze image' });
  }
});

app.post('/track', trackLimit, requireApiKey, (req: Request, res: Response) => {
  const { eventName, eventProps } = req.body || {};

  if (!eventName) {
    return res.status(400).json({ ok: false, error: 'eventName is required' });
  }

  if (eventName === 'product_clicked') {
    recordClick({
      productId: eventProps?.productId,
      productUrl: eventProps?.productUrl,
    }).catch((error) => {
      console.error('[Analytics] Failed to record click:', error);
    });
  }

  res.json({ ok: true });
});

// TODO: Implement /insights/products — return top products by impressions/clicks from product_analytics
// app.get('/insights/products', (_req: Request, res: Response) => {
//   res.json({ products: [] });
// });

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: err.message });
  }

  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
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
