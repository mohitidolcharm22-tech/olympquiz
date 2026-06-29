import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  quizzes: [],
  activeQuiz: null,
  currentQuestionIndex: 0,
  answers: {},
  quizStartTime: null,
  quizResult: null,
  quizHistory: [],
  attemptedQuizIds: [],   // quizzes a student has started — teachers cannot edit these
  loading: false,
  error: null,
  timeRemaining: null,
}

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state, action) => {
      state.activeQuiz = action.payload
      state.currentQuestionIndex = 0
      state.answers = {}
      state.quizStartTime = Date.now()
      state.quizResult = null
      state.timeRemaining = action.payload.durationMinutes * 60
      // Mark this quiz as attempted so teachers cannot edit it
      if (!state.attemptedQuizIds.includes(action.payload.id)) {
        state.attemptedQuizIds.push(action.payload.id)
      }
    },
    answerQuestion: (state, action) => {
      const { questionId, answer } = action.payload
      state.answers[questionId] = answer
    },
    nextQuestion: (state) => {
      if (state.activeQuiz && state.currentQuestionIndex < state.activeQuiz.questions.length - 1) {
        state.currentQuestionIndex += 1
      }
    },
    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1
      }
    },
    submitQuiz: (state) => {
      if (!state.activeQuiz) return
      const { questions } = state.activeQuiz
      let correct = 0
      const questionResults = questions.map(q => {
        const isCorrect = state.answers[q.id] === q.correctAnswer
        if (isCorrect) correct++
        return { questionId: q.id, given: state.answers[q.id], correct: q.correctAnswer, isCorrect }
      })
      const score = Math.round((correct / questions.length) * 100)
      const timeTaken = Math.round((Date.now() - state.quizStartTime) / 1000)
      state.quizResult = {
        quizId: state.activeQuiz.id,
        quizTitle: state.activeQuiz.title,
        score,
        correct,
        total: questions.length,
        timeTaken,
        questionResults,
        date: new Date().toISOString(),
        xpEarned: Math.round(score * 0.5),
      }
      state.quizHistory.unshift(state.quizResult)
      state.activeQuiz = null
    },
    tickTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1
      }
    },
    setQuizResult: (state, action) => {
      state.quizResult = action.payload
      state.activeQuiz = null
    },
    clearQuizResult: (state) => {
      state.quizResult = null
      state.currentQuestionIndex = 0
      state.answers = {}
    },
    clearActiveQuiz: (state) => {
      state.activeQuiz = null
      state.currentQuestionIndex = 0
      state.answers = {}
      state.quizResult = null
      state.timeRemaining = null
    },
  },
})

export const { startQuiz, answerQuestion, nextQuestion, prevQuestion, submitQuiz, tickTimer, clearQuizResult, setQuizResult, clearActiveQuiz } = quizSlice.actions
export default quizSlice.reducer
