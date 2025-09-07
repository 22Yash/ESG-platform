

## 📂 Project Structure

```
.
├── backend/                # Node.js + Express + Prisma backend
│   ├── prisma/             # Database schema & migrations
│   ├── src/
│   │   ├── middleware/     # Authentication middleware
│   │   ├── routes/         # API route handlers
│   │   ├── utils/          # Helper functions
│   │   ├── app.ts          # Express app config
│   │   ├── prisma.ts       # Prisma client
│   │   ├── seed.ts         # Seed database
│   │   └── server.ts       # Server entrypoint
│   └── ...
│
├── frontend/               # Next.js + TypeScript frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── app/            # App router pages
│   │   │   ├── auth/       # Login & Register pages
│   │   │   ├── dashboard/  # ESG dashboard
│   │   │   ├── questionnaire/ # ESG questionnaire
│   │   │   ├── responses/  # View past responses
│   │   │   └── summary/    # Charts & downloadable summary
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state (AuthContext)
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # ESG calculations & exports
│   └── ...
│
├── .env                    # Environment variables
├── package.json
└── README.md
```

---

## ✨ Features

* 🔐 **Authentication** – User registration, login, and JWT-based session handling
* 📊 **ESG Questionnaire** – Input environmental, social, and governance metrics per financial year
* ⚡ **Real-Time Calculations**

  * Carbon Intensity
  * Renewable Electricity Ratio
  * Diversity Ratio
  * Community Spend Ratio
* 📈 **Dashboard & Summary** – Charts using Recharts/Chart.js
* 💾 **Persistence** – Responses stored in PostgreSQL via Prisma ORM
* 📑 **Export** – Download filled questionnaire & summary in **PDF/Excel**
* 🎨 **UI/UX** – Built with Next.js, TailwindCSS, and reusable components

---

## 🛠️ Tech Stack

**Frontend:**

* Next.js (App Router) + TypeScript
* TailwindCSS
* Chart.js / Recharts

**Backend:**

* Node.js + Express (TypeScript)
* Prisma ORM
* PostgreSQL

**Other:**

* JWT Authentication
* PDF/Excel export libraries

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

# Seed DB
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

## 📌 API Endpoints

| Endpoint             | Method | Description                    | Auth Required  |
| -------------------- | ------ | ------------------------------ | -------------  |
| `/api/auth/register` | POST   | Register a new user            | ❌             |
| `/api/auth/login`    | POST   | Login and get JWT              | ❌             |
| `/api/responses`     | POST   | Save ESG response              | ✅             |
| `/api/responses`     | GET    | Fetch logged-in user responses | ✅             |

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

* Backend: Deploy on **Render**
* Frontend: Deploy on **Vercel**
* Database: **Supabase**

---


