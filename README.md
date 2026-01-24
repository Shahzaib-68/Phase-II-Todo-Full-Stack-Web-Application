# 🎯 Aura Task Management App

> A modern, full-stack task management application with real-time authentication and beautiful UI

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.13-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-15-black.svg)

## 📋 Overview

Aura Task is a production-ready todo application featuring secure authentication, real-time task management, and a stunning glassmorphic UI. Built with modern technologies and best practices.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with Better Auth
- ✅ **CRUD Operations** - Create, read, update, delete tasks
- 🎨 **Beautiful UI** - Glassmorphic design with Framer Motion animations
- 📊 **Task Statistics** - Track pending, completed, and total tasks
- 🏷️ **Priority Levels** - Low, Medium, High task priorities
- 📅 **Due Dates** - Set and track task deadlines
- 🌐 **Cloud Database** - PostgreSQL hosted on Neon
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLModel** - SQL databases with Python type hints
- **PostgreSQL** - Production database (Neon)
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Better Auth** - Authentication library
- **Sonner** - Beautiful toast notifications
- **Shadcn/ui** - High-quality UI components

## 📁 Project Structure

```
MY_TODO_APP_II/
├── backend/
│   ├── routes/
│   │   ├── auth.py          # Authentication endpoints
│   │   └── tasks.py         # Task CRUD endpoints
│   ├── models.py            # SQLModel database models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database connection
│   ├── config.py            # Environment configuration
│   ├── auth.py              # Auth utilities
│   ├── main.py              # FastAPI application
│   ├── clear_database.py    # Database utility script
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/   # Dashboard page
│   │   │   ├── auth/        # Auth pages (login/signup)
│   │   │   └── layout.tsx   # Root layout
│   │   ├── components/
│   │   │   ├── ui/          # Shadcn components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   └── NewTaskDialog.tsx
│   │   └── lib/
│   │       └── auth-client.ts
│   ├── .env.local           # Frontend environment variables
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.13+**
- **Node.js 18+** and npm/pnpm
- **PostgreSQL** (or use Neon cloud database)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd MY_TODO_APP_II
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

**Edit `backend/.env`:**

```env
# Database (Use Neon or local PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Authentication Secret (32+ characters)
BETTER_AUTH_SECRET=your-super-secret-key-minimum-32-chars

# API Configuration
BETTER_AUTH_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:3000
ENVIRONMENT=development
PORT=8000
```

**Initialize Database:**

```bash
# This will create all tables
python main.py
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
# or
pnpm install

# Create .env.local file
cp .env.example .env.local
```

**Edit `frontend/.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-super-secret-key-minimum-32-chars
BETTER_AUTH_URL=http://localhost:8000
```

### Running the Application

#### Start Backend Server

```bash
cd backend
python -m uvicorn main:app --reload
```

Backend will run on: **http://localhost:8000**

API Docs: **http://localhost:8000/docs**

#### Start Frontend Server

```bash
cd frontend
npm run dev
# or
pnpm dev
```

Frontend will run on: **http://localhost:3000**

## 📖 Usage

### 1. Create Account
- Navigate to `http://localhost:3000`
- Click "Sign Up"
- Enter email, password, and name
- Submit to create account

### 2. Login
- Use your credentials to login
- Session is stored securely in cookies

### 3. Manage Tasks

**Create Task:**
- Click "+ New Task" button
- Fill in title, description, priority, and due date
- Click "Create Task"

**View Tasks:**
- Dashboard shows all your tasks
- See statistics (Total, Pending, Completed)

**Complete Task:**
- Click checkbox next to task
- Task will be marked as completed

**Delete Task:**
- Hover over task
- Click trash icon
- Task will be deleted

### 4. Navigation
- **Dashboard** - Overview and statistics
- **My Tasks** - All tasks list
- **Completed** - Completed tasks only
- **Settings** - Account settings

## 🔧 Database Utilities

### Clear All Data

```bash
cd backend
python clear_database.py
```

### Clear Only Expired Sessions

