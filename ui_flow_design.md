# Event Ticketing System - UI Flow Design

This document provides a comprehensive overview of the user interface flows and system architecture for the Event Ticketing System.

---

## 1. Complete User Journey Flow

```mermaid
flowchart TD
    Start([User Visits App]) --> Auth{Authenticated?}
    Auth -->|No| Login[Login Page]
    Auth -->|Yes| RoleCheck{User Role?}
    
    Login --> LoginForm[Enter Credentials]
    LoginForm --> LoginSubmit{Valid?}
    LoginSubmit -->|No| LoginError[Show Error]
    LoginError --> LoginForm
    LoginSubmit -->|Yes| RoleCheck
    
    RoleCheck -->|Member| MemberDash[Member Dashboard]
    RoleCheck -->|Admin| AdminDash[Admin Dashboard]
    
    %% Member Flow
    MemberDash --> MemberActions{Choose Action}
    MemberActions -->|Browse Events| EventList[Events Page]
    MemberActions -->|My Tickets| MyTickets[My Tickets Page]
    
    EventList --> SelectEvent[Select Event]
    SelectEvent --> BookModal[Booking Modal]
    BookModal --> EnterAmount[Enter Ticket Amount]
    EnterAmount --> ConfirmBook{Confirm Booking?}
    ConfirmBook -->|No| EventList
    ConfirmBook -->|Yes| CreateTicket[Create Ticket]
    CreateTicket --> MyTickets
    
    MyTickets --> TicketActions{Choose Action}
    TicketActions -->|View QR| ShowQR[Display QR Code Modal]
    TicketActions -->|Edit| EditModal[Edit Ticket Amount]
    TicketActions -->|Cancel| DeleteConfirm{Confirm Delete?}
    
    ShowQR --> CloseQR[Close Modal]
    CloseQR --> MyTickets
    
    EditModal --> UpdateTicket[Update Amount]
    UpdateTicket --> MyTickets
    
    DeleteConfirm -->|Yes| DeleteTicket[Delete Ticket]
    DeleteConfirm -->|No| MyTickets
    DeleteTicket --> MyTickets
    
    %% Admin Flow
    AdminDash --> AdminActions{Choose Action}
    AdminActions -->|Manage Events| EventMgmt[Events Management]
    AdminActions -->|Manage Tickets| TicketMgmt[Ticketing Management]
    AdminActions -->|Verify Tickets| Scanner[Ticket Verification]
    
    EventMgmt --> EventCRUD{Action}
    EventCRUD -->|Create| CreateEvent[Create Event Form]
    EventCRUD -->|Edit| EditEvent[Edit Event Form]
    EventCRUD -->|Delete| DeleteEvent[Delete Event]
    
    CreateEvent --> SaveEvent[Save Event]
    EditEvent --> SaveEvent
    SaveEvent --> EventMgmt
    DeleteEvent --> EventMgmt
    
    Scanner --> ScanMethod{Scan Method}
    ScanMethod -->|Upload Image| UploadQR[Upload QR Image]
    ScanMethod -->|Manual Entry| EnterID[Enter Ticket ID]
    
    UploadQR --> ProcessQR[Process QR Code]
    ProcessQR --> ExtractID[Extract Ticket ID]
    ExtractID --> VerifyTicket
    
    EnterID --> VerifyTicket[Verify Ticket]
    VerifyTicket --> TicketStatus{Ticket Status}
    
    TicketStatus -->|Valid & Unused| ShowDetails[Show Ticket Details]
    TicketStatus -->|Already Used| ShowUsedError[Show 'Already Used' Error]
    TicketStatus -->|Invalid| ShowInvalidError[Show 'Invalid Ticket' Error]
    
    ShowDetails --> RedeemAction{Redeem?}
    RedeemAction -->|Yes| MarkUsed[Mark Ticket as Used]
    RedeemAction -->|No| Scanner
    
    MarkUsed --> ShowSuccess[Show Success Message]
    ShowSuccess --> Scanner
    
    ShowUsedError --> Scanner
    ShowInvalidError --> Scanner
    
    style Start fill:#e1f5ff
    style MemberDash fill:#d4edda
    style AdminDash fill:#fff3cd
    style ShowQR fill:#cfe2ff
    style MarkUsed fill:#d1e7dd
    style ShowSuccess fill:#d1e7dd
    style ShowUsedError fill:#f8d7da
    style ShowInvalidError fill:#f8d7da
```

---

