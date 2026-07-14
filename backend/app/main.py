# Copyright 2024-2026 Bodapati Bharat Chandra
# Licensed under the Apache License, Version 2.0
# https://www.apache.org/licenses/LICENSE-2.0

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
from loguru import logger

from app.core.database import engine
from app.core.config import settings
from app.models import Base
from app.middleware.error_handler import global_exception_handler
from app.utils.logger import setup_logger

from app.routers import (
    auth_router, user_router, patient_router, doctor_router,
    appointment_router, prescription_router, lab_router,
    billing_router, bed_router, inventory_router, admin_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logger()
    logger.info(f"Starting {settings.APP_NAME} [{settings.ENVIRONMENT}]")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created/verified")

    # Auto-seed on first boot — runs only if no users exist yet
    try:
        from sqlalchemy.ext.asyncio import AsyncSession
        from sqlalchemy.orm import sessionmaker
        from sqlalchemy import select, func
        from app.models.user import User
        AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        async with AsyncSessionLocal() as db:
            result = await db.execute(select(func.count()).select_from(User))
            count = result.scalar()
        if count == 0:
            logger.info("Empty database — running seed...")
            import subprocess, sys, os
            # __file__ is backend/app/main.py — seed.py is one level up at backend/seed.py
            seed_path = os.path.join(os.path.dirname(__file__), "..", "seed.py")
            seed_path = os.path.abspath(seed_path)
            proc = subprocess.run(
                [sys.executable, seed_path],
                capture_output=True, text=True,
                cwd=os.path.dirname(seed_path),
            )
            if proc.returncode == 0:
                logger.info("Seed completed successfully")
            else:
                logger.warning(f"Seed exited with code {proc.returncode}: {proc.stderr[-500:]}")
        else:
            logger.info(f"Database already has {count} users — skipping seed")
    except Exception as e:
        logger.warning(f"Auto-seed check failed (non-fatal): {e}")

    yield
    logger.info("Shutting down...")
    await engine.dispose()


# Show docs always (needed for demo); disable for hardened prod later
_docs = "/docs"
_redoc = None

app = FastAPI(
    title="Deepthi Hospitals API",
    description="Production-grade Hospital Management System API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url=_docs,
    redoc_url=_redoc,
    redirect_slashes=False,
)

# GZip compression for all responses > 1KB
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS — read allowed origins from env
_origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Global error handler
app.add_exception_handler(Exception, global_exception_handler)

# Routers
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(patient_router.router)
app.include_router(doctor_router.router)
app.include_router(appointment_router.router)
app.include_router(prescription_router.router)
app.include_router(lab_router.router)
app.include_router(billing_router.router)
app.include_router(bed_router.router)
app.include_router(inventory_router.router)
app.include_router(admin_router.router)


@app.get("/", tags=["Health"], include_in_schema=False)
async def root():
    return {"message": f"{settings.APP_NAME} API is running", "docs": "/docs"}


@app.get("/health", tags=["Health"], include_in_schema=False)
async def health():
    return {"status": "ok", "app": settings.APP_NAME, "env": settings.ENVIRONMENT}


@app.post("/admin/seed", tags=["Admin"], include_in_schema=False)
async def run_seed(secret: str = ""):
    """Trigger seed script via HTTP — free-tier alternative to Render Shell."""
    if secret != settings.SECRET_KEY[:16]:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Forbidden")
    import subprocess, sys, os
    seed_path = os.path.join(os.path.dirname(__file__), "..", "seed.py")
    seed_path = os.path.abspath(seed_path)
    result = subprocess.run(
        [sys.executable, seed_path],
        capture_output=True, text=True,
        cwd=os.path.dirname(seed_path),
    )
    return {
        "returncode": result.returncode,
        "stdout": result.stdout[-3000:] if result.stdout else "",
        "stderr": result.stderr[-1000:] if result.stderr else "",
    }
