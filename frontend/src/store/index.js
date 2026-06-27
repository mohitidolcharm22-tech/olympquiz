import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import quizReducer from './slices/quizSlice'
import notificationReducer from './slices/notificationSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    notifications: notificationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['quiz/startQuiz'],
      },
    }),
})

export default store
