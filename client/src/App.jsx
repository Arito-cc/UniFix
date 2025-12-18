import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Import Global Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import UniFix Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SubmitComplaint from './pages/SubmitComplaint.jsx';
import Leaderboard from './pages/Leaderboard';

const App = () => {
  const { loading } = useContext(AuthContext);

  // Global Loading Spinner for UniFix Initialization
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-200">
      <Navbar />
      
      {/* The 'pt-16' padding-top offsets the fixed Navbar height.
          The 'pb-12' ensures content doesn't hit the bottom of the screen.
      */}
      <main className="pt-16 pb-12">
        <Routes>
          {/* --- PUBLIC ACCESS --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* --- PROTECTED ACCESS (AUTHENTICATED ONLY) --- */}
          
          {/* Dashboard is shared, but displays different content based on role */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* STUDENT ONLY: Reporting is restricted to Student roles. 
              Staff trying to access this via URL will be redirected.
          */}
          <Route
            path="/submit-complaint"
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <SubmitComplaint />
              </ProtectedRoute>
            }
          />

          {/* --- FALLBACK --- */}
          {/* Redirect any dead links back to the Campus Wall (Home) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;