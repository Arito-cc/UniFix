import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:5000';

// Helper to choose status color
const getStatusColor = (status) => {
  switch (status) {
    case 'Submitted': return 'bg-blue-600 text-white';
    case 'In Progress': return 'bg-yellow-500 text-gray-900';
    case 'Resolved': return 'bg-green-600 text-white';
    case 'Closed': return 'bg-gray-600 text-white';
    default: return 'bg-gray-400 text-white';
  }
};

// Simple Upvote Icon
const UpvoteIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 ${filled ? 'text-cyan-400' : 'text-gray-400'}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L11 6.414V17a1 1 0 11-2 0V6.414L5.707 9.707a1 1 0 01-1.414-1.414l5-5A1 1 0 0110 3z"
      clipRule="evenodd"
    />
  </svg>
);

// StarRating component for students to rate resolutions
const StarRating = ({ onRate, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleSubmit = () => {
    if (rating > 0 && !isSubmitting) onRate(rating);
  };

  return (
    <div className="bg-gray-700/50 p-4 rounded-lg mt-3 border border-gray-600">
      <p className="text-sm font-bold text-white mb-2">Rate this resolution:</p>
      <div className="flex items-center space-x-3">
        <div className="flex">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <button
                type="button"
                key={starValue}
                className={`text-2xl transition-colors ${starValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-500'}`}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
                disabled={isSubmitting}
              >
                ★
              </button>
            );
          })}
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className="px-4 py-1.5 text-xs font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-600 transition"
        >
          {isSubmitting ? 'Sending...' : 'Submit Rating'}
        </button>
      </div>
    </div>
  );
};

const ComplaintCard = ({ complaint, currentUser, onComplaintUpdate, onModalOpen }) => {
  const { user: ctxUser, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const loggedInUser = currentUser ?? ctxUser;

  const {
    title, description, status, submittedBy, beforeImage, afterImage,
    location, createdAt, upvotedBy = [], _id, rating = null
  } = complaint;

  // Image path helper
  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const userIdStr = loggedInUser?.id ?? loggedInUser?._id ?? null;
  const initialHasUpvoted = Boolean(userIdStr && upvotedBy.some(id => id.toString() === userIdStr.toString()));

  const [isUpvoted, setIsUpvoted] = useState(initialHasUpvoted);
  const [localUpvoteCount, setLocalUpvoteCount] = useState(complaint.upvoteCount || upvotedBy.length);
  const [upvoteSubmitting, setUpvoteSubmitting] = useState(false);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const canRate = loggedInUser && status === 'Resolved' && rating === null &&
    (submittedBy?._id?.toString() === userIdStr?.toString() || submittedBy?.toString() === userIdStr?.toString());

  const handleUpvote = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (upvoteSubmitting) return;
    
    setUpvoteSubmitting(true);
    setIsUpvoted(!isUpvoted);
    setLocalUpvoteCount(prev => isUpvoted ? prev - 1 : prev + 1);

    try {
      const res = await axios.patch(`/api/complaints/${_id}/upvote`);
      onComplaintUpdate(res.data);
    } catch (err) {
      setIsUpvoted(initialHasUpvoted);
      setLocalUpvoteCount(complaint.upvoteCount || upvotedBy.length);
    } finally {
      setUpvoteSubmitting(false);
    }
  };

  const handleRatingSubmit = async (star) => {
    setRatingSubmitting(true);
    try {
      const res = await axios.patch(`/api/complaints/${_id}/rate`, { rating: star });
      onComplaintUpdate(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRatingSubmitting(false);
    }
  };

  return (
    <div className="flex bg-gray-800 shadow-xl rounded-xl border border-gray-700 overflow-hidden mb-6 transition-all hover:border-gray-500">
      {/* Upvote Column */}
      <div className="flex flex-col items-center p-4 bg-gray-900/40 border-r border-gray-700">
        <button onClick={handleUpvote} disabled={upvoteSubmitting} className="hover:scale-110 transition-transform">
          <UpvoteIcon filled={isUpvoted} />
        </button>
        <span className="text-white font-black mt-1">{localUpvoteCount}</span>
      </div>

      <div className="flex-1 p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-cyan-400 leading-tight">{title}</h3>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
              {new Date(createdAt).toLocaleDateString()} • By {submittedBy?.name || submittedBy?.username || 'Student'}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>

        {/* Campus Location Badge */}
        <div className="inline-flex items-center bg-cyan-900/20 border border-cyan-500/30 rounded-md px-3 py-1.5 mb-4">
          <span className="text-cyan-400 mr-2 text-sm">📍</span>
          <span className="text-gray-200 text-xs font-bold uppercase tracking-wide">
            {location?.building || 'Main Campus'} {location?.roomNumber ? `• Room ${location.roomNumber}` : ''} 
            {location?.area ? ` (${location.area})` : ''}
          </span>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">{description}</p>

        {/* Before/After Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {beforeImage && (
            <div className="relative rounded-lg overflow-hidden border border-gray-700">
              <p className="absolute top-2 left-2 bg-black/70 text-[10px] font-black text-white px-2 py-0.5 rounded">BEFORE</p>
              <img src={getFullImageUrl(beforeImage)} className="w-full h-44 object-cover" alt="issue" />
            </div>
          )}
          {afterImage && (
            <div className="relative rounded-lg overflow-hidden border border-green-500/50">
              <p className="absolute top-2 left-2 bg-green-600 text-[10px] font-black text-white px-2 py-0.5 rounded">RESOLVED</p>
              <img src={getFullImageUrl(afterImage)} className="w-full h-44 object-cover" alt="resolution" />
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-700 pt-4 mt-2 gap-4">
          <div className="flex items-center">
            {rating ? (
              <span className="text-yellow-400 font-black text-sm">Feedback: {rating} ★</span>
            ) : (
              <span className="text-gray-500 text-xs italic">Resolution pending student feedback</span>
            )}
          </div>

          {onModalOpen && (
            <button onClick={() => onModalOpen(complaint)} className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black py-2.5 px-5 rounded-lg transition uppercase tracking-widest">
              Update Status
            </button>
          )}
        </div>

        {canRate && <StarRating onRate={handleRatingSubmit} isSubmitting={ratingSubmitting} />}
      </div>
    </div>
  );
};

export default ComplaintCard;