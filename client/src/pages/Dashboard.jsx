import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ComplaintDetailModal from '../components/ComplaintDetailModal'; // Import the modal

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [selectedComplaint, setSelectedComplaint] = useState(null); // State for selected complaint

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/api/complaints');
        setComplaints(res.data);
        
        // Calculate quick stats
        const total = res.data.length;
        const pending = res.data.filter(c => c.status !== 'Resolved').length;
        const resolved = res.data.filter(c => c.status === 'Resolved').length;
        setStats({ total, pending, resolved });
      } catch (err) {
        console.error('Dashboard Load Error:', err);
      } finally {
        setLoading(false);
      }
    }; // Define fetchDashboardData inside useEffect or memoize it
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="animate-pulse text-cyan-400 font-black tracking-widest uppercase">Initializing Portal...</div>
    </div>
  );

return (
  <div className="px-6 pt-24 pb-32 max-w-md mx-auto">

    {/* ===== STATS ===== */}

    {/* TOTAL */}
    <div className="bg-[#151b2a] rounded-xl p-6 mb-4">
      <p className="text-xs font-bold uppercase tracking-wider text-[#859491]">
        Total Reports
      </p>

      <div className="flex justify-between items-end mt-2">
        <h2 className="text-3xl font-bold text-[#dce2f6]">
          {stats.total}
        </h2>

        <div className="flex items-center gap-1 text-[#55e0d2] text-sm font-semibold">
          📈 +2
        </div>
      </div>
    </div>

    {/* ACTIVE + RESOLVED */}
    <div className="grid grid-cols-2 gap-4 mb-8">

      <div className="bg-[#151b2a] rounded-xl p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#859491]">
          Active
        </p>

        <div className="flex justify-between items-end mt-2">
          <h2 className="text-3xl font-bold text-[#dce2f6]">
            {stats.pending}
          </h2>

          <span className="text-[#ffbca3] text-sm font-semibold">
            +1
          </span>
        </div>
      </div>

      <div className="bg-[#151b2a] rounded-xl p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#859491]">
          Resolved
        </p>

        <div className="flex justify-between items-end mt-2">
          <h2 className="text-3xl font-bold text-[#dce2f6]">
            {stats.resolved}
          </h2>

          <span className="text-[#55e0d2] text-sm font-semibold">
            +1
          </span>
        </div>
      </div>
    </div>

    {/* ===== HEADER ===== */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-[#dce2f6]">
        Recent Reports
      </h2>

      <button className="text-sm font-bold text-[#55e0d2]">
        View All
      </button>
    </div>

    {/* ===== LIST ===== */}
    <div className="flex flex-col gap-4">

      {complaints.map((item) => (
        <div
          key={item._id}
          className="bg-[#19202e] rounded-xl p-5 hover:bg-[#232a39] transition"
        >

          {/* TOP */}
          <div className="flex justify-between">

            <div>
              <h3 className="text-lg font-medium text-[#dce2f6] leading-tight">
                {item.title}
              </h3>

              <p className="text-sm text-[#bbcac6] mt-1">
                {item.status === "Resolved"
                  ? "Resolved"
                  : "Reported"}{" "}
                • {item.location.building}
              </p>
            </div>

            <StatusBadge status={item.status} />
          </div>

          {/* BOTTOM */}
          <div className="flex justify-between items-center mt-4">

            <div className="text-xs text-[#859491]">
              {item.description?.slice(0, 40)}...
            </div>

            <button
              onClick={() => setSelectedComplaint(item)}
              className="text-[#55e0d2] font-bold text-sm hover:underline"
            >
              View Details
            </button>
          </div>
        </div>
      ))}

    </div>

    {/* ===== FAB ===== */}
    {user?.role === "Student" && (
      <Link
        to="/submit-complaint"
        className="fixed bottom-24 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#55e0d2] to-[#2ec4b6] text-[#00201d] flex items-center justify-center text-3xl shadow-xl active:scale-95"
      >
        +
      </Link>
    )}

    {/* MODAL */}
    {selectedComplaint && (
      <ComplaintDetailModal
        complaint={selectedComplaint}
        user={user}
        onClose={() => setSelectedComplaint(null)}
        onRefresh={() => {}}
      />
    )}
  </div>
);
};

// Sub-components for cleaner code
const StatCard = ({ label, value, color }) => (
  <div className={`bg-gray-800 p-6 rounded-2xl border ${color} shadow-xl`}>
    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-white">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  if (status === "Resolved") {
    return (
      <div className="bg-[#2ec4b6]/20 text-[#2ec4b6] px-3 py-1 rounded-full text-xs font-bold">
        RESOLVED
      </div>
    );
  }

  return (
    <div className="bg-[#ffbca3]/20 text-[#ffbca3] px-3 py-1 rounded-full text-xs font-bold">
      PENDING
    </div>
  );
};

export default Dashboard;