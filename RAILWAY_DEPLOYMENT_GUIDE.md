# Polish Association Newcastle - Railway Backend Deployment

## Step-by-Step Guide (No CLI Needed!)

### Step 1: Create GitHub Repository

1. Go to https://github.com and sign in (or create account)
2. Click the **"+"** icon (top right) → **"New repository"**
3. Name it: `pan-backend`
4. Set to **Private** (recommended)
5. Click **"Create repository"**

### Step 2: Upload Files to GitHub

1. On your new repo page, click **"uploading an existing file"**
2. Drag and drop ALL files from this folder (except this guide):
   - `Procfile`
   - `railway.toml`
   - `requirements.txt`
   - `server.py`
   - `routes.py`
   - `models.py`
   - `auth.py`
   - `auth_routes.py`
   - `upload_routes.py`
   - `email_service.py`
   - `uploads/` folder (with all images)
3. Click **"Commit changes"**

### Step 3: Create Railway Account

1. Go to https://railway.app
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway to access your GitHub

### Step 4: Deploy on Railway

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select your `pan-backend` repository
4. Railway will auto-detect Python and start deploying

### Step 5: Add Environment Variables

1. Click on your deployed service
2. Go to **"Variables"** tab
3. Click **"Raw Editor"** and paste this:

```
MONGO_URL=mongodb+srv://pan_admin:Capricorn1987!@pan-cluster.q8ekax8.mongodb.net/pan_database?retryWrites=true&w=majority&appName=PAN-cluster
DB_NAME=pan_database
JWT_SECRET_KEY=a7f3c91d8b4e2f6a0c5d7e9b1a3f5c8d2e4b6a8c0d2f4e6a8b0c2d4f6e8a0b2c
CORS_ORIGINS=https://polishassociationnewcastle.org.au,https://www.polishassociationnewcastle.org.au
SMTP_HOST=mail.polishassociationnewcastle.org.au
SMTP_PORT=25
SMTP_USERNAME=webadmin@polishassociationnewcastle.org.au
SMTP_PASSWORD=RPwv3@jvAS&t
SMTP_FROM_EMAIL=webadmin@polishassociationnewcastle.org.au
SMTP_FROM_NAME=Polish Association of Newcastle
NOTIFICATION_EMAIL=webadmin@polishassociationnewcastle.org.au
```

4. Click **"Update Variables"**
5. Railway will automatically redeploy

### Step 6: Get Your Backend URL

1. Go to **"Settings"** tab
2. Under **"Domains"**, click **"Generate Domain"**
3. You'll get a URL like: `pan-backend-production.up.railway.app`
4. **Copy this URL** - you'll need it for the frontend

### Step 7: Test Your Backend

Visit: `https://YOUR-RAILWAY-URL/api/health`

Should show:
```json
{"status": "healthy", "service": "Polish Association API"}
```

### Step 8: Update Frontend & Deploy to Vodien

**IMPORTANT:** Before uploading frontend to Vodien, tell me your Railway URL and I'll rebuild the frontend package with the correct backend URL.

---

## Updating the Website Later

When you make changes:
1. Upload new files to your GitHub repository
2. Railway automatically redeploys!

---

## Costs

Railway gives **$5 free credit/month**.
Your estimated usage: **~$3-4/month** → Stays within free tier! ✅

If you exceed $5, Railway will email you. You can add a payment method then.

---

## Troubleshooting

### "Build failed"
- Check that all files were uploaded to GitHub
- Make sure `requirements.txt` and `Procfile` are in the root folder

### "Application error"
- Check the "Deployments" tab for error logs
- Verify environment variables are set correctly

### Images not loading
- Upload the `uploads/` folder to GitHub
- Or re-upload images through admin panel after deployment
