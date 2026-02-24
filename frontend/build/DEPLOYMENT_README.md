# Polish Association Newcastle - Frontend Deployment Guide for Vodien

## Overview
This is a production build of the React frontend, ready to upload to Vodien cPanel.

## Deployment Steps

### Step 1: Upload Files
1. Log in to cPanel
2. Open **File Manager**
3. Navigate to `public_html` (or your domain's document root)
4. Upload ALL contents of this folder (not the folder itself)

### Step 2: Verify Structure
After upload, your `public_html` should look like:
```
public_html/
├── .htaccess
├── index.html
├── favicon.ico
├── manifest.json
├── robots.txt
└── static/
    ├── css/
    └── js/
```

### Step 3: Test
Visit your website: https://polishassociationnewcastle.org.au

## Important Notes

- The `.htaccess` file is crucial for React Router to work
- Make sure hidden files (starting with `.`) are uploaded
- The API URL is configured to: https://api.polishassociationnewcastle.org.au

## Troubleshooting

### Blank Page
- Check browser console for errors
- Verify `.htaccess` was uploaded
- Clear browser cache

### 404 on Page Refresh
- Ensure `.htaccess` is in the root folder
- Check if `mod_rewrite` is enabled (contact Vodien support)

### API Connection Issues
- Verify backend is running at api.polishassociationnewcastle.org.au
- Check CORS settings in backend `.env`
