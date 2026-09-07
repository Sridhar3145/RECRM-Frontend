import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminUsers from './pages/Admin/AdminUsers'
import AdminBookings from './pages/Admin/AdminBookings'
import AdminProjects from './pages/Admin/AdminProjects'
import AdminUnits from './pages/Admin/AdminUnits'
import AdminLeads from './pages/Admin/AdminLeads'
import AdminDashboard from './pages/Admin/AdminDashboard'
import SalesDashboard from './pages/SalesEmployee/SalesDashboard'
import SalesLeads from './pages/SalesEmployee/SalesLeads'
import SalesProperties from './pages/SalesEmployee/SalesProperties'
import SalesBookings from './pages/SalesEmployee/SalesBookings'
import ProtectedRoute from './components/ProductedRoute'
function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/adminusers"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/adminbookings"
          element={
            <ProtectedRoute role="admin">
              <AdminBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/adminprojects"
          element={
            <ProtectedRoute role="admin">
              <AdminProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/adminunits"
          element={
            <ProtectedRoute role="admin">
              <AdminUnits />
            </ProtectedRoute>
          }
        />

        <Route
          path="/adminleads"
          element={
            <ProtectedRoute role="admin">
              <AdminLeads />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/salesdashboard"
          element={
            <ProtectedRoute role="sales employee">
              <SalesDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/salesleads"
          element={
            <ProtectedRoute role="sales employee">
              <SalesLeads />
            </ProtectedRoute>
          }
        />

        <Route
          path="/salesproperties"
          element={
            <ProtectedRoute role="sales employee">
              <SalesProperties />
            </ProtectedRoute>
          }
        />

        <Route
          path="/salesbookings"
          element={
            <ProtectedRoute role="sales employee">
              <SalesBookings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App
