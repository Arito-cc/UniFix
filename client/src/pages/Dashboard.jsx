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
    <div className="container mx-auto p-6 max-w-6xl min-h-screen pt-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            {user?.role === 'Staff' ? 'DEPT. QUEUE' : 'MY REPORTS'}
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">
            Logged in as: <span className="text-cyan-400">{user?.role}</span>
          </p>
        </div>
        
        {user?.role === 'Student' && (
          <Link 
            to="/submit-complaint" 
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-cyan-900/20"
          >
            Report New Issue
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard label="Total Registry" value={stats.total} color="border-gray-700" />
        <StatCard label="Active Tasks" value={stats.pending} color="border-yellow-500/50" />
        <StatCard label="Resolved" value={stats.resolved} color="border-green-500/50" />
      </div>

      {/* Data Table */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-900/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-700">
              <th className="p-5">Issue Details</th>
              <th className="p-5">Location</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {complaints.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-20 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">
                  No records found in current scope.
                </td>
              </tr>
            ) : (
              complaints.map((item) => (
                <tr key={item._id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="p-5">
                    <p className="text-white font-bold">{item.title}</p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">{item.description}</p>
                  </td>
                  <td className="p-5 text-gray-400 text-sm">
                    {item.location.building} <span className="text-gray-600 text-xs">/</span> {item.location.roomNumber || 'Area'}
                  </td>
                  <td className="p-5">
 <StatusBadge status={item.status} />
                  </td>
                  <td className="p-5 text-right">
                    <button onClick={() => setSelectedComplaint(item)} className="text-cyan-400 hover:text-white text-[10px] font-black uppercase tracking-tighter transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          user={user}
          onClose={() => setSelectedComplaint(null)}
          onRefresh={() => { /* Re-fetch data after update */ }} // You'll need to pass fetchDashboardData here
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
  const styles = {
    Submitted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "In Progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Resolved: "bg-green-500/10 text-green-500 border-green-500/20",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.Submitted}`}>
      {status}
    </span>
  );
};

export default Dashboard;