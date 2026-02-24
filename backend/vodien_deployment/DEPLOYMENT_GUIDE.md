# Polish Association Newcastle - Backend Deployment Guide for Vodien cPanel

## Overview
This guide explains how to deploy the FastAPI backend to Vodien cPanel hosting.

## Prerequisites
- Vodien cPanel hosting with Python support
- Access to cPanel dashboard
- MongoDB database (MongoDB Atlas recommended - see below)
- Domain configured: api.polishassociationnewcastle.org.au

---

## Step 1: Set Up MongoDB Atlas (Recommended)

Since cPanel shared hosting doesn't support MongoDB installation, use MongoDB Atlas (free tier available):

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free M0 tier is sufficient)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pan_database?retryWrites=true&w=majority
   ```
6. In Atlas, go to "Network Access" → Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0)

---

## Step 2: Prepare Files for Upload

### Files to Upload:
```
/home/yourusername/api.polishassociationnewcastle.org.au/
├── .htaccess                 (from vodien_deployment/)
├── passenger_wsgi.py         (from vodien_deployment/)
├── requirements.txt          (from vodien_deployment/)
├── .env                      (create new - see below)
├── server.py
├── routes.py
├── models.py
├── auth.py
├── auth_routes.py
├── upload_routes.py
├── email_service.py
└── uploads/                  (create empty folder, or copy existing uploads)
```

### Create the .env file for production:
```env
MONGO_URL="mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/pan_database?retryWrites=true&w=majority"
DB_NAME="pan_database"
CORS_ORIGINS="https://polishassociationnewcastle.org.au,https://www.polishassociationnewcastle.org.au"
JWT_SECRET_KEY="GENERATE_A_NEW_SECURE_KEY_HERE"
SMTP_HOST="mail.polishassociationnewcastle.org.au"
SMTP_PORT=25
SMTP_USERNAME="webadmin@polishassociationnewcastle.org.au"
SMTP_PASSWORD="your_smtp_password"
SMTP_FROM_EMAIL="webadmin@polishassociationnewcastle.org.au"
SMTP_FROM_NAME="Polish Association of Newcastle"
NOTIFICATION_EMAIL="webadmin@polishassociationnewcastle.org.au"
```

**Important:** Generate a new JWT secret key:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## Step 3: Set Up Python App in cPanel

1. Log in to cPanel
2. Go to "Setup Python App" (under Software section)
3. Click "Create Application"
4. Configure:
   - **Python version**: 3.9 or higher (3.10+ recommended)
   - **Application root**: `api.polishassociationnewcastle.org.au`
   - **Application URL**: Leave empty or set to `/`
   - **Application startup file**: `passenger_wsgi.py`
   - **Application Entry point**: `application`
   - **Passenger log file**: `passenger.log` (optional but recommended)

5. Click "Create"

---

## Step 4: Install Dependencies

1. In cPanel Python App, click on your application
2. Find "Enter to the virtual environment" - copy the command
3. Open cPanel Terminal or SSH into your server
4. Run the virtual environment command (something like):
   ```bash
   source /home/yourusername/virtualenv/api.polishassociationnewcastle.org.au/3.10/bin/activate
   ```
5. Navigate to your app directory:
   ```bash
   cd ~/api.polishassociationnewcastle.org.au
   ```
6. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

---

## Step 5: Configure Subdomain

1. In cPanel, go to "Subdomains"
2. Create subdomain `api` pointing to `polishassociationnewcastle.org.au`
3. Set document root to: `/home/yourusername/api.polishassociationnewcastle.org.au`

---

## Step 6: SSL Certificate

1. In cPanel, go to "SSL/TLS Status"
2. Ensure SSL is enabled for `api.polishassociationnewcastle.org.au`
3. If not, use "AutoSSL" to generate a free certificate

---

## Step 7: Test the Deployment

1. Restart the Python app in cPanel (click "Restart" button)
2. Visit: https://api.polishassociationnewcastle.org.au/api/health
3. Expected response:
   ```json
   {"status": "healthy", "service": "Polish Association API"}
   ```

---

## Step 8: Update Frontend Configuration

Update your frontend `.env` file to point to the new API:
```env
REACT_APP_BACKEND_URL=https://api.polishassociationnewcastle.org.au
```

---

## Step 9: Migrate Data

### Option A: Fresh Start
Run the seed script to populate initial data:
```bash
source /home/yourusername/virtualenv/api.polishassociationnewcastle.org.au/3.10/bin/activate
cd ~/api.polishassociationnewcastle.org.au
python seed.py
python create_admin.py
```

### Option B: Export from Current Database
Use MongoDB Compass or mongodump to export your current data and import to Atlas.

---

## Troubleshooting

### Check Logs
```bash
cat ~/api.polishassociationnewcastle.org.au/passenger.log
cat ~/logs/api.polishassociationnewcastle.org.au.error.log
```

### Common Issues

1. **500 Internal Server Error**
   - Check passenger.log for Python errors
   - Verify .env file exists and has correct values
   - Ensure all dependencies are installed

2. **MongoDB Connection Failed**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in Atlas (add 0.0.0.0/0)
   - Ensure dnspython is installed for SRV records

3. **CORS Errors**
   - Update CORS_ORIGINS in .env to include your frontend domain

4. **File Upload Issues**
   - Ensure `uploads/` folder exists and is writable
   - Check folder permissions: `chmod 755 uploads`

---

## File Permissions

Set correct permissions:
```bash
chmod 644 *.py
chmod 644 .env
chmod 644 .htaccess
chmod 755 uploads
```

---

## Security Checklist

- [ ] Generate new JWT_SECRET_KEY for production
- [ ] Update CORS_ORIGINS to only allow your frontend domain
- [ ] Set secure admin password after deployment
- [ ] Ensure .env file is not publicly accessible
- [ ] Enable HTTPS via cPanel SSL

---

## Support

If you encounter issues specific to Vodien hosting, contact:
- Vodien Support: https://www.vodien.com.au/support
- MongoDB Atlas Support: https://www.mongodb.com/support

---

## Quick Reference

| Item | Value |
|------|-------|
| API URL | https://api.polishassociationnewcastle.org.au |
| Health Check | https://api.polishassociationnewcastle.org.au/api/health |
| Python Version | 3.9+ |
| Database | MongoDB Atlas |
| WSGI Server | Phusion Passenger |
