import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import projectSlice from './slices/projectSlice'
import chartSlice from './slices/chartSlice'
import connectionSlice from './slices/connectionSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    projects: projectSlice,
    charts: chartSlice,
    connections: connectionSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export default store