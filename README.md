# FuelEU Maritime Compliance Platform

## Overview
This project is a minimal full-stack implementation of a FuelEU Maritime compliance dashboard. It includes a React + TypeScript + TailwindCSS frontend and a Node.js + TypeScript + PostgreSQL backend organized using a hexagonal architecture.

## Features
- Routes tab with filters and baseline selection
- Compare tab with baseline vs comparison table and chart
- Banking tab with compliance balance view
- Pooling tab with yearly pool details
- Clean separation between domain, use-cases, ports, and adapters

## Architecture Summary
### Backend
- `core/domain`: domain entities and calculation service
- `core/application`: use-cases
- `core/ports`: outbound repository ports
- `adapters/inbound`: Express controllers and HTTP routes
- `adapters/outbound`: PostgreSQL repository implementations

### Frontend
- `core/domain`: frontend domain models
- `core/application`: frontend use-cases
- `core/ports`: outbound API contracts
- `adapters/infrastructure`: API clients using Axios
- `adapters/ui`: React pages, hooks, and components

## Setup and Run Instructions

### 1. install
#### Backend
```bash
cd backend
npm install
cp .env.example .env
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env
```

### 2. Create PostgreSQL database
```sql
CREATE DATABASE fuel_eu_maritime;
```

### 3. Apply schema and seed data
```bash
psql -U postgres -d fuel_eu_maritime -f backend/sql/schema.sql
psql -U postgres -d fuel_eu_maritime -f backend/sql/seed.sql
```

### 4. Run backend
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:4000`

### 5. Run frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

## Environment Variables
### Backend
```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fuel_eu_maritime
CORS_ORIGIN=http://localhost:5173
```

### Frontend
```env
VITE_API_BASE_URL=http://localhost:4000
```

## Testing
There are no automated tests included in this minimal submission. Manual testing steps:
1. Open the Routes tab and verify routes load.
2. Click `Set Baseline` for a non-baseline route.
3. Open Compare tab and verify comparison values and chart update after refresh.
4. Open Banking and Pooling tabs and confirm the seeded 2025 data appears.

## Sample Requests / Responses
### GET /routes
```http
GET /routes?vesselType=Container&year=2025
```

### POST /routes/R003/baseline
```http
POST /routes/R003/baseline
```

### GET /routes/comparison
```http
GET /routes/comparison
```

### GET /compliance/cb?year=2025
```http
GET /compliance/cb?year=2025
```

### GET /compliance/pools?year=2025
```http
GET /compliance/pools?year=2025
```


