import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

import Layout from './layouts/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';


import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard.jsx';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

const NotFound = () => <div className="flex h-screen items-center justify-center text-red-600 font-bold text-2xl">404 - Not Found</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Doctor Routes */}
          <Route path="/doctor" element={
            <ProtectedRoute allowedRoles={['Doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          {/* Receptionist Routes */}
          <Route path="/receptionist" element={
            <ProtectedRoute allowedRoles={['Receptionist']}>
              <ReceptionistDashboard />
            </ProtectedRoute>
          } />

          {/* Patient Routes */}
          <Route path="/patient" element={
            <ProtectedRoute allowedRoles={['Patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
