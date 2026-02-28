# 🏥 AI Clinic Management + Smart Diagnosis SaaS

> **A production-ready MERN clinic management system with AI-assisted diagnosis, role-based dashboards, appointment booking, prescription PDF generation, and comprehensive analytics.**

## 🎯 Overview

This is a **modern healthcare SaaS platform** designed to digitize clinic workflows for small & medium clinics. It features:

- ✅ **Role-Based Access Control** (Admin, Doctor, Receptionist, Patient)
- 🔐 **Secure JWT Authentication** with bcrypt password hashing
- 👨‍⚕️ **AI-Assisted Smart Symptom Checker** with graceful fallback
- 📋 **Appointment Management** (create, confirm, complete, cancel)
- 💊 **Prescription Management** with auto-generated PDF downloads
- 📊 **Medical History Timeline** (append-only audit trail)
- 📈 **Admin & Doctor Analytics Dashboard** (Chart.js visualizations)
- 🔄 **Offline-ready** - Full functionality even if AI API fails

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite, Tailwind CSS, Chart.js, Lucide Icons |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose (Atlas) |
| **Authentication** | JWT (stateless) + bcryptjs |
| **AI** | Google Gemini API (with timeout & fallback) |
| **PDF Generation** | PDFKit |
| **File Storage** | Local `/uploads` (extendable to Cloudinary/Supabase) |

---

## 📁 Project Structure

```
hackathon2026/
├── backend/
│   ├── src/
│   │   ├── config/db.js              # MongoDB connection
│   │   ├── controllers/              # Business logic
│   │   │   ├── authController.js
│   │   │   ├── patientController.js
│   │   │   ├── appointmentController.js
│   │   │   ├── prescriptionController.js
│   │   │   ├── aiController.js
│   │   │   └── analyticsController.js
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Patient.js
│   │   │   ├── Appointment.js
│   │   │   ├── Prescription.js
│   │   │   └── DiagnosisLog.js
│   │   ├── routes/                   # API endpoints
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js     # JWT + RBAC
│   │   └── utils/
│   │       ├── aiHelper.js           # Gemini integration
│   │       └── generatePDF.js        # Prescription PDFs
│   ├── uploads/prescriptions/        # Generated PDFs
│   ├── .env                          # Secrets (git-ignored)
│   ├── .env.example                  # Template
│   ├── package.json
│   └── server.js                     # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/axiosInstance.js      # HTTP client
│   │   ├── auth/ProtectedRoute.jsx   # Route guards
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx    # Analytics + user mgmt
│   │   │   ├── DoctorDashboard.jsx   # AI symptom checker
│   │   │   ├── PatientDashboard.jsx  # Medical timeline
│   │   │   └── ReceptionistDashboard.jsx  # Appointments
│   │   ├── components/               # Reusable UI
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
│
└── README.md (this file)
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm
- **MongoDB Atlas** account (free tier OK)
- **Google Gemini API key** (free tier available)
- **Git** for version control

### 1️⃣ Backend Setup

```bash
cd backend
npm install

# Copy environment template and fill in your secrets
cp .env.example .env
# Edit .env with:
# - MONGO_URI (MongoDB Atlas connection string)
# - JWT_SECRET (strong random string)
# - AI_API_KEY (Google Gemini key)

# Start development server with auto-reload
npm run dev

# Output: Server running on port 5000
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install

# Start development server (opens on http://localhost:5173)
npm run dev
```

### 3️⃣ Test the System

1. Visit **http://localhost:5173**
2. Register as a test user (any role)
3. Login with credentials
4. Explore role-specific dashboard

---

## 📚 API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /register` - Create new account
- `POST /login` - Get JWT token

### Patients (`/api/patients`)
- `POST /` - Create patient (Doctor/Receptionist/Admin)
- `GET /` - Get all patients
- `GET /me/timeline` - Get current patient's medical history

### Appointments (`/api/appointments`)
- `POST /` - Create appointment
- `GET /` - Get appointments (role-filtered)
- `PUT /:id` - Update status (pending → confirmed → completed)

### Prescriptions (`/api/prescriptions`)
- `POST /` - Create + auto-generate PDF
- `GET /` - Get prescriptions

### AI Diagnosis (`/api/ai`)
- `POST /diagnose` - Run symptom checker with AI
- `GET /logs` - Get diagnosis history

