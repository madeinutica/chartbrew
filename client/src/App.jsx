import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// Components
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProjectDashboard from './pages/ProjectDashboard'
import ChartBuilder from './pages/ChartBuilder'
import Connections from './pages/Connections'
import Settings from './pages/Settings'
import LoadingScreen from './components/LoadingScreen'

// Actions
import { checkAuth } from './store/slices/authSlice'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/signup" 
          element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/project/:projectId" 
          element={isAuthenticated ? <ProjectDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/project/:projectId/chart/:chartId" 
          element={isAuthenticated ? <ChartBuilder /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/project/:projectId/connections" 
          element={isAuthenticated ? <Connections /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/settings" 
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
        />
        
        {/* Default redirect */}
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </div>
  )
}

export default App