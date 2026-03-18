# AI Clinic Pro - Full Stack Healthcare Management System

A modern, full-stack clinic management platform with role-based dashboards (Admin, Doctor, Receptionist, Patient), AI-powered assistant, appointment management, prescription handling, analytics, and secure authentication.

**Live Demo:** https://hackathon2026-tr98.vercel.app/
**Backend API:** https://hackathon-server-4c7a.onrender.com

---

## 📋 Project Overview

AI Clinic Pro is a comprehensive healthcare management system designed to streamline clinic operations. It provides separate dashboards for different user roles with intuitive workflows for managing patients, appointments, prescriptions, and health analytics.

**Key Features:**
- Multi-role authentication and role-based access control
- Real-time appointment scheduling and management
- Digital prescription generation and tracking
- Patient health records and timeline views
- AI-powered medical assistant chat
- Admin analytics and reporting
- Responsive design with dark/light theme support
- Secure OTP-based password reset flow

---

## 🏗️ Architecture Overview

This project is split into **two separate repositories**:

### Frontend Repository
- React + Vite SPA
- Deployed on Vercel/Netlify
- Handles all UI/UX interactions

### Backend Repository (API Server)
- Node.js + Express.js REST API
- MongoDB database
- Deployed on Render: https://hackathon-server-4c7a.onrender.com

---

# 🎨 FRONTEND - React Application

## Frontend Overview

Repository Location: `/frontend`  
Framework: React 18 + Vite  
Styling: Tailwind CSS v4  
State Management: React Context API  
Routing: React Router v6  

### Frontend Features by Page

#### 🏠 Landing Page
- Hero section with call-to-action
- Features showcase section
- Testimonials carousel
- Pricing 3-tier cards
- Support/FAQ section
- Floating AI Medical Assistant chat widget
- Dark/light theme toggle button
- Responsive mobile-first design

**AI Chat Widget Features:**
- Quick question suggestions
- Login required to use
- Real-time AI responses
- Medical disclaimer messages
- Smooth animations

#### 🔐 Authentication System
**Login Page**
- Email/password login
- Password visibility toggle
- Remember me checkbox
- Forgot password link
- Dark/light theme toggle
- Form validation & error messages

**Register Page**
- Name, email, password inputs
- Role selection (Patient/Doctor/Receptionist/Admin)
- Password confirmation
- Terms checkbox
- Auto-login after successful registration
- Dark/light theme toggle

**Forgot Password Page**
- Email input for OTP request
- Demo mode: OTP prints to backend console
- Success/error message display
- Dark/light theme toggle

**Reset Password Page**
- 6-digit OTP input field
- New password + confirm password
- Input validation
- Auto-redirect to login on success
- Dark/light theme toggle

#### 👥 Admin Dashboard
- User management (list, block, delete)
- Platform analytics with charts
- Activity monitoring & timeline
- User role distribution
- System statistics
- Real-time updates

#### 👨‍⚕️ Doctor Dashboard
- Patient list & search
- Appointment scheduler
- Prescription creation & PDF
- AI diagnosis assistant
- Health metrics charts
- Medical notes management

#### 🏥 Patient Dashboard
- Health timeline (chronological medical history)
- Appointment booking & management
- Prescription viewing & download
- Medical records access
- Health score tracking
- AI health advisor chatbot

#### 📞 Receptionist Dashboard
- Appointment calendar (day/week/month view)
- Patient check-in/check-out
- Schedule reports
- Doctor availability
- Queue management

#### 👤 Profile Page
- Personal information editor
- Specialization (for doctors)
- Password change
- Account settings
- Dark/light theme toggle

### Frontend Directory Structure

```
frontend/
├── src/
│   ├── pages/          # All page components
│   ├── components/     # Reusable UI components
│   ├── context/        # Auth & Theme context
│   ├── api/           # Axios API/configuration
│   ├── layouts/       # Layout wrappers
│   ├── auth/          # Protected routes
│   ├── App.jsx
│   ├── index.css      # Global styles + dark mode
│   └── main.jsx       # Entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

### Frontend Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Fast build tool |
| Tailwind CSS v4 | Styling |
| React Router v6 | Routing |
| Lucide React | Icons |
| Recharts | Charts |
| Axios | HTTP client |
| js-cookie | Cookie storage |

### Frontend Setup

```bash
cd frontend
npm install
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Production build
npm run lint     # Lint code
```

### Frontend API Integration

All requests go to: `https://hackathon-server-4c7a.onrender.com/api`

