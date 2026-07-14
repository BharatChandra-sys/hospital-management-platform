<div align="center">
  <img src="frontend/public/logo.svg-removebg-preview.png" alt="Deepthi Hospitals" height="80" />

  <h1>Deepthi Hospital Management System</h1>

  <p>A production-grade, open-source hospital management platform built with React and FastAPI.<br/>
  Covers a full public-facing hospital website, patient portal, and a multi-role staff HMS portal with real payment processing.</p>

  <p>
    <a href="https://github.com/bharatchandra/hospital-management-platform/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License: Apache 2.0" />
    </a>
    <img src="https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white" alt="Python 3.11+" />
    <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 16" />
    <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/Razorpay-Integrated-02042B?logo=razorpay&logoColor=white" alt="Razorpay" />
  </p>

  <p>
    <a href="#overview">Overview</a> &bull;
    <a href="#features">Features</a> &bull;
    <a href="#tech-stack">Tech Stack</a> &bull;
    <a href="#project-structure">Structure</a> &bull;
    <a href="#getting-started">Getting Started</a> &bull;
    <a href="#deployment">Deployment</a> &bull;
    <a href="#api-reference">API Reference</a> &bull;
    <a href="#demo-credentials">Demo Credentials</a> &bull;
    <a href="#contributing">Contributing</a> &bull;
    <a href="#license">License</a>
  </p>
</div>

---

## Overview

Deepthi Hospital Management System is a full-stack, multi-tenant platform designed to digitise and centralise hospital operations. It provides three distinct portals — a public patient-facing website, a patient self-service dashboard, and an internal HMS portal — all backed by a single async REST API.

The system handles real-world workflows including appointment booking with live payments via Razorpay, doctor queue management, prescription writing, lab order management, bed allocation, inventory tracking, and multi-role staff access control.

---

## Features

### Public Website

- Hospital landing page with departments, services, and doctor directory
- Doctor profiles with specialisations, qualifications, ratings, and available slots
- Online appointment booking with date and time slot selection
- Razorpay payment integration at the point of booking
- Patient registration and login
- Emergency contacts and information page
- About, Contact, FAQ, and legal pages

### Patient Dashboard

- Upcoming and past appointment management with cancellation
- Prescription viewer with medication details and refill status
- Lab reports viewer with status tracking and file download
- Billing page with invoice listing, one-click Pay Now, payment retry on failure, and payment history
- Printable invoice generation (client-side, no server dependency)
- Health profile management including blood group, allergies, and emergency contact

### HMS Admin Portal

- Central dashboard with live statistics — patients, appointments, beds, revenue, and pending bills
- Patient management — register, search, view history
- Doctor management — onboard, edit profile, set schedule and available slots
- Appointment management across all departments with status updates
- Bed management with ward-wise occupancy view
- Inventory management with low-stock alerts and category filtering
- Billing management with Razorpay payment initiation and verification
- Lab queue management
- Pharmacy management
- Analytics reports with date range selection and CSV export
- Staff and role management

### HMS Doctor Portal

- Clinical dashboard showing today's queue, next consultation, completed and pending counts
- Prescription pad — write prescriptions with multi-medication rows, frequency, dosage, route, and follow-up
- Lab order form — categorised test selection (Haematology, Biochemistry, Radiology, Microbiology, and more) with urgency levels and multi-test ordering in a single action
- Appointment management with status updates and clinical notes
- Patient records access
- Schedule management

### HMS Reception Portal

- Walk-in patient registration
- Appointment creation and check-in
- Live queue view with token management
- Billing and payment processing
- Discharge processing
- Patient records lookup

### Payments

- Razorpay order creation on the backend; checkout rendered on the frontend
- HMAC-SHA256 signature verification on every payment callback
- Razorpay webhook support for server-side payment confirmation
- Automatic bill status update on payment capture
- Payment retry without re-creating the order
- Printable, itemised invoice download

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool and dev server |
| Tailwind CSS | v4 | Utility-first styling |
| React Router DOM | 7 | Client-side routing |
| Zustand | 5 | Global state management with localStorage persistence |
| React Hook Form | 7 | Form state and validation |
| Zod | 4 | Schema-based form validation |
| Recharts | 3 | Admin analytics charts |
| react-hot-toast | 2 | Notifications |
| Razorpay Checkout | v1 | Payment modal |
| XLSX | 0.18 | CSV and spreadsheet export |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11+ | Runtime |
| FastAPI | 0.115 | Async REST API framework |
| SQLAlchemy | 2 | Async ORM |
| asyncpg | 0.30 | Async PostgreSQL driver |
| PostgreSQL | 16 | Primary database |
| Alembic | 1.14 | Database migrations |
| Pydantic v2 | 2.10 | Request and response validation |
| pydantic-settings | 2.7 | Environment-based configuration |
| python-jose | 3.3 | JWT access and refresh tokens |
| passlib + bcrypt | 1.7 | Password hashing |
| Razorpay SDK | 1.4 | Order creation and verification |
| Loguru | 0.7 | Structured logging |

