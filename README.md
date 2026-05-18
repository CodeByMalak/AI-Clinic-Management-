# 🏥 MediFlow AI | Intelligent Clinic Management & Diagnosis SaaS

Welcome to the **MediFlow AI** repository. This is a premium, full-stack MERN application that implements a secure, scalable role-based authentication system alongside an interactive clinic portal featuring an **AI-Assisted Symptom Diagnostics Engine** and a **Live Patient Queue Manager**.

---

## 🚀 Key Features

*   **Secure Cryptography**: Password hashing using `bcryptjs` with salt round factors and secure Mongoose model-level pre-save hooks.
*   **Signed JWT Tokens**: JSON Web Token authorization using `jsonwebtoken`. Subsystems automatically store, refresh, and apply Bearer tokens.
*   **Dynamic Role-Based Access Control (RBAC)**: Custom routing guards restricting partitions of the system. Ineligibility triggers a sleek, premium **Access Restrained** page.
*   **Multi-Role Dashboards**:
    1.  **Admin Portal**: Telemetry metrics, database security logging, and decryption audit logs.
    2.  **Doctor AI Hub**: An **Interactive AI Diagnostician** simulator that ingests patient symptoms, runs progressive neural simulation timelines, and generates a structured medical assessment.
    3.  **Receptionist Intake**: A live intake check-in feed. Staff can insert arrived patients and promote their check-in status (Waiting ➔ Triaged ➔ With Doctor).
    4.  **Patient Record**: View biometric history, automated assessments, and active medicines inside a digital cabinet.
*   **Premium Visual Experience**: Crafted with a premium dark clinical aesthetic using Custom HSL color spaces, Glassmorphism base styling, dynamic CSS glows, and Lucide React iconography.

---

## 📂 Project Architecture

```
Hekathon/
├── package.json                   # Root package manager (Concurrently configurations)
├── README.md                      # Platform documentation & Walkthrough
├── backend/
│   ├── .env                       # Environment credentials (JWT, MongoDB)
│   ├── server.js                  # Express API server entry point
│   ├── seedUsers.js               # Automatic database seeder for test accounts
│   ├── package.json               # Backend dependencies
│   ├── config/
│   │   └── db.js                  # Mongoose database connection
│   ├── controllers/
│   │   └── authController.js      # Controller logic (Login, Register, Profile)
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT & Role authorization gates
│   ├── models/
│   │   └── userModel.js           # User Schema with custom encryption hooks
│   └── routes/
│       └── authRoutes.js          # Authentication endpoint mapping
└── frontend/
    ├── index.html                 # App container with custom Typography & SEO metas
    ├── package.json               # Frontend dependencies
    ├── vite.config.js             # Vite configuration with Dev Proxy mapping
    ├── tailwind.config.js         # Tailwind configuration (clinical palettes & glows)
    ├── postcss.config.js          # PostCSS configuration
    └── src/
        ├── main.jsx               # React app renderer
        ├── index.css              # Global custom CSS overlays, scrollbars, and keyframes
        ├── App.jsx                # SPA Client Router & Route Guard mapping
        ├── components/
        │   └── ProtectedRoute.jsx # Authentication & Role Verification boundary
        ├── context/
        │   └── AuthContext.jsx    # React Context wrapping API calls & token syncing
        └── pages/
            ├── Login.jsx          # Login screen with Demo Quick-Logins
            ├── Register.jsx       # Dynamic registration with conditional fields
            └── Dashboard.jsx      # Multi-Role Dashboard & AI simulator
```

---

## 🛠️ Step-by-Step Installation & Running Guide

Ensure you have **Node.js** and **MongoDB** installed and running on your local machine.

### 1. Install Dependencies
Initialize and download dependencies for both backend and frontend layers using the root convenience script:
```bash
npm run install-all
```

### 2. Populate Test Accounts (Database Seeding)
To test role-based dashboards immediately without manually registering four separate accounts, run our database seeder:
```bash
cd backend
npm run seed
```
This will seed the database with the following demo credentials:

| Dashboard Portal | Email Address | Access Keycode | Unique Attributes |
| :--- | :--- | :--- | :--- |
| **Admin Director** | `admin@mediflow.ai` | `admin123` | Master security dashboard, system audit logs |
| **Doctor Faculty** | `doctor@mediflow.ai` | `doctor123` | **AI Symptom Diagnostician Engine simulator** |
| **Receptionist** | `receptionist@mediflow.ai` | `receptionist123` | **Live Intake & Patient Queuing Manager** |
| **Patient Record** | `patient@mediflow.ai` | `patient123` | Biometric stats & digital pharmacy cabinets |

### 3. Launch Development Servers
Return to the workspace root and boot up both backend (port `5000`) and frontend (port `5173`) servers concurrently:
```bash
cd ..
npm run dev
```

Open your browser and navigate to **`http://localhost:5173`** to access **MediFlow AI**!

---

## 🛡️ API Endpoints Reference

All backend endpoints are prefixed with `/api`.

| HTTP Verb | Path | Auth Requirement | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | **Public** | Validates details and creates new user nodes (auto-hashes password). |
| `POST` | `/auth/login` | **Public** | Validates email/password credentials and issues a signed JWT. |
| `GET` | `/auth/me` | **Private (JWT)** | Retrieves profile information for the authorized session token. |
| `GET` | `/health` | **Public** | Diagnostic ping checking system telemetry. |