## 2. Member User Flow (Detailed)

```mermaid
flowchart LR
    subgraph Authentication
        A1[Login] --> A2[Dashboard]
    end
    
    subgraph "Browse & Book"
        B1[Events Page] --> B2[Select Event]
        B2 --> B3[Booking Modal]
        B3 --> B4[Enter Amount<br/>1-5 tickets]
        B4 --> B5[Confirm Booking]
        B5 --> B6[Ticket Created]
    end
    
    subgraph "Manage Tickets"
        C1[My Tickets Page] --> C2{Action}
        C2 -->|View QR| C3[QR Code Modal]
        C2 -->|Edit| C4[Edit Amount]
        C2 -->|Cancel| C5[Delete Ticket]
        
        C3 --> C6[Show at Entrance]
        C4 --> C1
        C5 --> C1
    end
    
    A2 --> B1
    B6 --> C1
    
    style A2 fill:#d4edda
    style B6 fill:#d1e7dd
    style C3 fill:#cfe2ff
```

---

## 3. Admin User Flow (Detailed)

```mermaid
flowchart LR
    subgraph Authentication
        A1[Admin Login] --> A2[Admin Dashboard]
    end
    
    subgraph "Event Management"
        E1[Events Page] --> E2{Action}
        E2 -->|Create| E3[New Event Form]
        E2 -->|Edit| E4[Edit Event Form]
        E2 -->|Delete| E5[Delete Event]
        
        E3 --> E6[Save Event]
        E4 --> E6
        E6 --> E1
        E5 --> E1
    end
    
    subgraph "Ticket Verification"
        V1[Scanner Page] --> V2{Scan Method}
        V2 -->|Upload Photo| V3[Upload QR Image]
        V2 -->|Manual| V4[Enter Ticket ID]
        
        V3 --> V5[Extract Ticket ID]
        V4 --> V5
        V5 --> V6[Fetch Ticket Data]
        
        V6 --> V7{Status Check}
        V7 -->|Valid| V8[Show Details]
        V7 -->|Used| V9[Show Error]
        V7 -->|Invalid| V9
        
        V8 --> V10[Redeem Ticket]
        V10 --> V11[Mark as Used]
        V11 --> V1
        V9 --> V1
    end
    
    A2 --> E1
    A2 --> V1
    
    style A2 fill:#fff3cd
    style V11 fill:#d1e7dd
    style V9 fill:#f8d7da
```

---

## 4. System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend - Next.js"
        UI[User Interface]
        Auth[Auth Context]
        API[API Client]
        
        subgraph "Member Pages"
            MD[Dashboard]
            ME[Events]
            MT[My Tickets]
        end
        
        subgraph "Admin Pages"
            AD[Dashboard]
            AE[Events Mgmt]
            AT[Ticketing Mgmt]
            AS[Scanner]
        end
    end
    
    subgraph "Backend - Express.js"
        Routes[API Routes]
        Controllers[Controllers]
        Middleware[Auth Middleware]
        
        subgraph "Controllers"
            AuthC[Auth Controller]
            EventC[Event Controller]
            TicketC[Ticketing Controller]
        end
    end
    
    subgraph "Database - MongoDB"
        UserDB[(Users)]
        EventDB[(Events)]
        TicketDB[(Ticketing)]
    end
    
    UI --> Auth
    Auth --> API
    API --> Routes
    
    MD --> API
    ME --> API
    MT --> API
    AD --> API
    AE --> API
    AT --> API
    AS --> API
    
    Routes --> Middleware
    Middleware --> Controllers
    
    AuthC --> UserDB
    EventC --> EventDB
    TicketC --> TicketDB
    TicketC --> EventDB
    TicketC --> UserDB
    
    style UI fill:#e1f5ff
    style Routes fill:#fff3cd
    style UserDB fill:#d4edda
    style EventDB fill:#d4edda
    style TicketDB fill:#d4edda
