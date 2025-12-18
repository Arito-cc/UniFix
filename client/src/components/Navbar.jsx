import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md fixed w-full z-10 top-0 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Rebranded Logo / Home Link */}
          <Link to="/" className="text-2xl font-black tracking-tighter text-cyan-400">
            Uni<span className="text-white">Fix</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-cyan-300 text-sm font-medium transition-colors">
              Home
            </Link>
            
            <Link to="/leaderboard" className="hover:text-cyan-300 text-sm font-medium transition-colors">
              Leaderboard
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-cyan-300 text-sm font-medium transition-colors">
                  Dashboard
                </Link>

                {/* Updated Role Check: Student instead of Citizen */}
                {user?.role === 'Student' && (
                  <Link
                    to="/submit-complaint"
                    className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-cyan-900/20"
                  >
                    Report Issue
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-cyan-300 text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-cyan-900/20"
                >
                  Join UniFix
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;