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
  <div className="min-h-screen flex items-center justify-center bg-[#0c1321] px-4">

    {/* BACKGROUND GLOW */}
    <div className="fixed inset-0 -z-10">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#55e0d2]/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#ffbca3]/10 blur-[120px] rounded-full"></div>
    </div>

    <div className="w-full max-w-md">

      {/* HEADER */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="w-14 h-14 bg-[#2e3544] rounded-2xl flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.4)] mb-5">
          <span className="material-symbols-outlined text-[32px] text-[#55e0d2]">
            school
          </span>
        </div>

        <h1 className="text-[28px] font-bold text-[#dce2f6]">
          Welcome Back
        </h1>

        <p className="text-sm text-[#bbcac6] mt-2">
          Enter your details to access your account
        </p>
      </div>

      {/* CARD */}
      <div className="bg-[#19202e] p-5 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)]">

        <form onSubmit={onSubmit} className="flex flex-col gap-5">

          {/* STATUS */}
          {error && (
            <div className="text-xs text-red-400 bg-red-400/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && !error && (
            <div className="text-xs text-green-400 bg-green-400/10 p-3 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* EMAIL / USERNAME */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#bbcac6] ml-1">
              Email or Username
            </label>

            <input
              type="text"
              name="emailOrUsername"
              value={emailOrUsername}
              onChange={onChange}
              required
              placeholder="e.g. student_id or email"
              className="h-12 w-full bg-[#232a39] rounded-xl px-4 text-sm text-[#dce2f6] outline-none focus:ring-2 focus:ring-[#2ec4b6]"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#bbcac6] ml-1">
                Password
              </label>
              <span className="text-xs text-[#55e0d2] cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
              placeholder="••••••••"
              className="h-12 w-full bg-[#232a39] rounded-xl px-4 text-sm text-[#dce2f6] outline-none focus:ring-2 focus:ring-[#2ec4b6]"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="h-[44px] w-full bg-gradient-to-br from-[#55e0d2] to-[#2ec4b6] text-[#00201d] font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition"
          >
            {loading ? "Authenticating..." : "Enter Portal"}
          </button>

          {/* FOOTER */}
          <p className="text-sm text-center text-[#bbcac6]">
            New to the campus network?{" "}
            <Link
              to="/register"
              className="text-[#55e0d2] font-bold hover:underline"
            >
              Register here
            </Link>
          </p>

        </form>
      </div>

    </div>
  </div>
);
};

export default Login;