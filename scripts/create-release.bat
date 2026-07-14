@echo off
REM Hospital Management Platform - Windows Release Script
REM Copyright 2024 Bodapati Bharat Chandra
REM Licensed under Apache 2.0

if "%1"=="" (
    echo Usage: create-release.bat ^<version^>
    echo Example: create-release.bat v1.0.0
    exit /b 1
)

echo Creating release %1 for Hospital Management Platform
echo ============================================================

REM Run the Python release script
python scripts\create-release.py %1

if %errorlevel% neq 0 (
    echo Failed to create release
    exit /b 1
)

echo.
echo Release %1 created successfully!
echo View at: https://github.com/BharatChandra-sys/hospital-management-platform/releases