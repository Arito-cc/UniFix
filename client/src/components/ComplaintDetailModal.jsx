import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const ComplaintDetailModal = ({ complaint, onClose, onRefresh, user }) => {
  const [rating, setRating] = useState(0);
  const [afterImage, setAfterImage] = useState(null);
  const [updating, setUpdating] = useState(false);

  // --- STAFF LOGIC: Resolve Issue ---
  const handleResolve = async () => {
    setUpdating(true);
    try {
      let afterImageUrl = '';
      if (afterImage) {
        const fd = new FormData();
        fd.append('image', afterImage);
        const uploadRes = await axios.post('/api/upload', fd);
        afterImageUrl = uploadRes.data.filePath;
      }

      await axios.put(`/api/complaints/${complaint._id}`, {
        status: 'Resolved',
        afterImage: afterImageUrl
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Resolution Error:", err);
    } finally {
      setUpdating(false);
    }
  };

  // --- STUDENT LOGIC: Submit Rating ---
  const handleRate = async (score) => {
    try {
      await axios.patch(`/api/complaints/${complaint._id}/rate`, { rating: score });
      setRating(score);
      onRefresh();
      setTimeout(onClose, 1000); // Close after showing success
    } catch (err) {
      console.error("Rating Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        
        {/* Top Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">{complaint.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Comparison View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Reported Photo</span>
 <img src={`${API_BASE_URL}${complaint.beforeImage}`} className="rounded-xl border border-gray-700 w-full h-40 object-cover" alt="Before" />
            </div>
            {complaint.status === 'Resolved' && (
              <div className="space-y-2">
 <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Fix Proof</span>
 <img src={`${API_BASE_URL}${complaint.afterImage}`} className="rounded-xl border border-green-500/30 w-full h-40 object-cover" alt="After" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-gray-300 text-sm leading-relaxed">{complaint.description}</p>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 text-xs">
              <p className="text-gray-500">Location: <span className="text-white font-bold">{complaint.location.building} - {complaint.location.roomNumber}</span></p>
            </div>
          </div>

          {/* Role-Based Actions */}
          <div className="pt-6 border-t border-gray-700">
            {user.role === 'Staff' && complaint.status !== 'Resolved' && (
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest">Upload Resolution Photo</label>
                <input 
                  type="file" 
                  onChange={(e) => setAfterImage(e.target.files[0])}
                  className="w-full text-xs text-gray-400 file:bg-cyan-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:mr-4 file:font-black" 
                />
                <button 
                  onClick={handleResolve}
                  disabled={updating}
                  className="w-full py-4 bg-green-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-900/20"
                >
                  {updating ? 'Updating Registry...' : 'Mark as Fixed'}
                </button>
              </div>
            )}

            {user.role === 'Student' && complaint.status === 'Resolved' && !complaint.rating && (
              <div className="text-center space-y-4">
                <p className="text-cyan-400 text-xs font-black uppercase tracking-widest">Rate this Resolution</p>
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => handleRate(star)}
                      className="text-3xl hover:scale-125 transition-transform"
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailModal;