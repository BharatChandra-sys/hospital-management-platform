# Deployment Guide

This guide provides step-by-step instructions for deploying the Hospital Management Platform to production using Vercel (frontend) and Render (backend + database).

## Prerequisites

- GitHub account
- Vercel account
- Render account

## Frontend Deployment (Vercel)

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hospital-management-platform&project-name=hospital-management-platform&framework=vite&root-directory=frontend)

### Option 2: Manual Deployment

1. **Fork/Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/hospital-management-platform.git
   cd hospital-management-platform
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Framework preset: Vite

3. **Environment Variables**
   Add these environment variables in Vercel:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com
   ```

4. **Build Settings**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

## Backend Deployment (Render)

### Option 1: One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yourusername/hospital-management-platform)

### Option 2: Manual Deployment

1. **Create PostgreSQL Database**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "PostgreSQL"
   - Name: `hospital-management-db`
   - Plan: Free (or paid for production)
   - Copy the "Internal Database URL" for later

2. **Deploy Backend Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     ```
     Name: hospital-management-backend
     Root Directory: backend
     Environment: Python 3
     Build Command: pip install -r requirements.txt
     Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```

3. **Environment Variables**
   Add these in Render service settings:
   ```
   DATABASE_URL=<your-postgres-internal-url>
   SECRET_KEY=<generate-a-secure-32-character-key>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   APP_NAME=Hospital Management Platform
   DEBUG=false
   CORS_ORIGINS=https://your-frontend-vercel-app.vercel.app
   ```

4. **Database Migration**
   After deployment, run migrations in Render Shell:
   ```bash
   alembic upgrade head
   python seed.py
   ```

## Environment Configuration

### Frontend (.env)
```bash
VITE_API_URL=https://your-backend.onrender.com
```

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@host:port/db
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
APP_NAME=Hospital Management Platform
DEBUG=false
CORS_ORIGINS=https://your-frontend.vercel.app
```

## Domain Configuration

### Custom Domain (Optional)

1. **Frontend (Vercel)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **Backend (Render)**
   - Go to Service Settings → Custom Domains
   - Add your API subdomain (e.g., api.yourdomain.com)

## SSL/HTTPS

Both Vercel and Render provide automatic SSL certificates. Your applications will be served over HTTPS by default.

## Monitoring & Logs

### Vercel
- Functions tab for serverless function logs
- Analytics tab for usage statistics

### Render
- Logs tab for application logs
- Metrics tab for performance monitoring

## Backup Strategy

### Database Backups
Render provides automatic daily backups for PostgreSQL databases on paid plans.

For additional backup security:
```bash
# Create manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS_ORIGINS in backend includes your frontend domain
   - Check protocol (http vs https)

2. **Database Connection**
   - Verify DATABASE_URL format
   - Check if database is accessible from backend service

3. **Build Failures**
   - Check build logs in respective platforms
   - Verify all dependencies are in requirements.txt/package.json

4. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names

### Support

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Project Issues](https://github.com/yourusername/hospital-management-platform/issues)

## Security Checklist

- [ ] Use strong SECRET_KEY (32+ characters)
- [ ] Set DEBUG=false in production
- [ ] Configure proper CORS origins
- [ ] Use HTTPS for all communications
- [ ] Regularly update dependencies
- [ ] Monitor logs for suspicious activity
- [ ] Implement rate limiting (future enhancement)
- [ ] Regular database backups

## Performance Optimization

- [ ] Enable caching in Vercel
- [ ] Optimize database queries
- [ ] Implement database connection pooling
- [ ] Monitor and optimize bundle size
- [ ] Set up CDN for static assets

## Maintenance

- **Regular Updates**: Keep dependencies updated
- **Monitoring**: Set up alerts for downtime
- **Backups**: Verify backup restoration process
- **Security**: Regular security audits
- **Performance**: Monitor response times and optimize