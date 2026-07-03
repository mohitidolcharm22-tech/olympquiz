import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import ProtectedRoute from './ProtectedRoute'
import ErrorBoundary from '../components/common/ErrorBoundary'

// Layouts — always needed when the user is logged in, so kept eager.
import StudentLayout from '../components/layout/StudentLayout'
import TeacherLayout from '../components/layout/TeacherLayout'
import ParentLayout from '../components/layout/ParentLayout'
import AdminLayout from '../components/layout/AdminLayout'

// Auth — entry-point pages, kept eager so the login flow has no extra round-trip.
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage'
import OTPVerificationPage from '../features/auth/OTPVerificationPage'

/* Feature pages — split into per-route chunks so a student bundle
   doesn't carry admin/teacher/parent code, and vice versa. */
// Student
const StudentDashboard  = lazy(() => import('../features/student/StudentDashboard'))
const SubjectsPage      = lazy(() => import('../features/student/SubjectsPage'))
const TopicsPage        = lazy(() => import('../features/student/TopicsPage'))
const LessonsPage       = lazy(() => import('../features/student/LessonsPage'))
const QuizListPage      = lazy(() => import('../features/student/QuizListPage'))
const QuizPage          = lazy(() => import('../features/student/QuizPage'))
const QuizResultPage    = lazy(() => import('../features/student/QuizResultPage'))
const LeaderboardPage   = lazy(() => import('../features/student/LeaderboardPage'))
const AchievementsPage  = lazy(() => import('../features/student/AchievementsPage'))
const ProgressPage      = lazy(() => import('../features/student/ProgressPage'))
const AttemptsHistoryPage = lazy(() => import('../features/student/AttemptsHistoryPage'))
const AllLessonsPage      = lazy(() => import('../features/student/AllLessonsPage'))

// Teacher
const TeacherDashboard       = lazy(() => import('../features/teacher/TeacherDashboard'))
const ContentManagementPage  = lazy(() => import('../features/teacher/ContentManagementPage'))
const QuizManagementPage     = lazy(() => import('../features/teacher/QuizManagementPage'))
const TeacherReportsPage     = lazy(() => import('../features/teacher/TeacherReportsPage'))
const CommunicationPage      = lazy(() => import('../features/teacher/CommunicationPage'))
const BadgesPage             = lazy(() => import('../features/teacher/BadgesPage'))
const ClassesPage            = lazy(() => import('../features/teacher/ClassesPage'))
const StudentProgressPage    = lazy(() => import('../features/teacher/StudentProgressPage'))

// Parent
const ParentDashboard          = lazy(() => import('../features/parent/ParentDashboard'))
const ChildProgressPage        = lazy(() => import('../features/parent/ChildProgressPage'))
const ParentCommunicationPage  = lazy(() => import('../features/parent/ParentCommunicationPage'))
const ParentReportsPage        = lazy(() => import('../features/parent/ParentReportsPage'))

// Admin
const AdminDashboard         = lazy(() => import('../features/admin/AdminDashboard'))
const UserManagementPage     = lazy(() => import('../features/admin/UserManagementPage'))
const ContentModerationPage  = lazy(() => import('../features/admin/ContentModerationPage'))
const AdminAnalyticsPage     = lazy(() => import('../features/admin/AdminAnalyticsPage'))
const FeedbackManagementPage = lazy(() => import('../features/admin/FeedbackManagementPage'))
const BadgeManagementPage    = lazy(() => import('../features/admin/BadgeManagementPage'))
const SchoolManagementPage   = lazy(() => import('../features/admin/SchoolManagementPage'))

const Fallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
)

// Lightweight fallback for nested route transitions
const RouteFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
    <CircularProgress size={32} />
  </Box>
)

// Wraps a lazy element in its own Suspense + ErrorBoundary so only the
// content area reacts to loading/errors; layout stays visible.
const S = ({ children }) => (
  <ErrorBoundary inline>
    <Suspense fallback={<RouteFallback />}>{children}</Suspense>
  </ErrorBoundary>
)

export default function AppRoutes() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {/* Public Routes — eager, no extra Suspense needed */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp-verification" element={<OTPVerificationPage />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ============ STUDENT ROUTES ============ */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <ErrorBoundary>
              <StudentLayout />
            </ErrorBoundary>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"                element={<S><StudentDashboard /></S>} />
          <Route path="subjects"                 element={<S><SubjectsPage /></S>} />
          <Route path="subjects/:subjectId"      element={<S><TopicsPage /></S>} />
          <Route path="topics/:topicId/lessons"  element={<S><LessonsPage /></S>} />
          <Route path="lessons"                  element={<S><AllLessonsPage /></S>} />
          <Route path="quizzes"                  element={<S><QuizListPage /></S>} />
          <Route path="quiz/:quizId"             element={<S><QuizPage /></S>} />
          <Route path="quiz/:quizId/result"      element={<S><QuizResultPage /></S>} />
          <Route path="leaderboard"              element={<S><LeaderboardPage /></S>} />
          <Route path="achievements"             element={<S><AchievementsPage /></S>} />
          <Route path="progress"                 element={<S><ProgressPage /></S>} />
          <Route path="attempts"                 element={<S><AttemptsHistoryPage /></S>} />
        </Route>

        {/* ============ TEACHER ROUTES ============ */}
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <ErrorBoundary>
              <TeacherLayout />
            </ErrorBoundary>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"          element={<S><TeacherDashboard /></S>} />
          <Route path="content"            element={<S><ContentManagementPage /></S>} />
          <Route path="content/create"     element={<S><ContentManagementPage /></S>} />
          <Route path="quizzes"            element={<S><QuizManagementPage /></S>} />
          <Route path="quizzes/create"     element={<S><QuizManagementPage /></S>} />
          <Route path="reports"            element={<S><TeacherReportsPage /></S>} />
          <Route path="badges"             element={<S><BadgesPage /></S>} />
          <Route path="communication"      element={<S><CommunicationPage /></S>} />
          <Route path="classes"            element={<S><ClassesPage /></S>} />
          <Route path="students/:studentId" element={<S><StudentProgressPage /></S>} />
        </Route>

        {/* ============ PARENT ROUTES ============ */}
        <Route path="/parent" element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ErrorBoundary>
              <ParentLayout />
            </ErrorBoundary>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"       element={<S><ParentDashboard /></S>} />
          <Route path="child-progress"  element={<S><ChildProgressPage /></S>} />
          <Route path="reports"         element={<S><ParentReportsPage /></S>} />
          <Route path="communication"   element={<S><ParentCommunicationPage /></S>} />
        </Route>

        {/* ============ ADMIN ROUTES ============ */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'school_admin', 'super_admin']}>
            <ErrorBoundary>
              <AdminLayout />
            </ErrorBoundary>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"  element={<S><AdminDashboard /></S>} />
          <Route path="users"      element={<S><UserManagementPage /></S>} />
          <Route path="content"    element={<S><ContentModerationPage /></S>} />
          <Route path="analytics"  element={<S><AdminAnalyticsPage /></S>} />
          <Route path="feedback"   element={<S><FeedbackManagementPage /></S>} />
          <Route path="badges"     element={<S><BadgeManagementPage /></S>} />
          <Route path="schools"    element={<S><SchoolManagementPage /></S>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}
