# ✨ ResuMate — AI-Powered Full-Stack Resume Builder Platform

ResuMate is a production-ready, AI-powered resume generation platform designed to simplify professional resume creation through an intuitive and responsive user experience. Built using modern full-stack technologies, the platform enables users to generate polished, ATS-friendly resumes with dynamic customization, real-time preview, AI bullet point improvement, ATS scoring, PDF/PNG export, and public sharing — all in one place.

---

## 🚀 Live Demo

> **Frontend:** [https://resumate-eight-chi.vercel.app](https://resumate-eight-chi.vercel.app)
> **Backend API:** [https://resumate-jet-rho.vercel.app](https://resumate-jet-rho.vercel.app)

---

## ✅ Features

### 📄 Resume Management
- Create, edit, duplicate, and delete resumes
- Step-by-step guided form with section-by-section navigation
- Real-time live preview as you type
- Auto-save with 2.5s debounce — never lose progress
- Resume completion percentage tracker
- Ctrl+S keyboard shortcut to save instantly

### 🎨 Templates (7 Total)
| Template | Style |
|---|---|
| Template 01 | Classic Two-Column |
| Template 02 | Modern Minimal |
| Template 03 | Professional Sidebar |
| Template 04 | Ultra Minimal Clean |
| Template 05 | Dark Sidebar |
| Template 06 | Creative Colorful Header |
| Template 07 | Executive Classic |

### 🤖 AI Features (Google Gemini 2.5 Flash)
- **✨ Improve with AI** — rewrites work experience bullet points to be ATS-friendly and impactful
- **ATS Score Checker** — analyzes your resume and gives a score out of 100 with section-by-section breakdown, top issues, strengths, and keyword suggestions

### 📤 Export & Share
- **PDF Download** — high-quality A4 PDF export via html2pdf.js
- **PNG Download** — export resume as a PNG image via html2canvas
- **Print** — browser-native print with A4 formatting
- **Public Share Link** — generate a read-only public URL to share with recruiters
- **Revoke Share Link** — disable the public link anytime

### 🧠 Smart Dashboard
- Skeleton loaders while fetching data
- Stats bar — Total Resumes · Avg Completion · Last Edited
- Search resumes by title
- Filter by completion (≥80% / <80%)
- Duplicate resume with one click
- Resume thumbnail preview on cards

### 🔐 Auth & Security
- JWT-based authentication
- Protected routes — unauthorized users redirected to landing page
- Secure token storage in localStorage
- Password hashing with bcryptjs

### 🎓 UX Enhancements
- First-login onboarding tutorial (3-step modal)
- Completion Tips Drawer — floating button with real-time improvement suggestions
- Form validation on Profile, Contact, Education, Skills, and Work Experience steps
- Toast notifications on all user actions
- Fully responsive — mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React.js | UI framework |
| Tailwind CSS v4 | Styling (fully inline, no external style files) |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| html2pdf.js | PDF export |
| html2canvas | PNG export + thumbnail generation |
| react-hot-toast | Toast notifications |
| dayjs | Date formatting |
| lucide-react | Icons |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Multer | File uploads |
| @google/generative-ai | Gemini AI integration |
| dotenv | Environment config |

---

## 🏗️ Project Structure

```bash
resumate/
├── frontend/
│   └── src/
│       ├── assets/              # Resume thumbnail images
│       ├── components/          # Reusable UI components
│       │   ├── Cards.jsx
│       │   ├── CompletionTipsDrawer.jsx
│       │   ├── EditResume.jsx
│       │   ├── Forms.jsx
│       │   ├── Input.jsx
│       │   ├── Modal.jsx
│       │   ├── Navbar.jsx
│       │   ├── OnboardingModal.jsx
│       │   ├── Progress.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── RenderResume.jsx
│       │   ├── ResumeSection.jsx
│       │   ├── StepProgress.jsx
│       │   ├── Tabs.jsx
│       │   ├── TemplateOne.jsx
│       │   ├── TemplateTwo.jsx
│       │   ├── TemplateThree.jsx
│       │   ├── TemplateFour.jsx
│       │   ├── TemplateFive.jsx
│       │   ├── TemplateSix.jsx
│       │   ├── TemplateSeven.jsx
│       │   └── ThemeSelector.jsx
│       ├── context/
│       │   └── UserContext.jsx  # Global auth state
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── LandingPage.jsx
│       │   └── PublicResume.jsx
│       └── utils/
│           ├── apiPaths.js      # All API endpoint constants
│           ├── axiosInstance.js # Axios with auth interceptor
│           ├── color.js         # oklch color fix utility
│           ├── data.js          # Template data + dummy resume
│           ├── helper.js        # Date formatting, PDF capture
│           └── uploadImage.js   # Image upload utility
│
└── backend/
    ├── config/
    │   └── db.js                # MongoDB connection
    ├── controllers/
    │   ├── aiController.js      # Gemini AI — improve bullet + ATS score
    │   ├── resumeController.js  # Resume CRUD + duplicate + share
    │   ├── uploadImages.js      # Thumbnail + profile image upload
    │   └── userController.js    # Register, login, profile
    ├── middleware/
    │   ├── authMiddleware.js    # JWT protect middleware
    │   └── uploadMiddleware.js  # Multer config
    ├── models/
    │   ├── resumeModel.js       # Resume schema
    │   └── userModel.js         # User schema
    ├── routes/
    │   ├── aiRoutes.js          # /api/ai/*
    │   ├── resumeRoutes.js      # /api/resume/*
    │   └── userRoutes.js        # /api/auth/*
    ├── uploads/                 # Stored thumbnails + profile images
    └── server.js                # Express app entry point
```

---

## ⚙️ Environment Setup

### Backend `.env`
```env
# Database
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/resumate

# Auth
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini AI (free tier — no credit card needed)
# Get key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# URLs
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=4000
```

### Frontend `.env`
```env
VITE_API_BASE_URL=https://your-backend-url.vercel.app
```

---

## 📦 Installation & Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/resumate.git
cd resumate
```

### 2. Backend setup
```bash
cd backend
npm install
npm install @google/generative-ai   # AI feature dependency
cp .env.example .env                # Fill in your env values
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
http://localhost:5173
---

## 🔌 API Reference

### Auth — `/api/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| GET | `/profile` | Get user profile | ✅ |

### Resume — `/api/resume`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Create resume | ✅ |
| GET | `/` | Get all user resumes | ✅ |
| GET | `/:id` | Get resume by ID | ✅ |
| PUT | `/:id` | Update resume | ✅ |
| DELETE | `/:id` | Delete resume | ✅ |
| POST | `/:id/upload-images` | Upload thumbnail + profile image | ✅ |
| POST | `/:id/duplicate` | Duplicate resume | ✅ |
| POST | `/:id/share` | Generate public share link | ✅ |
| DELETE | `/:id/share` | Revoke public share link | ✅ |
| GET | `/view/:token` | Get public resume (no auth) | ❌ |

### AI — `/api/ai`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/improve-bullet` | AI rewrite work experience | ✅ |
| POST | `/ats-score` | Get ATS score + analysis | ✅ |

---

## 👨‍💻 Author

**Soumitra Sahoo**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/soumitrasahoo)

---

## 📄 License

This project is licensed under the MIT License.
