# Polish Association Newcastle - Single Domain Deployment Guide

## Overview
This deploys both frontend and backend on a single domain:
- `polishassociationnewcastle.org.au` (frontend)
- `polishassociationnewcastle.org.au/api/` (backend API)

---

## Folder Structure on Vodien

```
public_html/
├── .htaccess              (routes /api to backend)
├── index.html             (React frontend)
├── static/                (frontend assets)
│   ├── css/
│   └── js/
└── api/                   (Python backend)
    ├── .htaccess
    ├── passenger_wsgi.py
    ├── .env
    ├── server.py
    ├── routes.py
    ├── models.py
    ├── ... (other .py files)
    └── uploads/           (uploaded images/documents)
```

---

## Step-by-Step Deployment

### Step 1: Upload Frontend Files
1. Open cPanel → File Manager
2. Go to `public_html`
3. Upload these files from `frontend_files/` folder:
   - `index.html`
   - `.htaccess`
   - `static/` folder (with css and js)

### Step 2: Create Backend Folder
1. In `public_html`, create a new folder called `api`
2. Upload ALL contents of `backend_files/` into `public_html/api/`

### Step 3: Set Up Python App in cPanel
1. Go to cPanel → "Setup Python App"
2. Click "Create Application"
3. Configure:
   - **Python version:** 3.9 or higher
   - **Application root:** `public_html/api`
   - **Application URL:** `/api`
   - **Application startup file:** `passenger_wsgi.py`
   - **Application Entry point:** `application`
4. Click "Create"

### Step 4: Install Python Dependencies
1. In the Python App settings, click "Run pip install" or use Terminal
2. Run:
   ```bash
   source /home/YOUR_USERNAME/virtualenv/public_html/api/3.x/bin/activate
   cd ~/public_html/api
   pip install -r requirements.txt
   ```

### Step 5: Update Image URLs in Database
1. SSH into your server or use cPanel Terminal
2. Run:
   ```bash
   source /home/YOUR_USERNAME/virtualenv/public_html/api/3.x/bin/activate
   cd ~/public_html/api
   python migrate_urls.py
   ```

### Step 6: Set Permissions
```bash
chmod 755 ~/public_html/api
chmod 755 ~/public_html/api/uploads
chmod 644 ~/public_html/api/*.py
chmod 644 ~/public_html/api/.env
```

### Step 7: Restart Python App
In cPanel → Python App, click "Restart" on your application.

---

## Testing

1. **Frontend:** Visit `https://polishassociationnewcastle.org.au`
2. **API Health:** Visit `https://polishassociationnewcastle.org.au/api/health`
   - Should return: `{"status": "healthy", "service": "Polish Association API"}`

---

## Troubleshooting

### Images Not Loading
- Ensure `uploads/` folder exists in `public_html/api/`
- Run `migrate_urls.py` to update URLs in database
- Check file permissions: `chmod 755 uploads`

### API Returns 500 Error
- Check Python app logs in cPanel
- Verify `.env` file exists with correct MongoDB connection
- Ensure all dependencies are installed

### Page Refresh Shows 404
- Verify `.htaccess` is in `public_html` root
- Check if `mod_rewrite` is enabled

---

## File Checklist

### Frontend (public_html/)
- [ ] `.htaccess`
- [ ] `index.html`
- [ ] `static/css/main.*.css`
- [ ] `static/js/main.*.js`

### Backend (public_html/api/)
- [ ] `.htaccess`
- [ ] `.env`
- [ ] `passenger_wsgi.py`
- [ ] `requirements.txt`
- [ ] `server.py`
- [ ] `routes.py`
- [ ] `models.py`
- [ ] `auth.py`
- [ ] `auth_routes.py`
- [ ] `upload_routes.py`
- [ ] `email_service.py`
- [ ] `migrate_urls.py`
- [ ] `uploads/` folder with all images
