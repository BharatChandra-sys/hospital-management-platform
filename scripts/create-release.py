#!/usr/bin/env python3
"""
Hospital Management Platform - Release Creation Script
Copyright 2024 Bodapati Bharat Chandra
Licensed under Apache 2.0

This script helps create releases for the Hospital Management Platform.
"""

import os
import sys
import json
import subprocess
import datetime
from pathlib import Path

def run_command(cmd, cwd=None):
    """Run a command and return the output."""
    try:
        result = subprocess.run(
            cmd, shell=True, cwd=cwd, 
            capture_output=True, text=True, check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {cmd}")
        print(f"Error: {e.stderr}")
        sys.exit(1)

def get_project_root():
    """Get the project root directory."""
    return Path(__file__).parent.parent

def update_package_version(version):
    """Update version in package.json."""
    package_json_path = get_project_root() / "frontend" / "package.json"
    
    with open(package_json_path, 'r') as f:
        package_data = json.load(f)
    
    package_data['version'] = version.lstrip('v')
    
    with open(package_json_path, 'w') as f:
        json.dump(package_data, f, indent=2)
    
    print(f"✅ Updated frontend/package.json to version {version}")

def update_changelog(version):
    """Add new version to CHANGELOG.md."""
    changelog_path = get_project_root() / "CHANGELOG.md"
    today = datetime.date.today().strftime("%Y-%m-%d")
    
    # Read current changelog
    with open(changelog_path, 'r') as f:
        content = f.read()
    
    # Find insertion point (after first ## line)
    lines = content.split('\n')
    insert_index = 0
    for i, line in enumerate(lines):
        if line.startswith('## ['):
            insert_index = i
            break
    
    # Create new version entry
    new_entry = [
        f"## [{version.lstrip('v')}] - {today}",
        "",
        "### Added",
        "- New features and improvements",
        "",
        "### Fixed", 
        "- Bug fixes and performance improvements",
        "",
        "### Changed",
        "- Updates and modifications",
        "",
    ]
    
    # Insert new entry
    lines = lines[:insert_index] + new_entry + lines[insert_index:]
    
    # Write back
    with open(changelog_path, 'w') as f:
        f.write('\n'.join(lines))
    
    print(f"✅ Added {version} entry to CHANGELOG.md")

def run_tests():
    """Run frontend tests only locally. Backend async tests run on CI (GitHub Actions)."""
    project_root = get_project_root()

    print("🧪 Running frontend tests...")
    try:
        run_command("npm test", cwd=project_root / "frontend")
        print("✅ Frontend tests passed")
    except Exception:
        print("❌ Frontend tests failed")
        return False

    print("⚠️  Backend tests skipped locally (async session fixtures require a live DB).")
    print("    Full backend test suite runs automatically on GitHub Actions CI on push.")

    return True

def create_git_tag(version):
    """Create and push git tag."""
    project_root = get_project_root()
    
    # Create tag
    run_command(f"git tag -a {version} -m 'Release {version}'", cwd=project_root)
    print(f"✅ Created git tag {version}")
    
    # Push tag
    run_command(f"git push origin {version}", cwd=project_root)
    print(f"✅ Pushed tag {version} to remote")

def create_github_release(version):
    """Create GitHub release using gh CLI."""
    project_root = get_project_root()
    release_template = project_root / ".github" / "RELEASE_TEMPLATE.md"
    
    if release_template.exists():
        cmd = f'gh release create {version} --title "Hospital Management Platform {version}" --notes-file {release_template} --latest'
    else:
        notes = f"""# Hospital Management Platform {version}

## Features

### Complete Hospital Management System
- Patient management with comprehensive medical records
- Doctor portal with appointment scheduling and prescriptions  
- Admin dashboard with analytics and reporting
- Reception portal for registration and billing
- Real-time payment integration with Razorpay

### Technical Highlights
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **Authentication**: JWT-based with role-based access control
- **Deployment**: Production-ready for Vercel + Render

### Security & Quality
- Enterprise-level security implementation
- Comprehensive test coverage
- Production-ready configuration
- Professional documentation

## Quick Deploy

### Frontend (Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/BharatChandra-sys/hospital-management-platform&project-name=hospital-management-frontend&framework=vite&root-directory=frontend)

### Backend (Render)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/BharatChandra-sys/hospital-management-platform)

## Documentation

- [Setup Guide](./STARTUP.md)
- [Deployment Guide](./DEPLOYMENT.md)  
- [Architecture Overview](./ARCHITECTURE.md)
- [Release Guide](./RELEASE_GUIDE.md)

---

**Copyright 2024 Bodapati Bharat Chandra**  
**Licensed under Apache 2.0**"""
        
        cmd = f'gh release create {version} --title "Hospital Management Platform {version}" --notes "{notes}" --latest'
    
    try:
        run_command(cmd, cwd=project_root)
        print(f"✅ Created GitHub release {version}")
        return True
    except:
        print(f"❌ Failed to create GitHub release. You can create it manually at:")
        print(f"   https://github.com/BharatChandra-sys/hospital-management-platform/releases/new?tag={version}")
        return False

def main():
    """Main release creation process."""
    if len(sys.argv) != 2:
        print("Usage: python create-release.py <version>")
        print("Example: python create-release.py v1.0.0")
        sys.exit(1)
    
    version = sys.argv[1]
    if not version.startswith('v'):
        version = f"v{version}"
    
    print(f"🚀 Creating release {version} for Hospital Management Platform")
    print("=" * 60)
    
    # Step 1: Update version files
    print("📝 Updating version files...")
    update_package_version(version)
    update_changelog(version)
    
    # Step 2: Run tests
    print("\n🧪 Running tests...")
    if not run_tests():
        print("❌ Tests failed. Please fix issues before releasing.")
        sys.exit(1)
    
    # Step 3: Commit changes
    print("\n📦 Committing changes...")
    project_root = get_project_root()
    run_command("git add .", cwd=project_root)
    run_command(f"git commit -m 'Prepare release {version}'", cwd=project_root)
    run_command("git push", cwd=project_root)
    print("✅ Committed and pushed changes")
    
    # Step 4: Create and push tag
    print(f"\n🏷️  Creating git tag...")
    create_git_tag(version)
    
    # Step 5: Create GitHub release
    print(f"\n🎉 Creating GitHub release...")
    create_github_release(version)
    
    print("\n" + "=" * 60)
    print(f"🎊 Release {version} created successfully!")
    print(f"📦 View release: https://github.com/BharatChandra-sys/hospital-management-platform/releases/tag/{version}")
    print(f"🚀 Deploy frontend: https://vercel.com/new/clone?repository-url=https://github.com/BharatChandra-sys/hospital-management-platform")
    print(f"🏥 Deploy backend: https://render.com/deploy?repo=https://github.com/BharatChandra-sys/hospital-management-platform")

if __name__ == "__main__":
    main()