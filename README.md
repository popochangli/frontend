# Event Ticketing Admin Frontend

A Next.js 14 application with TypeScript and Tailwind CSS for managing events and ticketing requests.

## Features

### Phase 1 - Admin Role (Implemented)

- **Authentication**: Login and registration with role selection
- **Admin Dashboard**: System-wide metrics and recent activity
- **Event Management**: Full CRUD operations for events
- **Ticketing Management**: View, edit, and delete all ticketing requests
- **Public Event Viewing**: Anyone can view events without authentication
- **Role-Based Access Control**: Admin-only routes protected

### Phase 2 - Member Role (Placeholder)

- Member dashboard (coming soon)
- Browse and view events (coming soon)
- Create ticketing requests (coming soon)
- Manage own ticketing requests (coming soon)

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom wrapper
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:5000` (or configure `NEXT_PUBLIC_API_URL`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file (or copy from `.env.example`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=EventTicketer Admin
NEXT_PUBLIC_APP_VERSION=1.0.0
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (admin)/           # Admin pages
│   ├── (member)/          # Member pages (placeholders)
│   ├── events/            # Public event pages
│   └── unauthorized/      # Error pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── events/           # Event-related components
│   ├── ticketing/        # Ticketing components
│   └── dashboard/        # Dashboard components
├── contexts/             # React contexts
├── lib/                  # Utilities and API clients
│   ├── api/             # API service modules
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
└── middleware.ts        # Next.js middleware for route protection
```

## API Integration

The frontend integrates with the existing Event Ticketing System REST API. All API calls are handled through the API client service in `src/lib/api/`.

### Authentication

- JWT tokens are stored in localStorage
- Tokens are sent as Bearer tokens in Authorization headers
- Automatic redirect to login on 401 responses

### API Endpoints Used

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/logout` - Logout
- `GET /api/v1/events` - Get all events
- `GET /api/v1/events/:id` - Get event by ID
- `POST /api/v1/events` - Create event (admin only)
- `PUT /api/v1/events/:id` - Update event (admin only)
- `DELETE /api/v1/events/:id` - Delete event (admin only)
- `GET /api/v1/ticketing` - Get ticketing requests
- `GET /api/v1/ticketing/:id` - Get ticketing request by ID
- `PUT /api/v1/ticketing/:id` - Update ticketing request
- `DELETE /api/v1/ticketing/:id` - Delete ticketing request

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: http://localhost:5000/api/v1)
- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_VERSION` - Application version

## Notes

- The backend API must be running and accessible
- CORS must be configured on the backend to allow requests from the frontend
- All styling uses Tailwind CSS utility classes (no separate CSS files)
- Member role features are prepared but not implemented (Phase 2)

