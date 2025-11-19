import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useUserStore } from './stores/useUserStore'
import MainLayout from './components/MainLayout'
import './App.css'
import Login from "./pages/Login"
import Dashboard from './pages/Dashboard'
import DevicesPage from './pages/DevicesPage'  
import AlertsPage from './pages/AlertsPage'    
import ReportsPage from './pages/ReportsPage'  
import UsersPage from './pages/UsersPage'      
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  const { user, checkAuth } = useUserStore()

  
  const AdminRoute = ({ children }) => {
    return user?.role === 'admin' ? children : <Navigate to="/" />
  }

  return (
    <div>
      <Routes>
        {/* Public Route: Login */}
        {/* If user is already logged in, redirect them away from login page */}
        <Route 
          path='/login' 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />

        {/* Protected Routes (Wrapped in MainLayout) */}
        {/* If no user, redirect to login */}
        <Route element={user ? <MainLayout /> : <Navigate to="/login" />}>
          

          <Route path='/' element={<Dashboard />} />

          <Route path='/devices' element={<DevicesPage />} />

     
          <Route path='/alerts' element={<AlertsPage />} />

    
          <Route path='/reports' element={<ReportsPage />} />

          <Route path='/analytics' element={<AnalyticsPage />} />

      
          <Route 
            path='/users' 
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            } 
          />

        </Route>
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}

export default App
