# Shop The Frame — Backend

Express + TypeScript API that analyzes YouTube video frames using Gemini Vision and returns shoppable product matches from a Shopify catalog.

## Stack

- **Runtime**: Node.js 20, TypeScript
- **Framework**: Express
- **AI**: Google Gemini Vision
- **Catalog**: Shopify MCP
- **Database**: PostgreSQL via Prisma (Supabase-hosted)
- **Deploy**: Google Cloud Run

## Project Structure

```
backend/
├── server.ts                  # Entry point, routes
├── types.ts                   # Shared TypeScript types
├── analytics/
│   └── boost.ts               # Record impressions + clicks to product_analytics
├── db/
│   └── prisma.ts              # Prisma client singleton
├── middleware/
│   ├── allowlist.ts           # Origin allowlist (CORS + request blocking)
│   └── apiKey.ts              # API key auth middleware
├── prisma/
│   └── schema.prisma          # DB schema
├── services/
│   ├── gemini.ts              # Gemini Vision image analysis
│   ├── catalog.ts             # Catalog orchestrator (picks provider)
│   ├── catalogClient.ts       # Shopify MCP HTTP client
│   └── providers/
│       ├── shopify.ts         # Shopify catalog provider
│       └── amazon.ts          # Amazon provider (not yet implemented)
└── scripts/
    └── test-db.ts             # DB connection test script
```

## API

All protected routes require the `x-api-key` header.

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/health` | — | Health check |
| `POST` | `/shop-frame` | API key | Analyze image, return product matches |
| `POST` | `/track` | API key | Track product click events |

### POST /shop-frame

**Request**: `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `frame` | File | Image file (max 10MB) |
| `productSource` | string | `shopify` (default) |

**Response**:
```json
{
  "results": [
    {
      "item": { "query": "black hoodie", "confidence": 0.9 },
      "products": [
        {
          "id": "123",
          "title": "Premium Black Hoodie",
          "price": "49.99",
          "image": "https://...",
          "url": "https://...",
          "marketplace": "shopify"
        }
      ]
    }
  ],
  "requestId": "uuid"
}
```

### POST /track

**Request**: `application/json`

```json
{
  "eventName": "product_clicked",
  "eventProps": {
    "productId": "123",
    "productUrl": "https://..."
  }
}
```

## Local Development

### Prerequisites

- Node.js 20+
- Docker + Docker Compose

### Setup

```bash
cp .env.example .env
# Fill in your values in .env
npm install
```

### Run with Docker (recommended)

```bash
docker compose up
```

Server runs at `http://localhost:8000` with hot reload via `tsx --watch`.

### Run without Docker

```bash
npm run dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `TOKEN_URL` | Yes | Shopify OAuth token URL |
| `MCP_ENDPOINT` | Yes | Shopify MCP endpoint |
| `SHOPIFY_CLIENT_ID` | Yes | Shopify app client ID |
| `SHOPIFY_CLIENT_SECRET` | Yes | Shopify app client secret |
| `API_KEY` | Yes | Secret key for protected routes |
| `PORT` | No | Server port (default: 3000, Cloud Run sets 8080) |
| `USE_POSTGRES` | No | Set to `false` to skip DB connection |

### Database

```bash
# Push schema changes
npm run prisma:push

# Generate Prisma client after schema changes
npm run prisma:generate
```

## Deployment

Deployed to Google Cloud Run (`northamerica-northeast2`).

```bash
gcloud run deploy shop-the-frame-backend \
  --source . \
  --region northamerica-northeast2
```

Env vars are configured in the Cloud Run service settings (Variables & Secrets tab).

## Security

See [SECURITY_TODO.md](./SECURITY_TODO.md) for planned security improvements.

Current protections:
- Origin allowlist (blocks requests from non-whitelisted origins)
- API key required on all data routes
- Rate limiting: 50 req/hour on `/shop-frame`, 200 req/hour on `/track`
