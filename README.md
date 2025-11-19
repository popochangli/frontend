# Event Ticketing System - Frontend

Next.js-based frontend application for the Event Ticketing System with QR code generation and ticket management.

## 📋 Overview

This is the frontend application built with Next.js 14, TypeScript, and Tailwind CSS. It provides separate interfaces for members and administrators to manage event tickets.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **QR Code Generation:** qrcode.react
- **QR Code Scanning:** jsQR
- **Icons:** Lucide React
- **HTTP Client:** Fetch API with custom wrapper

## 📖 Documentation

### **[📊 UI Flow Design](./blob/main/ui_flow_design.md)**

View comprehensive UI flow documentation with interactive Mermaid diagrams showing:
- Complete user journey flows
- Member and admin workflows
- System architecture
- QR code workflow
- Page structure and navigation

**Click the link above to see detailed UI flows!**

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on port 5004

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file (optional):
```env
NEXT_PUBLIC_API_URL=http://localhost:5004/api/v1
```

The API URL defaults to `http://localhost:5004/api/v1` if not specified.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (admin)/           # Admin routes (protected)
│   │   │   └── admin/
│   │   │       ├── dashboard/ # Admin dashboard
│   │   │       ├── events/    # Event management
│   │   │       ├── ticketing/ # Ticketing management
│   │   │       └── scanner/   # QR scanner
│   │   ├── (member)/          # Member routes (protected)
│   │   │   └── member/
│   │   │       ├── dashboard/ # Member dashboard
│   │   │       ├── events/    # Browse events
│   │   │       └── my-tickets/# My tickets
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── events/           # Event components
│   │   ├── layout/           # Layout components
│   │   ├── ticketing/        # Ticketing components
│   │   └── ui/               # Reusable UI components
│   │
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   │
│   ├── lib/                  # Utilities and libraries
│   │   ├── api/             # API client functions
│   │   │   ├── client.ts    # Base API client
│   │   │   ├── auth.ts      # Auth API
│   │   │   ├── events.ts    # Events API
│   │   │   └── ticketing.ts # Ticketing API
│   │   └── types/           # TypeScript types
│   │       ├── auth.ts
│   │       ├── event.ts
│   │       └── ticketing.ts
│   │
│   └── middleware.ts         # Next.js middleware for auth
│
├── public/                   # Static files
├── tailwind.config.ts       # Tailwind configuration
├── next.config.js           # Next.js configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎨 Features

### Member Features
- ✅ Browse available events
- ✅ Book tickets (1-5 per event)
- ✅ View QR codes for tickets
- ✅ Edit ticket amounts
- ✅ Cancel bookings
- ✅ View ticket status (Active/Used)

### Admin Features
- ✅ Manage events (CRUD operations)
- ✅ View all ticketing records
- ✅ Upload QR code images for verification
- ✅ Manual ticket ID entry
- ✅ Redeem tickets
- ✅ Prevent duplicate redemptions

## 🔐 Authentication

The app uses JWT-based authentication with the following flow:

1. User logs in via `/login`
2. Backend returns JWT token
3. Token stored in localStorage
4. AuthContext provides user state
5. Middleware protects routes
6. API client includes token in requests

### Protected Routes

- **Member routes:** `/member/*` - Requires authentication
- **Admin routes:** `/admin/*` - Requires admin role

## 📱 Pages Overview

### Public Pages
- `/login` - User login
- `/register` - User registration

### Member Pages
- `/member/dashboard` - Overview of bookings
- `/member/events` - Browse and book events
- `/member/my-tickets` - Manage tickets and view QR codes

### Admin Pages
- `/admin/dashboard` - Admin overview
- `/admin/events` - Event management
- `/admin/ticketing` - View all tickets
- `/admin/scanner` - QR code verification

## 🎯 Key Components

### QR Code System

**Generation (`my-tickets/page.tsx`):**
```typescript
<QRCodeSVG 
  value={JSON.stringify({
    id: ticket._id,
    event: eventName,
    user: userName,
    amount: ticketAmount
  })}
  size={200}
  level="H"
/>
```

**Scanning (`admin/scanner/page.tsx`):**
- Upload QR image
- Extract data using `jsQR`
- Verify ticket via API
- Redeem if valid

### API Client

Located in `src/lib/api/`, provides typed functions for:
- Authentication (`auth.ts`)
- Events (`events.ts`)
- Ticketing (`ticketing.ts`)

Example:
```typescript
import { ticketingApi } from '@/lib/api/ticketing';

const response = await ticketingApi.create({
  event: eventId,
  ticketAmount: 3
});
```

## 🎨 Styling

### Tailwind Configuration

Custom color palette defined in `tailwind.config.ts`:
- **Primary:** Indigo
- **Secondary:** Slate
- **Accent colors** for success, error, warning

### Global Styles

`globals.css` includes:
- Gradient backgrounds
- Glassmorphism utilities (`.glass`, `.glass-dark`)
- Hover animations (`.card-hover`)

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Client components marked with `'use client'`
- Consistent naming conventions

## 📦 Dependencies

### Core
- `next` - React framework
- `react` & `react-dom` - UI library
- `typescript` - Type safety

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library

### QR Code
- `qrcode.react` - QR code generation
- `jsqr` - QR code scanning

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
vercel deploy
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables

Set `NEXT_PUBLIC_API_URL` to your production API URL.

## 📝 Notes

- QR codes are generated client-side (no server processing)
- Images are processed in-browser (not uploaded to server)
- Authentication state persists in localStorage
- API calls include JWT token automatically

---

**For detailed UI flows and system architecture, see [UI Flow Design Documentation](./blob/main/ui_flow_design.md)**
