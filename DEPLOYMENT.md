# Deployment Instructions for Vercel

## Quick Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Vercel configuration"
git push
```

### 2. Deploy on Vercel

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Angular
5. **Build Settings** (should be auto-filled):
   - **Framework Preset:** Angular
   - **Build Command:** `npm run build -- --configuration production`
   - **Output Directory:** `dist/complaints-project/browser`
   - **Install Command:** `npm install`
6. **Environment Variables** (Add these):
   - No environment variables needed (API URL is handled via proxy)
7. Click **Deploy**

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### 3. Configure Environment

After deployment, you'll get a URL like: `https://your-app.vercel.app`

## Important Notes

### ✅ What's Configured
- ✅ All routes redirect to `index.html` (SPA routing)
- ✅ Build optimized for production
- ✅ Output directory set correctly
- ✅ Framework detection enabled

### 🔧 Troubleshooting

#### Issue: 404 on Routes
**Cause:** Routes not redirecting to index.html  
**Solution:** Already fixed with `vercel.json` rewrites

#### Issue: API Calls Failing
**Cause:** CORS or API URL mismatch  
**Solution:** 
1. Update `environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-api.com/api'  // Update this!
};
```

2. Ensure your backend allows CORS from Vercel domain

#### Issue: Build Fails
**Cause:** Missing dependencies or build errors  
**Solution:**
```bash
# Test build locally first
npm run build -- --configuration production

# Check for errors
# Fix any TypeScript/linting errors
```

### 📝 Environment Configuration

Update your environment files:

**`src/environments/environment.prod.ts`:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://complaint-system-1-cm7y.onrender.com/api'  // Your actual backend
};
```

**`src/environments/environment.ts`:**
```typescript
export const environment = {
  production: false,
  apiUrl: '/api'  // Uses proxy in development
};
```

### 🚀 Deployment Checklist

Before deploying:
- [ ] All code is committed and pushed to GitHub
- [ ] Backend API is deployed and accessible
- [ ] `environment.prod.ts` has correct API URL
- [ ] Build works locally: `npm run build -- --configuration production`
- [ ] No linting errors: Check your IDE
- [ ] `vercel.json` is in project root

### 🔄 Automatic Deployments

Once connected to Vercel:
- ✅ Every push to `main` branch → Production deployment
- ✅ Every push to other branches → Preview deployment
- ✅ Pull requests → Automatic preview deployments

### 📊 After Deployment

1. Visit your Vercel URL
2. Test all routes: `/analytics`, `/complaints`, `/agencies`, `/users`
3. Test login functionality
4. Test API calls
5. Check browser console for errors

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify API URL in environment files
4. Ensure backend CORS allows Vercel domain