### Infrastructure

| Tool | Purpose |
|---|---|
| Docker + Docker Compose | Local development with PostgreSQL, Redis, MinIO |
| Render | Backend API and PostgreSQL hosting |
| Vercel | Frontend hosting |
| Cloudflare Tunnel | Local HTTPS tunnelling for webhook testing |

---

## Project Structure

```
hospital-management-platform/
│
├── frontend/                          # React + Vite application
│   ├── public/                        # Static assets
│   │   ├── logo.svg-removebg-preview.png
│   │   ├── logo-dark.svg-removebg-preview.png
│   │   ├── logo-white.svg-removebg-preview.png
│   │   ├── logo-icon.svg-removebg-preview.png
│   │   └── favicon.svg-removebg-preview.png
│   ├── src/
│   │   ├── App.jsx                    # Root router
│   │   ├── main.jsx                   # Entry point
│   │   ├── index.css                  # Global styles
│   │   ├── components/                # Shared UI components
│   │   │   ├── Logo.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── HmsHeader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── layouts/                   # Route layout wrappers
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── DoctorHmsLayout.jsx
│   │   │   ├── ReceptionLayout.jsx
│   │   │   └── HmsLayout.jsx
│   │   ├── pages/
│   │   │   ├── (public pages)         # HomePage, DoctorsPage, etc.
│   │   │   ├── dashboard/             # Patient self-service portal
│   │   │   └── hms/
│   │   │       ├── admin/             # Admin portal pages
│   │   │       ├── doctor/            # Doctor portal pages
│   │   │       └── reception/         # Reception portal pages
│   │   ├── services/
│   │   │   └── api.js                 # Centralised API layer with auth, retry
│   │   ├── store/                     # Zustand stores
│   │   ├── utils/
│   │   │   └── invoiceGenerator.js    # Client-side invoice PDF
│   │   └── data/
│   │       └── mockData.js            # Fallback mock data
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
├── backend/                           # FastAPI application
│   ├── app/
│   │   ├── main.py                    # Application entry point, CORS, middleware
│   │   ├── core/
│   │   │   ├── config.py              # Pydantic settings from environment
│   │   │   ├── database.py            # Async SQLAlchemy engine and session
│   │   │   ├── security.py            # JWT creation, password hashing
│   │   │   └── deps.py                # FastAPI dependencies (get_current_user, etc.)
│   │   ├── models/                    # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── patient.py
│   │   │   ├── doctor.py
│   │   │   ├── appointment.py
│   │   │   ├── prescription.py
│   │   │   ├── lab_report.py
│   │   │   ├── billing.py
│   │   │   ├── bed.py
│   │   │   ├── inventory.py
│   │   │   ├── doctor_schedule.py
│   │   │   ├── staff.py
│   │   │   └── role.py
│   │   ├── schemas/                   # Pydantic request/response schemas
│   │   ├── routers/                   # FastAPI route handlers
│   │   │   ├── auth_router.py
│   │   │   ├── patient_router.py
│   │   │   ├── doctor_router.py
│   │   │   ├── appointment_router.py
│   │   │   ├── prescription_router.py
│   │   │   ├── lab_router.py
│   │   │   ├── billing_router.py      # Razorpay order, verify, webhook
│   │   │   ├── bed_router.py
│   │   │   ├── inventory_router.py
│   │   │   ├── admin_router.py
│   │   │   └── user_router.py
│   │   ├── services/                  # Business logic layer
│   │   ├── middleware/
│   │   │   ├── error_handler.py       # Global exception handler
│   │   │   └── rbac.py                # Role-based access control
│   │   └── utils/
│   │       └── logger.py
│   ├── alembic/                       # Database migration scripts
│   ├── tests/                         # pytest test suite
│   ├── seed.py                        # Demo data seeder
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── docker-compose.yml                 # PostgreSQL, Redis, MinIO for local dev
├── LICENSE                            # Apache License 2.0
├── NOTICE                             # Copyright and third-party notices
├── CONTRIBUTING.md                    # Contribution guidelines
├── STARTUP.md                         # Step-by-step local setup guide
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Python 3.11 or higher
- PostgreSQL 16 (or Docker)

### 1. Clone the repository

```bash
git clone https://github.com/bharatchandra/hospital-management-platform.git
cd hospital-management-platform
```

### 2. Backend setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` and fill in the required values:

