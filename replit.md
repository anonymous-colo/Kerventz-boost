# KERVENTZ STATUS - Contact Management System

## Overview

KERVENTZ STATUS is a professional dual-site contact management platform designed for WhatsApp status group management. The system consists of a public registration site with multi-language support and a secure admin dashboard for contact management. The application provides a premium user experience with glassmorphism effects, real-time statistics, and comprehensive administrative controls.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React 18+ with TypeScript and follows a component-based architecture:
- **React Router**: Uses Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state with local React state for UI
- **Styling**: Tailwind CSS with custom design system and Radix UI components
- **Theme System**: Context-based theme provider supporting light/dark modes
- **Internationalization**: Custom translation system supporting French, English, and Spanish

### Backend Architecture
The backend follows an Express.js REST API pattern:
- **Server**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: In-memory session storage with automatic cleanup
- **API Design**: RESTful endpoints with proper error handling and validation

### Build System
- **Bundler**: Vite for development and production builds
- **TypeScript**: Full type safety across frontend, backend, and shared schemas
- **Development**: Hot module replacement and real-time error overlay

## Key Components

### Public Site Features
1. **Multi-language Registration Form**: Dynamic form validation with phone number validation per country
2. **Real-time Statistics**: Live counters for satisfaction rates, online users, and WhatsApp views
3. **Suffix Selection System**: Dynamic suffix management for contact personalization
4. **Responsive Design**: Mobile-first approach with glassmorphism UI effects
5. **Theme Toggle**: Light/dark mode switching with persistent storage

### Admin Dashboard Features
1. **Secure Authentication**: Session-based authentication with 24-hour expiration
2. **Contact Management**: Full CRUD operations with search, filtering, and bulk operations
3. **Data Export**: VCF and CSV export functionality for contact lists
4. **Suffix Management**: Dynamic suffix creation and management system
5. **Analytics Dashboard**: Real-time statistics and insights with data visualization

### Shared Components
1. **Schema Validation**: Zod schemas shared between frontend and backend
2. **Type Safety**: TypeScript interfaces for all data structures
3. **Utility Functions**: Shared utilities for phone validation and formatting

## Data Flow

### Contact Registration Flow
1. User selects language and fills registration form
2. Frontend validates data using shared Zod schemas
3. Phone number validation occurs based on selected country
4. Backend validates and stores contact with duplicate checking
5. Success response triggers WhatsApp group access modal

### Admin Management Flow
1. Admin authenticates with session token stored in localStorage
2. Dashboard loads with real-time statistics from backend
3. Contact operations (CRUD) update both database and query cache
4. Export functions generate formatted files for download
5. Session management handles automatic logout on expiration

### Data Validation
- **Frontend**: React Hook Form with Zod resolvers for real-time validation
- **Backend**: Zod schema validation before database operations
- **Phone Validation**: Country-specific validation rules and formatting

## External Dependencies

### Core Framework Dependencies
- **React 18+**: Frontend framework with hooks and context
- **Express.js**: Backend web server framework
- **Drizzle ORM**: Type-safe database operations
- **TanStack Query**: Server state management and caching

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the application
- **Zod**: Runtime type validation and parsing

### Database
- **PostgreSQL**: Primary database (configurable via DATABASE_URL)
- **In-Memory Storage**: Fallback for development without database

## Deployment Strategy

### Production Build
The application uses a dual-build strategy:
1. **Frontend Build**: Vite builds React application to static files
2. **Backend Build**: ESBuild bundles Node.js server with dependencies
3. **Static Assets**: Frontend served as static files with API proxy

### Deployment Platforms
- **Vercel**: Primary deployment target with serverless functions
- **Environment Variables**: DATABASE_URL for database connection
- **Asset Handling**: Static file serving with proper routing

### Development Environment
- **Hot Reload**: Vite development server with Express middleware
- **Error Handling**: Runtime error overlay for development debugging
- **Session Cleanup**: Automated cleanup of expired sessions every hour

### Security Considerations
- **Session Management**: Secure token-based authentication
- **Input Validation**: Comprehensive validation on both client and server
- **CORS**: Proper cross-origin request handling
- **Data Sanitization**: Protection against common web vulnerabilities

The architecture prioritizes type safety, developer experience, and scalability while maintaining a clean separation between public and administrative functionality.