### Analytics (`/api/analytics`)
- `GET /` - Get KPIs (patients, appointments, revenue, etc.)

---

## 🎮 User Roles & Dashboards

| Role | Capabilities |
|------|--------------|
| **admin** | Analytics, user management, system overview |
| **doctor** | AI symptom checker, create prescriptions, see patients |
| **receptionist** | Manage appointments, register patients, schedule |
| **patient** | View own medical timeline, appointments, prescriptions |

---

## 🤖 AI Symptom Checker Features

1. **Smart Diagnosis**: Takes comma-separated symptoms
2. **Risk Stratification**: Returns Low/Moderate/High risk levels
3. **Suggested Tests**: Recommends lab work based on symptoms
4. **Graceful Fallback**: If Gemini API fails (timeout/error), system returns safe message and allows manual notes
5. **Audit Trail**: All diagnosis logged in `DiagnosisLogs` collection

**Example Input**: `fever, dry cough, shortness of breath, fatigue`

**Fallback Message** (if AI unavailable):
```
"AI Service is currently unavailable. Please proceed with manual diagnosis."
```

---

## 📊 Database Schema (Mongoose)

### Users
```javascript
{
  _id, name, email, passwordHash, 
  role: ["Admin"|"Doctor"|"Receptionist"|"Patient"],
  subscriptionPlan: ["Free"|"Basic"|"Pro"],
  createdAt, updatedAt
}
```

### Patients
```javascript
{
  _id, userId, name, age, gender, contact,
  createdBy: DoctorId, createdAt, updatedAt
}
```

### Appointments
```javascript
{
  _id, patientId, doctorId, date,
  status: ["pending"|"confirmed"|"completed"|"cancelled"],
  createdAt, updatedAt
}
```

### Prescriptions
```javascript
{
  _id, patientId, doctorId,
  medicines: [{name, dose}],
  instructions, pdfUrl, createdAt, updatedAt
}
```

### DiagnosisLogs
```javascript
{
  _id, patientId, doctorId, symptoms: [],
  aiResponse, riskLevel: ["Low"|"Moderate"|"High"],
  createdAt
}
```

---

## 🔒 Security Best Practices

✅ **Implemented**:
- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens (15min expiry recommended)
- Role-based middleware for protected routes
- Environment variables for secrets (never hardcode!)
- Mongoose schema validation

⚠️ **For Production**:
- Use HTTPS/TLS encryption
- Set CORS origins precisely
- Implement rate limiting
- Add request logging
- Use refresh token rotation
- Set secure cookies

---

## 🐛 Troubleshooting

### Backend fails to start
```bash
# Check MongoDB connection
# Verify MONGO_URI in .env has correct credentials
# Ensure PORT 5000 is not in use

# Try:
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### 404 on `/api/patients/me/timeline`
- ✅ **Fixed** in latest version - route order corrected
- Ensure you're authenticated (JWT token in header)

### AI Diagnosis returns "unavailable"
- Check `AI_API_KEY` in .env
- Gemini API rate limits? Wait 60 seconds
- Network timeout? Fallback engages after 8 seconds

### Prescription PDF not downloading
- Verify `/uploads/prescriptions/` directory exists
- Check file permissions
- Frontend URL in DB matches backend path

---

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
# Build for production
npm run build

# Preview
npm run preview

# Deploy to Vercel
vercel
```

### Backend (Render/Railway/Cyclic)
```bash
# Push to GitHub
git push origin main

# Connect repo to Render/Railway
# Set environment variables in dashboard
# Deploy
```

---

## 📝 Hackathon Submission Checklist

- [x] **Frontend + Backend deployed** (live URLs)
- [x] **Git repo with incremental commits** (no single-zip)
- [x] **3-7 min demo video** showing:
  - [x] Role-based login flows
  - [x] Patient appointment booking
  - [x] AI symptom checker with fallback
  - [x] Prescription PDF generation
  - [x] Admin analytics dashboard
  - [x] Medical history timeline
- [x] **README & documentation** ✓ (this file)
- [x] **Error handling throughout** ✓
- [x] **Offline-ready** ✓ (AI fallback)

---

## 📄 License

MIT License - Free to use and modify

---

## 👥 Team & Contact

Built for **Hackathon 2026** 🏆

For questions, issues, or contributions, please open a GitHub issue.

---

**Happy clinic managing!** 🚀💊
