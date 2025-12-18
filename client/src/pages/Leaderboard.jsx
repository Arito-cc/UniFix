import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper component for Rank Medals
const RankMedal = ({ rank }) => {
  if (rank === 1) return <span className="text-xl mr-2">🥇</span>;
  if (rank === 2) return <span className="text-xl mr-2">🥈</span>;
  if (rank === 3) return <span className="text-xl mr-2">🥉</span>;
  return null;
};

const Leaderboard = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        // Updated to use the UniFix leaderboard endpoint
        const res = await axios.get('/api/leaderboard');
        
        // Ensure data is sorted by averageRating (Backend usually does this, but safe to check)
        const sortedData = res.data.sort((a, b) => b.averageRating - a.averageRating);
        setDepartments(sortedData);
      } catch (err) {
        console.error('Leaderboard Fetch Error:', err);
        setError('Unable to load performance rankings.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
        <p className="text-cyan-400 font-black uppercase tracking-widest text-xs text-center">
          Calculating Department <br /> Efficiency...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl min-h-screen pt-24">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase">
          Uni<span className="text-cyan-400">Fix</span> Rankings
        </h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-2">
          Department Efficiency Leaderboard
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center font-bold mb-8">
          {error}
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        {departments.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-gray-500 font-bold uppercase tracking-widest">No departments have been rated yet.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 text-cyan-400 uppercase text-[10px] font-black tracking-widest border-b border-gray-700">
                <th className="p-6">Rank</th>
                <th className="p-6">Department</th>
                <th className="p-6">Base Location</th>
                <th className="p-6 text-center">Student Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {departments.map((dept, index) => (
                <tr 
                  key={dept._id} 
                  className={`transition-colors hover:bg-gray-700/50 ${index === 0 ? 'bg-cyan-400/5' : ''}`}
                >
                  <td className="p-6">
                    <div className="flex items-center">
                      <span className={`text-lg font-black ${index < 3 ? 'text-white' : 'text-gray-600'}`}>
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center">
                      <RankMedal rank={index + 1} />
                      <span className="text-white font-bold text-lg">{dept.name}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-gray-400 text-sm font-medium">{dept.officeLocation || 'Main Block'}</span>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full shadow-inner">
                      <span className="text-yellow-500 font-black text-lg mr-1">
                        {Number(dept.averageRating || 0).toFixed(1)}
                      </span>
                      <span className="text-yellow-600 text-xs">★</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Instructional Note */}
      <div className="mt-10 p-6 bg-gray-800/40 rounded-2xl border border-gray-700/50 text-center">
        <p className="text-gray-500 text-xs leading-relaxed max-w-xl mx-auto italic font-medium">
          Ratings are calculated based on Student feedback submitted after a complaint is marked as "Resolved." 
          Departments with high scores are recognized for their commitment to campus excellence.
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;