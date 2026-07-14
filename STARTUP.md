# Local Development Setup

This file contains step-by-step instructions for running the project locally from scratch.

---

## Requirements

- Node.js 18 or higher
- Python 3.11 or higher
- PostgreSQL 16
- Git

---

## Step 1 — Clone the repository

```bash
git clone https://github.com/bharatchandra/hospital-management-platform.git
cd hospital-management-platform
```

---

## Step 2 — Database

Open psql or pgAdmin and create the database:

```sql
CREATE DATABASE deepthi_db;
```

The backend will auto-create all tables on first startup.

---

## Step 3 — Backend

Navigate to the backend folder and create a virtual environment:

```bash
cd backend
python -m venv venv
```

Activate it:

```bash
# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Copy and configure environment variables:

```bash
cp .env.example .env
```

Open `backend/.env` and fill in:

```env
DATABASE_URL=postgresql+asyncpg://postgres:yourpassword@localhost:5432/deepthi_db
SECRET_KEY=any-long-random-string-minimum-32-characters
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
ALLOWED_ORIGINS=http://localhost:5173
```

Start the server:

```bash
venv\Scripts\python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API is now running at `http://localhost:8000`.
API docs are at `http://localhost:8000/docs`.

---

## Step 4 — Seed demo data

With the backend running and the virtual environment active:

```bash
venv\Scripts\python seed.py
```

This creates demo users, doctors, patients, appointments, lab reports, prescriptions, inventory, and beds.

---

## Step 5 — Frontend

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
cp .env.example .env
```

Open `frontend/.env` and set:

```env
VITE_API_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

Start the dev server:

```bash
npm run dev
```

The frontend is now running at `http://localhost:5173`.

---

## Step 6 — ngrok or Cloudflare Tunnel (optional, for Razorpay webhooks)

This is only needed to test Razorpay payment webhooks locally.

**Using cloudflared (included in repo root):**

```bash
.\cloudflared.exe tunnel --url http://localhost:8000
```

Copy the HTTPS URL it prints (e.g. `https://xxxx.trycloudflare.com`).

**Using ngrok:**

```bash
ngrok http 8000
```

Then in Razorpay Dashboard, go to Settings → Webhooks → Add webhook:

- URL: `https://your-tunnel-url/billing/webhook/razorpay`
- Events: check `payment.captured`
- Secret: same as `RAZORPAY_KEY_SECRET`

Update `ALLOWED_ORIGINS` in `backend/.env` to include your tunnel URL and restart the backend.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@deepthihospitals.com | admin123 |
| Doctor | rajesh@deepthi.com | doctor123 |
| Reception | reception@deepthihospitals.com | admin123 |
| Patient | arjun@deepthi.com | password123 |

---

## Test Payment Card

Use these Razorpay test card details:

- Card number: `4111 1111 1111 1111`
- Expiry: any future date
- CVV: any 3 digits

---

## Common Issues

**Backend not starting**
- Check PostgreSQL is running on port 5432
- Verify `DATABASE_URL` in `.env` is correct
- Make sure the virtual environment is activated

**Frontend shows blank page or API errors**
- Check `VITE_API_URL` in `frontend/.env` points to `http://localhost:8000`
- Confirm the backend is running

**CORS error in browser**
- Add your frontend URL to `ALLOWED_ORIGINS` in `backend/.env`
- Restart the backend after changing `.env`

**401 Unauthorized on login**
- Run `seed.py` first — users do not exist until the seed runs
- Confirm you are using the exact email and password from the credentials table above

---

## Port Summary

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

---

## Running Tests

```bash
# Backend
cd backend
venv\Scripts\activate
pytest tests/ -v

# Frontend
cd frontend
npm run test
```

---

## Production Build

```bash
# Frontend
cd frontend
npm run build
# Output in frontend/dist/

# Backend — set DEBUG=False and ENVIRONMENT=production in .env first
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```
