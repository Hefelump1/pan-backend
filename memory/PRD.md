# Polish Association of Newcastle Website - Product Requirements Document

## Project Overview
Modern, traditional website for the Polish Association of Newcastle built with React frontend, FastAPI backend, and MongoDB database. Features admin panel for content management by committee members.

## Original Problem Statement
Build a modern website for the Polish Association of Newcastle with:
- Calendar of events
- Weekly goings on at the hall
- Hall hire enquiry page with booking system
- Committee and AGM/Constitution information
- Links to associated groups (Polish schools, dining, dance groups, seniors)
- Traditional & elegant design (white/red Polish colors)
- Admin panel for content management

## User Personas
1. **Committee Members** - Need to manage events, approve bookings, update content
2. **Community Members** - Want to view events, book hall, learn about activities
3. **Prospective Members** - Looking to join Polish community, learn about association

## Architecture

### Frontend (React)
- `/src/pages/` - Home, Events, WeeklyActivities, HallHire, Committee, AssociatedGroups, Constitution
- `/src/components/` - Navbar, Footer, UI components (shadcn)
- `/src/data/mock.js` - Mock data (temporary, will be replaced by API calls)

### Backend (FastAPI)
- `/api/events` - CRUD operations for events
- `/api/activities` - Weekly activities management
- `/api/bookings` - Hall hire booking system
- `/api/committee` - Committee member information
- `/api/groups` - Associated groups data
- `/api/documents` - Constitution and AGM documents
- `/api/auth` - Admin authentication

### Database (MongoDB)
Collections:
- events
- activities
- bookings
- committee_members
- associated_groups
- documents
- admin_users

## Implementation Status (Updated: December 2025)

### ✅ Completed - All Phases
- [x] Frontend setup with React, Tailwind, shadcn/ui
- [x] Navigation system with responsive mobile menu
- [x] Footer with contact information
- [x] Home page with hero, welcome section, quick links, upcoming events (API-driven)
- [x] Events calendar page with all events display (API-driven)
- [x] Committee page with member profiles (API-driven) - **10 members total**
- [x] Weekly Activities page with full schedule
- [x] Hall Hire page with booking form and calendar
- [x] Associated Groups page (API-driven)
- [x] Constitution/Governance page
- [x] Traditional Polish red/white design theme
- [x] **Backend API development - COMPLETED**
- [x] **MongoDB models and schemas - COMPLETED**
- [x] **Database seeding with initial data - COMPLETED**
- [x] **Frontend-Backend integration - COMPLETED**
- [x] **Hall booking system with form submission - COMPLETED**
- [x] **All CRUD endpoints working - COMPLETED**
- [x] **Admin Panel with JWT Authentication - COMPLETED**
- [x] **Admin booking management (approve/reject) - COMPLETED**
- [x] **Full Internationalization (i18n) - English/Polish - COMPLETED**
- [x] **Language toggle with flag icons - COMPLETED**
- [x] **Committee data: 10 members added (Dec 2025)**
- [x] **Testing completed - 100% pass rate**

### 📋 Backlog

#### P1 (High Priority)
- Admin CRUD for Events (create, edit, delete from dashboard)
- Admin CRUD for Committee Members
- Admin CRUD for Associated Groups
- Admin password change feature

#### P2 (Medium Priority)
- Email notifications for booking confirmations
- File upload for documents (Constitution, AGM notices, PDFs)
- Image upload for events and groups
- Interactive events calendar enhancements

#### P3 (Nice to Have)
- Member portal with login/registration
- Online event registration
- Newsletter subscription
- Photo gallery
- Contact form with captcha

## API Contracts

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

### Weekly Activities API
```
GET /api/activities - List all activities by day
POST /api/activities - Create activity (admin only)
PUT /api/activities/{id} - Update activity (admin only)
DELETE /api/activities/{id} - Delete activity (admin only)
```

### Committee API
```
GET /api/committee - List committee members
POST /api/committee - Add member (admin only)
PUT /api/committee/{id} - Update member (admin only)
DELETE /api/committee/{id} - Remove member (admin only)
```

## Mock Data Integration Plan
Current mock data in `/app/frontend/src/data/mock.js` will be replaced with API calls:
1. Replace `events` array with `fetch('/api/events')`
2. Replace `weeklyActivities` with `fetch('/api/activities')`
3. Replace `committeeMembers` with `fetch('/api/committee')`
4. Replace `associatedGroups` with `fetch('/api/groups')`
5. Add form submission handlers to call backend APIs

## Next Steps
1. Build remaining frontend pages with simple structures
2. Create MongoDB models for all entities
3. Build FastAPI endpoints with CRUD operations
4. Implement admin authentication with JWT
5. Create admin panel UI
6. Replace mock data with API calls
7. Test complete flow with testing agent
8. Add error handling and validation

## Technical Notes
- Avoid deeply nested JSX structures (causes babel plugin issues)
- Use shadcn calendar component for date selection
- Use sonner for toast notifications
- Traditional design: red (#dc2626) primary, clean layout, generous whitespace
- Mobile-first responsive approach
