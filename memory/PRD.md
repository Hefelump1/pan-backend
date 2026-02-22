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
- `/src/pages/` - Admin: AdminLogin, AdminDashboard, AdminHomePage, AdminActivities, AdminNews, AdminEvents, AdminCommittee, AdminGroups, AdminBookings, AdminHallHire, AdminDocuments
- `/src/components/` - Navbar, Footer, ImageUpload, UI components (shadcn)
- `/src/context/LanguageContext.jsx` - Language state management (EN/PL)
- `/src/translations/translations.js` - All static text in both languages

### Backend (FastAPI)
- `/api/settings` - Home page settings (images, text, hall images)
- `/api/activities` - Weekly activities CRUD (bilingual)
- `/api/news` - News articles CRUD (bilingual)
- `/api/events` - Events CRUD
- `/api/bookings` - Hall hire booking system
- `/api/committee` - Committee members
- `/api/groups` - Associated groups (bilingual)
- `/api/documents` - Governance documents CRUD
- `/api/auth` - Admin authentication (JWT)
- `/api/upload` - Image upload
- `/api/upload/document` - Document upload (PDF, DOC, DOCX)

### Database (MongoDB)
Collections:
- settings (hero_image, welcome_image, hero_title_en/pl, hero_subtitle_en/pl, welcome_text1_en/pl, welcome_text2_en/pl, hall_image_1-6)
- activities (day, name_en/pl, time, description_en/pl, contact, order, is_visible)
- news (title_en/pl, summary_en/pl, content_en/pl, image, date, published)
- events (title, date, time, location, description, category, image)
- bookings (name, email, phone, event_type, date, guests, status)
- committee_members (name, position, bio, image, order)
- associated_groups (name_en/pl, description_en/pl, schedule_en/pl, contact, website, image)
- governance_documents (title, file_url, file_type, file_size, order)
- admin_users (username, email, hashed_password)

## Implementation Status (Updated: February 2026)

### ✅ COMPLETED - All Core Features

#### Public Website
- [x] All pages built and functional (Home, Events, News, Weekly Activities, Hall Hire, Committee, Groups, Constitution)
- [x] Full bilingual support (English/Polish) with language toggle
- [x] Traditional Polish red/white design theme
- [x] Mobile-responsive design
- [x] Dynamic document display on Constitution/Governance page

#### Admin Panel (CMS) - FULLY COMPLETE
- [x] **Admin Authentication** - JWT-based login
- [x] **Admin Dashboard** - Stats overview with quick actions
- [x] **Home Page Settings** - Edit hero images, welcome images, hero title/subtitle (EN/PL), welcome text (EN/PL)
- [x] **Weekly Activities Management** - Full CRUD grouped by day, bilingual fields, visibility toggle to hide activities temporarily
- [x] **News Management** - Full CRUD with published/draft status, bilingual
- [x] **Events Management** - Full CRUD with categories and images
- [x] **Committee Management** - Full CRUD with display ordering
- [x] **Groups Management** - Full CRUD, bilingual fields
- [x] **Bookings Management** - Review, Approve/Reject hall hire requests
- [x] **Image Upload System** - Direct file upload with drag-and-drop support (replaces URL inputs)
- [x] **Password Change** - Admins can change their password from Settings menu
- [x] **Hall Hire Images** - Upload and manage gallery photos for the Hall Hire page (up to 6 images)
- [x] **Governance Documents** - Upload and manage PDF/Word documents with drag-and-drop reordering
- [x] **AGM Notice Editor** - Edit AGM announcement text (bilingual) and upload AGM notice document

### Document Upload Feature (Completed Feb 2026)
- **Backend API**: `POST /api/upload/document` accepts multipart/form-data, validates file types (pdf, doc, docx) and size (max 50MB)
- **Storage**: Files stored in `/app/backend/uploads/` and served at `/api/uploads/{filename}`
- **Frontend Admin**: `AdminDocuments.jsx` with file upload, title input, edit, delete, and drag-and-drop reordering
- **Public Display**: Constitution page (`/constitution`) dynamically fetches and displays documents from database

### Image Upload Feature (Completed Feb 2026)
- **Backend API**: `POST /api/upload` accepts multipart/form-data, validates file types (jpg, png, gif, webp, svg) and size (max 10MB)
- **Storage**: Files stored in `/app/backend/uploads/` and served at `/api/uploads/{filename}`
- **Frontend Component**: Reusable `ImageUpload.jsx` with drag-and-drop, preview, replace, and remove functionality
- **Deployed in**: AdminNews, AdminEvents, AdminCommittee, AdminGroups, AdminHomePage (hero/welcome images)

### Testing Status
- Backend: 100% (Document API: 16/16 tests passed)
- Frontend: 100% (All CMS features verified including document management)

### 📋 Backlog

#### P1 (High Priority)
- [x] ~~Admin password change feature~~ ✅ Completed Feb 2026
- [x] ~~Email notifications for new booking enquiries~~ ✅ Completed Feb 2026
- [x] ~~Governance document management~~ ✅ Completed Feb 2026

#### P2 (Medium Priority)
- [x] ~~File upload for images~~ ✅ Completed Feb 2026
- [ ] Rich text editor for news/event descriptions
- [ ] Interactive events calendar widget
- [ ] CMS Preview Mode - Preview content changes before publishing
- [ ] Bulk data import/export for content

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
| `/api/activities` | GET, POST, PUT, DELETE | Weekly activities (admin - all) |
| `/api/activities/visible` | GET | Visible activities only (public) |
| `/api/activities/{id}/visibility` | PATCH | Toggle activity visibility |
| `/api/news` | GET, POST, PUT, DELETE | News articles |
| `/api/news/published` | GET | Published news only |
| `/api/events` | GET, POST, PUT, DELETE | Events |
| `/api/committee` | GET, POST, PUT, DELETE | Committee members |
| `/api/groups` | GET, POST, PUT, DELETE | Associated groups |
| `/api/bookings` | GET, POST, PUT | Hall bookings |
| `/api/documents` | GET, POST | Governance documents |
| `/api/documents/reorder` | PUT | Reorder documents |
| `/api/documents/{id}` | PUT, DELETE | Update/delete document |
| `/api/settings` | GET, PUT | Site settings including AGM notice |
| `/api/auth/login` | POST | Admin login |
| `/api/auth/me` | GET | Verify token |
| `/api/auth/change-password` | POST | Change admin password |
| `/api/upload` | POST, DELETE | Image upload/delete |
| `/api/upload/document` | POST | Document upload (PDF/DOC/DOCX) |
| `/api/uploads/{filename}` | GET | Serve uploaded files |

## Technical Notes
- Bilingual content uses `_en` and `_pl` field suffixes
- Language context determines which fields to display
- JWT authentication with 24-hour token expiration
- Settings API uses upsert - creates if not exists
- Activities sorted by day order then by display order
- Documents sorted by order field (drag-and-drop reorderable)
- Default translations used when custom text is null
