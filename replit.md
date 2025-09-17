# IA Contábil

## Overview
This is a Brazilian accounting management system (Sistema de gerenciamento de contabilidade) built with React, TypeScript, and Firebase. The application provides user authentication, company management, invoice creation and listing, and a dashboard interface.

## Architecture
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Recoil (replacing Context API)
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Authentication**: Firebase Auth integrated with Recoil
- **Database**: Firebase Firestore + Firebase Data Connect with PostgreSQL
- **Routing**: React Router DOM

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
- Landing page
- Company management
- Invoice (nota fiscal) creation and listing
- **Comprehensive requested notes management system** with:
  - Advanced filtering and search with date ranges
  - Status management and priority tracking
  - Attachments handling with upload/download capabilities
  - Detailed note tracking with history and comments
  - Modal-based interface for complete note information
  - Pagination and bulk operations
- Protected routes for authenticated users
- Responsive design with dark/light theme support

## Development Setup
- Server runs on port 5000 via Vite dev server
- Configured for Replit environment with proper host binding
- Hot reload enabled for development

## Deployment
- Configured for autoscale deployment
- Build process: `npm run build`
- Serves static files from `dist/` directory

## Recent Improvements (September 17, 2025)

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
- Dependencies installed and working (including date-fns, shadcn/ui components)
- Development server configured and running
- Recoil state management fully implemented and tested
- Dashboard componentization completed
- **Requested notes management system fully implemented** with:
  ✅ Complete TypeScript type definitions
  ✅ Recoil state management integration
  ✅ UI components with advanced filtering and pagination
  ✅ Status management and attachments handling
  ✅ Modal-based detailed interface
  ✅ Navigation and routing integration
  🚧 Export functionality (Excel/PDF) - pending implementation
  🚧 Full attachments persistence with Firebase Storage - pending
  🚧 Notifications system - basic structure in place
- Ready for development and deployment
- Firebase integration configured but may need API keys for full functionality

## Technical Debt & Next Steps
1. **Complete Export Functionality**: Implement Excel/PDF export from filtered data
2. **Enhanced Attachments**: Full Firebase Storage integration for file versioning
3. **Notifications System**: Complete notification sending/receiving functionality
4. **Performance Optimization**: Consider virtualization for large datasets
5. **Testing**: Add comprehensive test coverage for new components

## Date
Last updated: September 17, 2025