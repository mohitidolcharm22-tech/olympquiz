import { createSlice } from '@reduxjs/toolkit'
import { notifications as allNotifications } from '../../data/notifications'

const initialState = {
  notifications: allNotifications,
  unreadCount: allNotifications.filter(n => !n.read).length,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
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
      state.unreadCount += 1
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
      state.unreadCount = state.notifications.filter(n => !n.read).length
    },
  },
})

export const { markAsRead, markAllAsRead, addNotification, deleteNotification } = notificationSlice.actions
export default notificationSlice.reducer
