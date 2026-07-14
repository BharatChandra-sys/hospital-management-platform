# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] - 2026-07-14

### Added
- New features and improvements

### Fixed
- Bug fixes and performance improvements

### Changed
- Updates and modifications

## [1.0.0] - 2026-07-14

### Added
- New features and improvements

### Fixed
- Bug fixes and performance improvements

### Changed
- Updates and modifications

## [1.0.0] - 2024-07-14

### Added

- Public hospital website with homepage, doctor directory, departments, services, about, contact, FAQ, and emergency pages
- Online appointment booking with doctor, date, and time slot selection
- Razorpay payment integration for appointment fees with HMAC-SHA256 signature verification
- Razorpay webhook support for automatic bill confirmation on payment capture
- Patient registration, login, and JWT-based authentication with silent refresh
- Patient self-service dashboard — appointments, prescriptions, lab reports, billing, and profile
- Client-side invoice generation and download
- HMS Admin portal — dashboard statistics, patient management, doctor management, appointment management
- HMS Admin — bed management with ward-wise occupancy view
- HMS Admin — inventory management with low-stock alerts and category filtering
- HMS Admin — billing management with Razorpay payment initiation
- HMS Admin — lab queue management, pharmacy management
- HMS Admin — analytics reports with date range selection and CSV export
- HMS Admin — staff management
- HMS Doctor portal — clinical dashboard with today's queue and next consultation
- HMS Doctor — prescription pad with multi-medication rows, dosage, frequency, route, and follow-up
- HMS Doctor — lab order form with categorised test selection and multi-test ordering
- HMS Doctor — appointment management with status updates and clinical notes
- HMS Doctor — schedule management
- HMS Reception portal — walk-in registration, appointment management, queue view, billing, discharge
- Role-based access control — ADMIN, DOCTOR, RECEPTION, STAFF, PATIENT roles
- JWT access tokens with refresh token rotation
- Async FastAPI backend with SQLAlchemy 2 and asyncpg
- Alembic database migrations
- Structured logging with Loguru
- Docker Compose configuration for local development
- Vercel deployment configuration for frontend
- Render deployment configuration for backend and database
- Seed script with full demo data — users, doctors, patients, appointments, bills, prescriptions, lab reports, inventory, and beds
- Apache License 2.0
- NOTICE, CONTRIBUTING, SECURITY, and CHANGELOG files

---

## Copyright

Copyright 2024 Bodapati Bharat Chandra
