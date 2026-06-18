# 🌸 Bloom Haven BnB (Lotus Heaven)

An enterprise-grade, full-stack Boutique Bed & Breakfast booking and guest experience management application. Built using a modern monorepo architecture with a **React + TypeScript** frontend and a **NestJS + Prisma** backend, this application provides users with interactive booking, real-time messaging, AI integrations, 3D property maps, and comprehensive administrative controls.

---

## 🚀 Features

### 🏨 Guest Experience & Booking
* **Interactive Booking Flow:** Seamless step-by-step reservation wizard with real-time room availability checks.
* **3D Property Explorer:** Interact with a virtual 3D room tour and floor blueprint viewer using Three.js / React Three Fiber.
* **Smart Search:** Enhanced search and filtering by price, amenities, date ranges, and guest capacities.
* **Weather Intelligence:** Contextual weather widgets suggesting guest experiences based on real-time forecast data.
* **Room Comparison:** Side-by-side amenity and price comparison tool.
* **Travel Memories & Itineraries:** Share trip journals, map out custom travel itineraries, and track vacation expenses.

### 🤖 AI & Real-time Integrations
* **AI Image Generator:** Synthesizes custom scenery images for destinations.
* **AI Recommendations:** Localized, context-aware suggestions for stays and activities.
* **Live Chat & Voice Assistant:** Instant floating messaging widget for guest queries and voice commands.
* **Real-time Notifications:** Toast-based notifications for bookings, reviews, and updates powered by WebSockets.

### 🛡️ Administration & Security
* **Admin Dashboard:** High-level performance tracking, booking analytics, guest listings, and interactive availability calendars.
* **Secure Authentication:** JWT token authentication stored securely using `HttpOnly` and `SameSite` cookies with refresh rotation.
* **Payment Integration:** Multi-processor checkout workflow supporting **Stripe** and **Razorpay**.
* **Mutating Audit Logs:** Interceptor-level tracking of database alterations for full transparency.

---

## 🛠️ Tech Stack

### Frontend
* **Core:** React 18, TypeScript, Vite
* **Routing:** React Router DOM
* **State & Query:** Zustand, TanStack React Query (Axios)
* **Styling:** Tailwind CSS, Shadcn/ui, Framer Motion
* **Visuals:** Three.js / React Three Fiber (R3F)

### Backend
* **Core:** NestJS (Node.js framework), TypeScript
* **Database & ORM:** Prisma ORM, PostgreSQL (Neon Server in production)
* **Caching & Queue:** Redis, BullMQ
* **Security:** Passport JWT, Cookie Parser, Bcrypt
* **Utilities:** Swagger API Docs, Winston (Nest Logger), Resend (Transactional Email)

---

## 📂 Project Structure

```
├── .github/workflows/       # GitHub Actions CI/CD pipeline
├── backend/                 # NestJS App Directory
│   ├── prisma/              # Schema definition & migrations
│   ├── src/                 # Backend TypeScript source code
│   └── Dockerfile           # Production Docker configuration
├── public/                  # Static assets & service workers
├── src/                     # React App Directory
│   ├── components/          # Reusable UI & custom features
│   ├── hooks/               # Custom React hooks (AI, voice, state)
│   ├── lib/                 # Global stores, API clients & styling
│   └── pages/               # Routing views (Dashboards, Room Detail, Travel journal)
├── docker-compose.yml       # Production-like multi-container orchestrator
└── package.json             # Root frontend configuration
```

---

## ⚙️ Environment Variables Setup

Before running the application, define your environment variables. Create a `.env` file in the root directory and inside the `/backend` directory.

### Root Directory (`/.env`)
```env
VITE_API_URL="/api"
```

### Backend Directory (`/backend/.env`)
```env
# Database connection
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=require"

# Token secrets (Min 32 characters long)
JWT_ACCESS_SECRET="your-development-access-secret-32-chars-minimum!"
JWT_REFRESH_SECRET="your-development-refresh-secret-32-chars-minimum!"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Server configuration
PORT=3000
FRONTEND_URL="http://localhost:8080"
NODE_ENV="development"

# Third-party integrations
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RESEND_API_KEY="re_..."
REDIS_URL="redis://localhost:6379"
```

---

## 💻 Running the Application Locally

You can run the application using **Docker** or directly on your host machine.

### Method 1: Using Docker Compose (Recommended)
This method builds the backend and spins up Postgres and Redis containers automatically.

1. Ensure Docker Desktop is running.
2. Run the orchestrator from the root:
   ```bash
   docker-compose up --build
   ```
3. The API will start on `http://localhost:3000` and the Database on `http://localhost:5432`.

### Method 2: Running Raw Local Servers

#### 1. Setup Backend:
```bash
cd backend
npm install
# Generate Prisma client and deploy database migrations
npx prisma generate
npx prisma migrate dev
# Start the dev server
npm run start:dev
```

#### 2. Setup Frontend:
```bash
# In the root project directory
npm install
npm run dev
```
The frontend application will boot on `http://localhost:8080` (or the fallback port).

---

## 🧪 Tests & Linting

Verify your code locally before pushing:

* **Backend Tests:** Runs Jest test suite
  ```bash
  cd backend
  npm run test
  ```
* **Frontend Builds:** Validates TypeScript & builds production bundle
  ```bash
  npm run build
  ```

---

## 🌐 Production Deployments

The project is preconfigured to support automated deployments.

### Railway (Backend & Database)
1. Link your GitHub repository in your **Railway Dashboard**.
2. Railway will automatically find the `/backend` directory and deploy using the `backend/Dockerfile`.
3. Database migrations will run automatically on startup via:
   `npx prisma migrate deploy`

### Vercel (Frontend SPA)
1. Link the repository to **Vercel**.
2. Configure the Build Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add a rewrites file (`vercel.json`) if you wish to proxy `/api` requests to your Railway backend server directly:
   ```json
   {
     "rewrites": [{ "source": "/api/(.*)", "destination": "https://your-backend.up.railway.app/api/$1" }]
   }
   ```
