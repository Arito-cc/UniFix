import React from "react";

const TopBar = () => {
  return (
    <div className="fixed top-0 w-full z-50 px-4 pt-4">

      <div className="max-w-md mx-auto bg-[#19202e]/80 backdrop-blur-xl rounded-2xl px-4 py-3 flex items-center justify-between shadow-lg">

        {/* LEFT ICON */}
        <div className="w-9 h-9 rounded-full bg-[#232a39] flex items-center justify-center text-[#55e0d2]">
          👤
        </div>

        {/* LOGO */}
        <div className="text-lg font-bold text-[#55e0d2]">
          Uni<span className="text-[#dce2f6]">Fix</span>
        </div>

        {/* RIGHT ICON (THEME) */}
        <div className="w-9 h-9 rounded-full bg-[#232a39] flex items-center justify-center text-[#dce2f6] cursor-pointer">
          🌙
        </div>

      </div>
    </div>
  );
};

export default TopBar;