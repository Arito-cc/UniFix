import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";

// Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SubmitComplaint from "./pages/SubmitComplaint.jsx";
import Leaderboard from "./pages/Leaderboard";

const App = () => {
  const { loading } = useContext(AuthContext);
  const location = useLocation();

  // Pages where we DON'T want TopBar & BottomNav
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  // Global Loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c1321]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#55e0d2]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c1321] min-h-screen text-[#dce2f6]">

      {/* TOP BAR (only for app pages) */}
      {!isAuthPage && <TopBar />}

      {/* MAIN CONTENT */}
      <main
        className={`
          ${!isAuthPage ? "pt-20 pb-24" : ""}
        `}
      >
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* PROTECTED */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/submit-complaint"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <SubmitComplaint />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* BOTTOM NAV (only for app pages) */}
      {!isAuthPage && <BottomNav />}
    </div>
  );
};

export default App;