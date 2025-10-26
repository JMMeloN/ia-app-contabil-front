# IA Contábil

## Overview
This is a Brazilian accounting management system (Sistema de gerenciamento de contabilidade) built with React, TypeScript, and Firebase. The application provides user authentication, company management, invoice creation and listing, and a dashboard interface.

## Architecture
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Recoil (replacing Context API)
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Authentication**: Firebase Auth integrated with Recoil + RBAC (Role-Based Access Control)
- **Database**: Firebase Firestore + Firebase Data Connect with PostgreSQL
- **Storage**: Firebase Storage for file attachments (PDFs/XMLs)
- **Routing**: React Router DOM with role-based route protection
- **Security**: Firestore & Storage Security Rules for data isolation

## Project Structure
- `src/components/` - Reusable UI components including shadcn/ui
- `src/components/business/` - Business-specific components (dashboard sections, etc.)
- `src/store/` - Recoil state management
  - `atoms/` - Recoil atoms for state
  - `selectors/` - Recoil selectors for derived state
- `src/hooks/` - Custom hooks for Recoil state management
- `src/types/` - TypeScript type definitions
- `src/presentation/` - Application-specific components, pages, and routes
  - `pages/public/` - Public pages (landing, sign-in, sign-up, etc.)
  - `pages/intern/` - Protected pages (dashboard, invoice management, requested notes)
  - `components/layout/` - Layout components and providers
  - `routes/` - Route configuration and protection
- `src/firebase/` - Firebase configuration and services
- `dataconnect/` - Firebase Data Connect configuration

## Key Features
- User authentication with Firebase
- **Role-Based Access Control (RBAC)** with 3 roles:
  - **Admin**: Manages user roles and system configuration
  - **Operacional**: Processes requests and uploads invoices
  - **Cliente**: Views and downloads their invoices
- Landing page with WhatsApp contact integration
- Company management
- Invoice (nota fiscal) creation and listing
- **Comprehensive requested notes management system** with:
  - Advanced filtering and search with date ranges
  - Status management and priority tracking
  - Attachments handling with upload/download capabilities
  - Detailed note tracking with history and comments
  - Modal-based interface for complete note information
  - Pagination and bulk operations
- **Separate dashboards per role**:
  - Admin Panel: User role management
  - Operational Dashboard: Request processing and file uploads
  - Client Dashboard: Invoice viewing and downloads
- Protected routes with role-based access control
- Dynamic navigation menu based on user role
- Responsive design with dark/light theme support

## Development Setup
- Server runs on port 5000 via Vite dev server
- Configured for Replit environment with proper host binding
- Hot reload enabled for development

## Deployment
- Configured for autoscale deployment
- Build process: `npm run build`
- Serves static files from `dist/` directory

## Recent Improvements

### Phase 3: Role-Based Access Control System (October 26, 2025)
- **RBAC Implementation**: Complete role-based access control system
  - Three distinct roles: Admin, Operacional, Cliente
  - Role assignment via Admin panel with live updates
  - New users automatically assigned "cliente" role
- **Security Infrastructure**:
  - Firestore Security Rules for data isolation
  - Storage Security Rules for file access control
  - RoleBasedRoute component for frontend route protection
  - useUserRole hook for role state management
- **Separate User Interfaces**:
  - Admin Panel (`/admin`): User management and role assignment
  - Operational Dashboard (`/operacional`): Request processing and file uploads
  - Client Dashboard (`/cliente`): Invoice viewing and downloads
- **File Management System**:
  - Firebase Storage integration for PDF/XML uploads
  - Operational users upload invoice files
  - Clients download only their own invoices
  - Secure file access with role-based permissions
- **Dynamic Navigation**:
  - Sidebar adapts to user role automatically
  - Admin sees: Admin Panel, Operational Area
  - Operacional sees: Requests, All Notes
  - Cliente sees: My Notes, Invoice Creation
- **Data Restructuring**:
  - New `/users/{uid}` collection with role field
  - Prepared `/requestedNotes` structure for multi-user access
  - Migration path from legacy `users/{uid}/notes` collection
- **Documentation**:
  - Complete setup guide (SETUP_RBAC.md)
  - Security rules deployment instructions
  - First admin user creation guide
  - Testing and troubleshooting documentation

### Previous Updates (September 17, 2025)

