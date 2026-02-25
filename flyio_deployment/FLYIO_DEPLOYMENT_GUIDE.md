# Polish Association Newcastle - Fly.io Backend Deployment Guide

## Overview
This guide deploys your backend API to Fly.io (free forever).

**Result:** `https://pan-api.fly.dev` or your custom domain `https://api.polishassociationnewcastle.org.au`

---

## Step 1: Create Fly.io Account

1. Go to https://fly.io
2. Click "Sign Up" (use GitHub or email)
3. **No credit card required** for free tier

---

## Step 2: Install Fly CLI

**On Mac:**
```bash
brew install flyctl
```

**On Windows (PowerShell):**
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

**On Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

---

## Step 3: Login to Fly

```bash
fly auth login
```
This opens a browser to authenticate.

---

## Step 4: Deploy the Backend

1. **Extract the zip file** to a folder on your computer
2. **Open terminal/command prompt** in that folder
3. **Run these commands:**

```bash
# Create the app (first time only)
fly apps create pan-api

# Create a volume for uploaded files (first time only)
fly volumes create pan_uploads --region syd --size 1

# Set environment variables (secrets)
fly secrets set MONGO_URL="mongodb+srv://pan_admin:Capricorn1987!@pan-cluster.q8ekax8.mongodb.net/pan_database?retryWrites=true&w=majority&appName=PAN-cluster"
fly secrets set DB_NAME="pan_database"
fly secrets set JWT_SECRET_KEY="a7f3c91d8b4e2f6a0c5d7e9b1a3f5c8d2e4b6a8c0d2f4e6a8b0c2d4f6e8a0b2c"
fly secrets set CORS_ORIGINS="https://polishassociationnewcastle.org.au,https://www.polishassociationnewcastle.org.au"
fly secrets set SMTP_HOST="mail.polishassociationnewcastle.org.au"
fly secrets set SMTP_PORT="25"
fly secrets set SMTP_USERNAME="webadmin@polishassociationnewcastle.org.au"
fly secrets set SMTP_PASSWORD="RPwv3@jvAS&t"
fly secrets set SMTP_FROM_EMAIL="webadmin@polishassociationnewcastle.org.au"
fly secrets set SMTP_FROM_NAME="Polish Association of Newcastle"
fly secrets set NOTIFICATION_EMAIL="webadmin@polishassociationnewcastle.org.au"

# Deploy!
fly deploy
```

---

## Step 5: Upload Existing Images

After first deployment, upload your existing images:

```bash
# Copy uploads folder to the Fly volume
fly ssh console -C "mkdir -p /app/uploads"

# For each image, you'll need to upload via the admin panel
# Or use: fly sftp shell
```

**Easier option:** Just re-upload images through the admin panel after deployment.

---

## Step 6: Test the Deployment

Visit: `https://pan-api.fly.dev/api/health`

Should return:
```json
{"status": "healthy", "service": "Polish Association API"}
```

---

## Step 7: Update Image URLs in Database

Run the migration script locally (one time):

```bash
python migrate_urls.py
```

Or manually update via MongoDB Atlas.

---

## Step 8: Set Up Custom Domain (Optional)

To use `api.polishassociationnewcastle.org.au`:

```bash
fly certs create api.polishassociationnewcastle.org.au
```

Then add DNS records as instructed by Fly.

---

## Step 9: Update Frontend

Update your Vodien frontend to point to the Fly.io backend.

In `public_html/.htaccess` or rebuild with:
```
REACT_APP_BACKEND_URL=https://pan-api.fly.dev
```

---

## Useful Commands

```bash
# View logs
fly logs

# Open app in browser
fly open

# Check app status
fly status

# SSH into container
fly ssh console

# Restart app
fly apps restart pan-api
```

---

## Costs

**Free tier includes:**
- 3 shared VMs (you're using 1)
- 160GB outbound bandwidth/month
- 3GB persistent storage

**Your usage:** Well within free tier ✅

---

## Troubleshooting

### "App not found"
Run `fly apps create pan-api` first

### MongoDB connection failed
Check the MONGO_URL secret is set correctly:
```bash
fly secrets list
```

### Images not loading
Images need to be re-uploaded via admin panel, or transferred via SFTP.

---

## File Structure in This Package

```
flyio_deployment/
├── Dockerfile          (container config)
├── fly.toml           (Fly.io config)
├── requirements.txt   (Python dependencies)
├── server.py          (main app)
├── routes.py          (API routes)
├── models.py          (database models)
├── auth.py            (authentication)
├── auth_routes.py     (auth endpoints)
├── upload_routes.py   (file uploads)
├── email_service.py   (email sending)
├── migrate_urls.py    (URL migration script)
└── uploads/           (uploaded files)
```
