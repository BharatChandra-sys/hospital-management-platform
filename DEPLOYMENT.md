# Deployment Guide

Step-by-step instructions for deploying Deepthi Hospitals Management Platform to production.  
**Stack:** React + Vite → Vercel · FastAPI + PostgreSQL → Render · Payments → Razorpay Test Mode

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Backend — Render](#2-backend--render)
3. [Database Migration & Seed](#3-database-migration--seed)
4. [Frontend — Vercel](#4-frontend--vercel)
5. [Razorpay Test Setup](#5-razorpay-test-setup)
6. [Environment Variable Reference](#6-environment-variable-reference)
7. [Demo Credentials](#7-demo-credentials)
8. [Verify the Deployment](#8-verify-the-deployment)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

| Account | Free tier | Sign-up URL |
|---|---|---|
| GitHub | Yes | https://github.com |
| Render | Yes | https://render.com |
| Vercel | Yes | https://vercel.com |
| Razorpay | Yes (test mode) | https://razorpay.com |

You need the repository pushed to GitHub before starting.

---

## 2. Backend — Render

### 2a. Create the PostgreSQL Database

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **PostgreSQL**.
3. Fill in:
   - **Name:** `deepthi-db`
   - **Database:** `deepthi_db`
   - **User:** `deepthi_user`
   - **Region:** pick the closest to your users
   - **Plan:** Free
4. Click **Create Database**.
5. Once it's running, click into the database and copy the **Internal Database URL** — it looks like:
   ```
   postgresql://deepthi_user:PASSWORD@dpg-xxx.render.com/deepthi_db
   ```
   You'll need this in the next step.

> **Note:** The internal URL only works within Render. For local debugging use the **External Database URL** instead.

### 2b. Deploy the Web Service

1. Click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:

   | Field | Value |
   |---|---|
   | **Name** | `deepthi-backend` |
   | **Root Directory** | `backend` |
   | **Environment** | `Python 3` |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
   | **Plan** | Free |

4. Under **Environment Variables**, add every variable from the table below:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Internal Database URL from step 2a — **replace `postgresql://` with `postgresql+asyncpg://`** |
   | `SECRET_KEY` | Generate one: `python -c "import secrets; print(secrets.token_hex(32))"` |
   | `ALGORITHM` | `HS256` |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `480` |
   | `REFRESH_TOKEN_EXPIRE_MINUTES` | `43200` |
   | `APP_NAME` | `Deepthi Hospitals` |
   | `ENVIRONMENT` | `production` |
   | `DEBUG` | `False` |
   | `ALLOWED_ORIGINS` | `https://your-app.vercel.app` (update after Vercel deploy) |
   | `RAZORPAY_KEY_ID` | Your Razorpay test key (see §5) |
   | `RAZORPAY_KEY_SECRET` | Your Razorpay test secret (see §5) |

   > **DATABASE_URL format:** Render gives you `postgresql://user:pass@host/db`.  
   > You must change the scheme to `postgresql+asyncpg://user:pass@host/db` for async SQLAlchemy.

5. Click **Create Web Service**. The first deploy takes 2–4 minutes.

6. Once live, copy the service URL, e.g. `https://deepthi-backend.onrender.com`.  
   You'll paste this into Vercel as `VITE_API_URL`.

---

## 3. Database Migration & Seed

After the backend service is running, open the **Render Shell** (Shell tab in the service dashboard) and run:

```bash
# Apply all schema migrations
alembic upgrade head

# Load demo data (doctors, patients, appointments, inventory, beds)
python seed.py
```

The seed script is idempotent — safe to run multiple times. It creates:

- 10 specialist doctors with full profiles
- 1 primary demo patient (`arjun@deepthi.com`)
- 8 additional patients with appointment history
- 15 appointments (past + today + upcoming) with bills
- Lab reports, prescriptions
- 10 inventory items, 50 beds across 6 wards
- All staff/admin/reception accounts

---

## 4. Frontend — Vercel

### 4a. Deploy

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** → **Project**.
3. Import your GitHub repository.
4. Configure the project:

   | Field | Value |
   |---|---|
   | **Root Directory** | `frontend` |
   | **Framework Preset** | Vite |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

5. Under **Environment Variables**, add:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | `https://deepthi-backend.onrender.com` (your Render URL) |
   | `VITE_RAZORPAY_KEY_ID` | Your Razorpay test key ID (see §5) |

6. Click **Deploy**. Build takes ~1 minute.

7. Copy the deployment URL, e.g. `https://deepthi-hospitals.vercel.app`.

### 4b. Update CORS on Render

Go back to your Render backend service → **Environment** and update:

```
ALLOWED_ORIGINS=https://deepthi-hospitals.vercel.app
```

Then click **Save Changes** — Render will redeploy automatically.

---

## 5. Razorpay Test Setup

Razorpay test mode lets you simulate payments without real money. No business verification needed.

### Get your API keys

1. Sign up at [razorpay.com](https://razorpay.com) (free).
2. Log in → **Settings** → **API Keys** → **Generate Test Key**.
3. Copy the **Key ID** (`rzp_test_...`) and **Key Secret**.
4. Add both to Render environment variables and the Key ID to Vercel (see §6).

### Test card details

Use these during demo payment flows — no real charges:

| Field | Value |
|---|---|
| **Card Number** | `4111 1111 1111 1111` |
| **Expiry** | Any future date (e.g. `12/26`) |
| **CVV** | Any 3 digits (e.g. `123`) |
| **Name** | Any name |
| **OTP** | `1234` (Razorpay test OTP) |

Other test cards:

| Scenario | Card Number |
|---|---|
| Success | `4111 1111 1111 1111` |
| Failure | `4000 0000 0000 0002` |
| International | `4012 8888 8888 1881` |

> All test transactions appear in the Razorpay Dashboard under **Test Mode** → **Transactions**.

### Webhook (optional for demo)

If you want the webhook to auto-mark bills as PAID:

1. Razorpay Dashboard → **Settings** → **Webhooks** → **Add New Webhook**.
2. URL: `https://deepthi-backend.onrender.com/billing/webhook/razorpay`
3. Active events: `payment.captured`
4. Secret: use the same value as `RAZORPAY_KEY_SECRET`

---

## 6. Environment Variable Reference

### Backend (Render Environment Variables)

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host/deepthi_db

# Auth
SECRET_KEY=<32+ char random hex>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
REFRESH_TOKEN_EXPIRE_MINUTES=43200

# App
APP_NAME=Deepthi Hospitals
ENVIRONMENT=production
DEBUG=False

# CORS — your Vercel URL, no trailing slash
ALLOWED_ORIGINS=https://your-app.vercel.app

# Razorpay test keys
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

### Frontend (Vercel Environment Variables)

```bash
# Backend URL — no trailing slash
VITE_API_URL=https://deepthi-backend.onrender.com

# Razorpay Key ID (public — Key ID only, never the secret)
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
```

---

## 7. Demo Credentials

All passwords are set by the seed script.

### Staff Portal (`/hms`)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@deepthi.com` | `admin123` |
| Admin (alt) | `admin@deepthihospitals.com` | `admin123` |
| Reception | `reception@deepthihospitals.com` | `admin123` |
| Reception 2 | `reception2@deepthihospitals.com` | `admin123` |

### Doctors (Staff Portal → Doctor Dashboard)

| Name | Email | Password |
|---|---|---|
| Dr. Rajesh Kumar (Cardiology) | `rajesh@deepthi.com` | `doctor123` |
| Dr. Priya Sharma (Neurology) | `priya@deepthi.com` | `doctor123` |
| Dr. Anil Deshmukh (Orthopedics) | `anil@deepthi.com` | `doctor123` |
| Dr. Sarah Williams (Pediatrics) | `sarah@deepthi.com` | `doctor123` |
| Dr. Meena Iyer (Dermatology) | `meena@deepthi.com` | `doctor123` |
| Dr. Vikram Nair (Ophthalmology) | `vikram@deepthi.com` | `doctor123` |
| Dr. Ananya Reddy (Oncology) | `ananya@deepthi.com` | `doctor123` |
| Dr. Suresh Babu (Gastroenterology) | `suresh@deepthi.com` | `doctor123` |
| Dr. Kavitha Menon (Psychiatry) | `kavitha@deepthi.com` | `doctor123` |
| Dr. Ramesh Gupta (Internal Medicine) | `ramesh@deepthi.com` | `doctor123` |

### Patient Portal (`/book-appointment`, `/dashboard`)

| Name | Email | Password |
|---|---|---|
| Arjun Mehta (primary demo) | `arjun@deepthi.com` | `password123` |
| Priya Nair | `priya.nair@gmail.com` | `patient123` |
| Suresh Reddy | `suresh.reddy@gmail.com` | `patient123` |
| Kavitha Menon | `kavitha.m@gmail.com` | `patient123` |

---

## 8. Verify the Deployment

Run through this checklist after deploying:

### Backend health

```
GET https://deepthi-backend.onrender.com/
→ {"message": "Deepthi Hospitals API is running"}

GET https://deepthi-backend.onrender.com/docs
→ Swagger UI loads with all endpoints
```

### Auth flow

1. Open `https://your-app.vercel.app/hms`.
2. Log in as `admin@deepthi.com` / `admin123`.
3. Confirm dashboard loads with stats (patients, doctors, appointments).

### Patient booking flow

1. Open the public site → **Book Appointment**.
2. Select a doctor, pick a date and time slot, submit.
3. Confirm the appointment appears in the admin dashboard.

### Payment flow (Razorpay test)

1. Log in as `arjun@deepthi.com` / `password123`.
2. Go to **Dashboard** → **Billing**.
3. Click **Pay Now** on a PENDING bill.
4. Razorpay checkout appears — use test card `4111 1111 1111 1111`, expiry `12/26`, CVV `123`.
5. Enter OTP `1234`.
6. Bill status should update to **Paid**.

---

## 9. Troubleshooting

### "CORS error" in browser console

The frontend origin is not in `ALLOWED_ORIGINS`. Update the variable on Render:
```
ALLOWED_ORIGINS=https://your-exact-vercel-url.vercel.app
```
No trailing slash. Redeploy.

### "Database connection refused"

- Check `DATABASE_URL` scheme is `postgresql+asyncpg://` not `postgresql://`.
- Confirm the Render PostgreSQL service is running (not suspended).
- Free tier databases on Render spin down after inactivity — the first request after spin-down takes ~30s.

### "Payment gateway not configured" (503)

`RAZORPAY_KEY_ID` is missing or still set to the placeholder `rzp_test_REPLACE_ME`. Add your real test key in Render environment variables.

### Build fails on Vercel

- Confirm **Root Directory** is set to `frontend` in Vercel project settings.
- Check that `VITE_API_URL` does not have a trailing slash.

### Alembic: "table already exists"

The database already has tables from a previous run. This is safe to ignore, or stamp the current state:
```bash
alembic stamp head
```

### Render free tier cold starts

Free Render services spin down after 15 minutes of inactivity. The first request after a cold start can take 30–50 seconds. For a demo, open the backend `/docs` URL a minute before presenting to pre-warm it.

### Seed fails with "duplicate key"

The seed script is idempotent — it checks before inserting. If you see this error, a partial seed ran previously. Run it again; it will skip existing records.

---

## Security Notes for Production

- [ ] Rotate `SECRET_KEY` — never use the example value
- [ ] Set `DEBUG=False`
- [ ] Switch Razorpay to **live mode** keys when going live
- [ ] Set `ALLOWED_ORIGINS` to exact frontend domain only
- [ ] Enable Render PostgreSQL automatic backups (paid plan)
- [ ] Monitor logs in Render → **Logs** tab

---

## Quick Reference

```
Public site:      https://your-app.vercel.app
Staff portal:     https://your-app.vercel.app/hms
API:              https://deepthi-backend.onrender.com
API docs:         https://deepthi-backend.onrender.com/docs
```
