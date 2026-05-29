# MPloyChek - Role-Based User Management & Background Verification Platform

MPloyChek is an enterprise-grade, production-ready Single Page Application (SPA) designed to simulate a digital background verification platform. It features secure authentication, role-based access controls (RBAC), and simulated asynchronous data flows.

---

## 🚀 Tech Stack

### Frontend
- **Angular 16+** (Modular architecture, lazy-loaded components)
- **TypeScript** & **RxJS** (Reactive states via `BehaviorSubject`)
- **Angular Material** (Corporate look and feel, responsive layout)
- **HTML5 & Vanilla CSS Variables** (Unified Light/Dark mode structure)

### Backend
- **Node.js** & **Express** with **TypeScript**
- **Simulated Latency Middleware** (Configurable delay: 1s, 3s, 5s)
- **Local JSON Mock Database** (`db.json` reads/writes user and log records)

---

## 🛠️ Key Features

1. **Secure Login Portal**
   - Form validations, role mismatch detection, password visibility toggle.
   - Saves mock JWT bearer token to `localStorage`.

2. **Role-Based Access Control (RBAC)**
   - **General User**: Can view only their personal verification records. Search and filter records, check processing time. Locked out of admin features.
   - **System Admin**: Can view all verification records. Full CRUD panel to add, edit, or delete users and change roles. Live view of total database audit logs.

3. **Inactivity Session Expiry Timer**
   - Monitors user interaction (mousemove, click, keystrokes) outside the Angular zone for performance.
   - Triggers an overlay warning warning after 4 minutes of inactivity. Auto-logs out and redirects to login at 5 minutes if left idle.

4. **Configurable Asynchronous Latency Simulator**
   - Choose latency values (1s, 3s, 5s) in the top nav-bar.
   - Integrates skeleton screens, spinner overlays, progress bars, and status logs to showcase async loading.

5. **Advanced Filters & Sorting**
   - Angular Material data table with real-time sorting, pagination, and multi-field custom predicate filter (search by ID, Type, Status).

6. **Unified Dark / Light Theme Toggle**
   - Seamless transition based on CSS custom properties, persisted in `localStorage`.

7. **System Audit Logs (Admin Only)**
   - Real-time logging of user actions (logins, creations, updates, deletions) directly into the mock DB.

---

## 🗂️ Folder Structure

```text
c:\Users\acer\Desktop\NSQ\
├── README.md
├── frontend/                     # Angular Client App
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/             # Base services, guards, interceptors, models
│   │   │   │   ├── guards/       # authGuard, roleGuard
│   │   │   │   ├── interceptors/ # authInterceptor (attaches token + latency)
│   │   │   │   ├── models/       # user, record, audit log schemas
│   │   │   │   └── services/     # api, auth, user, record state services
│   │   │   ├── modules/          # Lazy-loaded feature domains
│   │   │   │   ├── auth/         # Login components and routes
│   │   │   │   ├── dashboard/    # General user dashboard, profile cards, tables
│   │   │   │   └── admin/        # Admin CRUD control panels, audit lists
│   │   │   ├── shared/           # Common spinners and skeleton templates
│   │   │   ├── app.module.ts     # Main module
│   │   │   └── app-routing.module.ts
│   │   └── styles.css            # Light/Dark variables & Material overrides
└── backend/                      # Express API App
    ├── src/
    │   ├── data/                 # db.json database file
    │   ├── middleware/           # latency, logger, error, auth checks
    │   ├── controllers/          # routes controllers (auth, user, record)
    │   ├── routes/               # Express endpoints router
    │   ├── services/             # Reads/writes database service
    │   └── app.ts                # Application entrypoint
    ├── tsconfig.json
    └── package.json
```

---

## 🔑 Demo Access Credentials

| User ID | Password | Role | Description |
|:---|:---|:---|:---|
| **admin** | `admin123` | **Admin** | Full system rights, CRUD actions, Audit Logs |
| **user1** | `user123` | **General User** | Personal verification checks only |
| **user2** | `user123` | **General User** | Personal verification checks only |

---

## ⚙️ Setup and Run Instructions

Make sure you have [Node.js (v16+)](https://nodejs.org/) installed.

### 1. Launch the Backend API
In a new terminal window, navigate to the `backend` folder:
```bash
cd backend
npm install
npm run dev
```
The Express server boots at `http://localhost:3000`.

### 2. Launch the Angular Frontend
In a separate terminal window, navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run start
```
Open your browser at `http://localhost:4200` to interact with the platform.

---

## 💡 Architecture & Security Highlights

- **RxJS BehaviorSubjects**: Manages localized reactive states (such as active loading queues and current user session info) avoiding bloated component calls.
- **Lazy Loading**: Speeds up initial client loads by splitting auth, dashboard, and admin segments into self-contained code bundles fetched only on demand.
- **Request Latency Headers**: Selecting latency settings from the header appends a custom header `X-Simulate-Latency` to outgoing HTTP requests, which is intercepted by the Node.js middleware to simulate slow network queries cleanly.
- **HostListener Events**: Centralized user action listener updates a `lastActivity` session timestamp, reducing change detection overhead by running countdown checks outside Angular's zone.
