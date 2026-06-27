// ============================================================
// OlympQuiz - Subjects & Topics Data
// ============================================================

export const subjects = [
  {
    id: 'sub-math', name: 'Mathematics', icon: '🔢', color: '#6C63FF',
    bgGradient: 'linear-gradient(135deg, #6C63FF 0%, #A78BFA 100%)',
    description: 'Numbers, shapes, and logical thinking',
    grades: ['nursery', '1', '2', '3', '4', '5'],
    totalTopics: 10, totalLessons: 30, totalQuizzes: 15,
  },
  {
    id: 'sub-eng', name: 'English', icon: '📚', color: '#10B981',
    bgGradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    description: 'Reading, writing, grammar, and vocabulary',
    grades: ['nursery', '1', '2', '3', '4', '5'],
    totalTopics: 10, totalLessons: 30, totalQuizzes: 15,
  },
  {
    id: 'sub-gk', name: 'General Knowledge', icon: '🌍', color: '#F59E0B',
    bgGradient: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)',
    description: 'Science, history, geography, and world awareness',
    grades: ['nursery', '1', '2', '3', '4', '5'],
    totalTopics: 10, totalLessons: 30, totalQuizzes: 15,
  },
]

export const topics = [
  // MATHEMATICS TOPICS
  { id: 'top-m01', subjectId: 'sub-math', name: 'Counting & Numbers', icon: '1️⃣', grade: ['nursery','1'], order: 1, lessonCount: 3, quizCount: 2, difficulty: 'easy' },
  { id: 'top-m02', subjectId: 'sub-math', name: 'Addition', icon: '➕', grade: ['1','2'], order: 2, lessonCount: 3, quizCount: 2, difficulty: 'easy' },
  { id: 'top-m03', subjectId: 'sub-math', name: 'Subtraction', icon: '➖', grade: ['1','2'], order: 3, lessonCount: 3, quizCount: 2, difficulty: 'easy' },
  { id: 'top-m04', subjectId: 'sub-math', name: 'Multiplication', icon: '✖️', grade: ['2','3'], order: 4, lessonCount: 3, quizCount: 2, difficulty: 'medium' },
  { id: 'top-m05', subjectId: 'sub-math', name: 'Division', icon: '➗', grade: ['3','4'], order: 5, lessonCount: 3, quizCount: 2, difficulty: 'medium' },
  { id: 'top-m06', subjectId: 'sub-math', name: 'Shapes & Geometry', icon: '🔷', grade: ['1','2','3'], order: 6, lessonCount: 3, quizCount: 1, difficulty: 'easy' },
  { id: 'top-m07', subjectId: 'sub-math', name: 'Fractions', icon: '🍕', grade: ['3','4'], order: 7, lessonCount: 3, quizCount: 2, difficulty: 'medium' },
  { id: 'top-m08', subjectId: 'sub-math', name: 'Measurement', icon: '📏', grade: ['2','3','4'], order: 8, lessonCount: 3, quizCount: 1, difficulty: 'medium' },
  { id: 'top-m09', subjectId: 'sub-math', name: 'Time & Calendar', icon: '🕐', grade: ['2','3'], order: 9, lessonCount: 3, quizCount: 1, difficulty: 'easy' },
  { id: 'top-m10', subjectId: 'sub-math', name: 'Patterns & Sequences', icon: '🔄', grade: ['4','5'], order: 10, lessonCount: 3, quizCount: 2, difficulty: 'hard' },

  // ENGLISH TOPICS
  { id: 'top-e01', subjectId: 'sub-eng', name: 'Alphabet & Phonics', icon: '🔤', grade: ['nursery','1'], order: 1, lessonCount: 3, quizCount: 2, difficulty: 'easy' },
  { id: 'top-e02', subjectId: 'sub-eng', name: 'Sight Words', icon: '👀', grade: ['1','2'], order: 2, lessonCount: 3, quizCount: 2, difficulty: 'easy' },
  { id: 'top-e03', subjectId: 'sub-eng', name: 'Nouns & Pronouns', icon: '📝', grade: ['2','3'], order: 3, lessonCount: 3, quizCount: 2, difficulty: 'medium' },
  { id: 'top-e04', subjectId: 'sub-eng', name: 'Verbs & Tenses', icon: '🏃', grade: ['3','4'], order: 4, lessonCount: 3, quizCount: 2, difficulty: 'medium' },
  { id: 'top-e05', subjectId: 'sub-eng', name: 'Adjectives', icon: '🌈', grade: ['2','3'], order: 5, lessonCount: 3, quizCount: 1, difficulty: 'easy' },
  { id: 'top-e06', subjectId: 'sub-eng', name: 'Reading Comprehension', icon: '📖', grade: ['3','4','5'], order: 6, lessonCount: 3, quizCount: 2, difficulty: 'hard' },
  { id: 'top-e07', subjectId: 'sub-eng', name: 'Creative Writing', icon: '✍️', grade: ['4','5'], order: 7, lessonCount: 3, quizCount: 1, difficulty: 'hard' },
  { id: 'top-e08', subjectId: 'sub-eng', name: 'Vocabulary Building', icon: '📚', grade: ['2','3','4'], order: 8, lessonCount: 3, quizCount: 2, difficulty: 'medium' },
  { id: 'top-e09', subjectId: 'sub-eng', name: 'Sentence Formation', icon: '💬', grade: ['2','3'], order: 9, lessonCount: 3, quizCount: 2, difficulty: 'medium' },
  { id: 'top-e10', subjectId: 'sub-eng', name: 'Punctuation & Grammar', icon: '❗', grade: ['3','4','5'], order: 10, lessonCount: 3, quizCount: 2, difficulty: 'medium' },

  // GK TOPICS
  { id: 'top-g01', subjectId: 'sub-gk', name: 'Animals & Plants', icon: '🦁', grade: ['nursery','1','2'], order: 1, lessonCount: 3, quizCount: 2, difficulty: 'easy' },
  { id: 'top-g02', subjectId: 'sub-gk', name: 'My Body', icon: '🧠', grade: ['nursery','1'], order: 2, lessonCount: 3, quizCount: 2, difficulty: 'easy' },
  { id: 'top-g03', subjectId: 'sub-gk', name: 'Weather & Seasons', icon: '⛅', grade: ['1','2','3'], order: 3, lessonCount: 3, quizCount: 2, difficulty: 'easy' },
  { id: 'top-g04', subjectId: 'sub-gk', name: 'Our Country India', icon: '🇮🇳', grade: ['2','3','4'], order: 4, lessonCount: 3, quizCount: 2, difficulty: 'medium' },
  { id: 'top-g05', subjectId: 'sub-gk', name: 'Solar System & Space', icon: '🪐', grade: ['3','4','5'], order: 5, lessonCount: 3, quizCount: 2, difficulty: 'medium' },
  { id: 'top-g06', subjectId: 'sub-gk', name: 'Food & Nutrition', icon: '🥗', grade: ['1','2','3'], order: 6, lessonCount: 3, quizCount: 1, difficulty: 'easy' },
  { id: 'top-g07', subjectId: 'sub-gk', name: 'Inventions & Discoveries', icon: '💡', grade: ['4','5'], order: 7, lessonCount: 3, quizCount: 2, difficulty: 'hard' },
  { id: 'top-g08', subjectId: 'sub-gk', name: 'Famous Personalities', icon: '🎖️', grade: ['3','4','5'], order: 8, lessonCount: 3, quizCount: 2, difficulty: 'medium' },
  { id: 'top-g09', subjectId: 'sub-gk', name: 'Environment & Conservation', icon: '🌱', grade: ['2','3','4'], order: 9, lessonCount: 3, quizCount: 1, difficulty: 'medium' },
  { id: 'top-g10', subjectId: 'sub-gk', name: 'World Geography', icon: '🗺️', grade: ['4','5'], order: 10, lessonCount: 3, quizCount: 2, difficulty: 'hard' },
]

export const getTopicsBySubject = (subjectId) => topics.filter(t => t.subjectId === subjectId)
export const getTopicById = (id) => topics.find(t => t.id === id)

export default subjects
