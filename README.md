# Student Attendance Management Portal

A complete **production-ready Student Attendance Management Portal** using:
- **Backend:** Node.js + Express
- **Database:** MongoDB with Mongoose
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Authentication:** JWT
- **Deployment:** Render-ready

## Folder Structure

```
.
├── client
│   ├── attendance.html
│   ├── dashboard.html
│   ├── index.html
│   ├── report.html
│   ├── css
│   │   └── styles.css
│   └── js
│       ├── attendance.js
│       ├── common.js
│       ├── dashboard.js
│       ├── index.js
│       └── report.js
├── server
│   ├── config
│   │   └── db.js
│   ├── middleware
│   │   └── authMiddleware.js
│   ├── models
│   │   ├── Attendance.js
│   │   ├── Student.js
│   │   └── User.js
│   ├── routes
│   │   ├── attendanceRoutes.js
│   │   ├── authRoutes.js
│   │   └── studentRoutes.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Features

- Teacher/Admin registration and login with JWT authentication.
- Add and list students.
- Mark attendance (present/absent).
- Duplicate attendance prevention for same student/day.
- Attendance report by date.
- Attendance percentage calculation.
- Responsive and beginner-friendly UI.
- Alert messages for success/error feedback.

## API Routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Students
- `POST /api/students` (Protected)
- `GET /api/students` (Protected)

### Attendance
- `POST /api/attendance` (Protected)
- `GET /api/attendance?date=YYYY-MM-DD` (Protected)

## MongoDB Setup

1. Create a MongoDB Atlas cluster or local MongoDB instance.
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update `MONGODB_URI` and `JWT_SECRET` in `.env`.

## Run Locally (Step-by-Step)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Add environment variables in `.env`.
3. Start the server:
   ```bash
   node server/server.js
   ```
4. Open browser:
   - `http://localhost:5000`

## Deployment on Render

1. Push this project to GitHub.
2. Create a **Web Service** in Render and connect your repository.
3. Set environment variables on Render:
   - `PORT=5000`
   - `MONGODB_URI=...`
   - `JWT_SECRET=...`
4. Use these Render settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server/server.js`

## Default Workflow

1. Register a teacher/admin from login page.
2. Login and go to dashboard.
3. Add students.
4. Open attendance page and mark present/absent.
5. Submit attendance.
6. Open report page and check attendance summary/percentage.

## Production Notes

- Passwords are hashed using bcrypt.
- JWT middleware protects student and attendance APIs.
- CORS and JSON middleware are enabled.
- Attendance has a unique Mongo index on (`studentId`, `date`) to prevent duplicates.

## Start Command (Required)

```bash
npm install
node server/server.js
```
