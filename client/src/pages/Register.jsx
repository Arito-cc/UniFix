import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'Student', // Default role for UniFix
    department: '',  // Renamed from municipalBody
  });

  const [departments, setDepartments] = useState([]); // List of campus departments
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { name, username, email, password, role, department } = formData;

  // Fetch campus departments for the dropdown on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Updated endpoint to fetch campus departments
        const res = await axios.get('/api/departments');
        setDepartments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Could not load departments. Staff registration may be limited.');
      }
    };
    fetchDepartments();
  }, []);

  const onChange = (e) => {
    const { name: field, value } = e.target;

    // Reset department selection if switching back to Student
    if (field === 'role' && value === 'Student') {
      setFormData((prev) => ({ ...prev, role: value, department: '' }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation: Staff must select a department
    if (role === 'Staff' && !department) {
      setError('Please select your assigned department.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/auth/register', formData);

      // Auto-login if the backend returns a token
      if (res.data?.token) {
        login(res.data.token);
        navigate('/dashboard');
      } else {
        navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
      }
    } catch (err) {
      const msg = err.response?.data?.msg || err.response?.data?.errors || err.message;
      setError(Array.isArray(msg) ? msg.map(m => m.msg || m).join(' | ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4 py-12 pt-24">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            Uni<span className="text-cyan-400">Fix</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">
            Create Your Campus Account
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          {/* Identity Section */}
          <div className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name (e.g. Jane Doe)"
              value={name}
              onChange={onChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={onChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
            />
            <input
              type="email"
              name="email"
              placeholder="Campus Email"
              value={email}
              onChange={onChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
            />
            <input
              type="password"
              name="password"
              placeholder="Password (Min. 6 chars)"
              value={password}
              onChange={onChange}
              required
              minLength="6"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
            />
          </div>

          {/* Role Selection */}
          <div className="pt-2">
            <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
              Select Your Role
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'Student', department: '' })}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                  role === 'Student' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-650'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'Staff' })}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                  role === 'Staff' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-650'
                }`}
              >
                Staff
              </button>
            </div>
          </div>

          {/* Department Selection (Conditional) */}
          {role === 'Staff' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
                Assigned Department
              </label>
              <select
                name="department"
                value={department}
                onChange={onChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-cyan-600/50 rounded-xl text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
              >
                <option value="">Select your wing...</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 font-black text-xs uppercase tracking-widest text-white bg-cyan-600 rounded-xl hover:bg-cyan-700 transition shadow-lg shadow-cyan-900/20 disabled:bg-gray-600"
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>

          <p className="text-sm text-center text-gray-500 font-medium">
            Already a member?{' '}
            <Link to="/login" className="text-cyan-400 hover:underline font-bold">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;