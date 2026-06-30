import { createSlice } from '@reduxjs/toolkit'

const MAX_NOTIFICATIONS = 100

const initialState = {
  notifications: [],
  unreadCount: 0,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      const list = (action.payload ?? []).slice(0, MAX_NOTIFICATIONS)
      state.notifications = list
      state.unreadCount = list.filter(n => !n.read).length
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
        state.unreadCount = state.notifications.filter(n => !n.read).length
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => { n.read = true })
      state.unreadCount = 0
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
      if (state.notifications.length > MAX_NOTIFICATIONS) {
        state.notifications.length = MAX_NOTIFICATIONS
      }
      state.unreadCount = state.notifications.filter(n => !n.read).length
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
      state.unreadCount = state.notifications.filter(n => !n.read).length
    },
  },
})

export const {
  setNotifications, markAsRead, markAllAsRead, addNotification, deleteNotification,
} = notificationSlice.actions
export default notificationSlice.reducer