```env
DATABASE_URL=postgresql+asyncpg://postgres:yourpassword@localhost:5432/deepthi_db
SECRET_KEY=your-long-random-secret-key-here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
ALLOWED_ORIGINS=http://localhost:5173
```

Start the backend:

```bash
venv\Scripts\python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`. Interactive documentation is at `http://localhost:8000/docs` when `DEBUG=True`.

### 3. Seed demo data

```bash
venv\Scripts\python seed.py
```

This creates all demo users, doctors, patients, appointments, prescriptions, lab reports, inventory, and beds.

### 4. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

Start the dev server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 5. Docker (optional — runs PostgreSQL, Redis, MinIO)

```bash
docker-compose up -d
```

Update `DATABASE_URL` in `backend/.env` to use port 5433 when using Docker Compose.

---

## Demo Credentials

Run `seed.py` before using these credentials.

| Role | Email | Password | Portal |
|---|---|---|---|
| Admin | admin@deepthihospitals.com | admin123 | /hms/admin/dashboard |
| Admin (alt) | admin@deepthi.com | admin123 | /hms/admin/dashboard |
| Doctor (Cardiology) | rajesh@deepthi.com | doctor123 | /hms/doctor/dashboard |
| Doctor (Neurology) | priya@deepthi.com | doctor123 | /hms/doctor/dashboard |
| Reception | reception@deepthihospitals.com | admin123 | /hms/reception/dashboard |
| Patient | arjun@deepthi.com | password123 | /dashboard |
| Patient (alt) | priya.nair@gmail.com | patient123 | /dashboard |

**Razorpay test card:** `4111 1111 1111 1111` — any future expiry — any 3-digit CVV

---

## API Reference

The API is fully documented via Swagger UI when running locally.

**Base URL (local):** `http://localhost:8000`  
**Swagger UI:** `http://localhost:8000/docs`  
**ReDoc:** `http://localhost:8000/redoc`

### Authentication

All protected endpoints require a JWT Bearer token in the `Authorization` header.

```
Authorization: Bearer <access_token>
```

Tokens are obtained via `POST /auth/login`. A refresh token is also returned and can be used at `POST /auth/refresh` to obtain a new access token without re-authentication.

### Core Endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | /auth/register | Register a new patient | Public |
| POST | /auth/login | Login, receive access + refresh tokens | Public |
| POST | /auth/refresh | Refresh access token | Refresh token |
| GET | /auth/me | Get current user profile | Required |
| GET | /doctors | List all doctors with filters | Public |
| GET | /doctors/{id} | Get doctor profile | Public |
| POST | /appointments | Book an appointment | Required |
| GET | /appointments | List appointments | Required |
| DELETE | /appointments/{id} | Cancel appointment | Required |
| GET | /patients/me | Get patient profile | Required |
| PATCH | /patients/me | Update patient profile | Required |
| GET | /prescriptions | List prescriptions | Required |
| POST | /prescriptions | Create prescription | DOCTOR |
| GET | /lab-reports | List lab reports | Required |
| POST | /lab-reports | Create lab report | DOCTOR |
| GET | /billing | List bills | Required |
| POST | /billing/{id}/pay | Create Razorpay order | Required |
| POST | /billing/{id}/verify | Verify payment signature | Required |
| POST | /billing/webhook/razorpay | Razorpay webhook | Signed |
| GET | /admin/stats | Dashboard statistics | ADMIN |
| GET | /admin/patients | All patients | ADMIN/RECEPTION |
| GET | /admin/appointments | All appointments | ADMIN/RECEPTION |
| GET | /beds | List beds | ADMIN/RECEPTION |
| GET | /inventory | List inventory | ADMIN |
| GET | /health | Health check | Public |

---

## Deployment

### Quick Deploy (One-Click)

Deploy the complete Hospital Management Platform with a single click:

#### Frontend (Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/BharatChandra-sys/hospital-management-platform&project-name=hospital-management-frontend&framework=vite&root-directory=frontend)

#### Backend + Database (Render)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/BharatChandra-sys/hospital-management-platform)

### Manual Deployment

### Frontend — Vercel

1. Push the repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Set the root directory to `frontend`.
4. Add the following environment variables in Vercel project settings:

```
VITE_API_URL=https://your-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

5. Deploy. Vercel auto-detects Vite and builds with `npm run build`.

> Vercel Note: The frontend uses React Router with client-side routing. Add a `vercel.json` at the root of the `frontend` folder to handle SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Backend — Render

1. Go to [render.com](https://render.com) and create a new Web Service.
2. Connect your GitHub repository.
3. Set the following:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

4. Add environment variables in Render's Environment tab:

```
DATABASE_URL=postgresql+asyncpg://user:pass@host/db
SECRET_KEY=your-production-secret-key
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
ALLOWED_ORIGINS=https://your-frontend.vercel.app
ENVIRONMENT=production
DEBUG=False
```

### Database — Render PostgreSQL

1. In Render, create a new PostgreSQL instance.
2. Copy the Internal Database URL.
3. Replace `postgresql://` with `postgresql+asyncpg://` and paste it as `DATABASE_URL` in your backend service environment variables.
4. The backend will auto-create all tables on first startup.
5. To seed demo data on Render, use the Render Shell to run `python seed.py`.

### Razorpay Webhook (Production)

Once deployed, register the webhook in Razorpay Dashboard:

- URL: `https://your-backend.onrender.com/billing/webhook/razorpay`
- Events: `payment.captured`
- Webhook Secret: same value as `RAZORPAY_KEY_SECRET`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| DATABASE_URL | Yes | PostgreSQL async connection string |
| SECRET_KEY | Yes | JWT signing secret (use a long random string) |
| ALGORITHM | No | JWT algorithm, default HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | No | Access token TTL, default 480 |
| REFRESH_TOKEN_EXPIRE_MINUTES | No | Refresh token TTL, default 43200 |
| RAZORPAY_KEY_ID | Yes | Razorpay API key ID |
| RAZORPAY_KEY_SECRET | Yes | Razorpay API key secret |
| ALLOWED_ORIGINS | Yes | Comma-separated CORS origins |
| ENVIRONMENT | No | development or production |
| DEBUG | No | True shows Swagger UI, False hides it |
| LOG_LEVEL | No | INFO, DEBUG, WARNING, ERROR |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| VITE_API_URL | Yes | Backend base URL |
| VITE_RAZORPAY_KEY_ID | Yes | Razorpay publishable key |

---

## Running Tests

### Backend

```bash
cd backend
venv\Scripts\activate
pytest tests/ -v
```

### Frontend

```bash
cd frontend
npm run test
npm run test:coverage
```

---

## Database Migrations

The backend uses Alembic for schema migrations.

```bash
cd backend

# Create a new migration
venv\Scripts\python -m alembic revision --autogenerate -m "description"

# Apply migrations
venv\Scripts\python -m alembic upgrade head

# Rollback one step
venv\Scripts\python -m alembic downgrade -1
```

---

## Local Ports Summary

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| Health Check | http://localhost:8000/health |

---

## Portal URLs

| Portal | Path |
|---|---|
| Public Website | / |
| HMS Entry | /hms |
| Admin Dashboard | /hms/admin/dashboard |
| Doctor Dashboard | /hms/doctor/dashboard |
| Reception Dashboard | /hms/reception/dashboard |
| Patient Dashboard | /dashboard |

---

## Security Notes

- Never commit `.env` files. Both `.env` files are listed in `.gitignore`.
- Always use a long, randomly-generated `SECRET_KEY` in production.
- Switch to Razorpay live keys only in production. Test keys are safe for development.
- `DEBUG=False` in production disables Swagger UI and ReDoc.
- All payment verification uses HMAC-SHA256 signature comparison with `hmac.compare_digest` to prevent timing attacks.
- Passwords are hashed with bcrypt via passlib.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

---

## Releases

### Latest Release

Check the [Releases page](https://github.com/BharatChandra-sys/hospital-management-platform/releases) for the latest version and release notes.

### Creating Releases

For maintainers, use the automated release scripts:

```bash
# Windows
scripts\create-release.bat v1.0.0

# Cross-platform
python scripts/create-release.py v1.0.0
```

See [RELEASE_GUIDE.md](RELEASE_GUIDE.md) for detailed release procedures.

### Version History

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes in each version.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch and open a pull request

---

## License

Copyright 2024-2026 Bodapati Bharat Chandra

Licensed under the Apache License, Version 2.0. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See [LICENSE](LICENSE) for the full license text.

See [NOTICE](NOTICE) for third-party software acknowledgements.

---

## Author

**Bodapati Bharat Chandra**

Built as a complete, production-grade reference implementation of a hospital management system covering real-world workflows, payment processing, multi-role access control, and deployment readiness.