```bash
python clear_database.py expired_sessions
```

### Clear Inactive Users

```bash
python clear_database.py inactive_users
```

### Show Database Stats

```bash
python clear_database.py stats
```

## 🎨 UI Features

- **Glassmorphic Cards** - Modern glass effect design
- **Smooth Animations** - Framer Motion transitions
- **Gradient Accents** - Beautiful color gradients
- **Dark Theme** - Eye-friendly dark interface
- **Toast Notifications** - Real-time feedback
- **Loading States** - Skeleton loaders
- **Hover Effects** - Interactive elements

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **HTTP-only Cookies** - XSS protection
- **Password Hashing** - Secure password storage
- **CORS Protection** - Cross-origin security
- **SQL Injection Prevention** - Parameterized queries
- **Session Management** - Auto logout on expiry

## 📊 API Endpoints

### Authentication

- `POST /api/auth/sign-up/email` - Create account
- `POST /api/auth/sign-in/email` - Login
- `GET /api/auth/get-session` - Get current session
- `POST /api/auth/logout` - Logout

### Tasks

- `GET /api/tasks/` - List all tasks
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}` - Get single task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Toggle completion
- `GET /api/tasks/stats/summary` - Get task statistics

## 🐛 Troubleshooting

### Backend Issues

**SSL Connection Error:**
```bash
# Check DATABASE_URL in .env
# Should have: ?sslmode=require for Neon
# Or: ?sslmode=disable for local PostgreSQL
```

**Import Errors:**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

**Database Connection Failed:**
```bash
# Test connection
psql -U postgres -d your_database
```

### Frontend Issues

**API Connection Error:**
```bash
# Check NEXT_PUBLIC_API_URL in .env.local
# Make sure backend is running on correct port
```

**Authentication Failed:**
```bash
# Clear browser cookies
# Check BETTER_AUTH_SECRET matches in both .env files
```

**Module Not Found:**
```bash
# Reinstall dependencies
npm install
```

## 🚀 Deployment

### Backend (Render/Railway)

1. Push code to GitHub
2. Create new Web Service
3. Set environment variables
4. Deploy from GitHub repo

### Frontend (Vercel)

1. Push code to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy automatically

### Database (Neon)

Already configured! Just update `DATABASE_URL` in production.

## 🔮 Future Enhancements

### Planned Features

- [ ] **Task Edit Modal** - In-place task editing
- [ ] **Task Search** - Search by title/description
- [ ] **Task Filters** - Filter by priority, status, date
- [ ] **Task Categories** - Organize with categories/tags
- [ ] **Subtasks** - Break down large tasks
- [ ] **Task Notes** - Add detailed notes
- [ ] **File Attachments** - Attach files to tasks
- [ ] **Reminders** - Email/push notifications
- [ ] **Collaboration** - Share tasks with team
- [ ] **Calendar View** - Visualize tasks on calendar
- [ ] **Dark/Light Theme Toggle** - User preference
- [ ] **Mobile App** - React Native version
- [ ] **Offline Mode** - Work without internet
- [ ] **Export Data** - Export as JSON/CSV

### Technical Improvements

- [ ] **Redis Caching** - Faster API responses
- [ ] **Websockets** - Real-time updates
- [ ] **Rate Limiting** - API protection
- [ ] **Email Verification** - Secure signup
- [ ] **2FA Authentication** - Extra security
- [ ] **API Versioning** - Better backwards compatibility
- [ ] **Automated Tests** - Unit & integration tests
- [ ] **CI/CD Pipeline** - Automated deployments
- [ ] **Docker Compose** - Easy local setup
- [ ] **Monitoring** - Sentry error tracking

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@Shahzaib-68](https://github.com/Shahzaib-68/Phase-II-Todo-Full-Stack-Web-Application)
- Email: proedit.creatives@gmail.com

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [Better Auth](https://better-auth.com/) - Authentication
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Neon](https://neon.tech/) - Database hosting

---

**Made with ❤️ and ☕**

*Happy Task Managing! 🎯*