// ============================================================
// OlympQuiz - Dummy Users Data (10 Students, 3 Teachers, 2 Parents, 1 Admin)
// ============================================================

export const users = [
  // STUDENTS
  {
    id: 'stu-001', role: 'student', name: 'Arjun Sharma', email: 'arjun@olympquiz.com',
    password: 'demo123', grade: 3, avatar: 'AS', avatarColor: '#6C63FF',
    xp: 2450, level: 8, streak: 7, badges: ['quiz-master', 'fast-learner', 'streak-7'],
    subjects: ['math', 'english', 'gk'],
    stats: { quizzesTaken: 34, avgScore: 82, lessonsCompleted: 67, totalXP: 2450 },
    parentId: 'par-001', teacherId: 'tea-001', class: '3A',
    joinedAt: '2024-01-15', lastActive: '2024-06-22',
  },
  {
    id: 'stu-002', role: 'student', name: 'Priya Patel', email: 'priya@olympquiz.com',
    password: 'demo123', grade: 4, avatar: 'PP', avatarColor: '#FF6B35',
    xp: 3120, level: 10, streak: 15, badges: ['quiz-master', 'streak-15', 'top-scorer', 'consistent'],
    subjects: ['math', 'english', 'gk'],
    stats: { quizzesTaken: 47, avgScore: 91, lessonsCompleted: 89, totalXP: 3120 },
    parentId: 'par-001', teacherId: 'tea-001', class: '4B',
    joinedAt: '2024-01-10', lastActive: '2024-06-23',
  },
  {
    id: 'stu-003', role: 'student', name: 'Rohan Gupta', email: 'rohan@olympquiz.com',
    password: 'demo123', grade: 2, avatar: 'RG', avatarColor: '#10B981',
    xp: 1200, level: 5, streak: 3, badges: ['first-quiz', 'curious-learner'],
    subjects: ['math', 'english', 'gk'],
    stats: { quizzesTaken: 18, avgScore: 71, lessonsCompleted: 34, totalXP: 1200 },
    parentId: 'par-002', teacherId: 'tea-002', class: '2A',
    joinedAt: '2024-02-01', lastActive: '2024-06-20',
  },
  {
    id: 'stu-004', role: 'student', name: 'Ananya Singh', email: 'ananya@olympquiz.com',
    password: 'demo123', grade: 5, avatar: 'AS', avatarColor: '#F59E0B',
    xp: 4500, level: 14, streak: 21, badges: ['quiz-master', 'math-wizard', 'english-star', 'streak-21', 'top-scorer'],
    subjects: ['math', 'english', 'gk'],
    stats: { quizzesTaken: 63, avgScore: 95, lessonsCompleted: 112, totalXP: 4500 },
    parentId: 'par-002', teacherId: 'tea-003', class: '5A',
    joinedAt: '2024-01-05', lastActive: '2024-06-23',
  },
  {
    id: 'stu-005', role: 'student', name: 'Kabir Mehta', email: 'kabir@olympquiz.com',
    password: 'demo123', grade: 1, avatar: 'KM', avatarColor: '#8B5CF6',
    xp: 650, level: 3, streak: 1, badges: ['first-quiz'],
    subjects: ['math', 'english', 'gk'],
    stats: { quizzesTaken: 9, avgScore: 65, lessonsCompleted: 18, totalXP: 650 },
    parentId: 'par-001', teacherId: 'tea-002', class: '1B',
    joinedAt: '2024-03-01', lastActive: '2024-06-19',
  },
  {
    id: 'stu-006', role: 'student', name: 'Diya Joshi', email: 'diya@olympquiz.com',
    password: 'demo123', grade: 3, avatar: 'DJ', avatarColor: '#EC4899',
    xp: 1900, level: 7, streak: 5, badges: ['fast-learner', 'curious-learner', 'streak-5'],
    subjects: ['math', 'english', 'gk'],
    stats: { quizzesTaken: 28, avgScore: 78, lessonsCompleted: 55, totalXP: 1900 },
    parentId: 'par-002', teacherId: 'tea-001', class: '3A',
    joinedAt: '2024-01-20', lastActive: '2024-06-21',
  },
  {
    id: 'stu-007', role: 'student', name: 'Vihaan Kumar', email: 'vihaan@olympquiz.com',
    password: 'demo123', grade: 4, avatar: 'VK', avatarColor: '#0EA5E9',
    xp: 2800, level: 9, streak: 10, badges: ['quiz-master', 'streak-10', 'consistent'],
    subjects: ['math', 'english', 'gk'],
    stats: { quizzesTaken: 41, avgScore: 85, lessonsCompleted: 78, totalXP: 2800 },
    parentId: 'par-001', teacherId: 'tea-003', class: '4A',
    joinedAt: '2024-01-12', lastActive: '2024-06-22',
  },
  {
    id: 'stu-008', role: 'student', name: 'Myra Verma', email: 'myra@olympquiz.com',
    password: 'demo123', grade: 2, avatar: 'MV', avatarColor: '#F97316',
    xp: 980, level: 4, streak: 2, badges: ['first-quiz', 'curious-learner'],
    subjects: ['math', 'english', 'gk'],
    stats: { quizzesTaken: 14, avgScore: 68, lessonsCompleted: 29, totalXP: 980 },
    parentId: 'par-002', teacherId: 'tea-002', class: '2B',
    joinedAt: '2024-02-15', lastActive: '2024-06-18',
  },
  {
    id: 'stu-009', role: 'student', name: 'Aditya Rao', email: 'aditya@olympquiz.com',
    password: 'demo123', grade: 5, avatar: 'AR', avatarColor: '#6C63FF',
    xp: 3800, level: 12, streak: 18, badges: ['quiz-master', 'math-wizard', 'streak-18', 'top-scorer'],
    subjects: ['math', 'english', 'gk'],
    stats: { quizzesTaken: 56, avgScore: 89, lessonsCompleted: 98, totalXP: 3800 },
    parentId: 'par-001', teacherId: 'tea-003', class: '5B',
    joinedAt: '2024-01-08', lastActive: '2024-06-23',
  },
  {
    id: 'stu-010', role: 'student', name: 'Siya Nair', email: 'siya@olympquiz.com',
    password: 'demo123', grade: 1, avatar: 'SN', avatarColor: '#10B981',
    xp: 450, level: 2, streak: 0, badges: ['first-quiz'],
    subjects: ['math', 'english', 'gk'],
    stats: { quizzesTaken: 6, avgScore: 72, lessonsCompleted: 12, totalXP: 450 },
    parentId: 'par-002', teacherId: 'tea-001', class: '1A',
    joinedAt: '2024-04-01', lastActive: '2024-06-16',
  },

  // TEACHERS
  {
    id: 'tea-001', role: 'teacher', name: 'Mrs. Priya Krishnan', email: 'teacher@olympquiz.com',
    password: 'demo123', subject: 'Mathematics', grade: '3-4', avatar: 'PK', avatarColor: '#1E40AF',
    qualification: 'M.Sc. Mathematics, B.Ed',
    stats: { studentsCount: 42, contentCreated: 87, quizzesCreated: 24, avgClassScore: 81 },
    classes: ['3A', '4A', '4B'],
    joinedAt: '2022-06-01', lastActive: '2024-06-23',
  },
  {
    id: 'tea-002', role: 'teacher', name: 'Mr. Suresh Pillai', email: 'teacher2@olympquiz.com',
    password: 'demo123', subject: 'English', grade: '1-2', avatar: 'SP', avatarColor: '#059669',
    qualification: 'M.A. English Literature, B.Ed',
    stats: { studentsCount: 38, contentCreated: 65, quizzesCreated: 19, avgClassScore: 76 },
    classes: ['1A', '1B', '2A', '2B'],
    joinedAt: '2022-08-01', lastActive: '2024-06-22',
  },
  {
    id: 'tea-003', role: 'teacher', name: 'Ms. Kavitha Menon', email: 'teacher3@olympquiz.com',
    password: 'demo123', subject: 'General Knowledge', grade: '4-5', avatar: 'KM', avatarColor: '#7C3AED',
    qualification: 'B.Sc., M.Ed',
    stats: { studentsCount: 45, contentCreated: 92, quizzesCreated: 31, avgClassScore: 84 },
    classes: ['4A', '5A', '5B'],
    joinedAt: '2023-01-01', lastActive: '2024-06-23',
  },

  // PARENTS
  {
    id: 'par-001', role: 'parent', name: 'Mr. Rajesh Sharma', email: 'parent@olympquiz.com',
    password: 'demo123', avatar: 'RS', avatarColor: '#0F766E',
    childrenIds: ['stu-001', 'stu-002', 'stu-005', 'stu-007', 'stu-009'],
    phone: '+91 98765 43210',
    joinedAt: '2024-01-05', lastActive: '2024-06-22',
  },
  {
    id: 'par-002', role: 'parent', name: 'Mrs. Sneha Patel', email: 'parent2@olympquiz.com',
    password: 'demo123', avatar: 'SP', avatarColor: '#0F766E',
    childrenIds: ['stu-003', 'stu-004', 'stu-006', 'stu-008', 'stu-010'],
    phone: '+91 87654 32109',
    joinedAt: '2024-01-08', lastActive: '2024-06-21',
  },

  // ADMIN
  {
    id: 'adm-001', role: 'admin', name: 'Admin User', email: 'admin@olympquiz.com',
    password: 'demo123', avatar: 'AU', avatarColor: '#1E293B',
    permissions: ['all'],
    joinedAt: '2023-12-01', lastActive: '2024-06-23',
  },
]

export const getUserById = (id) => users.find(u => u.id === id)
export const getUsersByRole = (role) => users.filter(u => u.role === role)
export const students = users.filter(u => u.role === 'student')
export const teachers = users.filter(u => u.role === 'teacher')
export const parents = users.filter(u => u.role === 'parent')
export const admins = users.filter(u => u.role === 'admin')

export default users
