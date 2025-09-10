

# 🌱 ESG Questionnaire Platform

## 📂 Project Structure

```
.
├── backend/                # Node.js + Express + Prisma backend
│   ├── prisma/             # Database schema & migrations
│   ├── src/
│   │   ├── middleware/     # JWT authentication middleware
│   │   ├── routes/         # API route handlers
│   │   ├── utils/          # Helper functions
│   │   ├── app.ts          # Express app configuration
│   │   ├── prisma.ts       # Prisma client
│   │   ├── seed.ts         # Database seeding
│   │   └── server.ts       # Server entrypoint
│
├── frontend/               # Next.js + TypeScript frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   │   ├── auth/       # Login & Register pages
│   │   │   ├── dashboard/  # ESG dashboard (protected)
│   │   │   ├── questionnaire/ # ESG questionnaire (protected)
│   │   │   ├── responses/  # View past responses (protected)
│   │   │   └── summary/    # Charts & downloads (protected)
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state (AuthContext)
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # ESG calculations & exports
│
├── .env                    # Environment variables
├── package.json
└── README.md
```

---

## ✨ Features

* 🔐 **Authentication** – JWT-based login & registration
* 📊 **ESG Questionnaire** – Collect Environmental, Social, Governance metrics per financial year
* ⚡ **Real-Time Calculations**

  * Carbon Intensity
  * Renewable Electricity Ratio
  * Diversity Ratio
  * Community Spend Ratio
* 📈 **Dashboard & Summary** – Interactive charts with **Recharts**
* 💾 **Persistence** – Responses stored in PostgreSQL (Prisma ORM)
* 📑 **Export** – Download questionnaire & summary as **PDF/Excel**
* 🎨 **Modern UI/UX** – Next.js, TailwindCSS, and reusable components

---

## 🛠️ Tech Stack

**Frontend**

* Next.js (App Router) + TypeScript
* TailwindCSS
* Recharts (for data visualization)

**Backend**

* Node.js + Express (TypeScript)
* Prisma ORM
* PostgreSQL

**Other**

* JWT Authentication
* PDF/Excel Export Libraries

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/esg-questionnaire-platform.git
cd esg-questionnaire-platform
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env

# Run Prisma migrations
npx prisma migrate dev --name init

# Seed database
npm run seed

# Start backend server
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install

# Setup environment variables
cp .env.example .env

# Run frontend
npm run dev
```

---

## 📌 Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`frontend/.env`)

```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"
```

---

## 📌 API Endpoints

| Endpoint             | Method | Description                    | Auth |
| -------------------- | ------ | ------------------------------ | ---- |
| `/api/auth/register` | POST   | Register new user              | ❌    |
| `/api/auth/login`    | POST   | Login, returns JWT             | ❌    |
| `/api/responses`     | POST   | Save ESG response              | ✅    |
| `/api/responses`     | GET    | Fetch logged-in user responses | ✅    |
| `/api/responses/:id` | GET    | Fetch single response          | ✅    |
| `/api/responses/:id` | PUT    | Update a response              | ✅    |
| `/api/responses/:id` | DELETE | Delete a response              | ✅    |

---

## 📊 Example Metrics

**Inputs**

* Environmental: Electricity, Renewable Energy, Fuel, Carbon Emissions
* Social: Employees, Female Employees, Training Hours, Community Spend
* Governance: Board Independence, Data Privacy Policy, Revenue

**Auto-calculated**

* Carbon Intensity
* Renewable Electricity Ratio
* Diversity Ratio
* Community Spend Ratio

---

## 📦 Deployment

* **Backend:** Render
* **Frontend:** Vercel
* **Database:** Supabase

---

