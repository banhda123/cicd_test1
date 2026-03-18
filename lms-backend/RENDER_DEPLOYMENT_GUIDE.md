# Render Deployment Guide

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push code to GitHub
3. **Environment Variables**: Prepare all required secrets

## 🚀 Deployment Steps

### 1. Database Setup

1. Go to Render Dashboard → Create New → PostgreSQL
2. **Database Name**: `lms-db`
3. **Database User**: `lms_user`
4. **Region**: Choose nearest to your users
5. **Plan**: Free tier is fine for testing

### 2. Web Service Setup

1. Go to Render Dashboard → Create New → Web Service
2. **Connect Repository**: Select your GitHub repo
3. **Name**: `lms-backend`
4. **Environment**: `Node`
5. **Build Command**: `chmod +x render-build.sh && ./render-build.sh`
6. **Start Command**: `npm start`
7. **Instance Type**: Free tier

### 3. Environment Variables

Add these environment variables in Render Dashboard:

#### Required Variables
```
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
SESSION_SECRET=your_session_secret_key
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

#### Database Variables (Auto-filled by Render)
```
DATABASE_URL=postgresql://lms_user:password@host:5432/lms_db
```

#### Optional Variables
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=your_folder_name

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-app-name.onrender.com/auth/google/callback
```

#### Email Variables (DISABLED)
```
# Email is disabled for Render deployment
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASSWORD=your_app_password
```

### 4. Health Check

Render automatically uses your health check endpoint:
- **URL**: `/health` or `/api/health`
- **Interval**: Every 30 seconds
- **Timeout**: 10 seconds

## 🔧 Configuration Files

### `render.yaml`
- Defines web service and database
- Auto-generates some environment variables
- Sets up resource limits

### `render-build.sh`
- Build script for Render
- Installs dependencies
- Runs migrations
- Runs tests

### `.env.render`
- Template for environment variables
- Shows all required variables
- Comments out disabled features

## 📊 Deployment Status

### ✅ Working Features
- User registration (with verification codes in response)
- User login
- Password reset (with tokens in response)
- Email verification (with codes in response)
- All API endpoints
- Database operations
- File uploads (Cloudinary)

### ⚠️ Disabled Features
- Email sending (nodemailer)
- Email notifications
- Password reset via email (tokens shown in API response instead)

## 🧪 Testing After Deployment

1. **Health Check**: `GET https://your-app-name.onrender.com/api/health`
2. **Registration**: `POST https://your-app-name.onrender.com/api/auth/register`
3. **Login**: `POST https://your-app-name.onrender.com/api/auth/login`
4. **API Documentation**: Check `/api/docs` if available

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check logs in Render Dashboard
   - Ensure all dependencies are in package.json
   - Verify build script permissions

2. **Database Connection**:
   - Verify DATABASE_URL is correct
   - Check database is running
   - Ensure user permissions

3. **Environment Variables**:
   - Double-check all required variables are set
   - Verify no typos in variable names
   - Check sensitive data is properly escaped

4. **Health Check Failures**:
   - Ensure health endpoint exists and returns 200
   - Check for startup errors in logs
   - Verify port is correct (Render uses PORT env var)

### Debug Commands

```bash
# Check logs in Render Dashboard
# View build logs
# View service logs

# Test locally with same environment
cp .env.render .env
# Fill in your values
npm start
```

## 📈 Scaling Up

When ready to move beyond free tier:

1. **Database**: Upgrade to paid PostgreSQL
2. **Web Service**: Upgrade to Standard instance
3. **Add Redis**: For session storage and caching
4. **Add CDN**: For static assets
5. **Monitor**: Add logging and monitoring

## 🔄 CI/CD Integration

Your existing GitHub Actions workflow will work with Render:

1. **Push to GitHub** → Triggers Render build
2. **Tests run** → Build continues if passed
3. **Deploy** → New version goes live
4. **Health check** → Ensures deployment success

## 📞 Support

- **Render Docs**: [docs.render.com](https://docs.render.com)
- **Status Page**: [status.render.com](https://status.render.com)
- **Community**: [community.render.com](https://community.render.com)
