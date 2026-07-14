# Release Scripts

This directory contains scripts to help with creating releases for the Hospital Management Platform.

## Scripts

### `create-release.py`
Python script that automates the entire release process:
- Updates version in package.json
- Updates CHANGELOG.md
- Runs tests
- Creates git tag
- Creates GitHub release

### `create-release.bat` 
Windows batch script that calls the Python release script.

## Usage

### Windows
```cmd
scripts\create-release.bat v1.0.0
```

### Python (Cross-platform)
```bash
python scripts/create-release.py v1.0.0
```

## Prerequisites

- Python 3.7+
- GitHub CLI (`gh`) installed and authenticated
- Git configured with push access to repository
- All tests passing

## What the Script Does

1. **Version Update**: Updates `frontend/package.json` version
2. **Changelog**: Adds new version entry to `CHANGELOG.md`
3. **Testing**: Runs frontend and backend test suites
4. **Git Operations**: Commits changes, creates and pushes tag
5. **GitHub Release**: Creates release with professional notes

## Manual Process

If you prefer manual releases, follow the [Release Guide](../RELEASE_GUIDE.md).

---

**Copyright 2024 Bodapati Bharat Chandra**  
**Licensed under Apache 2.0**