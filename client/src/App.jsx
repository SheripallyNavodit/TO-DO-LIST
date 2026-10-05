import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewAdvisory from './pages/NewAdvisory';
import AdvisoryDetails from './pages/AdvisoryDetails';
import Advisories from './pages/Advisories';
import Farms from './pages/Farms';
import NewFarm from './pages/NewFarm';
import FarmDetails from './pages/FarmDetails';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/advisory/new" element={<NewAdvisory />} />
              <Route path="/advisory/:id" element={<AdvisoryDetails />} />
              <Route path="/advisories" element={<Advisories />} />
              <Route path="/farms" element={<Farms />} />
              <Route path="/farms/new" element={<NewFarm />} />
              <Route path="/farms/:id" element={<FarmDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Error Route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}
