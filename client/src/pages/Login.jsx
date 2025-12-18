import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext); // Destructured for cleaner access

  // Get success message from registration if it exists
  const successMessage = location.state?.message;

  const { emailOrUsername, password } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { emailOrUsername, password };
      const res = await axios.post('/api/auth/login', payload);

      const token = res.data?.token;
      if (token && typeof login === 'function') {
        login(token);
        navigate('/dashboard');
        return;
      }

      setError('Login succeeded but failed to sync session.');
    } catch (err) {
      const msg = err.response?.data?.msg || err.response?.data?.errors || err.message;
      if (Array.isArray(msg)) {
        setError(msg.map((m) => m.msg || m).join(' | '));
      } else {
        setError(typeof msg === 'string' ? msg : 'Invalid credentials. Please try again.');
      }
      console.error('Auth Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4 pt-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            Uni<span className="text-cyan-400">Fix</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">
            Campus Resolution Portal
          </p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          {/* Status Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}
          {successMessage && !error && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-xl text-xs font-bold">
              {successMessage}
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
              Email or Username
            </label>
            <input
              type="text"
              name="emailOrUsername"
              value={emailOrUsername}
              onChange={onChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
              placeholder="e.g. student_id or email"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-black text-xs uppercase tracking-widest text-white bg-cyan-600 rounded-xl hover:bg-cyan-700 transition shadow-lg shadow-cyan-900/20 disabled:bg-gray-600"
          >
            {loading ? 'Authenticating...' : 'Enter Portal'}
          </button>

          <p className="text-sm text-center text-gray-500 font-medium">
            New to the campus network?{' '}
            <Link to="/register" className="text-cyan-400 hover:underline font-bold">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;