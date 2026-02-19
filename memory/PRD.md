# Polish Association of Newcastle Website - Product Requirements Document

## Project Overview
Modern, traditional website for the Polish Association of Newcastle built with React frontend, FastAPI backend, and MongoDB database. Features a comprehensive admin panel (CMS) for content management by committee members.

## Original Problem Statement
Build a modern website for the Polish Association of Newcastle with:
- Calendar of events
- Weekly goings on at the hall
- Hall hire enquiry page with booking system
- Committee and AGM/Constitution information
- Links to associated groups (Polish schools, dining, dance groups, seniors)
- Traditional & elegant design (white/red Polish colors)
- Admin panel for content management
- Full bilingual support (English/Polish)

## Architecture

### Frontend (React)
- `/src/pages/` - Public: Home, Events, News, WeeklyActivities, HallHire, Committee, AssociatedGroups, Constitution
- `/src/pages/` - Admin: AdminLogin, AdminDashboard, AdminHomePage, AdminActivities, AdminNews, AdminEvents, AdminCommittee, AdminGroups, AdminBookings
- `/src/components/` - Navbar, Footer, UI components (shadcn)
- `/src/context/LanguageContext.jsx` - Language state management (EN/PL)
- `/src/translations/translations.js` - All static text in both languages

### Backend (FastAPI)
- `/api/settings` - Home page settings (images, text)
- `/api/activities` - Weekly activities CRUD (bilingual)
- `/api/news` - News articles CRUD (bilingual)
- `/api/events` - Events CRUD
- `/api/bookings` - Hall hire booking system
- `/api/committee` - Committee members
- `/api/groups` - Associated groups (bilingual)
- `/api/auth` - Admin authentication (JWT)

### Database (MongoDB)
Collections:
- settings (hero_image, welcome_image, hero_title_en/pl, hero_subtitle_en/pl, welcome_text1_en/pl, welcome_text2_en/pl)
- activities (day, name_en/pl, time, description_en/pl, contact, order)
- news (title_en/pl, summary_en/pl, content_en/pl, image, date, published)
- events (title, date, time, location, description, category, image)
- bookings (name, email, phone, event_type, date, guests, status)
- committee_members (name, position, bio, image, order)
- associated_groups (name_en/pl, description_en/pl, schedule_en/pl, contact, website, image)
- admin_users (username, email, hashed_password)

## Implementation Status (Updated: February 2026)

### ✅ COMPLETED - All Core Features

#### Public Website
- [x] All pages built and functional (Home, Events, News, Weekly Activities, Hall Hire, Committee, Groups, Constitution)
- [x] Full bilingual support (English/Polish) with language toggle
- [x] Traditional Polish red/white design theme
- [x] Mobile-responsive design

#### Admin Panel (CMS) - FULLY COMPLETE
- [x] **Admin Authentication** - JWT-based login
- [x] **Admin Dashboard** - Stats overview with quick actions
- [x] **Home Page Settings** - Edit hero images, welcome images, hero title/subtitle (EN/PL), welcome text (EN/PL)
- [x] **Weekly Activities Management** - Full CRUD grouped by day, bilingual fields
- [x] **News Management** - Full CRUD with published/draft status, bilingual
- [x] **Events Management** - Full CRUD with categories and images
- [x] **Committee Management** - Full CRUD with display ordering
- [x] **Groups Management** - Full CRUD, bilingual fields
- [x] **Bookings Management** - Review, Approve/Reject hall hire requests
- [x] **Image Upload System** - Direct file upload with drag-and-drop support (replaces URL inputs)

### Image Upload Feature (Completed Feb 2026)
- **Backend API**: `POST /api/upload` accepts multipart/form-data, validates file types (jpg, png, gif, webp, svg) and size (max 10MB)
- **Storage**: Files stored in `/app/backend/uploads/` and served at `/api/uploads/{filename}`
- **Frontend Component**: Reusable `ImageUpload.jsx` with drag-and-drop, preview, replace, and remove functionality
- **Deployed in**: AdminNews, AdminEvents, AdminCommittee, AdminGroups, AdminHomePage (hero/welcome images)

### Testing Status
- Backend: 100% (17/17 upload API tests passed + 19 existing)
- Frontend: 100% (All CMS features verified including image upload)

### 📋 Backlog

#### P1 (High Priority)
- [ ] Admin password change feature
- [ ] Email notifications for new booking enquiries

#### P2 (Medium Priority)
- [x] ~~File upload for images~~ ✅ Completed Feb 2026
- [ ] Rich text editor for news/event descriptions
- [ ] Interactive events calendar widget

#### P3 (Nice to Have)
- [ ] Member portal with login/registration
- [ ] Online event registration
- [ ] Newsletter subscription
- [ ] Photo gallery
- [ ] Contact form with captcha

## Admin Access
- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

## API Endpoints Summary

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/settings` | GET, PUT | Home page settings |
| `/api/activities` | GET, POST, PUT, DELETE | Weekly activities |
| `/api/news` | GET, POST, PUT, DELETE | News articles |
| `/api/news/published` | GET | Published news only |
| `/api/events` | GET, POST, PUT, DELETE | Events |
| `/api/committee` | GET, POST, PUT, DELETE | Committee members |
| `/api/groups` | GET, POST, PUT, DELETE | Associated groups |
| `/api/bookings` | GET, POST, PUT | Hall bookings |
| `/api/auth/login` | POST | Admin login |
| `/api/auth/me` | GET | Verify token |
| `/api/upload` | POST, DELETE | Image upload/delete |
| `/api/uploads/{filename}` | GET | Serve uploaded images |

## Technical Notes
- Bilingual content uses `_en` and `_pl` field suffixes
- Language context determines which fields to display
- JWT authentication with 24-hour token expiration
- Settings API uses upsert - creates if not exists
- Activities sorted by day order then by display order
- Default translations used when custom text is null
