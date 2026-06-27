/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║              OlympQuiz — Frontend API Service Catalog                   ║
 * ║  Single source of truth for all backend API calls.                      ║
 * ║  All functions return the unwrapped `data` object from the response.    ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * BASE URL : http://localhost:5000/api/v1   (set in .env → VITE_API_URL)
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ AUTH                                                                    │
 * │  POST   /auth/register            registerUser(payload)                 │
 * │  POST   /auth/login               loginUser(email, password)            │
 * │  POST   /auth/logout              logoutUser()                          │
 * │  GET    /auth/me                  getMe()                               │
 * │  GET    /auth/users               listUsers(params?)   [admin]          │
 * │  PATCH  /auth/users/:id/toggle    toggleUserStatus(id) [admin]          │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ SUBJECTS                                                                │
 * │  GET    /subjects                 getSubjects(grade?)                   │
 * │  GET    /subjects/:id             getSubject(id)                        │
 * │  GET    /subjects/:id/topics      getTopicsBySubject(id, grade?)        │
 * │  POST   /subjects                 createSubject(payload) [teacher/admin]│
 * │  PATCH  /subjects/:id             updateSubject(id, payload)            │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ TOPICS                                                                  │
 * │  GET    /topics/:id               getTopic(id)                          │
 * │  GET    /topics/:id/lessons       getLessonsByTopic(id)                 │
 * │  POST   /topics                   createTopic(payload) [teacher/admin]  │
 * │  PATCH  /topics/:id               updateTopic(id, payload)              │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ LESSONS                                                                 │
 * │  GET    /lessons/:id              getLesson(id)                         │
 * │  POST   /lessons                  createLesson(payload) [teacher/admin] │
 * │  PATCH  /lessons/:id              updateLesson(id, payload)             │
 * │  DELETE /lessons/:id              deleteLesson(id)     [teacher/admin]  │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ QUIZZES                                                                 │
 * │  GET    /quizzes                  getQuizzes(params?)                   │
 * │  GET    /quizzes/:id              getQuiz(id)                           │
 * │  POST   /quizzes                  createQuiz(payload)  [teacher/admin]  │
 * │  PATCH  /quizzes/:id              updateQuiz(id, payload)               │
 * │  DELETE /quizzes/:id              deleteQuiz(id)       [teacher/admin]  │
 * │  POST   /quizzes/:id/submit       submitQuiz(id, answers, timeTaken)    │
 * │  GET    /quizzes/:id/result       getQuizResult(id)    [student]        │
 * │  GET    /quizzes/:id/attempts     getQuizAttempts(id)  [teacher/admin]  │
 * │  GET    /quizzes/leaderboard      getLeaderboard()                      │
 * │  GET    /quizzes/my-attempts      getMyAttempts()      [student]        │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ NOTIFICATIONS                                                           │
 * │  GET    /users/notifications          getNotifications()                │
 * │  PATCH  /users/notifications/:id/read markNotificationRead(id)          │
 * │  PATCH  /users/notifications/mark-all-read  markAllRead()               │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ FEEDBACK                                                                │
 * │  POST   /users/feedback           createFeedback(payload)               │
 * │  GET    /users/feedback           getFeedback(params?) [admin]          │
 * │  PATCH  /users/feedback/:id       updateFeedback(id, payload) [admin]   │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ PROGRESS                                                                │
 * │  GET    /users/me/progress        getMyProgress()      [student]        │
 * │  GET    /users/:id/progress       getStudentProgress(id) [parent/teacher│
 * └─────────────────────────────────────────────────────────────────────────┘
 */

import api from './api'

/* ══════════════════════════════════════════════════════════════════════════
   AUTH
   ══════════════════════════════════════════════════════════════════════════ */
export const authApi = {
  /** Register a new user. Roles: student | teacher | parent | admin */
  register: (payload) =>
    api.post('/auth/register', payload).then(r => r.data),

  /** Login with email + password. Returns { accessToken, data: { user } } */
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then(r => r.data),

  /** Logout — clears HttpOnly refresh cookie on server */
  logout: () =>
    api.post('/auth/logout').then(r => r.data),

  /** Get currently authenticated user */
  getMe: () =>
    api.get('/auth/me').then(r => r.data),

  /** [Admin] List all users. Params: { role?, search? } */
  listUsers: (params = {}) =>
    api.get('/auth/users', { params }).then(r => r.data),

  /** [Admin] Enable or disable a user account */
  toggleUserStatus: (userId) =>
    api.patch(`/auth/users/${userId}/toggle-status`).then(r => r.data),
}

/* ══════════════════════════════════════════════════════════════════════════
   SUBJECTS
   ══════════════════════════════════════════════════════════════════════════ */
export const subjectsApi = {
  /** Get all active subjects. Params: { grade? } */
  getAll: (params = {}) =>
    api.get('/subjects', { params }).then(r => r.data),

  /** Get a single subject by ID */
  getOne: (id) =>
    api.get(`/subjects/${id}`).then(r => r.data),

  /** Get all topics for a subject. Params: { grade? } */
  getTopics: (subjectId, params = {}) =>
    api.get(`/subjects/${subjectId}/topics`, { params }).then(r => r.data),

  /** [Teacher/Admin] Create a new subject */
  create: (payload) =>
    api.post('/subjects', payload).then(r => r.data),

  /** [Teacher/Admin] Update a subject */
  update: (id, payload) =>
    api.patch(`/subjects/${id}`, payload).then(r => r.data),
}

/* ══════════════════════════════════════════════════════════════════════════
   TOPICS
   ══════════════════════════════════════════════════════════════════════════ */
export const topicsApi = {
  /** Get a single topic by ID (includes subject info) */
  getOne: (id) =>
    api.get(`/topics/${id}`).then(r => r.data),

  /** Get all lessons under a topic */
  getLessons: (topicId) =>
    api.get(`/topics/${topicId}/lessons`).then(r => r.data),

  /** [Teacher/Admin] Create a topic */
  create: (payload) =>
    api.post('/topics', payload).then(r => r.data),

  /** [Teacher/Admin] Update a topic */
  update: (id, payload) =>
    api.patch(`/topics/${id}`, payload).then(r => r.data),
}

/* ══════════════════════════════════════════════════════════════════════════
   LESSONS
   ══════════════════════════════════════════════════════════════════════════ */
export const lessonsApi = {
  /** Get a single lesson by ID */
  getOne: (id) =>
    api.get(`/lessons/${id}`).then(r => r.data),

  /** [Teacher/Admin] Create a lesson */
  create: (payload) =>
    api.post('/lessons', payload).then(r => r.data),

  /** [Teacher/Admin] Update a lesson */
  update: (id, payload) =>
    api.patch(`/lessons/${id}`, payload).then(r => r.data),

  /** [Teacher/Admin] Soft-delete a lesson */
  delete: (id) =>
    api.delete(`/lessons/${id}`).then(r => r.data),

  /** [Student] Mark a lesson as completed */
  complete: (id) =>
    api.post(`/lessons/${id}/complete`).then(r => r.data),
}

/* ══════════════════════════════════════════════════════════════════════════
   QUIZZES
   ══════════════════════════════════════════════════════════════════════════ */
export const quizzesApi = {
  /**
   * Get quizzes with optional filters.
   * Params: { subjectId?, topicId?, difficulty?, grade?, search? }
   */
  getAll: (params = {}) =>
    api.get('/quizzes', { params }).then(r => r.data),

  /** Get a single quiz. Students receive questions without correct answers. */
  getOne: (id) =>
    api.get(`/quizzes/${id}`).then(r => r.data),

  /** [Teacher/Admin] Create a quiz with questions */
  create: (payload) =>
    api.post('/quizzes', payload).then(r => r.data),

  /** [Teacher/Admin] Update a quiz (blocked if it has been attempted) */
  update: (id, payload) =>
    api.patch(`/quizzes/${id}`, payload).then(r => r.data),

  /** [Teacher/Admin] Soft-delete a quiz */
  delete: (id) =>
    api.delete(`/quizzes/${id}`).then(r => r.data),

  /**
   * [Student] Submit quiz answers.
   * @param {string} id - Quiz ID
   * @param {Array}  answers - [{ questionId, selected }]
   * @param {number} timeTaken - seconds taken
   */
  submit: (id, answers, timeTaken) =>
    api.post(`/quizzes/${id}/submit`, { answers, timeTaken }).then(r => r.data),

  /** [Student] Get the result of a previous attempt */
  getResult: (quizId) =>
    api.get(`/quizzes/${quizId}/result`).then(r => r.data),

  /** [Teacher/Admin] Get all student attempts for a quiz */
  getAttempts: (quizId) =>
    api.get(`/quizzes/${quizId}/attempts`).then(r => r.data),

  /** Get global leaderboard (top 50 students by XP) */
  getLeaderboard: () =>
    api.get('/quizzes/leaderboard').then(r => r.data),

  /** [Student] Get all my quiz attempts with quiz info */
  getMyAttempts: () =>
    api.get('/quizzes/my-attempts').then(r => r.data),
}

/* ══════════════════════════════════════════════════════════════════════════
   NOTIFICATIONS
   ══════════════════════════════════════════════════════════════════════════ */
export const notificationsApi = {
  /** Get all notifications for the logged-in user (last 50) */
  getAll: () =>
    api.get('/users/notifications').then(r => r.data),

  /** Mark a single notification as read */
  markRead: (id) =>
    api.patch(`/users/notifications/${id}/read`).then(r => r.data),

  /** Mark all unread notifications as read */
  markAllRead: () =>
    api.patch('/users/notifications/mark-all-read').then(r => r.data),
}

/* ══════════════════════════════════════════════════════════════════════════
   FEEDBACK
   ══════════════════════════════════════════════════════════════════════════ */
export const feedbackApi = {
  /**
   * Submit feedback.
   * Payload: { title, description?, category, rating? }
   * Categories: bug | suggestion | content | general | praise
   */
  create: (payload) =>
    api.post('/users/feedback', payload).then(r => r.data),

  /** [Admin] List feedback. Params: { category?, status?, role? } */
  getAll: (params = {}) =>
    api.get('/users/feedback', { params }).then(r => r.data),

  /** [Admin] Update feedback status or add notes. Payload: { status?, adminNotes? } */
  update: (id, payload) =>
    api.patch(`/users/feedback/${id}`, payload).then(r => r.data),
}

/* ══════════════════════════════════════════════════════════════════════════
   PROGRESS
   ══════════════════════════════════════════════════════════════════════════ */
export const progressApi = {
  /** [Student] Get my own progress — XP, level, streak, recent attempts */
  getMyProgress: () =>
    api.get('/users/me/progress').then(r => r.data),

  /** [Parent/Teacher/Admin] Get progress for a specific student */
  getStudentProgress: (studentId) =>
    api.get(`/users/${studentId}/progress`).then(r => r.data),

  /** [Teacher/Admin] Get all students with their quiz stats */
  getStudents: () =>
    api.get('/users/students').then(r => r.data),

  /** [Parent] Get progress data for all linked children */
  getMyChildren: () =>
    api.get('/users/my-children').then(r => r.data),

  /** [Parent] Link a child student by their username */
  linkChild: (childUsername) =>
    api.post('/users/link-child', { childUsername }).then(r => r.data),

  /** Get the current student's completed lesson IDs */
  getCompletedLessons: () =>
    api.get('/users/me/progress').then(r => r.data),

  /** [Teacher/Admin] Award a badge to a student */
  awardBadge: (studentId, badge, note = '') =>
    api.post(`/users/${studentId}/badges`, { badge, note }).then(r => r.data),

  /** [Teacher/Admin] Revoke a badge from a student */
  revokeBadge: (studentId, badgeId) =>
    api.delete(`/users/${studentId}/badges/${badgeId}`).then(r => r.data),
}

/* ══════════════════════════════════════════════════════════════════════════
   BADGE CATALOG API  — Admin manages definitions, all roles read
   ══════════════════════════════════════════════════════════════════════════ */
export const badgeCatalogApi = {
  /** [All] List active badge definitions */
  getAll: () =>
    api.get('/badges').then(r => r.data),

  /** [All] List all including inactive (admin view) */
  getAllAdmin: () =>
    api.get('/badges?all=true').then(r => r.data),

  /** [Admin] Create a new badge definition */
  create: (payload) =>
    api.post('/badges', payload).then(r => r.data),

  /** [Admin] Update a badge definition */
  update: (id, payload) =>
    api.patch(`/badges/${id}`, payload).then(r => r.data),

  /** [Admin] Delete a badge definition */
  remove: (id) =>
    api.delete(`/badges/${id}`).then(r => r.data),
}

/* ══════════════════════════════════════════════════════════════════════════
   DEFAULT EXPORT — grouped by domain
   ══════════════════════════════════════════════════════════════════════════ */
export default {
  auth:          authApi,
  subjects:      subjectsApi,
  topics:        topicsApi,
  lessons:       lessonsApi,
  quizzes:       quizzesApi,
  notifications: notificationsApi,
  feedback:      feedbackApi,
  progress:      progressApi,
  badgeCatalog:  badgeCatalogApi,
}
