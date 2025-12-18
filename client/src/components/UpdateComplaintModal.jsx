import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const UpdateComplaintModal = ({ isOpen, onClose, complaint, onComplaintUpdated }) => {
  const [status, setStatus] = useState('Submitted');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync state with the specific complaint when it changes
  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || 'Submitted');
    }
  }, [complaint]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let afterImageUrl = complaint.afterImage;

      // 1. Handle "After" Image Upload for proof of resolution
      if (image) {
        const fd = new FormData();
        fd.append('image', image);
        const uploadRes = await axios.post(`${API_BASE_URL}/api/upload`, fd);
        afterImageUrl = uploadRes.data.filePath;
      }

      // 2. PUT request to update status and image
      const res = await axios.put(`${API_BASE_URL}/api/complaints/${complaint._id}`, {
        status,
        afterImage: afterImageUrl,
      });

      onComplaintUpdated(res.data);
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      setError(err.response?.data?.msg || 'Failed to update campus record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-700 overflow-hidden transform transition-all">
        
        {/* Header - UniFix Branded */}
        <div className="bg-gray-900/50 p-5 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-cyan-400 uppercase tracking-tighter">Resolution Desk</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Case ID: {complaint._id.slice(-6)}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-white transition-colors text-3xl font-light"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-xs font-bold">
              {error}
            </div>
          )}

          {/* Status Selection */}
          <div>
            <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
              Lifecycle Status
            </label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-medium"
            >
              <option value="Submitted">Submitted (Pending)</option>
              <option value="In Progress">In Progress (Active)</option>
              <option value="Resolved">Resolved (Completed)</option>
              <option value="Closed">Closed (Archive)</option>
            </select>
          </div>

          {/* Proof of Resolution Image */}
          <div>
            <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
              Resolution Proof (After Photo)
            </label>
            <div className="relative group">
              <input 
                type="file" 
                onChange={(e) => setImage(e.target.files[0])}
                className="text-xs text-gray-400 block w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 file:transition-colors cursor-pointer"
              />
            </div>
            <p className="mt-2 text-[10px] text-gray-500 italic">Required for "Resolved" status transparency.</p>
          </div>

          {/* Visual flow of the update logic */}
          

          <div className="bg-cyan-900/10 border border-cyan-500/20 p-4 rounded-xl">
            <p className="text-[11px] text-cyan-200/70 leading-relaxed font-medium">
              <span className="text-cyan-400 font-bold uppercase mr-1">System Note:</span> 
              Updating to "Resolved" stamps your Department ID and notifies the student to provide efficiency feedback.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex space-x-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-600 transition"
            >
              Discard
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-4 py-3 bg-cyan-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-700 disabled:bg-gray-600 transition shadow-lg shadow-cyan-900/20"
            >
              {loading ? 'Processing...' : 'Sync Change'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateComplaintModal;