# AI-Powered Agriculture Crop Advisory Assistant

A production-grade, full-stack digital agriculture advisory platform designed for farmers, growers, and agronomists. Built with **React (Vite + Tailwind CSS)**, **Node.js (Express)**, **PostgreSQL/JSON-storage persistence**, and **Google Gemini** integration via the official `@google/genai` SDK.

---

## 🌟 Key Features

1. **AI-Powered Crop Advisory Engine**:
   - Structured JSON agronomic recommendations from Google Gemini.
   - Modules for Complete Crop Advisory, Crop Selection, Pest & Disease Diagnosis, Nutrient/Fertilizer Plans, and Irrigation Schedules.
   - Comprehensive safety rules avoiding fabricated soil or pesticide dosages.

2. **Farm Management**:
   - Save and manage multiple farm parcels with area, soil type, pH, NPK, organic carbon, and irrigation method.
   - One-click auto-fill into the advisory generator.

3. **Advisory History & Action Plans**:
   - Every AI advisory is persisted to the database.
   - Interactive actionable workplans with checkboxes to mark field tasks as completed.
   - Search by crop, filter by advisory type, and print reports.

4. **Security & Data Isolation**:
   - Salted and hashed passwords with `bcryptjs`.
   - Stateless 7-day cryptographic JSON Web Tokens (JWT).
   - Strict resource ownership checks on all endpoints (`user_id` verification).
   - Server-side rate limiting and Helmet HTTP security headers.
   - `GEMINI_API_KEY` is kept strictly server-side and never exposed to the client.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, React Router 7
- **Backend**: Node.js, Express.js REST API
- **AI SDK**: `@google/genai` (v2.27)
- **Validation**: Zod (for request bodies, parameters, and Gemini structured output)
- **Database**: PostgreSQL (with resilient embedded storage fallback for offline/local environments)

---

## 🚀 Getting Started

### 1. Environment Configuration

Copy the example environment configuration:

```bash
cp .env.example .env
```

Edit `.env` and set your credentials:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crop_advisory_db
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
JWT_SECRET=production_super_secret_jwt_key_crop_advisory_2026_secure
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

### 2. Install Dependencies

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3. Seed Demo Data

Run the database seed script to populate realistic crop advisories and a demo farmer account:

```bash
node server/db/seed.js
```

**Pre-seeded Demo Account:**
- **Email**: `farmer@agriadvisor.org`
- **Password**: `Farmer@123`

### 4. Run Development Servers

In terminal 1 (Backend):
```bash
node server/server.js
```

In terminal 2 (Frontend):
```bash
cd client
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛡️ API Endpoints

### Auth
- `POST /api/auth/register` — Register a new farmer
- `POST /api/auth/login` — Sign in and get JWT token
- `POST /api/auth/logout` — Sign out
- `GET /api/auth/me` — Get current authenticated user

### Farmer Profile
- `GET /api/users/me` — Get profile
- `PUT /api/users/me` — Update profile & language preferences

### Farms
- `GET /api/farms` — List farms owned by user
- `POST /api/farms` — Create new farm parcel
- `GET /api/farms/:id` — Get farm details (ownership verified)
- `PUT /api/farms/:id` — Update farm details
- `DELETE /api/farms/:id` — Delete farm

### Advisories
- `POST /api/advisories` — Run Gemini AI advisory generation and persist to database
- `GET /api/advisories` — Search and filter advisory history
- `GET /api/advisories/:id` — View detailed structured advisory report
- `DELETE /api/advisories/:id` — Delete advisory report
- `PATCH /api/advisory-actions/:id` — Update status of a field action task

### Health
- `GET /api/health` — Returns `{ "success": true, "status": "healthy" }`
