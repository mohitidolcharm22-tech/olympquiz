export { default as subjects, topics, getTopicsBySubject, getTopicById } from './subjects'
export { default as lessons, getLessonsByTopic, getLessonById } from './lessons'
export { default as quizzes, getQuizById, getQuizzesBySubject, getQuizzesByTopic } from './quizzes'
export { default as users, getUserById, getUsersByRole, students, teachers, parents, admins } from './users'
export { default as feedback, getFeedbackByRole, getFeedbackByCategory, getFeedbackStats } from './feedback'
export { default as notifications } from './notifications'

// Leaderboard data
export const leaderboard = [
  { rank: 1, userId: 'stu-004', name: 'Ananya Singh', xp: 4500, level: 14, avatar: 'AS', avatarColor: '#F59E0B', badges: 5, streak: 21 },
  { rank: 2, userId: 'stu-009', name: 'Aditya Rao', xp: 3800, level: 12, avatar: 'AR', avatarColor: '#6C63FF', badges: 4, streak: 18 },
  { rank: 3, userId: 'stu-002', name: 'Priya Patel', xp: 3120, level: 10, avatar: 'PP', avatarColor: '#FF6B35', badges: 4, streak: 15 },
  { rank: 4, userId: 'stu-007', name: 'Vihaan Kumar', xp: 2800, level: 9, avatar: 'VK', avatarColor: '#0EA5E9', badges: 3, streak: 10 },
  { rank: 5, userId: 'stu-001', name: 'Arjun Sharma', xp: 2450, level: 8, avatar: 'AS', avatarColor: '#6C63FF', badges: 3, streak: 7 },
  { rank: 6, userId: 'stu-006', name: 'Diya Joshi', xp: 1900, level: 7, avatar: 'DJ', avatarColor: '#EC4899', badges: 3, streak: 5 },
  { rank: 7, userId: 'stu-003', name: 'Rohan Gupta', xp: 1200, level: 5, avatar: 'RG', avatarColor: '#10B981', badges: 2, streak: 3 },
  { rank: 8, userId: 'stu-008', name: 'Myra Verma', xp: 980, level: 4, avatar: 'MV', avatarColor: '#F97316', badges: 2, streak: 2 },
  { rank: 9, userId: 'stu-005', name: 'Kabir Mehta', xp: 650, level: 3, avatar: 'KM', avatarColor: '#8B5CF6', badges: 1, streak: 1 },
  { rank: 10, userId: 'stu-010', name: 'Siya Nair', xp: 450, level: 2, avatar: 'SN', avatarColor: '#10B981', badges: 1, streak: 0 },
]

// Badges definition
export const badgeDefinitions = [
  { id: 'first-quiz', name: 'First Quiz!', icon: '🎯', description: 'Completed your very first quiz', color: '#6C63FF', xpRequired: 0 },
  { id: 'fast-learner', name: 'Fast Learner', icon: '⚡', description: 'Completed 5 lessons in one day', color: '#F59E0B', xpRequired: 200 },
  { id: 'curious-learner', name: 'Curious Mind', icon: '🔍', description: 'Explored all 3 subjects', color: '#10B981', xpRequired: 300 },
  { id: 'quiz-master', name: 'Quiz Master', icon: '🏆', description: 'Scored 90%+ on 5 quizzes', color: '#FFD700', xpRequired: 1000 },
  { id: 'streak-5', name: 'On Fire! (5 days)', icon: '🔥', description: '5-day learning streak', color: '#EF4444', xpRequired: 500 },
  { id: 'streak-7', name: 'Week Warrior', icon: '🗓️', description: '7-day learning streak', color: '#F97316', xpRequired: 700 },
  { id: 'streak-10', name: 'Persistent Pro', icon: '💪', description: '10-day learning streak', color: '#8B5CF6', xpRequired: 1000 },
  { id: 'streak-15', name: 'Dedication Star', icon: '⭐', description: '15-day learning streak', color: '#EC4899', xpRequired: 1500 },
  { id: 'streak-21', name: '3-Week Champion', icon: '👑', description: '21-day learning streak', color: '#FFD700', xpRequired: 2000 },
  { id: 'math-wizard', name: 'Math Wizard', icon: '🧮', description: 'Scored 100% on a math quiz', color: '#6C63FF', xpRequired: 1500 },
  { id: 'english-star', name: 'English Star', icon: '📖', description: 'Completed all English topics', color: '#10B981', xpRequired: 2000 },
  { id: 'top-scorer', name: 'Top Scorer', icon: '🥇', description: 'Reached the top 3 on leaderboard', color: '#FFD700', xpRequired: 2500 },
  { id: 'consistent', name: 'Consistent Learner', icon: '📅', description: 'Studied for 30 days', color: '#0EA5E9', xpRequired: 3000 },
]
