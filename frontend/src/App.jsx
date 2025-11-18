import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useUserStore } from './stores/useUserStore'
import MainLayout from './components/MainLayout'
import './App.css'
import Login from "./pages/Login"
import Dashboard from './pages/Dashboard'
import DevicesPage from './pages/DevicesPage'  // For FR-1.2 (Access Points)
import AlertsPage from './pages/AlertsPage'    // For FR-1.3.2 (Alerts)
import ReportsPage from './pages/ReportsPage'  // For FR-1.6 (Reporting)
import UsersPage from './pages/UsersPage'      // For FR-1.5 (User Mgmt)
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  const { user, checkAuth } = useUserStore()

  // Optional: specific route protection for Admin-only pages
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
          
          {/* Dashboard (Default Home) */}
          <Route path='/' element={<Dashboard />} />

          {/* FR-1.2: Device Management */}
          <Route path='/devices' element={<DevicesPage />} />

          {/* FR-1.3.2: Alerts System */}
          <Route path='/alerts' element={<AlertsPage />} />

          {/* FR-1.6: Reports & Analytics */}
          <Route path='/reports' element={<ReportsPage />} />

          <Route path='/analytics' element={<AnalyticsPage />} />

          {/* FR-1.5: User Management (Admin Only) */}
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