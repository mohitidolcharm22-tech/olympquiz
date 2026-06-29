// ============================================================
// OlympQuiz - Notifications Data
// ============================================================

export const notifications = [
  { id: 'noti-001', userId: 'stu-001', type: 'quiz_assigned', title: 'New Quiz Available! 🎯', message: 'Mrs. Priya Krishnan assigned "Multiplication Master" quiz. Due by Friday!', date: '2024-06-23T09:00:00Z', read: false, link: '/student/quiz/qz-003', icon: '📝' },
  { id: 'noti-002', userId: 'stu-001', type: 'achievement', title: 'Badge Unlocked! 🏅', message: 'Congratulations! You earned the "Streak-7" badge for 7 consecutive days of learning!', date: '2024-06-22T18:00:00Z', read: false, link: '/student/achievements', icon: '🏅' },
  { id: 'noti-003', userId: 'stu-001', type: 'content_upload', title: 'New Lesson Added 📚', message: 'A new lesson "Patterns & Sequences - Part 1" has been added to Mathematics!', date: '2024-06-21T10:00:00Z', read: true, link: '/student/subjects/sub-math', icon: '📚' },
  { id: 'noti-004', userId: 'stu-001', type: 'teacher_update', title: 'Message from Teacher 💬', message: 'Mrs. Priya Krishnan: "Great work on this week\'s quiz! Keep it up, Arjun!"', date: '2024-06-20T14:30:00Z', read: true, link: '/student/notifications', icon: '💬' },
  { id: 'noti-005', userId: 'stu-002', type: 'quiz_assigned', title: 'New Quiz Available! 🎯', message: '"Space Explorer Quiz" is now available. Test your knowledge of the solar system!', date: '2024-06-23T09:30:00Z', read: false, link: '/student/quiz/qz-008', icon: '📝' },
  { id: 'noti-006', userId: 'tea-001', type: 'student_activity', title: 'Quiz Completed 📊', message: 'Arjun Sharma completed "Addition Adventure" quiz with a score of 80%.', date: '2024-06-22T15:00:00Z', read: false, link: '/teacher/reports', icon: '📊' },
  { id: 'noti-007', userId: 'tea-001', type: 'feedback', title: 'New Parent Feedback 💬', message: 'Mr. Rajesh Sharma left feedback about the app experience. Rating: 4/5', date: '2024-06-21T11:00:00Z', read: true, link: '/teacher/communication', icon: '💬' },
  { id: 'noti-008', userId: 'par-001', type: 'child_achievement', title: "Arjun's Achievement! 🌟", message: 'Your child Arjun unlocked the "Streak-7" badge! He has been learning for 7 days straight!', date: '2024-06-22T18:05:00Z', read: false, link: '/parent/child-progress', icon: '🌟' },
  { id: 'noti-009', userId: 'par-001', type: 'weekly_report', title: 'Weekly Progress Report 📈', message: 'This week\'s learning summary for Arjun is ready. He completed 5 lessons and 3 quizzes!', date: '2024-06-21T07:00:00Z', read: false, link: '/parent/reports', icon: '📈' },
  { id: 'noti-010', userId: 'adm-001', type: 'new_user', title: 'New Registration 👤', message: 'A new teacher account has been requested: john.doe@school.com. Awaiting approval.', date: '2024-06-23T08:00:00Z', read: false, link: '/admin/user-management', icon: '👤' },
  { id: 'noti-011', userId: 'adm-001', type: 'feedback_alert', title: 'Bug Report Submitted 🐛', message: 'Student Myra Verma reported a quiz timer bug. Severity: Medium. Review needed.', date: '2024-06-22T12:00:00Z', read: false, link: '/admin/feedback', icon: '🐛' },
]

export default notifications
