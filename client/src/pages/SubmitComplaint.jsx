import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const API_BASE_URL = 'http://localhost:5000';

const SubmitComplaint = () => {
  // 1. Updated state to handle Campus Locations
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    building: '',
    roomNumber: '',
    area: ''
  });
  const [image, setImage] = useState(null);

  // UI state
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token } = useAuth();
  const { title, description, building, roomNumber, area } = formData;

  // Form handlers
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
  const onFileChange = (e) => setImage(e.target.files[0]);

  // Handle form submit
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('You must be logged in to report an issue.');
      return;
    }

    setLoading(true);
    try {
      let beforeImageUrl = 'https://placehold.co/600x400?text=No+Image+Provided';

      // Upload image first if it exists
      if (image) {
        const fd = new FormData();
        fd.append('image', image);
        const uploadRes = await axios.post(`${API_BASE_URL}/api/upload`, fd);
        beforeImageUrl = uploadRes.data.filePath;
      }

      // 2. Updated Payload to match the new Campus Model
      const body = {
        title,
        description,
        beforeImage: beforeImageUrl,
        location: {
          building,
          roomNumber,
          area
        },
      };

      await axios.post(`${API_BASE_URL}/api/complaints`, body);

      setMessage('Report submitted successfully! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || 'An error occurred. Please try again.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-gray-900 pt-24">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-black text-cyan-400 tracking-tighter uppercase">
            Report Campus Issue
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">
            UniFix Incident Registry
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Feedback Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-xl text-xs font-bold">
              {message}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
              Short Summary of Issue
            </label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
              placeholder="e.g., Broken projector in Lab A"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
              Detailed Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              rows="3"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
              placeholder="Please provide specifics about the damage or fault..."
              required
            ></textarea>
          </div>

          {/* Campus Location Grid */}
          <div className="bg-gray-900/40 p-5 rounded-2xl border border-gray-700 space-y-4">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-2">Location Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-[10px] font-bold uppercase mb-1">Building / Block</label>
                <select
                  name="building"
                  value={building}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm outline-none focus:border-cyan-500"
                >
                  <option value="">Select Block</option>
                  <option value="Admin Block">Admin Block</option>
                  <option value="Academic Block A">Academic Block A</option>
                  <option value="Academic Block B">Academic Block B</option>
                  <option value="Central Library">Central Library</option>
                  <option value="Hostel Wing 1">Hostel Wing 1</option>
                  <option value="Hostel Wing 2">Hostel Wing 2</option>
                  <option value="Cafeteria">Cafeteria</option>
                  <option value="Sports Complex">Sports Complex</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 text-[10px] font-bold uppercase mb-1">Room No. (Optional)</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={roomNumber}
                  onChange={onChange}
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm outline-none focus:border-cyan-500"
                  placeholder="e.g., 302 or Lab 1"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 text-[10px] font-bold uppercase mb-1">Specific Area Context</label>
              <input
                type="text"
                name="area"
                value={area}
                onChange={onChange}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm outline-none focus:border-cyan-500"
                placeholder="e.g., Near the main entrance, 2nd floor corridor..."
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
              Visual Evidence (Before Photo)
            </label>
            <input
              type="file"
              onChange={onFileChange}
              className="w-full px-4 py-2 text-sm text-gray-400 bg-gray-700 border border-gray-600 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-4 px-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-900/20 disabled:bg-gray-600"
          >
            {loading ? 'Processing Registry...' : 'Submit Official Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;