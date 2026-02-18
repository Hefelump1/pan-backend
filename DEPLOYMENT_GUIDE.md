# Deployment Guide for External Hosting

## Why Your Site Shows Blank

When deploying a React Single-Page Application (SPA) to a different host, there are several common issues:

### Issue 1: Absolute vs Relative Paths
**Fixed:** Added `"homepage": "."` to package.json. This ensures all asset paths are relative, not absolute.

### Issue 2: Server Routing Configuration
React Router handles routing on the client-side. When you navigate to `/events` and refresh, the server looks for a file at `/events` which doesn't exist. The server must be configured to serve `index.html` for ALL routes.

### Issue 3: Environment Variables
`REACT_APP_BACKEND_URL` must be set BEFORE building. React embeds environment variables at build time, not runtime.

---

## Deployment Steps

### Step 1: Set Environment Variables
Before building, set your backend URL:
```bash
# In frontend/.env
REACT_APP_BACKEND_URL=https://your-backend-api.com
```

### Step 2: Build the Application
```bash
cd frontend
yarn build
```
This creates a `build/` folder with static files.

### Step 3: Deploy the `build/` Folder
Upload the contents of `frontend/build/` to your hosting provider.

---

## Server Configuration by Host Type

### Apache (.htaccess)
Create a `.htaccess` file in your build folder:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Nginx
Add to your nginx.conf:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Netlify (_redirects)
Create `public/_redirects`:
```
/*    /index.html   200
```

### Vercel (vercel.json)
Create `vercel.json` in frontend root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Firebase (firebase.json)
```json
{
  "hosting": {
    "public": "build",
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

### Shared Hosting (cPanel, etc.)
Upload build files to `public_html` and create `.htaccess` with Apache rules above.

---

## Common Hosting Providers

### Netlify
1. Connect your GitHub repo
2. Build command: `cd frontend && yarn build`
3. Publish directory: `frontend/build`
4. Add environment variable `REACT_APP_BACKEND_URL` in Netlify dashboard

### Vercel
1. Import project from GitHub
2. Framework preset: Create React App
3. Root directory: `frontend`
4. Add environment variable in Vercel dashboard

### Traditional Web Host
1. Run `yarn build` locally
2. Upload `frontend/build/*` to your web root via FTP
3. Add `.htaccess` for Apache servers

---

## Troubleshooting Blank Page

1. **Check browser console** (F12 → Console) for errors
2. **Check Network tab** for 404 errors on JS/CSS files
3. **Verify paths** - if seeing `/static/js/...` 404s, the homepage setting needs fixing
4. **Check CORS** - if API calls fail, your backend needs to allow your frontend domain

---

## Backend Deployment

The backend (FastAPI) needs to be deployed separately and accessible at the URL you set in `REACT_APP_BACKEND_URL`.

Options:
- Heroku
- Railway
- Render
- DigitalOcean App Platform
- AWS/GCP/Azure
- Any VPS with Python support

Remember to set these environment variables on your backend host:
- `MONGO_URL` - Your MongoDB connection string
- `DB_NAME` - Database name
- `JWT_SECRET_KEY` - Secure random string
- `CORS_ORIGINS` - Your frontend domain(s)
