# OlympQuiz

An interactive quiz and learning platform for Olympiad preparation, built for students, teachers, parents, and administrators.

[![CI](https://github.com/mohitidolcharm22-tech/olympquiz/actions/workflows/ci.yml/badge.svg)](https://github.com/mohitidolcharm22-tech/olympquiz/actions/workflows/ci.yml)

---

## Features

### Student
- **Dashboard** — personal stats, recent activity, quick-access subject cards
- **Subjects & Topics** — browse subjects, drill into topics, track completion
- **Lessons** — structured lesson content per topic
- **Quizzes** — timed, scored quizzes with 8 question types (MCQ, True/False, Fill-in-the-blank, Matching, Ordering, Short Answer, Image-based, and more)
- **Quiz Results** — immediate feedback, correct answers, score breakdown
- **Flashcards** — spaced-repetition study cards per topic
- **Progress** — visual progress bars per subject/topic, completion percentages
- **Leaderboard** — ranked view of top-performing students
- **Achievements / Badges** — earned badges displayed with awarded-by context (teacher name, note, date)
- **Notifications** — system and teacher-sent notifications

### Teacher
- **Dashboard** — class overview, recent student activity
- **Content Management** — create and manage subjects, topics, lessons, and quizzes
- **Student Reports** — individual and class-level performance analytics
- **Badge Awarding** — award dynamic badges (from admin-managed catalog) to students with a custom note; revoke badges if needed
- **Communication** — send messages and notifications to students and parents

### Parent
- **Dashboard** — summary view of all linked children
- **Child Progress** — per-subject progress, recent quiz attempts, earned badges, and teacher-awarded badges per child
- **Reports** — downloadable/printable progress reports
- **Communication** — message teachers; receive notifications

### Admin
- **Dashboard** — platform-wide analytics (users, quizzes, attempts, engagement)
- **User Management** — create, edit, deactivate users across all roles; role assignment
- **Content Moderation** — review and approve/reject content submitted by teachers
- **Badge Management** — create and manage the badge catalog (name, icon, color, category, active/inactive); badges are immediately available to teachers for awarding
- **Feedback Management** — review and respond to platform feedback
- **Analytics** — charts for quiz completion rates, subject popularity, user growth

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, MUI v5, Redux Toolkit |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB Atlas |
| Auth | JWT (access 15 min + refresh 7 d in HttpOnly cookie) |
| Security | helmet, express-mongo-sanitize, express-rate-limit |
| CI/CD | GitHub Actions |

---

## Project Structure

```
OlympQuiz/
├── src/
│   ├── features/      # Page components (admin / auth / parent / student / teacher)
│   ├── components/    # Shared UI & layouts
│   ├── services/      # Axios API clients
│   ├── store/         # Redux slices
│   └── routes/        # React Router config
├── public/
├── vite.config.js
└── .github/workflows/ # GitHub Actions CI
```

> The backend (Express REST API) lives in a separate repository.

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (or local MongoDB 6+)

### 1. Clone

```bash
git clone https://github.com/mohitidolcharm22-tech/olympquiz.git
cd olympquiz
```

### 2. Install & Run

```bash
cp .env.example .env        # fill in required values
npm install
npm run dev                 # starts on http://localhost:5173
```

> Make sure the backend API (separate repo) is running and `VITE_API_URL` points to it.

---

## Environment Variables

### Frontend (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API base URL (e.g. `http://localhost:5000/api/v1`) |

---

## Available Scripts

```bash
npm run dev       # Vite dev server with HMR
npm run build     # Production build → dist/
npm run preview   # Preview production build
npm run lint      # ESLint
npm run lint:fix  # ESLint with auto-fix
```

---

## API Overview

All endpoints are prefixed with `/api/v1`.

| Resource | Endpoint |
|----------|----------|
| Auth | `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh`, `/auth/me` |
| Users | `/users` — student progress, badge awarding |
| Subjects | `/subjects` |
| Topics | `/topics` |
| Lessons | `/lessons` |
| Quizzes | `/quizzes` |
| Badges | `/badges` — admin catalog CRUD + teacher read |

Rate limits: auth endpoints 20 req/15 min (hard: 500), API endpoints 300 req/15 min (hard: 2000).

---

## CI/CD

GitHub Actions runs on every push and pull request to `main`:

1. **Frontend** — `npm ci` → `npm run lint` → `npm run build`

---

## License

MIT
