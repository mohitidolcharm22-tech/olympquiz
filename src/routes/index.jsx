import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import ProtectedRoute from './ProtectedRoute'

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

export default function AppRoutes() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp-verification" element={<OTPVerificationPage />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ============ STUDENT ROUTES ============ */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="subjects/:subjectId" element={<TopicsPage />} />
          <Route path="topics/:topicId/lessons" element={<LessonsPage />} />
          <Route path="quizzes" element={<QuizListPage />} />
          <Route path="quiz/:quizId" element={<QuizPage />} />
          <Route path="quiz/:quizId/result" element={<QuizResultPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="attempts" element={<AttemptsHistoryPage />} />
          <Route path="lessons" element={<AllLessonsPage />} />
        </Route>

        {/* ============ TEACHER ROUTES ============ */}
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="content" element={<ContentManagementPage />} />
          <Route path="content/create" element={<ContentManagementPage />} />
          <Route path="quizzes" element={<QuizManagementPage />} />
          <Route path="quizzes/create" element={<QuizManagementPage />} />
          <Route path="reports" element={<TeacherReportsPage />} />
          <Route path="badges" element={<BadgesPage />} />
          <Route path="communication" element={<CommunicationPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="students/:studentId" element={<StudentProgressPage />} />
        </Route>

        {/* ============ PARENT ROUTES ============ */}
        <Route path="/parent" element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="child-progress" element={<ChildProgressPage />} />
          <Route path="reports" element={<ParentReportsPage />} />
          <Route path="communication" element={<ParentCommunicationPage />} />
        </Route>

        {/* ============ ADMIN ROUTES ============ */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'school_admin', 'super_admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="content" element={<ContentModerationPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="feedback" element={<FeedbackManagementPage />} />
          <Route path="badges" element={<BadgeManagementPage />} />
          <Route path="schools" element={<SchoolManagementPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}
