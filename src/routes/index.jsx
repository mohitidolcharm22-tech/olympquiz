import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import ProtectedRoute from './ProtectedRoute'

// Layouts
import StudentLayout from '../components/layout/StudentLayout'
import TeacherLayout from '../components/layout/TeacherLayout'
import ParentLayout from '../components/layout/ParentLayout'
import AdminLayout from '../components/layout/AdminLayout'

// Auth
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage'
import OTPVerificationPage from '../features/auth/OTPVerificationPage'

// Student
import StudentDashboard from '../features/student/StudentDashboard'
import SubjectsPage from '../features/student/SubjectsPage'
import TopicsPage from '../features/student/TopicsPage'
import LessonsPage from '../features/student/LessonsPage'
import FlashcardsPage from '../features/student/FlashcardsPage'
import QuizListPage from '../features/student/QuizListPage'
import QuizPage from '../features/student/QuizPage'
import QuizResultPage from '../features/student/QuizResultPage'
import LeaderboardPage from '../features/student/LeaderboardPage'
import AchievementsPage from '../features/student/AchievementsPage'
import ProgressPage from '../features/student/ProgressPage'
import NotificationsPage from '../features/student/NotificationsPage'

// Teacher
import TeacherDashboard from '../features/teacher/TeacherDashboard'
import ContentManagementPage from '../features/teacher/ContentManagementPage'
import QuizManagementPage from '../features/teacher/QuizManagementPage'
import TeacherReportsPage from '../features/teacher/TeacherReportsPage'
import CommunicationPage from '../features/teacher/CommunicationPage'
import BadgesPage from '../features/teacher/BadgesPage'

// Parent
import ParentDashboard from '../features/parent/ParentDashboard'
import ChildProgressPage from '../features/parent/ChildProgressPage'
import ParentCommunicationPage from '../features/parent/ParentCommunicationPage'
import ParentReportsPage from '../features/parent/ParentReportsPage'

// Admin
import AdminDashboard from '../features/admin/AdminDashboard'
import UserManagementPage from '../features/admin/UserManagementPage'
import ContentModerationPage from '../features/admin/ContentModerationPage'
import AdminAnalyticsPage from '../features/admin/AdminAnalyticsPage'
import FeedbackManagementPage from '../features/admin/FeedbackManagementPage'
import BadgeManagementPage from '../features/admin/BadgeManagementPage'

const Fallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
)

export default function AppRoutes() {
  return (
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
        <Route path="topics/:topicId/flashcards" element={<FlashcardsPage />} />
        <Route path="quizzes" element={<QuizListPage />} />
        <Route path="quiz/:quizId" element={<QuizPage />} />
        <Route path="quiz/:quizId/result" element={<QuizResultPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
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
        <ProtectedRoute allowedRoles={['admin']}>
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
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
