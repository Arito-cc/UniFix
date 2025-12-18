import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ComplaintCard from '../components/ComplaintCard';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Access UniFix Auth Context
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch public feed (sorted by upvotes on the backend)
        const res = await axios.get('/api/complaints/public');
        setComplaints(res.data);
      } catch (err) {
        console.error('UniFix Feed Error:', err);
        setError('Failed to sync campus feed. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleComplaintUpdate = (updatedComplaint) => {
    setComplaints((prev) =>
      prev.map((c) => (c._id === updatedComplaint._id ? updatedComplaint : c))
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
        <p className="text-cyan-400 font-black uppercase tracking-widest text-xs">Loading Campus Wall...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-12 pt-24">
      
      {/* Hero Section - UniFix Rebranding */}
      <div className="relative overflow-hidden p-12 bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl text-center">
        <div className="relative z-10">
          <h1 className="text-5xl font-black mb-4 text-white tracking-tighter">
            Uni<span className="text-cyan-400">Fix</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium mb-8 max-w-lg mx-auto leading-relaxed">
            The decentralized campus resolution portal. Transparency for students, efficiency for staff.
          </p>
          
          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-cyan-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-900/30"
              >
                Enter Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-cyan-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-900/30"
              >
                Join the Community
              </Link>
            )}
          </div>
        </div>
        
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Campus Wall - Public Feed */}
      <div>
        <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Campus Wall</h2>
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            {complaints.length} Global Issues
          </span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl text-center font-bold mb-6">
            {error}
          </div>
        )}

        {complaints.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-800">
            <p className="text-gray-500 font-bold uppercase tracking-widest">No reports have hit the wall yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                currentUser={user}
                onComplaintUpdate={handleComplaintUpdate}
                // Home page is view-only for status updates
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;