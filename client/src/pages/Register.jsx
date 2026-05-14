import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "Student",
    department: "",
  });

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { name, username, email, password, role, department } = formData;

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("/api/departments");
        setDepartments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Could not load departments.");
      }
    };
    fetchDepartments();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "role" && value === "Student") {
      setFormData((prev) => ({ ...prev, role: value, department: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    return email.endsWith(".edu");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Invalid campus email. Must use .edu domain.");
      return;
    }

    if (role === "Staff" && !department) {
      setError("Please select your assigned department.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/register", formData);

      if (res.data?.token) {
        login(res.data.token);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.errors ||
        err.message;

      setError(Array.isArray(msg) ? msg.join(" | ") : msg);
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
            Create Account
          </h1>

          <p className="text-sm text-[#bbcac6] mt-2">
            Join the UniFix campus network
          </p>
        </div>

        {/* CARD */}
        <div className="bg-[#19202e] p-5 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)]">

          <form onSubmit={onSubmit} className="flex flex-col gap-5">

            {/* ROLE */}
            <div className="flex p-1 bg-[#070e1c] rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "Student", department: "" })}
                className={`flex-1 h-10 rounded-lg flex items-center justify-center gap-2 text-xs font-bold ${
                  role === "Student"
                    ? "bg-[#55e0d2] text-[#00201d]"
                    : "text-[#bbcac6]"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                Student
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "Staff" })}
                className={`flex-1 h-10 rounded-lg flex items-center justify-center gap-2 text-xs font-bold ${
                  role === "Staff"
                    ? "bg-[#55e0d2] text-[#00201d]"
                    : "text-[#bbcac6]"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">badge</span>
                Staff
              </button>
            </div>

            {/* NAME + USERNAME */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Jane Doe"
                required
                className="h-12 bg-[#232a39] rounded-xl px-4 text-[#dce2f6] outline-none focus:ring-2 focus:ring-[#2ec4b6]"
              />

              <input
                type="text"
                name="username"
                value={username}
                onChange={onChange}
                placeholder="@janedoe"
                required
                className="h-12 bg-[#232a39] rounded-xl px-4 text-[#dce2f6] outline-none focus:ring-2 focus:ring-[#2ec4b6]"
              />
            </div>

            {/* EMAIL */}
            <div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Campus Email"
                required
                className={`h-12 w-full bg-[#232a39] rounded-xl px-4 text-[#dce2f6] outline-none pr-10 ${
                  error ? "border-b-2 border-red-400" : "focus:ring-2 focus:ring-[#2ec4b6]"
                }`}
              />
              {error && (
                <p className="text-xs text-red-400 mt-1">{error}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={onChange}
                placeholder="••••••••"
                required
                className="h-12 w-full bg-[#232a39] rounded-xl px-4 text-[#dce2f6] outline-none focus:ring-2 focus:ring-[#2ec4b6]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#859491]"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* DEPARTMENT */}
            {role === "Staff" && (
              <select
                name="department"
                value={department}
                onChange={onChange}
                className="h-12 w-full bg-[#232a39] rounded-xl px-4 text-[#dce2f6] outline-none focus:ring-2 focus:ring-[#2ec4b6]"
              >
                <option value="">Select your wing...</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="h-[44px] w-full bg-gradient-to-br from-[#55e0d2] to-[#2ec4b6] text-[#00201d] font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition"
            >
              {loading ? "Creating..." : "Create Account →"}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#bbcac6]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#55e0d2] font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;