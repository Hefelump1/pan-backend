# Polish Association of Newcastle - Website PRD

## Original Problem Statement
Build a modern, elegant, and traditional website for the Polish Association of Newcastle. Full-stack with React frontend, FastAPI backend, MongoDB database. Bilingual (English/Polish) with admin panel.

## Architecture
- **Frontend**: React (CRA) + Tailwind CSS + Shadcn UI, deployed on Vodien (cPanel)
- **Backend**: FastAPI, deployed on Railway (via GitHub)
- **Database**: MongoDB Atlas
- **Deployment**: Decoupled - static frontend on Vodien, API on Railway

## What's Been Implemented
- All public pages: Home, Events, News, Weekly Activities, Hall Hire, Committee, Associated Groups, Governance
- Full admin panel: Dashboard, content management for all sections
- Bilingual (EN/PL) with language toggle
- Hall hire booking with email notifications
- Image upload system
- Governance document management (CRUD with reordering)
- AGM notice management
- Membership form download
- ScrollToTop component for navigation
- Events with website/ticket link field
- Complete Polish translations for all pages

## Completed (March 2026)
- [x] P0 Fix batch: ScrollToTop, Events website field, Polish translations (Weekly Activities + Committee), News Read More modal, Associated Groups website links
- [x] Committee page full Polish translation: Added `position_pl` and `bio_pl` fields to backend model, updated admin form, seeded Polish data for all 10 members
- [x] Backend models updated with website field for Events
- [x] Image storage migrated from Railway filesystem to MongoDB Atlas
- [x] Email delivery migrated from SMTP to HTTP PHP relay (email_relay.php on Vodien)
- [x] Admin Useful Links page: Full CRUD for managing links on Governance page (backend + frontend, tested 100%)
- [x] Frontend deployment build created
- [x] Railway deployment package created

## Production URLs
- Backend: https://pan-backend-production-ebef.up.railway.app
- Frontend: Vodien cPanel (user's domain)

## Deployment Workflow
- **Backend**: Provide `pan_backend_railway.zip` → user commits to GitHub → Railway auto-deploys
- **Frontend**: Run `yarn build` → package `frontend/build/` → user uploads to `public_html` via cPanel

## P1 Issues (Next Priority)
- Hall Hire email delivery via HTTP relay: User to verify emails arriving at webadmin@polishassociationnewcastle.org.au
- Verify all deployment packages work on production

## Upcoming Tasks
- P1: CMS "Preview" mode for admin draft content
- P1: Bulk data import/export for content
- P2: Rich text (WYSIWYG) editor for News/Events
- P2: Interactive calendar for Events
- P3: Member registration, event registration, newsletter

## Refactoring (Low Priority)
- Split routes.py into admin_routes.py / public_routes.py
- Improve database connection pattern (FastAPI Depends)

## Admin Credentials
- URL: /admin/login
- Username: admin
- Password: admin123
