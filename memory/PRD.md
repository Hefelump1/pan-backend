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

## User Personas
1. **Committee Members (Admins)** - Need to manage events, approve bookings, update content via CMS
2. **Community Members** - Want to view events, book hall, learn about activities
3. **Prospective Members** - Looking to join Polish community, learn about association

## Architecture

### Frontend (React)
- `/src/pages/` - Public: Home, Events, News, WeeklyActivities, HallHire, Committee, AssociatedGroups, Constitution
- `/src/pages/` - Admin: AdminLogin, AdminDashboard, AdminNews, AdminEvents, AdminCommittee, AdminGroups, AdminBookings
- `/src/components/` - Navbar, Footer, UI components (shadcn)
- `/src/context/LanguageContext.jsx` - Language state management (EN/PL)
- `/src/translations/translations.js` - All static text in both languages

### Backend (FastAPI)
- `/api/news` - CRUD operations for news articles (bilingual)
- `/api/events` - CRUD operations for events
- `/api/activities` - Weekly activities management
- `/api/bookings` - Hall hire booking system
- `/api/committee` - Committee member information
- `/api/groups` - Associated groups data (bilingual)
- `/api/auth` - Admin authentication (JWT)

### Database (MongoDB)
Collections:
- news (NEW - bilingual: title_en/pl, summary_en/pl, content_en/pl)
- events
- activities
- bookings
- committee_members
- associated_groups (bilingual: name_en/pl, description_en/pl, schedule_en/pl)
- admin_users

## Implementation Status (Updated: February 2026)

### ✅ COMPLETED - All Core Features

#### Public Website
- [x] Frontend setup with React, Tailwind, shadcn/ui
- [x] Navigation with responsive mobile menu + language toggle
- [x] Footer with contact information
- [x] Home page with hero, welcome section, quick links, upcoming events
- [x] Events calendar page (API-driven)
- [x] Recent News page (API-driven, bilingual)
- [x] Committee page with 10 member profiles (API-driven)
- [x] Weekly Activities page with full schedule
- [x] Hall Hire page with booking form and calendar
- [x] Associated Groups page (API-driven, bilingual)
- [x] Constitution/Governance page with Useful Links section
- [x] Traditional Polish red/white design theme
- [x] Full Internationalization (i18n) - English/Polish toggle

#### Admin Panel (CMS) - COMPLETED February 2026
- [x] Admin Authentication with JWT
- [x] Admin Dashboard with stats and quick actions
- [x] **News Management** - Full CRUD (Create, Read, Update, Delete)
  - Bilingual fields: title_en/pl, summary_en/pl, content_en/pl
  - Published/Draft status
  - Image URL support
- [x] **Events Management** - Full CRUD
  - Title, date, time, location, description
  - Categories (cultural, educational, social, religious, other)
  - Image URL support
- [x] **Committee Management** - Full CRUD
  - Name, position, bio, photo
  - Display ordering
- [x] **Groups Management** - Full CRUD
  - Bilingual fields: name_en/pl, description_en/pl, schedule_en/pl
  - Contact info and website links
- [x] **Bookings Management** - Review, Approve/Reject
- [x] Testing: 100% pass rate (20/20 backend tests, all frontend features verified)

### 📋 Backlog

#### P1 (High Priority)
- [ ] Admin password change feature
- [ ] Email notifications for new booking enquiries

#### P2 (Medium Priority)
- [ ] File upload for documents (Constitution, AGM notices, PDFs)
- [ ] Image upload for events and groups (cloud storage)
- [ ] Interactive events calendar enhancements (calendar widget)

#### P3 (Nice to Have)
- [ ] Member portal with login/registration
- [ ] Online event registration
- [ ] Newsletter subscription
- [ ] Photo gallery
- [ ] Contact form with captcha

## API Contracts

### News API (NEW)
```
GET /api/news - List all news articles
GET /api/news/published - List only published articles (for public)
POST /api/news - Create article (admin only)
GET /api/news/{id} - Get single article
PUT /api/news/{id} - Update article (admin only)
DELETE /api/news/{id} - Delete article (admin only)
```

### Events API
```
GET /api/events - List all events
POST /api/events - Create event (admin only)
GET /api/events/{id} - Get single event
PUT /api/events/{id} - Update event (admin only)
DELETE /api/events/{id} - Delete event (admin only)
```

### Bookings API
```
GET /api/bookings - List bookings (admin only)
POST /api/bookings - Create booking enquiry
GET /api/bookings/{id} - Get booking details
PUT /api/bookings/{id}/status - Update booking status (admin only)
```

### Committee API
```
GET /api/committee - List committee members
POST /api/committee - Add member (admin only)
PUT /api/committee/{id} - Update member (admin only)
DELETE /api/committee/{id} - Remove member (admin only)
```

### Groups API
```
GET /api/groups - List associated groups
POST /api/groups - Create group (admin only)
PUT /api/groups/{id} - Update group (admin only)
DELETE /api/groups/{id} - Delete group (admin only)
```

## Admin Credentials
- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

## Technical Notes
- Bilingual content uses `_en` and `_pl` field suffixes in database
- Language context determines which fields to display
- JWT authentication for admin routes (24-hour token expiration)
- Use sonner for toast notifications
- Traditional design: red (#dc2626) primary, clean layout, generous whitespace
- Mobile-first responsive approach