Key endpoints:
- POST /auth/register - User registration
- POST /auth/login - User login
- POST /auth/forgot-password - OTP request
- POST /auth/reset-password - Password reset
- GET /appointments - List appointments
- POST /prescriptions - Create prescription
- GET /analytics - Dashboard data
- POST /ai/ask - AI assistant

### Frontend Security

- JWT-based authentication
- Protected route components
- Role-based access control
- Input validation on all forms
- Automatic logout on token expiry
- CORS-enabled API requests

### Frontend Dark/Light Theme

- Global ThemeContext for state
- localStorage persistence
- Class-based Tailwind dark mode
- Theme toggle on all pages
- Smooth color transitions
- All components fully themed

---

# 🔧 BACKEND - Node.js Express API

## Backend Overview

API URL: https://hackathon-server-4c7a.onrender.com  
Framework: Express.js  
Database: MongoDB  
Authentication: JWT  
Email Service: Nodemailer (Gmail SMTP + Demo Mode)  

### Backend Features

#### 🔐 Authentication Module
**POST /auth/register** - Create new user account  
**POST /auth/login** - Login & get JWT token  
**POST /auth/forgot-password** - Request OTP for password reset  
**POST /auth/reset-password** - Reset password with OTP  
**GET /auth/profile** - Get authenticated user profile  
**PUT /auth/profile** - Update user profile  
**GET /auth/doctors** - List all active doctors  

#### 📅 Appointment Management
**POST /appointments** - Create appointment  
**GET /appointments** - Get user's appointments  
**PUT /appointments/:id** - Update appointment status  
**DELETE /appointments/:id** - Cancel appointment  

#### 💊 Prescription Management
**POST /prescriptions** - Create digital prescription  
**GET /prescriptions** - List prescriptions  
**GET /prescriptions/:id/pdf** - Download PDF  

#### 👥 Patient Management
**GET /patients** - List patients  
**GET /patients/:id** - Get patient details  
**PUT /patients/:id** - Update patient info  

#### 🤖 AI Assistant
**POST /ai/ask** - Get AI response to question  

#### 📊 Analytics
**GET /analytics** - Get dashboard analytics data  

### Backend Authentication

- JWT tokens generated on login/register
- Tokens expire in 30 days
- Sent in Authorization header on every request
- Verified by middleware on protected routes
- Passwords hashed with bcrypt

### Backend Password Reset (OTP Flow)

1. User provides email on "Forgot Password"
2. Backend generates 6-digit OTP
3. **Demo Mode (if EMAIL not configured):**
   - OTP logged to backend console
   - Frontend shows "Check backend console"
4. **Production (if EMAIL configured):**
   - OTP emailed to user
   - Log: "📧 [DEMO MODE] OTP Code: 462849"
5. User enters OTP → Backend validates
6. User sets new password → Password updated
7. OTP cleared from database

### Backend Directory Structure

```
backend/
├── src/
│   ├── config/        # Database config
│   ├── models/        # MongoDB schemas
│   ├── controllers/   # Business logic
│   ├── routes/        # API endpoints
│   ├── middlewares/   # JWT, error handling
│   ├── utils/         # Email, PDF, AI
│   └── server.js      # Express setup
├── uploads/           # PDF storage
├── .env              # Environment variables
└── package.json
```

Authentication & Security Features:
- JWT-based auth
- Password hashing (bcrypt)
- Role-based access control
- OTP expiration (10 minutes)
- Protected API routes
- CORS configuration
- Input validation

### Backend Tech Stack

| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongoose | MongoDB ODM |
| jsonwebtoken | JWT auth |
| bcryptjs | Password hashing |
| nodemailer | Email sending |
| dotenv | Environment vars |
| cors | CORS handling |
| multer | File uploads |
| jspdf | PDF generation |

### Backend Setup

