import React from "react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const navItem = (to, label, icon) => {
    const active = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex flex-col items-center text-xs ${
          active ? "text-[#55e0d2]" : "text-[#bbcac6]"
        }`}
      >
        <span className="text-lg">{icon}</span>
        {label}
      </Link>
    );
  };

  return (
    <div className="fixed bottom-4 w-full flex justify-center z-50">
      <div className="bg-[#19202e]/90 backdrop-blur-xl px-6 py-3 rounded-2xl flex gap-8 shadow-lg">

        {navItem("/", "Home", "🏠")}
        {navItem("/dashboard", "Dashboard", "📊")}
        {navItem("/leaderboard", "Leaderboard", "🏆")}
        {navItem("/submit-complaint", "Report", "➕")}

      </div>
    </div>
  );
};

export default BottomNav;