```

---

## 5. QR Code Workflow

```mermaid
sequenceDiagram
    participant M as Member
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant A as Admin
    
    Note over M,F: Ticket Generation
    M->>F: Book Event Ticket
    F->>B: POST /api/v1/ticketing
    B->>DB: Create Ticket Record
    DB-->>B: Return Ticket ID
    B-->>F: Ticket Created
    F-->>M: Show Success
    
    Note over M,F: QR Code Display
    M->>F: Click "View QR"
    F->>F: Generate QR Code<br/>(Client-side with ticket ID)
    F-->>M: Display QR Code Modal
    
    Note over A,DB: Ticket Verification
    A->>F: Upload QR Image
    F->>F: Extract Ticket ID from QR
    F->>B: GET /api/v1/ticketing/:id
    B->>DB: Fetch Ticket Details
    DB-->>B: Return Ticket Data
    B-->>F: Ticket Details
    F-->>A: Show Ticket Info
    
    Note over A,DB: Ticket Redemption
    A->>F: Click "Confirm & Redeem"
    F->>B: POST /api/v1/ticketing/:id/redeem
    B->>DB: Update isUsed = true
    DB-->>B: Ticket Updated
    B-->>F: Success
    F-->>A: Show Success Message
```

---

## 6. Data Flow Diagram

```mermaid
flowchart TD
    subgraph "User Actions"
        U1[Member Books Ticket]
        U2[Member Views QR]
        U3[Admin Scans QR]
        U4[Admin Redeems Ticket]
    end
    
    subgraph "Frontend Processing"
        F1[Booking Form]
        F2[QR Generator]
        F3[QR Scanner]
        F4[Verification UI]
    end
    
    subgraph "API Layer"
        A1[POST /ticketing]
        A2[GET /ticketing]
        A3[GET /ticketing/:id]
        A4[POST /ticketing/:id/redeem]
    end
    
    subgraph "Database"
        D1[(Ticketing Collection)]
        D2[(Events Collection)]
        D3[(Users Collection)]
    end
    
    U1 --> F1
    F1 --> A1
    A1 --> D1
    A1 --> D2
    A1 --> D3
    
    U2 --> F2
    F2 -.->|Uses Ticket ID| D1
    
    U3 --> F3
    F3 --> A3
    A3 --> D1
    
    U4 --> F4
    F4 --> A4
    A4 --> D1
    
    style U1 fill:#cfe2ff
    style U2 fill:#cfe2ff
    style U3 fill:#fff3cd
    style U4 fill:#fff3cd
    style D1 fill:#d4edda
    style D2 fill:#d4edda
    style D3 fill:#d4edda
```

---

## 7. Key Features Summary

### **Member Features:**
1. ✅ Browse available events
2. ✅ Book tickets (1-5 per event)
3. ✅ View QR codes for tickets
4. ✅ Edit ticket amounts
5. ✅ Cancel bookings
6. ✅ See ticket status (Active/Used)

### **Admin Features:**
1. ✅ Manage events (Create/Edit/Delete)
2. ✅ View all ticketing records
3. ✅ Scan QR codes (via image upload)
4. ✅ Manual ticket ID verification
5. ✅ Redeem tickets
6. ✅ Prevent duplicate redemptions

### **Security Features:**
1. ✅ JWT-based authentication
2. ✅ Role-based access control (Member/Admin)
3. ✅ Protected API routes
4. ✅ Ticket validation before redemption

---

## 8. Page Structure

```mermaid
graph TB
    subgraph Public["Public Routes"]
        Login["Login Page<br/>/login"]
        Register["Register Page<br/>/register"]
    end
    
    subgraph Member["Member Routes (Protected)"]
        MDash["Member Dashboard<br/>/member/dashboard"]
        MEvents["Browse Events<br/>/member/events"]
        MTickets["My Tickets<br/>/member/my-tickets"]
    end
    
    subgraph Admin["Admin Routes (Protected)"]
        ADash["Admin Dashboard<br/>/admin/dashboard"]
        AEvents["Events Management<br/>/admin/events"]
        ATickets["Ticketing Management<br/>/admin/ticketing"]
        AScanner["Ticket Verification<br/>/admin/scanner"]
    end
    
    Login -->|Member Login| MDash
    Login -->|Admin Login| ADash
    
    MDash --> MEvents
    MDash --> MTickets
    
    ADash --> AEvents
    ADash --> ATickets
    ADash --> AScanner
    
    style Login fill:#e1f5ff
    style MDash fill:#d4edda
    style ADash fill:#fff3cd
```

---

## Usage Notes

- **QR Codes**: Generated client-side, contain ticket ID + metadata
- **Image Upload**: Uses `jsQR` library to decode QR codes from photos
- **No Image Storage**: QR images are processed in-browser, not saved to database
- **Ticket Status**: Tracked via `isUsed` boolean field in database
- **Real-time Updates**: Dashboard shows live ticket counts and activity

---

*Generated: 2025-11-19*
