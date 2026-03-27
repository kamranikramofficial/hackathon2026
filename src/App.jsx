import { BrowserRouter as Router, Routes, Route, Navigate, Suspense, lazy } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './auth/ProtectedRoute';

import Layout from './layouts/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Lazy load dashboard routes for better initial load performance
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const ReceptionistDashboard = lazy(() => import('./pages/ReceptionistDashboard'));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Loading fallback component
const LoadingSpinner = () => (
    <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
);

const NotFound = () => <div className="flex h-screen items-center justify-center text-red-600 font-bold text-2xl">404 - Not Found</div>;

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* All dashboard routes wrapped in Layout (Sidebar + content) */}
          <Route element={<Layout />}>
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/doctor" element={
              <ProtectedRoute allowedRoles={['Doctor']}>
                <Suspense fallback={<LoadingSpinner />}>
                  <DoctorDashboard />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/receptionist" element={
              <ProtectedRoute allowedRoles={['Receptionist']}>
                <Suspense fallback={<LoadingSpinner />}>
                  <ReceptionistDashboard />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/patient" element={
              <ProtectedRoute allowedRoles={['Patient']}>
                <Suspense fallback={<LoadingSpinner />}>
                  <PatientDashboard />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['Admin', 'Doctor', 'Receptionist', 'Patient']}>
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfilePage />
                </Suspense>
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