### Phase 1: Core Architecture
- **Recoil Integration**: Completely migrated from Context API to Recoil for better state management
- **Enhanced Componentization**: Refactored large Dashboard component into smaller, reusable components:
  - DashboardHeader: Welcome message and action buttons
  - StatsCards: Summary statistics display
  - RecentNotesTable: Recent invoices table
  - CompaniesSection: Company management panel
  - QuickActions: Quick access buttons
- **State Management**: Created organized atom and selector structure for auth, business data, and theme
- **Custom Hooks**: Implemented useAuth, useNotas, useCompanies, and useDashboard for clean state access
- **Data Normalization**: Added compatibility layer for legacy Firebase documents
- **Performance**: Fixed infinite re-render issues with properly memoized functions

### Phase 2: Requested Notes Management System
- **Comprehensive TypeScript Types**: Created complete type definitions for RequestedNotes ecosystem
- **Advanced State Management**: Extended Recoil architecture with specialized atoms and selectors for:
  - Notes data management with filtering and pagination
  - Attachments handling with upload progress tracking
  - Status management and priority systems
  - History tracking and comments functionality
  - Modal state and user interactions
- **Rich Component Library**: Built specialized UI components:
  - RequestedNotesFilters: Advanced filtering with date pickers and status selectors
  - RequestedNotesTable: Paginated table with actions and bulk operations
  - StatusManager: Comprehensive status workflow management
  - AttachmentsManager: File upload/download with progress tracking
  - RequestedNoteDetailModal: Full-featured modal with tabbed interface
- **Integration**: Added routes, navigation, and Firebase persistence
- **User Experience**: Implemented Brazilian Portuguese localization with date-fns

## Current State
- Dependencies installed and working (including date-fns, shadcn/ui components, Firebase Storage)
- Development server configured and running on port 5000
- Recoil state management fully implemented and tested
- Dashboard componentization completed
- **Role-Based Access Control (RBAC) fully implemented** with:
  ✅ Three distinct roles (Admin, Operacional, Cliente)
  ✅ Admin panel for role management
  ✅ Separate dashboards for each role
  ✅ Role-based route protection
  ✅ Dynamic navigation menu
  ✅ Firestore Security Rules (ready to deploy)
  ✅ Storage Security Rules (ready to deploy)
  ✅ Firebase Storage integration for file uploads/downloads
  ✅ Operational area for processing requests
  ✅ Client area for viewing and downloading invoices
  ✅ Complete setup documentation (SETUP_RBAC.md)
- **Requested notes management system fully implemented** with:
  ✅ Complete TypeScript type definitions
  ✅ Recoil state management integration
  ✅ UI components with advanced filtering and pagination
  ✅ Status management and attachments handling
  ✅ Modal-based detailed interface
  ✅ Navigation and routing integration
  ✅ File upload/download with Firebase Storage
  🚧 Export functionality (Excel/PDF) - pending implementation
  🚧 Data migration from legacy structure - documented but not automated
  🚧 Notifications system - basic structure in place
- Ready for deployment (requires Security Rules deployment)
- Firebase integration fully configured and operational

## Technical Debt & Next Steps
1. **Deploy Security Rules**: Upload firestore.rules and storage.rules to Firebase Console
2. **Create First Admin**: Manually assign admin role to first user in Firestore
3. **Data Migration**: Migrate existing notes from `users/{uid}/notes` to `/requestedNotes` if needed
4. **Complete Export Functionality**: Implement Excel/PDF export from filtered data
5. **Enhanced Notifications**: Complete notification sending/receiving functionality
6. **Performance Optimization**: Consider virtualization for large datasets
7. **Testing**: Add comprehensive test coverage for RBAC and new components

## Important Files for RBAC
- `SETUP_RBAC.md` - Complete setup and deployment guide
- `firestore.rules` - Firestore Security Rules (needs deployment)
- `storage.rules` - Storage Security Rules (needs deployment)
- `src/types/user.ts` - User and role type definitions
- `src/hooks/useUserRole.ts` - Role state management hook
- `src/presentation/routes/role-based-route.tsx` - Role-based route protection
- `src/presentation/pages/intern/admin/` - Admin panel for role management
- `src/presentation/pages/intern/operacional/` - Operational dashboard
- `src/presentation/pages/intern/cliente/` - Client dashboard

## Date
Last updated: October 26, 2025