```bash
cd backend
npm install

# Create .env file with:
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/clinic
JWT_SECRET=your-secret-key
PORT=5000
EMAIL_USER=your-gmail@gmail.com      # Optional
EMAIL_PASS=app-password-16-chars     # Optional
NODE_ENV=development

npm start      # Run server on port 5000
```

### MongoDB Setup

**Cloud (MongoDB Atlas):**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Add to .env as MONGODB_URI

**Local Installation:**
```bash
# Windows: Download from mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Linux: apt-get install mongodb
```

### Gmail SMTP Setup (for OTP emails)

Optional - Demo mode works without email!

1. Enable 2-Step Verification on Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Select Mail + your device
4. Copy 16-character password
5. Add to .env as EMAIL_PASS

---

## 📱 Role-Based Features Summary

### Admin Features
- View all users
- Block/unblock users
- Delete user accounts
- Platform analytics
- Activity monitoring
- User role distribution
- System statistics

### Doctor Features
- View assigned patients
- Schedule appointments
- Create & send prescriptions
- AI diagnosis assistant
- Patient health metrics
- Medical notes
- Prescription PDF generation

### Patient Features
- Book appointments
- View appointments
- Medical timeline
- Download prescriptions
- Medical records
- Health tracking
- AI health advisor

### Receptionist Features
- Appointment calendar
- Patient check-in/check-out
- Schedule reports
- Doctor availability
- Queue management
- Patient quick search

### All Roles
- Secure login/registration
- OTP password reset
- Profile management
- Dark/light theme
- Role-based dashboard

---

## 🚀 Deployment Status

**Frontend:** Ready for Vercel/Netlify deployment  
**Backend:** Live on Render at https://hackathon-server-4c7a.onrender.com  

---

## 🧪 Test Accounts (if seeded)

```
Admin:
email: admin@clinic.com
password: password

Doctor:
email: doctor@clinic.com
password: password

Patient:
email: patient@clinic.com
password: password

Receptionist:
email: receptionist@clinic.com
password: password
```

---

## 📝 Project Statistics

| Metric | Count |
|--------|-------|
| Frontend Dashboards | 5 (Landing, Admin, Doctor, Patient, Receptionist) |
| Auth Pages | 6 (Login, Register, Forgot, Reset, Profile, Landing) |
| API Endpoints | 30+ |
| Database Models | 5 |
| User Roles | 4 |
| Dark Mode Support | Yes - All pages |
| Mobile Responsive | Yes |
| Components | 50+ |
| Lines of Code | 3000+ |

---

## 🎯 Key Technologies

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router
- Lucide Icons
- Recharts

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT
- Nodemailer
- bcryptjs

---

## 💡 Demo Mode Highlights

**No Email Configuration Needed:**
- Start development without email setup
- OTP prints to backend console
- Full functionality available
- Test entire password reset flow

**Switch to Production:**
- Add EMAIL_USER and EMAIL_PASS to .env
- Restart backend
- OTP automatically emails to users
- No code changes needed

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- OTP expiration (10 minutes)
- Automatic logout
- CORS configuration
- Input validation
- Error handling
- Environment variable protection

---

## 📋 For Video Posts & Resume

### Video Description
Excited to share **AI Clinic Pro** — a full-stack healthcare platform with secure authentication, appointment management, prescription generation, AI assistant, and role-based dashboards built with React, Node.js, Express, and MongoDB.

### WhatsApp Message
Hi! Just completed **AI Clinic Pro** - a full-stack clinic management system with Admin/Doctor/Receptionist/Patient dashboards, appointment & prescription management, AI assistant chat, OTP password reset, and dark/light theme. Check it out!

### Resume Bullet
Developed **AI Clinic Pro**, a full-stack healthcare management platform with role-based dashboards for Admin, Doctor, Patient, and Receptionist; implemented secure JWT authentication with OTP password reset; built appointment/prescription modules; integrated AI assistant; and deployed frontend on Vercel and backend on Render using React, Node.js, Express, and MongoDB.

---

## 📞 Support

Backend API: https://hackathon-server-4c7a.onrender.com  
GitHub: [Your repository]  
Status: Production Ready
