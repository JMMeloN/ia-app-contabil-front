# IA Contábil

## Overview
This is a Brazilian accounting management system (Sistema de gerenciamento de contabilidade) built with React, TypeScript, and Firebase. The application provides user authentication, company management, invoice creation and listing, and a dashboard interface.

## Architecture
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore + Firebase Data Connect with PostgreSQL
- **Routing**: React Router DOM

## Project Structure
- `src/components/` - Reusable UI components including shadcn/ui
- `src/presentation/` - Application-specific components, pages, and routes
  - `pages/public/` - Public pages (landing, sign-in, sign-up, etc.)
  - `pages/intern/` - Protected pages (dashboard, invoice management)
  - `components/layout/` - Layout components and providers
  - `routes/` - Route configuration and protection
- `src/firebase/` - Firebase configuration and services
- `dataconnect/` - Firebase Data Connect configuration

## Key Features
- User authentication with Firebase
- Landing page
- Company management
- Invoice (nota fiscal) creation and listing
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

## Current State
- Dependencies installed and working
- Development server configured and running
- Ready for development and deployment
- Firebase integration configured but may need API keys for full functionality

## Date
Last updated: September 17, 2025